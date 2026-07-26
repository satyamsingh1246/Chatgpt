import io from 'socket.io-client'

let socket = null

const getToken = () => {
  // Try to get from localStorage first
  let token = localStorage.getItem('token')
  
  // If not found, try to parse from cookies
  if (!token) {
    const cookies = document.cookie.split('; ').find(row => row.startsWith('token='))
    if (cookies) {
      token = cookies.split('=')[1]
    }
  }
  
  return token
}

export const connectSocket = () => {
  if (socket) return socket

  const token = getToken()
  
  socket = io('http://localhost:3000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    query: {
      token: token,
    },
  })

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id)
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket

export const emitMessage = (chatId, content) => {
  if (socket && socket.connected) {
    socket.emit('ai-message', {
      chat: chatId,
      content,
    })
  }
}

export const onAIResponse = (callback) => {
  if (socket) {
    socket.on('ai-response', callback)
    return () => socket.off('ai-response', callback)
  }
}

export const onAIStreamChunk = (callback) => {
  if (socket) {
    socket.on('ai-stream-chunk', callback)
    return () => socket.off('ai-stream-chunk', callback)
  }
}

export const onAIStreamEnd = (callback) => {
  if (socket) {
    socket.on('ai-stream-end', callback)
    return () => socket.off('ai-stream-end', callback)
  }
}
