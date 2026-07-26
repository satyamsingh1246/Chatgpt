# ChatGPT Frontend

A modern React frontend for a ChatGPT-like AI application with real-time messaging using WebSockets.

## Features

- 🔐 User authentication (register/login)
- 💬 Real-time chat with AI assistant
- 📱 Responsive design (mobile-friendly)
- 🎨 Dark mode UI
- 🚀 Socket.io integration for real-time updates
- 📝 Chat history management
- ⚡ Fast and lightweight with Vite

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **Lucide React** - Icons
- **date-fns** - Date formatting

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file (optional):
```env
VITE_API_URL=http://localhost:3000
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ChatWindow.jsx       # Main chat interface
│   ├── MessageBubble.jsx    # Individual message component
│   └── Sidebar.jsx          # Chat sidebar
├── context/
│   ├── AuthContext.jsx      # Authentication context
│   └── ChatContext.jsx      # Chat state management
├── pages/
│   ├── ChatApp.jsx          # Main app page
│   ├── Login.jsx            # Login page
│   └── Register.jsx         # Register page
├── services/
│   ├── api.js               # API client
│   └── socket.js            # Socket.io client
├── App.jsx                  # Main app component
├── main.jsx                 # Entry point
└── index.css                # Global styles
```

## Configuration

The frontend connects to the backend at `http://localhost:3000`. Make sure the backend is running before starting the frontend.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT
