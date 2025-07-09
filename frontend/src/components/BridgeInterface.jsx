import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { ArrowRight, RefreshCw, Wallet, Clock, DollarSign, Zap, Shield } from 'lucide-react'

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

  const chains = [
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: '⟠' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', icon: '⬟' },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', icon: '🔷' },
    { id: 'optimism', name: 'Optimism', symbol: 'OP', icon: '🔴' },
    { id: 'base', name: 'Base', symbol: 'BASE', icon: '🔵' },
    { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', icon: '🔺' }
  ]

  const tokens = ['USDC', 'USDT', 'ETH', 'WETH', 'DAI']

  // Mock bridge routes data matching the mockup
  const mockRoutes = [
    {
      id: 'stargate',
      name: 'Stargate',
      icon: '🌟',
      rate: '0.05%',
      time: '2 min',
      gasFee: '$12',
      totalFee: '$12.50',
      security: 'High',
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'hop',
      name: 'Hop Protocol',
      icon: '⚡',
      rate: '0.1%',
      time: '5 min',
      gasFee: '$8',
      totalFee: '$9.00',
      security: 'High',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'synapse',
      name: 'Synapse',
      icon: '🔗',
      rate: '0.15%',
      time: '3 min',
      gasFee: '$10',
      totalFee: '$11.50',
      security: 'Medium',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'across',
      name: 'Across',
      icon: '🌉',
      rate: '0.08%',
      time: '1 min',
      gasFee: '$15',
      totalFee: '$15.80',
      security: 'High',
      color: 'bg-gray-50 border-gray-200'
    },
    {
      id: 'multichain',
      name: 'Multichain',
      icon: '⛓️',
      rate: '0.12%',
      time: '4 min',
      gasFee: '$9',
      totalFee: '$10.20',
      security: 'Medium',
      color: 'bg-indigo-50 border-indigo-200'
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
    
    // Simulate API call delay
    setTimeout(() => {
      setBridgeRoutes(mockRoutes)
      setLoading(false)
    }, 1500)
  }

  const handleExecuteBridge = (route) => {
    setSelectedRoute(route)
    // This would trigger the transaction flow
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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Main Bridge Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Bridge Assets
          </CardTitle>
          <CardDescription>
            Compare routes across all major bridges and execute with one click
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wallet Balance Display */}
          {connectedWallet && (
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Wallet Balances</span>
                </div>
                <Button variant="outline" size="sm" onClick={loadWalletBalances}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">ETH:</span>
                  <span className="ml-2 font-mono">{ethBalance}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">USDC:</span>
                  <span className="ml-2 font-mono">{usdcBalance}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Balance:</span>
                  <span className="ml-2 font-mono">{getCurrentBalance()} {token}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bridge Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* From */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">From</Label>
              <Select value={fromChain} onValueChange={setFromChain}>
                <SelectTrigger className="h-12">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getChainIcon(fromChain)}</span>
                      <span>{getChainName(fromChain)}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {chains.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{chain.icon}</span>
                        <span>{chain.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="relative">
                <Input
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 text-lg pr-20"
                />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                  <Select value={token} onValueChange={setToken}>
                    <SelectTrigger className="h-8 w-20 border-0 bg-transparent">
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
            </div>

            {/* Swap Arrow */}
            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => {
                  const temp = fromChain
                  setFromChain(toChain)
                  setToChain(temp)
                }}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            {/* To */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">To</Label>
              <Select value={toChain} onValueChange={setToChain}>
                <SelectTrigger className="h-12">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getChainIcon(toChain)}</span>
                      <span>{getChainName(toChain)}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {chains.filter(chain => chain.id !== fromChain).map((chain) => (
                    <SelectItem key={chain.id} value={chain.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{chain.icon}</span>
                        <span>{chain.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="h-12 flex items-center px-3 bg-gray-50 rounded-md">
                <span className="text-muted-foreground">You'll receive: </span>
                <span className="ml-2 font-semibold">
                  {amount ? (parseFloat(amount) * 0.999).toFixed(2) : '0'} {token}
                </span>
              </div>
            </div>
          </div>

          {/* Get Routes Button */}
          <Button 
            className="w-full h-12 text-lg" 
            onClick={handleGetRoutes}
            disabled={loading || !amount || !connectedWallet}
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                Finding Best Routes...
              </>
            ) : (
              <>
                <ArrowRight className="mr-2 h-5 w-5" />
                Get Routes
              </>
            )}
          </Button>

          {!connectedWallet && (
            <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200 mb-3">
                Connect your wallet to see routes and execute bridges
              </p>
              <Button onClick={onConnect}>Connect Wallet</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Route Comparison Table */}
      {bridgeRoutes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Routes</CardTitle>
            <CardDescription>
              Compare bridge options sorted by best value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bridgeRoutes.map((route, index) => (
                <div 
                  key={route.id} 
                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${route.color} ${
                    index === 0 ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{route.icon}</span>
                        <div>
                          <div className="font-semibold text-lg">{route.name}</div>
                          {index === 0 && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Recommended
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Rate</div>
                        <div className="font-semibold text-green-600">{route.rate}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Time</div>
                        <div className="font-semibold flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {route.time}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Gas Fee</div>
                        <div className="font-semibold flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {route.gasFee}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Total Fee</div>
                        <div className="font-semibold">{route.totalFee}</div>
                      </div>
                      
                      <Button 
                        onClick={() => handleExecuteBridge(route)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Execute Bridge
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default BridgeInterface

