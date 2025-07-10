import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { ArrowRight, RefreshCw, Wallet, Clock, DollarSign, Zap, Shield, TrendingUp, Star, CheckCircle } from 'lucide-react'

const BridgeInterface = ({ connectedWallet, onConnect, routes }) => {
  const [fromChain, setFromChain] = useState('ethereum')
  const [toChain, setToChain] = useState('polygon')
  const [token, setToken] = useState('USDC')
  const [amount, setAmount] = useState('1000')
  const [loading, setLoading] = useState(false)
  const [bridgeRoutes, setBridgeRoutes] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [ethBalance, setEthBalance] = useState('2.4567')
  const [usdcBalance, setUsdcBalance] = useState('5,234.56')
  const [sortBy, setSortBy] = useState('score')

  const chains = [
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: '⟠', color: 'bg-blue-500' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', icon: '⬟', color: 'bg-purple-500' },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', icon: '🔷', color: 'bg-blue-600' },
    { id: 'optimism', name: 'Optimism', symbol: 'OP', icon: '🔴', color: 'bg-red-500' },
    { id: 'base', name: 'Base', symbol: 'BASE', icon: '🔵', color: 'bg-blue-400' },
    { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', icon: '🔺', color: 'bg-red-600' }
  ]

  const tokens = ['USDC', 'USDT', 'ETH', 'WETH', 'DAI', 'WBTC']

  // Premium bridge routes with advanced scoring
  const premiumRoutes = [
    {
      id: 'stargate',
      name: 'Stargate Finance',
      icon: 'S',
      iconBg: 'bg-green-500',
      fee: '0.06%',
      feeUsd: '$0.60',
      time: '5 min',
      gas: '$12.50',
      youGet: '993.50',
      confidence: 'High Confidence',
      confidencePercent: '95%',
      score: 92.5,
      recommended: true,
      features: ['Instant Settlement', 'Low Slippage', 'High Liquidity']
    },
    {
      id: 'hop',
      name: 'Hop Protocol',
      icon: 'H',
      iconBg: 'bg-purple-500',
      fee: '0.04%',
      feeUsd: '$4.80',
      time: '4 min',
      gas: '$8.20',
      youGet: '995.20',
      confidence: 'High Confidence',
      confidencePercent: '92%',
      score: 94.2,
      recommended: false,
      features: ['Fast Transfer', 'Optimized Gas', 'Multi-hop']
    },
    {
      id: 'across',
      name: 'Across Protocol',
      icon: 'A',
      iconBg: 'bg-blue-500',
      fee: '0.03%',
      feeUsd: '$3.80',
      time: '3 min',
      gas: '$6.80',
      youGet: '996.20',
      confidence: 'Medium Confidence',
      confidencePercent: '88%',
      score: 96.1,
      recommended: false,
      features: ['Ultra Fast', 'Low Fees', 'Optimistic']
    },
    {
      id: 'synapse',
      name: 'Synapse Protocol',
      icon: 'S',
      iconBg: 'bg-indigo-500',
      fee: '0.08%',
      feeUsd: '$8.00',
      time: '6 min',
      gas: '$10.50',
      youGet: '991.50',
      confidence: 'High Confidence',
      confidencePercent: '90%',
      score: 89.3,
      recommended: false,
      features: ['Secure', 'Reliable', 'Cross-chain']
    },
    {
      id: 'multichain',
      name: 'Multichain',
      icon: 'M',
      iconBg: 'bg-orange-500',
      fee: '0.10%',
      feeUsd: '$10.00',
      time: '8 min',
      gas: '$15.00',
      youGet: '990.00',
      confidence: 'Medium Confidence',
      confidencePercent: '85%',
      score: 87.8,
      recommended: false,
      features: ['Wide Support', 'Established', 'Multi-asset']
    }
  ]

  useEffect(() => {
    if (connectedWallet && window.ethereum && window.connectedAccount) {
      loadWalletBalances()
    }
  }, [connectedWallet])

  const loadWalletBalances = async () => {
    if (!window.ethereum || !window.connectedAccount) return
    
    try {
      const ethBalanceWei = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [window.connectedAccount, 'latest']
      })
      
      const ethBalanceEth = parseInt(ethBalanceWei, 16) / Math.pow(10, 18)
      setEthBalance(ethBalanceEth.toFixed(4))
    } catch (error) {
      console.error('Error loading balances:', error)
    }
  }

  const handleGetRoutes = async () => {
    setLoading(true)
    
    // Simulate API call with realistic delay
    setTimeout(() => {
      const sortedRoutes = [...premiumRoutes].sort((a, b) => {
        if (sortBy === 'score') return b.score - a.score
        if (sortBy === 'time') return parseInt(a.time) - parseInt(b.time)
        if (sortBy === 'fee') return parseFloat(a.fee) - parseFloat(b.fee)
        if (sortBy === 'youGet') return parseFloat(b.youGet) - parseFloat(a.youGet)
        return 0
      })
      setBridgeRoutes(sortedRoutes)
      setLoading(false)
    }, 2000)
  }

  const handleExecuteBridge = (route) => {
    setSelectedRoute(route)
    console.log('Executing bridge via:', route.name)
  }

  const getCurrentBalance = () => {
    if (token === 'ETH') return ethBalance
    if (token === 'USDC') return usdcBalance
    return '0'
  }

  const getChainIcon = (chainId) => {
    const chain = chains.find(c => c.id === chainId)
    return chain ? chain.icon : '⚪'
  }

  const getChainName = (chainId) => {
    const chain = chains.find(c => c.id === chainId)
    return chain ? chain.name : chainId
  }

  const getChainColor = (chainId) => {
    const chain = chains.find(c => c.id === chainId)
    return chain ? chain.color : 'bg-gray-500'
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4">
      {/* Premium Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
          Bridge Aggregator
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Find the best routes across all major bridges. Save on fees, reduce time, maximize security.
        </p>
      </div>

      {/* Main Bridge Interface */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardContent className="p-8 space-y-8">
          {/* Premium Wallet Display */}
          {connectedWallet && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Connected Wallet</h3>
                    <p className="text-sm text-muted-foreground">{connectedWallet}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={loadWalletBalances} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{ethBalance}</div>
                  <div className="text-sm text-muted-foreground">ETH</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{usdcBalance}</div>
                  <div className="text-sm text-muted-foreground">USDC</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{getCurrentBalance()}</div>
                  <div className="text-sm text-muted-foreground">Selected ({token})</div>
                </div>
              </div>
            </div>
          )}

          {/* Premium Bridge Form */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-end">
            {/* From Chain */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <span>From</span>
              </Label>
              <Select value={fromChain} onValueChange={setFromChain}>
                <SelectTrigger className="h-14 text-lg">
                  <SelectValue>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${getChainColor(fromChain)} flex items-center justify-center text-white font-bold`}>
                        {getChainIcon(fromChain)}
                      </div>
                      <span>{getChainName(fromChain)}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {chains.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id}>
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full ${chain.color} flex items-center justify-center text-white text-sm font-bold`}>
                          {chain.icon}
                        </div>
                        <span>{chain.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount & Token */}
            <div className="space-y-3 lg:col-span-2">
              <Label className="text-base font-semibold">Amount</Label>
              <div className="relative">
                <Input
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-14 text-lg pr-24 text-right"
                />
                <div className="absolute right-2 top-2">
                  <Select value={token} onValueChange={setToken}>
                    <SelectTrigger className="h-10 w-20 border-0 bg-gray-100 dark:bg-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {connectedWallet && (
                <div className="text-sm text-muted-foreground text-right">
                  Balance: {getCurrentBalance()} {token}
                </div>
              )}
            </div>

            {/* To Chain */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">To</Label>
              <Select value={toChain} onValueChange={setToChain}>
                <SelectTrigger className="h-14 text-lg">
                  <SelectValue>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${getChainColor(toChain)} flex items-center justify-center text-white font-bold`}>
                        {getChainIcon(toChain)}
                      </div>
                      <span>{getChainName(toChain)}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {chains.filter(chain => chain.id !== fromChain).map((chain) => (
                    <SelectItem key={chain.id} value={chain.id}>
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full ${chain.color} flex items-center justify-center text-white text-sm font-bold`}>
                          {chain.icon}
                        </div>
                        <span>{chain.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Get Routes Button */}
            <Button 
              className="h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg" 
              onClick={handleGetRoutes}
              disabled={loading || !amount || !connectedWallet}
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Finding Routes...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Get Routes
                </>
              )}
            </Button>
          </div>

          {!connectedWallet && (
            <div className="text-center p-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Connect Your Wallet</h3>
                <p className="text-muted-foreground">
                  Connect your wallet to access premium bridge routes and execute transactions
                </p>
                <Button onClick={onConnect} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Connect Wallet
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Premium Route Comparison */}
      {bridgeRoutes.length > 0 && (
        <Card className="shadow-2xl border-0">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  Route Comparison
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Bridging {amount} {token} from {getChainName(fromChain)} to {getChainName(toChain)} • Optimized for <span className="font-semibold text-blue-600">best value</span>
                </CardDescription>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Route Score</SelectItem>
                  <SelectItem value="time">Fastest Time</SelectItem>
                  <SelectItem value="fee">Lowest Fee</SelectItem>
                  <SelectItem value="youGet">You Get Most</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {bridgeRoutes.map((route, index) => (
              <div 
                key={route.id} 
                className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  route.recommended 
                    ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950' 
                    : 'border-gray-200 bg-white dark:bg-gray-800 hover:border-blue-300'
                }`}
              >
                {route.recommended && (
                  <div className="absolute -top-3 left-6">
                    <Badge className="bg-green-500 text-white px-3 py-1 text-sm font-semibold">
                      <Star className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  {/* Protocol Info */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${route.iconBg} flex items-center justify-center text-white font-bold text-xl`}>
                      {route.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{route.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant={route.confidence.includes('High') ? 'default' : 'secondary'} className="text-xs">
                          {route.confidence}
                        </Badge>
                        <span className="text-sm font-semibold text-blue-600">{route.confidencePercent}</span>
                      </div>
                    </div>
                  </div>

                  {/* Route Metrics */}
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Fee
                      </div>
                      <div className="font-semibold text-green-600">{route.fee}</div>
                      <div className="text-xs text-muted-foreground">{route.feeUsd}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Time
                      </div>
                      <div className="font-semibold">{route.time}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Gas
                      </div>
                      <div className="font-semibold">{route.gas}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        You Get
                      </div>
                      <div className="font-semibold text-lg text-green-600">{route.youGet}</div>
                      <div className="text-xs text-muted-foreground">USDC</div>
                    </div>
                    
                    <Button 
                      onClick={() => handleExecuteBridge(route)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                      size="lg"
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Bridge
                    </Button>
                  </div>
                </div>

                {/* Route Score */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Route Score</span>
                    <span className="font-semibold">{route.score}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${route.score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-4 flex gap-2">
                  {route.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default BridgeInterface

