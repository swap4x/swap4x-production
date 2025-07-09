import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { ArrowRight, ArrowUpDown, Clock, DollarSign, Shield, Zap, TrendingUp, Activity } from 'lucide-react'
import './App.css'

// Components
import Header from './components/Header'
import BridgeInterface from './components/BridgeInterface'
import RouteComparison from './components/RouteComparison'
import TransactionHistory from './components/TransactionHistory'
import Analytics from './components/Analytics'

function App() {
  const [connectedWallet, setConnectedWallet] = useState(null)
  const [bridgeRoutes, setBridgeRoutes] = useState([])
  const [loading, setLoading] = useState(false)

  // Check for existing wallet connection on app load
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          })
          
          if (accounts.length > 0) {
            const account = accounts[0]
            const formattedAddress = `${account.slice(0, 6)}...${account.slice(-4)}`
            setConnectedWallet(formattedAddress)
            window.connectedAccount = account
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }

    checkWalletConnection()

    // Set up MetaMask event listeners with more robust handling
    let accountsChangedHandler
    let chainChangedHandler

    if (typeof window.ethereum !== 'undefined') {
      accountsChangedHandler = (accounts) => {
        console.log('🔄 MetaMask account change event fired:', accounts)
        
        if (accounts.length === 0) {
          console.log('❌ No accounts - wallet disconnected')
          setConnectedWallet(null)
          window.connectedAccount = null
        } else {
          const account = accounts[0]
          console.log('✅ New account detected:', account)
          const formattedAddress = `${account.slice(0, 6)}...${account.slice(-4)}`
          setConnectedWallet(formattedAddress)
          window.connectedAccount = account
          console.log('✅ UI updated with new account:', formattedAddress)
        }
      }

      chainChangedHandler = (chainId) => {
        console.log('🔗 Chain changed to:', chainId)
        // Force page reload on chain change to ensure clean state
        setTimeout(() => window.location.reload(), 100)
      }

      // Add event listeners
      console.log('🎧 Setting up MetaMask event listeners...')
      window.ethereum.on('accountsChanged', accountsChangedHandler)
      window.ethereum.on('chainChanged', chainChangedHandler)

      // Test if events are working
      console.log('🧪 Testing MetaMask event setup...')
      console.log('MetaMask provider:', window.ethereum)
      console.log('Event listeners added successfully')
    } else {
      console.log('❌ MetaMask not detected')
    }

    // Cleanup function
    return () => {
      if (window.ethereum && accountsChangedHandler && chainChangedHandler) {
        console.log('🧹 Cleaning up MetaMask event listeners...')
        try {
          window.ethereum.removeListener('accountsChanged', accountsChangedHandler)
          window.ethereum.removeListener('chainChanged', chainChangedHandler)
          console.log('✅ Event listeners cleaned up')
        } catch (error) {
          console.error('❌ Error cleaning up listeners:', error)
        }
      }
    }
  }, [])

  // Backup polling mechanism for account changes (in case events don't work)
  useEffect(() => {
    let pollInterval

    const pollForAccountChanges = async () => {
      if (typeof window.ethereum !== 'undefined' && connectedWallet) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          })
          
          if (accounts.length > 0) {
            const currentAccount = accounts[0]
            const storedAccount = window.connectedAccount
            
            if (currentAccount !== storedAccount) {
              console.log('🔄 Polling detected account change!')
              console.log('Previous:', storedAccount)
              console.log('Current:', currentAccount)
              
              const formattedAddress = `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`
              setConnectedWallet(formattedAddress)
              window.connectedAccount = currentAccount
            }
          } else if (connectedWallet) {
            console.log('🔄 Polling detected wallet disconnection')
            setConnectedWallet(null)
            window.connectedAccount = null
          }
        } catch (error) {
          console.error('Polling error:', error)
        }
      }
    }

    // Start polling every 2 seconds when wallet is connected
    if (connectedWallet) {
      console.log('🔄 Starting account polling backup...')
      pollInterval = setInterval(pollForAccountChanges, 2000)
    }

    // Cleanup polling
    return () => {
      if (pollInterval) {
        console.log('🛑 Stopping account polling')
        clearInterval(pollInterval)
      }
    }
  }, [connectedWallet])

  // Hide Manus branding/popup
  useEffect(() => {
    const hideManusElements = () => {
      // Find and hide all elements containing "Made with Manus"
      const manusElements = document.querySelectorAll('*');
      manusElements.forEach(element => {
        if (element.textContent && element.textContent.includes('Made with Manus')) {
          element.style.display = 'none';
          element.style.visibility = 'hidden';
          element.style.opacity = '0';
          element.style.pointerEvents = 'none';
        }
      });

      // Also hide any links that contain "manus" in href
      const manusLinks = document.querySelectorAll('a[href*="manus"]');
      manusLinks.forEach(link => {
        link.style.display = 'none';
        link.style.visibility = 'hidden';
        link.style.opacity = '0';
        link.style.pointerEvents = 'none';
      });
    };

    // Run immediately
    hideManusElements();
    
    // Run again after a short delay to catch dynamically loaded elements
    setTimeout(hideManusElements, 1000);
    
    // Set up observer to catch future additions
    const observer = new MutationObserver(hideManusElements);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);

  // Mock data for development
  const mockRoutes = [
    {
      protocol: 'stargate',
      name: 'Stargate Finance',
      fee: '0.06%',
      estimatedTime: '5 min',
      gasEstimate: '$12.50',
      confidence: 95,
      totalFee: '$6.50',
      amountOut: '993.50',
      score: 92.5
    },
    {
      protocol: 'hop',
      name: 'Hop Protocol',
      fee: '0.04%',
      estimatedTime: '4 min',
      gasEstimate: '$8.20',
      confidence: 92,
      totalFee: '$4.80',
      amountOut: '995.20',
      score: 94.2
    },
    {
      protocol: 'across',
      name: 'Across Protocol',
      fee: '0.03%',
      estimatedTime: '3 min',
      gasEstimate: '$6.80',
      confidence: 88,
      totalFee: '$3.80',
      amountOut: '996.20',
      score: 96.1
    }
  ]

  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        
        if (accounts.length > 0) {
          const account = accounts[0]
          console.log('Wallet connected:', account)
          // Format address for display (show first 6 and last 4 characters)
          const formattedAddress = `${account.slice(0, 6)}...${account.slice(-4)}`
          setConnectedWallet(formattedAddress)
          
          // Store full address for transactions
          window.connectedAccount = account
          
          // Force a check for the current account to ensure sync
          setTimeout(async () => {
            try {
              const currentAccounts = await window.ethereum.request({
                method: 'eth_accounts'
              })
              if (currentAccounts.length > 0 && currentAccounts[0] !== account) {
                const newAccount = currentAccounts[0]
                const newFormattedAddress = `${newAccount.slice(0, 6)}...${newAccount.slice(-4)}`
                setConnectedWallet(newFormattedAddress)
                window.connectedAccount = newAccount
                console.log('Account updated after connection:', newAccount)
              }
            } catch (error) {
              console.error('Error checking account after connection:', error)
            }
          }, 1000)
        }
      } else {
        // MetaMask not installed
        alert('Please install MetaMask or another Web3 wallet to connect')
        // Optionally redirect to MetaMask installation
        window.open('https://metamask.io/download/', '_blank')
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      if (error.code === 4001) {
        // User rejected the request
        alert('Wallet connection was rejected. Please try again.')
      } else {
        alert('Failed to connect wallet. Please try again.')
      }
    }
  }

  const disconnectWallet = () => {
    setConnectedWallet(null)
    window.connectedAccount = null
    console.log('Wallet disconnected')
  }

  const refreshAccount = async () => {
    console.log('🔄 Manual account refresh triggered...')
    
    try {
      if (typeof window.ethereum !== 'undefined') {
        console.log('🔍 Checking current MetaMask accounts...')
        
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        })
        
        console.log('📋 Current accounts from MetaMask:', accounts)
        
        if (accounts.length > 0) {
          const account = accounts[0]
          console.log('✅ Active account found:', account)
          
          const formattedAddress = `${account.slice(0, 6)}...${account.slice(-4)}`
          console.log('🎨 Formatted address:', formattedAddress)
          
          // Update state
          setConnectedWallet(formattedAddress)
          window.connectedAccount = account
          
          console.log('✅ Account refreshed successfully!')
          console.log('Current state - connectedWallet:', formattedAddress)
          console.log('Current state - window.connectedAccount:', account)
        } else {
          console.log('❌ No accounts found - disconnecting')
          setConnectedWallet(null)
          window.connectedAccount = null
        }
      } else {
        console.log('❌ MetaMask not available')
        alert('MetaMask not detected. Please make sure it is installed and enabled.')
      }
    } catch (error) {
      console.error('❌ Error refreshing account:', error)
      alert('Failed to refresh account. Please try again or reconnect your wallet.')
    }
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header 
          connectedWallet={connectedWallet}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
          onRefreshAccount={refreshAccount}
        />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <div className="space-y-8">
                {/* Hero Section */}
                <div className="text-center space-y-6 py-4">
                  <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight pb-2">
                    Bridge Aggregator
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Find the best routes across all major bridges. Save on fees, reduce time, maximize security.
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">$12.5M</div>
                        <div className="text-sm text-muted-foreground">Total Volume</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">2,847</div>
                        <div className="text-sm text-muted-foreground">Active Users</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">9</div>
                        <div className="text-sm text-muted-foreground">Bridge Protocols</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-500">0.05%</div>
                        <div className="text-sm text-muted-foreground">Low Fees: From</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Main Bridge Interface */}
                <BridgeInterface 
                  connectedWallet={connectedWallet}
                  onConnect={connectWallet}
                  routes={mockRoutes}
                />

                {/* Features Section */}
                <div className="grid md:grid-cols-3 gap-6 mt-16">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        Best Rates
                      </CardTitle>
                      <CardDescription>
                        Compare rates across all major bridges to find the most cost-effective route
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-600" />
                        Fastest Routes
                      </CardTitle>
                      <CardDescription>
                        Optimize for speed with real-time bridge performance monitoring
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        Maximum Security
                      </CardTitle>
                      <CardDescription>
                        Choose the most secure bridges with confidence scores and risk assessment
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            } />
            
            <Route path="/history" element={
              <TransactionHistory connectedWallet={connectedWallet} />
            } />
            
            <Route path="/analytics" element={
              <Analytics />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

