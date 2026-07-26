import { formatDistanceToNow } from 'date-fns'
import './MessageBubble.css'

export default function MessageBubble({ message }) {
  return (
    <div className={`message-bubble ${message.role}`}>
      <div className="message-content">
        <p>{message.content}</p>
      </div>
      <span className="message-time">
        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
      </span>
    </div>
  )
}
