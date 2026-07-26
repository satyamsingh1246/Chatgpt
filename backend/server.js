require('dotenv').config() 
const app = require('./src/app')
const connectDB = require('./src/db/db')
const initSocketServer = require('./src/sockets/socket.server')
const http = require("http")

const httpServer = http.createServer(app)

/* function calls */
connectDB() 
initSocketServer(httpServer)

httpServer.listen(5000, () => {   
    console.log('server is listening at port 5000')
})  