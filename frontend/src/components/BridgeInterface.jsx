import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { ArrowRight, ArrowUpDown, Clock, DollarSign, Shield, Zap, RefreshCw, AlertTriangle, Wallet, Network } from 'lucide-react'
import RouteComparison from './RouteComparison'
import { 
  getAllTokenBalances, 
  formatBalance, 
  getCurrentChainId, 
  getNetworkName,
  getTokensForNetwork,
  isOnCorrectNetwork,
  switchToNetwork,
  CHAIN_ID_MAP,
  getNetworkConfig
} from '../utils/walletUtils.js'

const BridgeInterface = ({ connectedWallet, onConnect, routes }) => {
  const [fromChain, setFromChain] = useState('ethereum')
  const [toChain, setToChain] = useState('polygon')
  const [token, setToken] = useState('USDC')
  const [amount, setAmount] = useState('')
  const [preference, setPreference] = useState('balanced')
  const [loading, setLoading] = useState(false)
  const [showRoutes, setShowRoutes] = useState(false)
  const [walletBalances, setWalletBalances] = useState({})
  const [loadingBalances, setLoadingBalances] = useState(false)
  const [currentChainId, setCurrentChainId] = useState(null)
  const [availableTokens, setAvailableTokens] = useState({})
  const [networkMismatch, setNetworkMismatch] = useState(false)

  const chains = [
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', chainId: 1 },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', chainId: 137 },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ETH', chainId: 42161 },
    { id: 'optimism', name: 'Optimism', symbol: 'ETH', chainId: 10 },
    { id: 'base', name: 'Base', symbol: 'ETH', chainId: 8453 },
    { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', chainId: 43114 },
    { id: 'bnb', name: 'BNB Chain', symbol: 'BNB', chainId: 56 },
    { id: 'fantom', name: 'Fantom', symbol: 'FTM', chainId: 250 }
  ]

  // Load current network and balances when wallet connects
  useEffect(() => {
    if (connectedWallet && window.connectedAccount) {
      loadCurrentNetwork()
      loadWalletBalances()
    }
  }, [connectedWallet])

  // Update available tokens when fromChain changes
  useEffect(() => {
    updateAvailableTokens()
  }, [fromChain, currentChainId])

  // Check for network mismatch
  useEffect(() => {
    checkNetworkMismatch()
  }, [fromChain, currentChainId])

  const loadCurrentNetwork = async () => {
    try {
      const chainId = await getCurrentChainId()
      setCurrentChainId(chainId)
      console.log(`🌐 Current network: ${getNetworkName(chainId)} (${chainId})`)
    } catch (error) {
      console.error('❌ Error loading current network:', error)
    }
  }

  const updateAvailableTokens = () => {
    const expectedChainId = CHAIN_ID_MAP[fromChain]
    if (expectedChainId) {
      const tokens = getTokensForNetwork(expectedChainId)
      setAvailableTokens(tokens)
      
      // Reset token selection if current token not available on new network
      if (!tokens[token]) {
        const firstToken = Object.keys(tokens)[0]
        if (firstToken) {
          setToken(firstToken)
        }
      }
    }
  }

  const checkNetworkMismatch = () => {
    const expectedChainId = CHAIN_ID_MAP[fromChain]
    const mismatch = currentChainId && expectedChainId && currentChainId !== expectedChainId
    setNetworkMismatch(mismatch)
  }

  const loadWalletBalances = async () => {
    if (!window.ethereum || !window.connectedAccount) return
    
    console.log('🔍 Loading wallet balances...')
    setLoadingBalances(true)
    
    try {
      const balances = await getAllTokenBalances(window.connectedAccount)
      setWalletBalances(balances)
      console.log('✅ Wallet balances loaded:', balances)
      
    } catch (error) {
      console.error('❌ Error loading wallet balances:', error)
    } finally {
      setLoadingBalances(false)
    }
  }

  const handleSwitchNetwork = async () => {
    const expectedChainId = CHAIN_ID_MAP[fromChain]
    if (expectedChainId) {
      console.log(`🔄 Switching to ${fromChain} (${expectedChainId})`)
      const success = await switchToNetwork(expectedChainId)
      if (success) {
        // Reload network and balances after switch
        setTimeout(() => {
          loadCurrentNetwork()
          loadWalletBalances()
        }, 1000)
      }
    }
  }

  const setMaxAmount = () => {
    const balance = walletBalances[token] || '0'
    if (parseFloat(balance) > 0) {
      setAmount(balance)
    }
  }

  const preferences = [
    { id: 'cheapest', name: 'Cheapest', icon: DollarSign, description: 'Minimize fees' },
    { id: 'fastest', name: 'Fastest', icon: Zap, description: 'Minimize time' },
    { id: 'safest', name: 'Safest', icon: Shield, description: 'Maximum security' },
    { id: 'balanced', name: 'Balanced', icon: ArrowUpDown, description: 'Best overall' }
  ]

  const handleSwapChains = () => {
    const temp = fromChain
    setFromChain(toChain)
    setToChain(temp)
  }

  const handleGetRoutes = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setShowRoutes(true)
    }, 1500)
  }

  const handleExecuteBridge = (route) => {
    if (!connectedWallet) {
      onConnect()
      return
    }
    
    // Simulate bridge execution
    alert(`Executing bridge via ${route.name}...`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Bridge Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Bridge Assets
          </CardTitle>
          <CardDescription>
            Compare routes across all major bridges and execute with one click
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Chain */}
          <div className="space-y-2">
            <Label htmlFor="from-chain">From</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={fromChain} onValueChange={setFromChain}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                  {chains.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id}>
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={token} onValueChange={setToken}>
                <SelectTrigger>
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(availableTokens).map((tokenItem) => (
                    <SelectItem key={tokenItem.id} value={tokenItem.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{tokenItem.symbol} - {tokenItem.name}</span>
                        {connectedWallet && (
                          <span className="text-sm text-gray-500 ml-2">
                            {loadingBalances ? '...' : formatBalance(walletBalances[tokenItem.id])}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-right pr-16"
                />
                {connectedWallet && walletBalances[token] && parseFloat(walletBalances[token]) > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={setMaxAmount}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 px-2 text-xs"
                  >
                    MAX
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwapChains}
              className="rounded-full p-2"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* To Chain */}
          <div className="space-y-2">
            <Label htmlFor="to-chain">To</Label>
            <Select value={toChain} onValueChange={setToChain}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination chain" />
              </SelectTrigger>
              <SelectContent>
                {chains.filter(chain => chain.id !== fromChain).map((chain) => (
                  <SelectItem key={chain.id} value={chain.id}>
                    {chain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preference Selection */}
          <div className="space-y-2">
            <Label>Route Preference</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {preferences.map((pref) => {
                const Icon = pref.icon
                return (
                  <Button
                    key={pref.id}
                    variant={preference === pref.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreference(pref.id)}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{pref.name}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Get Routes Button */}
          <Button 
            onClick={handleGetRoutes}
            disabled={loading || !amount}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Finding Best Routes...
              </>
            ) : (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                Get Routes
              </>
            )}
          </Button>

          {/* Network Mismatch Warning */}
          {networkMismatch && connectedWallet && (
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-700 dark:text-orange-300">
                  Wrong network! Switch to {chains.find(c => c.id === fromChain)?.name} to see balances
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwitchNetwork}
                className="text-orange-700 border-orange-300 hover:bg-orange-100"
              >
                Switch Network
              </Button>
            </div>
          )}

          {/* Wallet Balance Display */}
          {connectedWallet && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span className="font-medium">
                    Wallet Balances {currentChainId && `(${getNetworkName(currentChainId)})`}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadWalletBalances}
                  disabled={loadingBalances}
                  className="h-8"
                >
                  {loadingBalances ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.values(availableTokens).map((tokenItem) => (
                  <div key={tokenItem.id} className="text-center">
                    <div className="text-sm font-medium">{tokenItem.symbol}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {loadingBalances ? '...' : formatBalance(walletBalances[tokenItem.id])}
                    </div>
                  </div>
                ))}
              </div>
              {Object.keys(availableTokens).length === 0 && (
                <div className="text-center text-sm text-gray-500">
                  No tokens available for this network
                </div>
              )}
            </div>
          )}

          {/* Warning for disconnected wallet */}
          {!connectedWallet && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-700 dark:text-yellow-300">
                Connect your wallet to execute bridge transactions
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Route Comparison */}
      {showRoutes && (
        <RouteComparison 
          routes={routes}
          fromChain={fromChain}
          toChain={toChain}
          token={token}
          amount={amount}
          preference={preference}
          onExecute={handleExecuteBridge}
          connectedWallet={connectedWallet}
        />
      )}
    </div>
  )
}

export default BridgeInterface

