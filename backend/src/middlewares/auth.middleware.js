const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')


async function authUser(req,res,next) {
    
    let token = req.cookies.token
    
    // Also check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7) // Remove 'Bearer ' prefix
      }
    }

    if(!token){
      return res.status(401).json({message:"Unauthorized"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user =await userModel.findById(decoded.id)
        req.user = user
        next()

    } catch (error) {
        res.status(401).json({message:"Unauthorized"})
    }
}

module.exports = {authUser}