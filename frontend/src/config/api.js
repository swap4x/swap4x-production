// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    health: '/health',
    chains: '/api/bridge/chains',
    routes: '/api/bridge/routes',
    prices: '/api/prices',
    analytics: '/api/analytics'
  }
}

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

export default apiConfig

