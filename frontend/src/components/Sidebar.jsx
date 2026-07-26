import { useContext, useState } from 'react'
import { ChatContext } from '../context/ChatContext'
import { Plus, LogOut, Trash2, X } from 'lucide-react'
import './Sidebar.css'

export default function Sidebar({ open, onClose, user, onLogout }) {
  const chatContext = useContext(ChatContext)
  const [newChatTitle, setNewChatTitle] = useState('')
  const [creatingChat, setCreatingChat] = useState(false)

  const handleCreateChat = async (e) => {
    e.preventDefault()
    if (!newChatTitle.trim()) return

    try {
      setCreatingChat(true)
      await chatContext.createNewChat(newChatTitle)
      setNewChatTitle('')
    } catch (error) {
      console.error('Error creating chat:', error)
    } finally {
      setCreatingChat(false)
    }
  }

  const handleSelectChat = (chat) => {
    chatContext.selectChat(chat)
    onClose()
  }

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation()
    // TODO: Implement delete chat API call
    console.log('Delete chat:', chatId)
  }

  return (
    <>
      <div className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>ChatGPT</h2>
          <button className="close-sidebar" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleCreateChat} className="new-chat-form">
          <div className="new-chat-input">
            <Plus size={16} />
            <input
              type="text"
              placeholder="New chat"
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              disabled={creatingChat}
            />
          </div>
          <button
            type="submit"
            disabled={!newChatTitle.trim() || creatingChat}
            className="new-chat-button"
          >
            {creatingChat ? 'Creating...' : 'Create'}
          </button>
        </form>

        <div className="chats-list">
          {chatContext.chats && chatContext.chats.length > 0 ? (
            chatContext.chats.map((chat) => (
              <div
                key={chat._id}
                className={`chat-item ${
                  chatContext.currentChat?._id === chat._id ? 'active' : ''
                }`}
                onClick={() => handleSelectChat(chat)}
              >
                <div className="chat-item-content">
                  <p className="chat-title">{chat.title}</p>
                  <p className="chat-date">
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  className="delete-chat"
                  onClick={(e) => handleDeleteChat(e, chat._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="no-chats">No chats yet. Create one to get started!</div>
          )}
        </div>

        {user && user.fullName && (
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">
                {user.fullName.firstName[0]}{user.fullName.lastName[0]}
              </div>
              <div className="user-details">
                <p className="user-name">
                  {user.fullName.firstName} {user.fullName.lastName}
                </p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
            <button className="logout-button" onClick={onLogout}>
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>

      {open && <div className="sidebar-overlay" onClick={onClose} />}
    </>
  )
}
