const express = require('express');
const router = express.Router();
const { getPrices, getTokenPrice } = require('../services/priceService');
const logger = require('../utils/logger');

// Get current prices for multiple tokens
router.get('/', async (req, res) => {
  try {
    const { tokens, vs_currency = 'usd' } = req.query;
    
    if (!tokens) {
      return res.status(400).json({
        error: 'Missing required parameter: tokens',
        message: 'Please provide comma-separated token IDs'
      });
    }

    const tokenList = tokens.split(',').map(token => token.trim());
    const prices = await getPrices(tokenList, vs_currency);

    res.json({
      success: true,
      data: prices,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error fetching prices:', error);
    res.status(500).json({
      error: 'Failed to fetch prices',
      message: error.message
    });
  }
});

// Get price for a specific token
router.get('/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { vs_currency = 'usd' } = req.query;

    const price = await getTokenPrice(tokenId, vs_currency);

    if (!price) {
      return res.status(404).json({
        error: 'Token not found',
        message: `Price data not available for token: ${tokenId}`
      });
    }

    res.json({
      success: true,
      data: {
        [tokenId]: price
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Error fetching price for ${req.params.tokenId}:`, error);
    res.status(500).json({
      error: 'Failed to fetch token price',
      message: error.message
    });
  }
});

// Get price history for a token
router.get('/:tokenId/history', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { days = 7, vs_currency = 'usd' } = req.query;

    // For now, return mock data - can be enhanced later
    const mockHistory = Array.from({ length: parseInt(days) }, (_, i) => ({
      timestamp: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
      price: Math.random() * 1000 + 1000 // Mock price between 1000-2000
    })).reverse();

    res.json({
      success: true,
      data: {
        tokenId,
        vs_currency,
        days: parseInt(days),
        prices: mockHistory
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Error fetching price history for ${req.params.tokenId}:`, error);
    res.status(500).json({
      error: 'Failed to fetch price history',
      message: error.message
    });
  }
});

module.exports = router;

