const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail } = require('../emails/account')

const upload = multer({
    limits: {
        fileSize: 5000000,
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

const router = new express.Router()

// Router for creating/signup a new user
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e.message.split(": ")[2])
    }
})

// Router for logging in a user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)  // findByCredentials is user defined method on User
        console.log("fine till here")
        console.log(user)
        const token = await user.generateAuthToken()
        console.log("fine till here")
        res.send({user, token})
    } catch(e) {
        res.status(400).send()
    }
})

// Route for logging out of one session
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

// Router to get all NGO's
router.get('/users', async(req, res) => {
    try {
        const users = await User.find({isNGO: true})
        if(!users) {
            throw new Error("No NGOs")
        }

        res.send(users)
    } catch(e) {
        res.status(400).send()
    }
})

// Router for fetching user profile
router.get('/users/me',auth, async (req, res) => {
    res.send(req.user)
})

// Router for updating an existing user
router.patch('/users/me', auth, async (req, res) => {
    // Something that user will be allowed to update
    const updates = Object.keys(req.body)  // Will give key of value in req.body
    const allowedUpdates = ['name', 'phoneNumber', 'city', 'description']

    const isValidOperation = updates.every((update) => {  // every is called for every ite in the updates array
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    try {

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()
        
        res.send(req.user)
    } catch(e) {
        res.status(404).send()
    }
})

//Router to upload profile pic
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(404).send({error: error.message})
})

//Router to delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch {
        res.status(404).send({error: error.message})
    }
})

// Route To serve the image data
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }

        // Setting res header
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch(e) {
        res.status(404).send()
    }
})

module.exports = router