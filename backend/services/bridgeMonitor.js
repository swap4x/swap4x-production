const logger = require('../utils/logger');

// Bridge monitoring configuration
const BRIDGE_CHECK_INTERVAL = 300000; // 5 minutes
const SUPPORTED_BRIDGES = [
  'stargate',
  'hop',
  'across',
  'synapse',
  'multichain'
];

let bridgeStatusCache = new Map();
let monitoringInterval = null;

/**
 * Start bridge monitoring service
 */
function startBridgeMonitoring() {
  logger.info('Starting bridge monitoring service...');
  
  // Initial status check
  updateBridgeStatuses();
  
  // Set up periodic checks
  monitoringInterval = setInterval(updateBridgeStatuses, BRIDGE_CHECK_INTERVAL);
  
  logger.info(`Bridge monitoring started with ${BRIDGE_CHECK_INTERVAL / 1000}s interval`);
}

/**
 * Stop bridge monitoring service
 */
function stopBridgeMonitoring() {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
    logger.info('Bridge monitoring stopped');
  }
}

/**
 * Update status for all monitored bridges
 */
async function updateBridgeStatuses() {
  try {
    logger.debug('Updating bridge statuses...');
    
    for (const bridgeName of SUPPORTED_BRIDGES) {
      const status = await checkBridgeStatus(bridgeName);
      bridgeStatusCache.set(bridgeName, {
        ...status,
        lastChecked: new Date().toISOString()
      });
    }
    
    logger.debug(`Updated status for ${SUPPORTED_BRIDGES.length} bridges`);
    
  } catch (error) {
    logger.error('Error updating bridge statuses:', error);
  }
}

/**
 * Check status of a specific bridge
 */
async function checkBridgeStatus(bridgeName) {
  try {
    // Mock bridge status check - in production, this would make actual API calls
    const mockStatus = {
      name: bridgeName,
      status: Math.random() > 0.1 ? 'operational' : 'degraded', // 90% uptime
      responseTime: Math.random() * 2000 + 500, // 500-2500ms
      successRate: Math.random() * 10 + 90, // 90-100%
      lastTransaction: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Within last hour
      supportedChains: getBridgeChains(bridgeName),
      fees: {
        min: Math.random() * 10 + 5,
        max: Math.random() * 50 + 20,
        average: Math.random() * 30 + 15
      }
    };
    
    return mockStatus;
    
  } catch (error) {
    logger.error(`Error checking status for bridge ${bridgeName}:`, error);
    return {
      name: bridgeName,
      status: 'error',
      responseTime: null,
      successRate: 0,
      lastTransaction: null,
      error: error.message
    };
  }
}

/**
 * Get supported chains for a bridge
 */
function getBridgeChains(bridgeName) {
  const chainMappings = {
    stargate: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'BSC'],
    hop: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Gnosis'],
    across: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
    synapse: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'BSC', 'Fantom'],
    multichain: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'BSC', 'Fantom', 'Moonbeam']
  };
  
  return chainMappings[bridgeName] || ['Ethereum', 'Polygon'];
}

/**
 * Get cached status for a bridge
 */
function getCachedBridgeStatus(bridgeName) {
  return bridgeStatusCache.get(bridgeName);
}

/**
 * Get all cached bridge statuses
 */
function getAllCachedBridgeStatuses() {
  const statuses = {};
  for (const [bridgeName, status] of bridgeStatusCache.entries()) {
    statuses[bridgeName] = status;
  }
  return statuses;
}

/**
 * Check if bridge status is stale
 */
function isBridgeStatusStale(bridgeName, maxAgeMs = 600000) { // 10 minutes default
  const cachedStatus = bridgeStatusCache.get(bridgeName);
  if (!cachedStatus || !cachedStatus.lastChecked) {
    return true;
  }
  
  const age = Date.now() - new Date(cachedStatus.lastChecked).getTime();
  return age > maxAgeMs;
}

/**
 * Force refresh status for a specific bridge
 */
async function refreshBridgeStatus(bridgeName) {
  try {
    const status = await checkBridgeStatus(bridgeName);
    bridgeStatusCache.set(bridgeName, {
      ...status,
      lastChecked: new Date().toISOString()
    });
    return status;
  } catch (error) {
    logger.error(`Error refreshing status for bridge ${bridgeName}:`, error);
    return null;
  }
}

/**
 * Get bridge status with automatic refresh if stale
 */
async function getBridgeStatus(bridgeName, maxAgeMs = 600000) {
  if (isBridgeStatusStale(bridgeName, maxAgeMs)) {
    logger.debug(`Status for bridge ${bridgeName} is stale, refreshing...`);
    await refreshBridgeStatus(bridgeName);
  }
  return getCachedBridgeStatus(bridgeName);
}

/**
 * Get operational bridges only
 */
function getOperationalBridges() {
  const operational = [];
  for (const [bridgeName, status] of bridgeStatusCache.entries()) {
    if (status.status === 'operational') {
      operational.push(bridgeName);
    }
  }
  return operational;
}

module.exports = {
  startBridgeMonitoring,
  stopBridgeMonitoring,
  getCachedBridgeStatus,
  getAllCachedBridgeStatuses,
  isBridgeStatusStale,
  refreshBridgeStatus,
  getBridgeStatus,
  getOperationalBridges,
  SUPPORTED_BRIDGES
};

