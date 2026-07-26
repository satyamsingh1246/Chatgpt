import { useContext, useEffect, useState, useRef } from 'react'
import { ChatContext } from '../context/ChatContext'
import { getSocket, emitMessage, onAIResponse, onAIStreamChunk, onAIStreamEnd } from '../services/socket'
import { Send, Loader } from 'lucide-react'
import MessageBubble from './MessageBubble'
import './ChatWindow.css'

export default function ChatWindow({ chat }) {
  const chatContext = useContext(ChatContext)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [chatContext.messages])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    // Handle AI response
    const handleAIResponse = (data) => {
      if (data.chat === chat._id) {
        chatContext.addMessage({
          id: data.id || Date.now().toString(),
          chat: chat._id,
          content: data.content,
          role: 'assistant',
          createdAt: new Date().toISOString(),
        })
        setLoading(false)
      }
    }

    // Handle AI stream
    const handleAIStreamChunk = (data) => {
      if (data.chat === chat._id) {
        if (chatContext.messages.length > 0 && 
            chatContext.messages[chatContext.messages.length - 1].role === 'assistant') {
          chatContext.updateLastMessage({
            ...chatContext.messages[chatContext.messages.length - 1],
            content: chatContext.messages[chatContext.messages.length - 1].content + data.chunk,
          })
        } else {
          chatContext.addMessage({
            id: Date.now().toString(),
            chat: chat._id,
            content: data.chunk,
            role: 'assistant',
            createdAt: new Date().toISOString(),
          })
        }
      }
    }

    const handleAIStreamEnd = (data) => {
      if (data.chat === chat._id) {
        setLoading(false)
      }
    }

    const unsubscribeResponse = onAIResponse(handleAIResponse)
    const unsubscribeChunk = onAIStreamChunk(handleAIStreamChunk)
    const unsubscribeEnd = onAIStreamEnd(handleAIStreamEnd)

    return () => {
      unsubscribeResponse?.()
      unsubscribeChunk?.()
      unsubscribeEnd?.()
    }
  }, [chat._id, chatContext])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || loading) return

    const userMessage = {
      id: Date.now().toString(),
      chat: chat._id,
      content: inputValue,
      role: 'user',
      createdAt: new Date().toISOString(),
    }

    chatContext.addMessage(userMessage)
    setInputValue('')
    setLoading(true)

    try {
      emitMessage(chat._id, inputValue)
    } catch (error) {
      console.error('Error sending message:', error)
      setLoading(false)
    }
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>{chat.title}</h2>
        <p className="chat-date">
          Created {new Date(chat.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="messages-container">
        {chatContext.messages && chatContext.messages.length > 0 ? (
          chatContext.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        ) : (
          <div className="empty-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        {loading && (
          <div className="message-bubble assistant loading">
            <Loader size={20} className="spinner" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input-form">
        <div className="message-input-wrapper">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Send a message..."
            disabled={loading}
            className="message-input"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="send-button"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}
