const express = require('express')
const auth = require('../middleware/auth')
const Donor = require('../models/donor')
const User = require('../models/user')
const {sendDonorFormMail } = require('../emails/account')

const router = new express.Router()

// Route to submit a donation form
router.post('/aaharam/donate/:id', auth, async(req, res) => {
    const donor = new Donor( req.body)

    try {
        const ngo = await User.findById(req.params.id)
        if (!ngo) {
            res.status(404).send("No ngo found")
        }
        ngo.donors = ngo.donors.concat({donor : donor._id})
        await ngo.save()
        await donor.save()
        sendDonorFormMail(donor.email, donor.name)
        res.send(donor)
    } catch(e) {
        res.status(400).send(e)
    }
})

// Route to view all donors for NGO's
router.get('/aaharam/me/donors', auth, async (req, res) => {
    try {
        const ngo = req.user
        const ngoDonors = ngo.donors
        var i
        var regdonors = []
        for(i = 0; i < ngoDonors.length; i++) {
            const donor = await Donor.findById(ngoDonors[i].donor)
            regdonors = regdonors.concat(donor)
        }
        res.send(regdonors)
    } catch(e) {
        res.status(500).send(e)
    }
})



module.exports = router