import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { ArrowRight, RefreshCw, Wallet } from 'lucide-react'
import RouteComparison from './RouteComparison'

const BridgeInterface = ({ connectedWallet, onConnect, routes }) => {
  const [fromChain, setFromChain] = useState('ethereum')
  const [toChain, setToChain] = useState('polygon')
  const [token, setToken] = useState('USDC')
  const [amount, setAmount] = useState('')
  const [preference, setPreference] = useState('balanced')
  const [loading, setLoading] = useState(false)
  const [showRoutes, setShowRoutes] = useState(false)
  const [ethBalance, setEthBalance] = useState('0')
  const [usdcBalance, setUsdcBalance] = useState('0')
  const [loadingBalances, setLoadingBalances] = useState(false)

  const chains = [
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC' },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ETH' },
    { id: 'optimism', name: 'Optimism', symbol: 'ETH' },
    { id: 'base', name: 'Base', symbol: 'ETH' },
    { id: 'bnb', name: 'BNB Chain', symbol: 'BNB' }
  ]

  const tokens = {
    'ETH': { name: 'Ethereum', symbol: 'ETH' },
    'USDC': { name: 'USD Coin', symbol: 'USDC' },
    'USDT': { name: 'Tether', symbol: 'USDT' },
    'WETH': { name: 'Wrapped Ethereum', symbol: 'WETH' }
  }

  // Load wallet balances when wallet connects
  useEffect(() => {
    if (connectedWallet && window.ethereum && window.connectedAccount) {
      loadWalletBalances()
    }
  }, [connectedWallet])

  const loadWalletBalances = async () => {
    if (!window.ethereum || !window.connectedAccount) return
    
    setLoadingBalances(true)
    console.log('🔄 Loading wallet balances for:', window.connectedAccount)
    
    try {
      // Get ETH balance
      const ethBalanceWei = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [window.connectedAccount, 'latest']
      })
      
      const ethBalanceEth = parseInt(ethBalanceWei, 16) / Math.pow(10, 18)
      setEthBalance(ethBalanceEth.toFixed(4))
      console.log('✅ ETH Balance:', ethBalanceEth.toFixed(4))
      
      // Mock USDC balance for now (you can implement real USDC reading later)
      setUsdcBalance('1,234.56')
      console.log('✅ Balances loaded successfully')
      
    } catch (error) {
      console.error('❌ Error loading balances:', error)
      setEthBalance('Error')
      setUsdcBalance('Error')
    } finally {
      setLoadingBalances(false)
    }
  }

  const handleGetRoutes = async () => {
    setLoading(true)
    setShowRoutes(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  const getCurrentBalance = () => {
    if (token === 'ETH') return ethBalance
    if (token === 'USDC') return usdcBalance
    return '0'
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Wallet Balances</span>
                {loadingBalances && <RefreshCw className="h-4 w-4 animate-spin" />}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadWalletBalances}
                disabled={loadingBalances}
              >
                Refresh
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="text-sm">
                <span className="text-muted-foreground">ETH:</span>
                <span className="ml-2 font-mono">{ethBalance}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">USDC:</span>
                <span className="ml-2 font-mono">{usdcBalance}</span>
              </div>
            </div>
          </div>
        )}

        {/* From Section */}
        <div className="space-y-4">
          <Label>From</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={fromChain} onValueChange={setFromChain}>
              <SelectTrigger>
                <SelectValue />
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(tokens).map(([key, tokenInfo]) => (
                  <SelectItem key={key} value={key}>
                    {tokenInfo.symbol} - {tokenInfo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Input
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-16"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 px-2 text-xs"
                onClick={() => setAmount(getCurrentBalance())}
              >
                MAX
              </Button>
            </div>
          </div>
          
          {connectedWallet && (
            <div className="text-sm text-muted-foreground">
              Balance: {getCurrentBalance()} {token}
            </div>
          )}
        </div>

        {/* Swap Icon */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const temp = fromChain
              setFromChain(toChain)
              setToChain(temp)
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* To Section */}
        <div className="space-y-4">
          <Label>To</Label>
          <Select value={toChain} onValueChange={setToChain}>
            <SelectTrigger>
              <SelectValue />
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

        {/* Route Preference */}
        <div className="space-y-4">
          <Label>Route Preference</Label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'cheapest', label: 'Cheapest', icon: '$' },
              { id: 'fastest', label: 'Fastest', icon: '⚡' },
              { id: 'safest', label: 'Safest', icon: '🛡️' },
              { id: 'balanced', label: 'Balanced', icon: '⚖️' }
            ].map((pref) => (
              <Button
                key={pref.id}
                variant={preference === pref.id ? 'default' : 'outline'}
                className="flex flex-col h-16"
                onClick={() => setPreference(pref.id)}
              >
                <span className="text-lg">{pref.icon}</span>
                <span className="text-xs">{pref.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Get Routes Button */}
        <Button 
          className="w-full" 
          onClick={handleGetRoutes}
          disabled={loading || !amount || !connectedWallet}
        >
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Finding Routes...
            </>
          ) : (
            <>
              <ArrowRight className="mr-2 h-4 w-4" />
              Get Routes
            </>
          )}
        </Button>

        {!connectedWallet && (
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Connect your wallet to see balances and execute bridges
            </p>
            <Button className="mt-2" onClick={onConnect}>
              Connect Wallet
            </Button>
          </div>
        )}

        {/* Route Results */}
        {showRoutes && (
          <RouteComparison 
            routes={routes} 
            loading={loading}
            fromChain={fromChain}
            toChain={toChain}
            token={token}
            amount={amount}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default BridgeInterface
