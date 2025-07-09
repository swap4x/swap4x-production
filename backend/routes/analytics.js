const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Get platform analytics
router.get('/', async (req, res) => {
  try {
    // Mock analytics data for testing
    const analytics = {
      totalVolume: {
        value: 125000000,
        currency: 'USD',
        change24h: 12.5
      },
      totalTransactions: {
        value: 15420,
        change24h: 8.3
      },
      totalFees: {
        value: 62500,
        currency: 'USD',
        change24h: 15.2
      },
      activeUsers: {
        value: 3240,
        change24h: 5.7
      },
      topBridges: [
        { name: 'Stargate', volume: 45000000, percentage: 36 },
        { name: 'Hop Protocol', volume: 32500000, percentage: 26 },
        { name: 'Across', volume: 25000000, percentage: 20 },
        { name: 'Synapse', volume: 15000000, percentage: 12 },
        { name: 'Multichain', volume: 7500000, percentage: 6 }
      ],
      topChains: [
        { name: 'Ethereum', volume: 50000000, percentage: 40 },
        { name: 'Polygon', volume: 37500000, percentage: 30 },
        { name: 'Arbitrum', volume: 25000000, percentage: 20 },
        { name: 'Optimism', volume: 12500000, percentage: 10 }
      ],
      volumeHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        volume: Math.random() * 5000000 + 2000000
      })).reverse()
    };

    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error fetching analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
});

// Get bridge-specific analytics
router.get('/bridges/:bridgeName', async (req, res) => {
  try {
    const { bridgeName } = req.params;

    // Mock bridge-specific data
    const bridgeAnalytics = {
      name: bridgeName,
      volume24h: Math.random() * 10000000 + 5000000,
      transactions24h: Math.random() * 1000 + 500,
      avgFee: Math.random() * 50 + 10,
      avgTime: Math.random() * 300 + 60, // seconds
      supportedChains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
      reliability: Math.random() * 20 + 80, // 80-100%
      volumeHistory: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        volume: Math.random() * 2000000 + 1000000
      })).reverse()
    };

    res.json({
      success: true,
      data: bridgeAnalytics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Error fetching analytics for bridge ${req.params.bridgeName}:`, error);
    res.status(500).json({
      error: 'Failed to fetch bridge analytics',
      message: error.message
    });
  }
});

// Get user analytics (requires authentication in production)
router.get('/user/:address', async (req, res) => {
  try {
    const { address } = req.params;

    // Mock user analytics
    const userAnalytics = {
      address,
      totalVolume: Math.random() * 100000 + 10000,
      totalTransactions: Math.random() * 50 + 10,
      totalFees: Math.random() * 500 + 50,
      favoriteChains: ['Ethereum', 'Polygon'],
      favoriteBridges: ['Stargate', 'Hop Protocol'],
      recentActivity: Array.from({ length: 10 }, (_, i) => ({
        id: `tx_${i}`,
        timestamp: new Date(Date.now() - (i * 60 * 60 * 1000)).toISOString(),
        fromChain: 'Ethereum',
        toChain: 'Polygon',
        amount: Math.random() * 1000 + 100,
        token: 'USDC',
        bridge: 'Stargate',
        status: 'completed'
      }))
    };

    res.json({
      success: true,
      data: userAnalytics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Error fetching user analytics for ${req.params.address}:`, error);
    res.status(500).json({
      error: 'Failed to fetch user analytics',
      message: error.message
    });
  }
});

module.exports = router;

