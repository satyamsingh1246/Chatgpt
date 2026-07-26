const express = require('express')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')
const chatRoutes = require('./routes/chat.routes')
const app = express()


/* Middlewares */
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  
  next()
})

/* Routes */
app.use('/api/auth',authRoutes)
app.use('/api/chat',chatRoutes)

module.exports = app
