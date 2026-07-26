import { createContext, useState, useCallback, useEffect } from 'react'
import api from '../services/api'

export const ChatContext = createContext()

export function ChatContextProvider({ children }) {
  const [chats, setChats] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true)
      // Fetch chats from the backend API
      const response = await api.get('/api/chat')
      setChats(response.data.chats || [])
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch chats on mount
  useEffect(() => {
    fetchChats()
  }, [])

  const createNewChat = useCallback(async (title) => {
    try {
      const response = await api.post('/api/chat', { title })
      const newChat = response.data.chat
      setChats(prev => [newChat, ...prev])
      setCurrentChat(newChat)
      setMessages([])
      return newChat
    } catch (error) {
      console.error('Error creating chat:', error)
      throw error
    }
  }, [])

  const selectChat = useCallback((chat) => {
    setCurrentChat(chat)
    setMessages([])
  }, [])

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message])
  }, [])

  const updateLastMessage = useCallback((message) => {
    setMessages(prev => [...prev.slice(0, -1), message])
  }, [])

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        currentChat,
        setCurrentChat,
        messages,
        setMessages,
        loading,
        fetchChats,
        createNewChat,
        selectChat,
        addMessage,
        updateLastMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
