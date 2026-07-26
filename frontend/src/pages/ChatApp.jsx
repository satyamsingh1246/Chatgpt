import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import { connectSocket, disconnectSocket } from '../services/socket'
import './ChatApp.css'

export default function ChatApp() {
  const { user, handleLogout } = useContext(AuthContext)
  const chatContext = useContext(ChatContext)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    // Fetch chats
    if (chatContext && chatContext.fetchChats) {
      chatContext.fetchChats()
    }
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="chat-app">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      <div className="chat-main">
        <button
          className="toggle-sidebar"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title="Toggle sidebar"
        >
          ☰
        </button>

        {chatContext.currentChat ? (
          <ChatWindow chat={chatContext.currentChat} />
        ) : (
          <div className="no-chat">
            <div className="no-chat-content">
              <h1>ChatGPT</h1>
              <p>Select a chat to continue or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
