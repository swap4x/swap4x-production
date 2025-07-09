// API Configuration for Swap4x Bridge Aggregator

module.exports = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3001,
    host: '0.0.0.0',
    environment: process.env.NODE_ENV || 'development'
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || 'sqlite:./swap4x_local.db',
    options: {
      logging: process.env.NODE_ENV === 'development',
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  },

  // RPC Endpoints
  rpc: {
    ethereum: process.env.ETHEREUM_RPC || 'https://eth-mainnet.g.alchemy.com/v2/GG12Ngpf1dOhnz2lgwd7YOlEDQsR1WTa',
    polygon: process.env.POLYGON_RPC || 'https://polygon-mainnet.g.alchemy.com/v2/GG12Ngpf1dOhnz2lgwd7YOlEDQsR1WTa',
    arbitrum: process.env.ARBITRUM_RPC || 'https://arb-mainnet.g.alchemy.com/v2/GG12Ngpf1dOhnz2lgwd7YOlEDQsR1WTa',
    optimism: process.env.OPTIMISM_RPC || 'https://opt-mainnet.g.alchemy.com/v2/GG12Ngpf1dOhnz2lgwd7YOlEDQsR1WTa',
    base: process.env.BASE_RPC || 'https://base-mainnet.g.alchemy.com/v2/GG12Ngpf1dOhnz2lgwd7YOlEDQsR1WTa',
    avalanche: process.env.AVALANCHE_RPC || 'https://api.avax.network/ext/bc/C/rpc',
    bsc: process.env.BSC_RPC || 'https://bsc-dataseed.binance.org/',
    fantom: process.env.FANTOM_RPC || 'https://rpc.ftm.tools/',
    solana: process.env.SOLANA_RPC || 'https://api.mainnet-beta.solana.com'
  },

  // API Keys
  apiKeys: {
    coingecko: process.env.COINGECKO_API_KEY || 'CG-aCwPhUQrCgnkBtKphJfZHgwi',
    alchemy: process.env.ALCHEMY_API_KEY || 'GG12Ngpf1dOhnz2lgwd7YOlEDQsR1WTa'
  },

  // Bridge Configuration
  bridge: {
    platformFee: parseFloat(process.env.PLATFORM_FEE) || 0.05,
    maxSlippage: parseFloat(process.env.MAX_SLIPPAGE) || 0.5,
    gasMultiplier: parseFloat(process.env.GAS_MULTIPLIER) || 1.2,
    timeout: 30000
  },

  // Supported Networks
  networks: {
    ethereum: { chainId: 1, name: 'Ethereum', symbol: 'ETH' },
    polygon: { chainId: 137, name: 'Polygon', symbol: 'MATIC' },
    arbitrum: { chainId: 42161, name: 'Arbitrum', symbol: 'ETH' },
    optimism: { chainId: 10, name: 'Optimism', symbol: 'ETH' },
    base: { chainId: 8453, name: 'Base', symbol: 'ETH' },
    avalanche: { chainId: 43114, name: 'Avalanche', symbol: 'AVAX' },
    bsc: { chainId: 56, name: 'BNB Chain', symbol: 'BNB' },
    fantom: { chainId: 250, name: 'Fantom', symbol: 'FTM' },
    solana: { chainId: 101, name: 'Solana', symbol: 'SOL' }
  },

  // Platform Configuration
  platform: {
    supportedTokens: [
      'ethereum', 'bitcoin', 'binancecoin', 'cardano', 'solana',
      'polkadot', 'dogecoin', 'avalanche-2', 'polygon', 'chainlink',
      'uniswap', 'litecoin', 'bitcoin-cash', 'algorand', 'cosmos'
    ]
  },

  // CORS Configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://swap4x.com', 'https://www.swap4x.com']
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'simple'
  }
};

