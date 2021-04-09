const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace("Bearer ", '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET) // Decoded token for verification
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})  // tokens.token is used to check whether a token is there in tokens array

        //req.userData = decoded
        
        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch {
        res.status(401).send({ error: "Please authenticate"})
    }
}

module.exports = auth