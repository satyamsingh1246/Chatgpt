import { useState, useEffect } from 'react'
import { AuthContext } from './context/AuthContext'
import { ChatContextProvider } from './context/ChatContext'
import Login from './pages/Login'
import Register from './pages/Register'
import ChatApp from './pages/ChatApp'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('login')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // Check localStorage for user data
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('token')
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser))
          // Restore cookie for socket.io
          document.cookie = `token=${storedToken}; path=/`
          setCurrentPage('chat')
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setCurrentPage('chat')
  }

  const handleRegister = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setCurrentPage('chat')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setCurrentPage('login')
  }

  if (loading) {
    return <div className="loading-container">Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout }}>
      {!user ? (
        <div className="auth-container">
          {currentPage === 'login' ? (
            <>
              <Login onLogin={handleLogin} />
              <button 
                className="auth-toggle"
                onClick={() => setCurrentPage('register')}
              >
                Don't have an account? Register
              </button>
            </>
          ) : (
            <>
              <Register onRegister={handleRegister} />
              <button 
                className="auth-toggle"
                onClick={() => setCurrentPage('login')}
              >
                Already have an account? Login
              </button>
            </>
          )}
        </div>
      ) : (
        <ChatContextProvider>
          <ChatApp />
        </ChatContextProvider>
      )}
    </AuthContext.Provider>
  )
}

export default App
