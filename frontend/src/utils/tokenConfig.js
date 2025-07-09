// Token configurations for different networks
export const NETWORK_CONFIGS = {
  1: { // Ethereum Mainnet
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/demo',
    blockExplorer: 'https://etherscan.io'
  },
  137: { // Polygon
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com'
  },
  42161: { // Arbitrum
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io'
  },
  10: { // Optimism
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io'
  },
  8453: { // Base
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org'
  },
  43114: { // Avalanche
    name: 'Avalanche',
    symbol: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorer: 'https://snowtrace.io'
  },
  56: { // BNB Chain
    name: 'BNB Chain',
    symbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed1.binance.org',
    blockExplorer: 'https://bscscan.com'
  },
  250: { // Fantom
    name: 'Fantom',
    symbol: 'FTM',
    rpcUrl: 'https://rpc.ftm.tools',
    blockExplorer: 'https://ftmscan.com'
  }
}

// Token configurations per network
export const TOKEN_CONFIGS = {
  1: { // Ethereum Mainnet
    ETH: {
      id: 'ETH',
      name: 'Ethereum',
      symbol: 'ETH',
      address: 'native',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    USDC: {
      id: 'USDC',
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0xA0b86a33E6441e6e80A0c4C7596C5C7C4b8C0c8C',
      decimals: 6,
      logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    },
    USDT: {
      id: 'USDT',
      name: 'Tether',
      symbol: 'USDT',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6,
      logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
    },
    WETH: {
      id: 'WETH',
      name: 'Wrapped Ethereum',
      symbol: 'WETH',
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    }
  },
  137: { // Polygon
    MATIC: {
      id: 'MATIC',
      name: 'Polygon',
      symbol: 'MATIC',
      address: 'native',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
    },
    USDC: {
      id: 'USDC',
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      decimals: 6,
      logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    },
    USDT: {
      id: 'USDT',
      name: 'Tether',
      symbol: 'USDT',
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      decimals: 6,
      logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
    },
    WETH: {
      id: 'WETH',
      name: 'Wrapped Ethereum',
      symbol: 'WETH',
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    }
  },
  42161: { // Arbitrum
    ETH: {
      id: 'ETH',
      name: 'Ethereum',
      symbol: 'ETH',
      address: 'native',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    USDC: {
      id: 'USDC',
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      decimals: 6,
      logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    },
    USDT: {
      id: 'USDT',
      name: 'Tether',
      symbol: 'USDT',
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      decimals: 6,
      logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
    },
    WETH: {
      id: 'WETH',
      name: 'Wrapped Ethereum',
      symbol: 'WETH',
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    }
  },
  10: { // Optimism
    ETH: {
      id: 'ETH',
      name: 'Ethereum',
      symbol: 'ETH',
      address: 'native',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    USDC: {
      id: 'USDC',
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      decimals: 6,
      logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    },
    USDT: {
      id: 'USDT',
      name: 'Tether',
      symbol: 'USDT',
      address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      decimals: 6,
      logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
    },
    WETH: {
      id: 'WETH',
      name: 'Wrapped Ethereum',
      symbol: 'WETH',
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    }
  },
  8453: { // Base
    ETH: {
      id: 'ETH',
      name: 'Ethereum',
      symbol: 'ETH',
      address: 'native',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    USDC: {
      id: 'USDC',
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      decimals: 6,
      logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    },
    WETH: {
      id: 'WETH',
      name: 'Wrapped Ethereum',
      symbol: 'WETH',
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    }
  },
  43114: { // Avalanche
    AVAX: {
      id: 'AVAX',
      name: 'Avalanche',
      symbol: 'AVAX',
      address: 'native',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/avalanche-avax-logo.png'
    },
    USDC: {
      id: 'USDC',
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      decimals: 6,
      logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    },
    USDT: {
      id: 'USDT',
      name: 'Tether',
      symbol: 'USDT',
      address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
      decimals: 6,
      logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
    },
    WETH: {
      id: 'WETH',
      name: 'Wrapped Ethereum',
      symbol: 'WETH',
      address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    }
  },
  56: { // BNB Chain
    BNB: {
      id: 'BNB',
      name: 'BNB',
      symbol: 'BNB',
      address: 'native',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
    },
    USDC: {
      id: 'USDC',
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    },
    USDT: {
      id: 'USDT',
      name: 'Tether',
      symbol: 'USDT',
      address: '0x55d398326f99059fF775485246999027B3197955',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
    },
    WETH: {
      id: 'WETH',
      name: 'Wrapped Ethereum',
      symbol: 'WETH',
      address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    }
  },
  250: { // Fantom
    FTM: {
      id: 'FTM',
      name: 'Fantom',
      symbol: 'FTM',
      address: 'native',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/fantom-ftm-logo.png'
    },
    USDC: {
      id: 'USDC',
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
      decimals: 6,
      logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    },
    USDT: {
      id: 'USDT',
      name: 'Tether',
      symbol: 'USDT',
      address: '0x049d68029688eAbF473097a2fC38ef61633A3C7A',
      decimals: 6,
      logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
    },
    WETH: {
      id: 'WETH',
      name: 'Wrapped Ethereum',
      symbol: 'WETH',
      address: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
      decimals: 18,
      logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    }
  }
}

// Chain ID mapping for UI
export const CHAIN_ID_MAP = {
  'ethereum': 1,
  'polygon': 137,
  'arbitrum': 42161,
  'optimism': 10,
  'base': 8453,
  'avalanche': 43114,
  'bnb': 56,
  'fantom': 250
}

// Get tokens for a specific network
export const getTokensForNetwork = (chainId) => {
  return TOKEN_CONFIGS[chainId] || {}
}

// Get network config
export const getNetworkConfig = (chainId) => {
  return NETWORK_CONFIGS[chainId] || null
}

// Get current network chain ID
export const getCurrentChainId = async () => {
  if (!window.ethereum) return null
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    return parseInt(chainId, 16)
  } catch (error) {
    console.error('Error getting chain ID:', error)
    return null
  }
}

// Switch to a specific network
export const switchToNetwork = async (chainId) => {
  if (!window.ethereum) return false
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }]
    })
    return true
  } catch (error) {
    console.error('Error switching network:', error)
    return false
  }
}

