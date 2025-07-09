const PriceService = require('./priceService');
const logger = require('../utils/logger');

// Initialize price service
const priceService = new PriceService();

// Price monitoring configuration
const PRICE_UPDATE_INTERVAL = 60000; // 1 minute
const MONITORED_TOKENS = [
  'ethereum',
  'matic-network',
  'usd-coin',
  'tether',
  'dai',
  'wrapped-bitcoin',
  'chainlink',
  'uniswap'
];

let priceCache = new Map();
let monitoringInterval = null;

/**
 * Start price monitoring service
 */
function startPriceMonitoring() {
  logger.info('Starting price monitoring service...');
  
  // Initial price fetch
  updatePrices();
  
  // Set up periodic updates
  monitoringInterval = setInterval(updatePrices, PRICE_UPDATE_INTERVAL);
  
  logger.info(`Price monitoring started with ${PRICE_UPDATE_INTERVAL / 1000}s interval`);
}

/**
 * Stop price monitoring service
 */
function stopPriceMonitoring() {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
    logger.info('Price monitoring stopped');
  }
}

/**
 * Update prices for monitored tokens
 */
async function updatePrices() {
  try {
    logger.debug('Updating token prices...');
    
    const prices = await priceService.getMultiplePrices(MONITORED_TOKENS);
    
    // Update cache
    for (const [tokenId, priceData] of Object.entries(prices)) {
      priceCache.set(tokenId, {
        ...priceData,
        lastUpdated: new Date().toISOString()
      });
    }
    
    logger.debug(`Updated prices for ${Object.keys(prices).length} tokens`);
    
  } catch (error) {
    logger.error('Error updating prices:', error);
  }
}

/**
 * Get cached price for a token
 */
function getCachedPrice(tokenId) {
  return priceCache.get(tokenId);
}

/**
 * Get all cached prices
 */
function getAllCachedPrices() {
  const prices = {};
  for (const [tokenId, priceData] of priceCache.entries()) {
    prices[tokenId] = priceData;
  }
  return prices;
}

/**
 * Check if price data is stale
 */
function isPriceStale(tokenId, maxAgeMs = 300000) { // 5 minutes default
  const cachedPrice = priceCache.get(tokenId);
  if (!cachedPrice || !cachedPrice.lastUpdated) {
    return true;
  }
  
  const age = Date.now() - new Date(cachedPrice.lastUpdated).getTime();
  return age > maxAgeMs;
}

/**
 * Force refresh price for a specific token
 */
async function refreshTokenPrice(tokenId) {
  try {
    const prices = await getPrices([tokenId], 'usd');
    if (prices[tokenId]) {
      priceCache.set(tokenId, {
        ...prices[tokenId],
        lastUpdated: new Date().toISOString()
      });
      return prices[tokenId];
    }
    return null;
  } catch (error) {
    logger.error(`Error refreshing price for ${tokenId}:`, error);
    return null;
  }
}

/**
 * Get price with automatic refresh if stale
 */
async function getPrice(tokenId, maxAgeMs = 300000) {
  if (isPriceStale(tokenId, maxAgeMs)) {
    logger.debug(`Price for ${tokenId} is stale, refreshing...`);
    await refreshTokenPrice(tokenId);
  }
  return getCachedPrice(tokenId);
}

module.exports = {
  startPriceMonitoring,
  stopPriceMonitoring,
  getCachedPrice,
  getAllCachedPrices,
  isPriceStale,
  refreshTokenPrice,
  getPrice,
  MONITORED_TOKENS
};

