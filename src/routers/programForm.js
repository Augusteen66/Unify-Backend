const express = require('express')
const auth = require('../middleware/auth')
const programForm = require('../models/programForm')
const User = require('../models/user')
const {sendProgramFormMail } = require('../emails/account')

const router = new express.Router()

// Router for creating a new program
router.post('/paryavarana/forms',auth, async (req, res) => {
    const form = new programForm({
        ...req.body,   // Copies everything from req.body to object task
        owner: req.user._id
    })

    try {
        await form.save()
        sendProgramFormMail(req.user.email, req.user.name)
        res.send(form)
    } catch(e) {
        res.status(400).send()
    }
})

// Router for getting all the programs that are available for registration
router.get('/paryavarana/forms',auth, async (req, res) => {
    try {
        const forms = await programForm.find({})
        const user = req.user
        const crForms  = await programForm.find({owner: req.user._id})
        //let avForms = forms.filter(x => !crForms.includes(x))         // For difference
        const avForms = (forms, crForms) => {
            return forms.filter(form => !crForms.some(crForm => form._id === crForm._id))
        }
        res.send(forms)
    } catch(e) {
        res.status(500).send(e)
    }
})

// Router for getting all the programs created by a single user
router.get('/paryavarana/forms/me', auth, async (req, res) => {
    try {
        const forms = await programForm.find({owner: req.user._id})
        res.send(forms)
    } catch(e) {
        res.status(500).send()
    }
})

// Router for updating a program
router.patch('/paryavarana/forms/me/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'motto', 'date', 'time', 'place', 'otherInfo']
    const isValidOperation = updates.every((update) =>  {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid updates!"})
    }

    try {
        const form = await programForm.findOne({_id: req.params.id, owner: req.user._id})

        if(!form) {
            return res.status(404).send("Not found")
        }

        updates.forEach((update) => {
            form[update] = req.body[update]
        })
        await form.save()

        res.send(form)
    } catch(e) {
        res.status(404).send()
    }
})

// Router to delete a form
router.delete('/paryavarana/forms/me/:id', auth, async (req, res) => {
    try {
        const form = await programForm.findOne({_id: req.params.id, owner: req.user._id})

        

        if(!form) {
            console.log("Yes")
            return res.status(404).send()
        }

        const regUsers = form.registeredUsers
        console.log(regUsers.length)

        var i
        for(i =0; i < regUsers.length; i++) {
            console.log("Inside loop")
            console.log(regUsers[i].registeredUser)
            const user = await User.findById({_id : regUsers[i].registeredUser})
            //console.log(user)
            const xyz = user.registeredPrograms.filter(registeredProgram => !registeredProgram._id === req.params.id)
            //console.log(xyz)
            user.registeredPrograms = xyz
            //console.log(user)
            await user.save()
            await form.delete()
        }

        res.send(form)
    } catch(e) {
        res.status(500).send(e)
    }
})

//Router to register for a form
router.patch('/paryavarana/forms/myforms/:id',auth, async (req, res) => {
    try {
        const form = await programForm.findById(req.params.id)

        // Find forms created by user
        const user = req.user
        const crForms  = await programForm.find({owner: req.user._id})
        
        const isValidRegistration = crForms.every((form) =>  {
            return crForms.includes(form)
        })

        const alreadyRegistered = user.registeredPrograms.filter((program) => {
            return program._id === req.params.id
        })

        if(!isValidRegistration || alreadyRegistered) {
            return res.status(400).send({error: "Invalid Registration!"})
        }


        form.registeredUsers =  form.registeredUsers.concat({ registeredUser: user._id })
        user.registeredPrograms = user.registeredPrograms.concat({ registeredProgram: form._id})

        await form.save()
        await user.save()

        res.send({user, form})
    } catch(e) {
        res.status(404).send(e)
    }
})

//Router to get all registered programs of a user
router.get('/paryavarana/forms/myforms', auth, async (req, res) => {
    try {
        const user = req.user
        const forms = user.registeredPrograms
        var regForms = []
        var i
        for(i = 0; i < forms.length; i++) {
            const program = await programForm.findById(forms[i].registeredProgram)
            const progObj = program.toObject()
            delete progObj.registeredUsers
            regForms = regForms.concat(progObj)
        }
        res.send(regForms)
    } catch(e) {
        res.status(500).send()
    }
})

//Router to get the users registered in a program
router.get('/paryavarana/forms/form/users/:id', auth, async (req, res) => {
    try {
        const form = await programForm.findOne({_id: req.params.id, owner: req.user._id})
        const users = form.registeredUsers
        var regUsers = []
        var i
        for (i = 0; i < users.length; i++) {
            const user = await User.findById(users[i].registeredUser)
            const userObj = user.toObject()
            delete userObj.password
            delete userObj.registeredPrograms
            regUsers = regUsers.concat(userObj)
        }
        res.send(regUsers)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router