import { 
  getTokensForNetwork, 
  getCurrentChainId as getChainId, 
  getNetworkConfig,
  CHAIN_ID_MAP,
  switchToNetwork as switchNetwork
} from './tokenConfig.js'

// Re-export functions with consistent naming
export const getCurrentChainId = getChainId
export const switchToNetwork = switchNetwork
export { getTokensForNetwork, getNetworkConfig, CHAIN_ID_MAP }

// ERC20 ABI for balance checking
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  }
]

// Get native token balance (ETH, MATIC, etc.)
export const getNativeBalance = async (address, chainId) => {
  if (!window.ethereum || !address) return '0'
  
  try {
    console.log(`🔍 Getting native balance for ${address} on chain ${chainId}`)
    
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    })
    
    // Convert from wei to ether (18 decimals)
    const balanceInEther = (parseInt(balance, 16) / Math.pow(10, 18)).toString()
    console.log(`💰 Native balance: ${balanceInEther}`)
    
    return balanceInEther
  } catch (error) {
    console.error('Error getting native balance:', error)
    return '0'
  }
}

// Get ERC20 token balance
export const getTokenBalance = async (address, tokenAddress, decimals) => {
  if (!window.ethereum || !address || !tokenAddress) return '0'
  
  try {
    console.log(`🔍 Getting token balance for ${tokenAddress}`)
    
    // Encode the balanceOf function call
    const data = `0x70a08231000000000000000000000000${address.slice(2)}`
    
    const result = await window.ethereum.request({
      method: 'eth_call',
      params: [{
        to: tokenAddress,
        data: data
      }, 'latest']
    })
    
    if (!result || result === '0x') {
      return '0'
    }
    
    // Convert from token units to human readable
    const balanceWei = parseInt(result, 16)
    const balance = (balanceWei / Math.pow(10, decimals)).toString()
    console.log(`💰 Token balance: ${balance}`)
    
    return balance
  } catch (error) {
    console.error('Error getting token balance:', error)
    return '0'
  }
}

// Get all token balances for current network
export const getAllTokenBalances = async (address) => {
  if (!window.ethereum || !address) return {}
  
  try {
    console.log('🔍 Loading all token balances...')
    
    // Get current network
    const chainId = await getCurrentChainId()
    if (!chainId) {
      console.error('❌ Could not get current chain ID')
      return {}
    }
    
    console.log(`🌐 Current network: ${chainId}`)
    
    // Get tokens for this network
    const tokens = getTokensForNetwork(chainId)
    const balances = {}
    
    // Load balances for each token
    for (const [tokenId, tokenConfig] of Object.entries(tokens)) {
      try {
        let balance = '0'
        
        if (tokenConfig.address === 'native') {
          // Native token (ETH, MATIC, etc.)
          balance = await getNativeBalance(address, chainId)
        } else {
          // ERC20 token
          balance = await getTokenBalance(address, tokenConfig.address, tokenConfig.decimals)
        }
        
        balances[tokenId] = balance
        console.log(`💰 ${tokenConfig.symbol}: ${balance}`)
        
      } catch (error) {
        console.error(`❌ Error loading ${tokenConfig.symbol} balance:`, error)
        balances[tokenId] = '0'
      }
    }
    
    console.log('✅ All balances loaded:', balances)
    return balances
    
  } catch (error) {
    console.error('❌ Error loading token balances:', error)
    return {}
  }
}

// Format balance for display
export const formatBalance = (balance, maxDecimals = 6) => {
  const num = parseFloat(balance || '0')
  
  if (num === 0) return '0'
  if (num < 0.000001) return '< 0.000001'
  if (num < 1) return num.toFixed(maxDecimals)
  if (num < 1000) return num.toFixed(4)
  if (num < 1000000) return num.toFixed(2)
  
  // For large numbers, use K/M notation
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K'
  }
  
  return num.toFixed(2)
}

// Check if user is on the correct network
export const isOnCorrectNetwork = async (expectedChainId) => {
  const currentChainId = await getCurrentChainId()
  return currentChainId === expectedChainId
}

// Get network name from chain ID
export const getNetworkName = (chainId) => {
  const config = getNetworkConfig(chainId)
  return config ? config.name : `Unknown (${chainId})`
}

// Validate wallet address
export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Get token info for display
export const getTokenDisplayInfo = (tokenId, chainId) => {
  const tokens = getTokensForNetwork(chainId)
  return tokens[tokenId] || null
}

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
}

// Request account access
export const requestAccounts = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed')
  }
  
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })
    return accounts[0]
  } catch (error) {
    console.error('Error requesting accounts:', error)
    throw error
  }
}

// Get current account
export const getCurrentAccount = async () => {
  if (!window.ethereum) return null
  
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    })
    return accounts[0] || null
  } catch (error) {
    console.error('Error getting current account:', error)
    return null
  }
}

