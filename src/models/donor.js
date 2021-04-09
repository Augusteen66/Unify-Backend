const mongoose = require('mongoose')
const validator = require('validator')

const donorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
        //unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(!validator.isMobilePhone(value, 'en-IN')) {
                throw new Error('Mobile number is invalid!')
            }
        }
    },
    address: {
        type: String,
        //required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    itemName: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type:String,
        trim: true
    },
    isNonVeg: {
        type: Boolean,
        default: false
    },
    quantity: {
        type: String,
        trim: true,
        required: true
    }
})

const Donor = mongoose.model('Donor', donorSchema)

module.exports = Donor