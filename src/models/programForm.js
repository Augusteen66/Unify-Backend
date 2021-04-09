const mongoose = require('mongoose')
const validator = require('validator')

const progFormSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true,
        trim: true
    },
    motto: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(!validator.isDate(value)) {
                throw new Error('Invalid Date')
            }
        }
    },
    time: {
        type: String,
        required: true,
        trim: true
    },
    place: {
        type: String,
        required: true,
        trim: true
    },
    otherInfo: {
        type: String,
        trim: true
    }, 
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    registeredUsers: [{
        registeredUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
})

//Hiding some details
progFormSchema.methods.toJSON = function () {
    const form = this
    const formObj = form.toObject()
    delete formObj.registeredUsers
    return formObj
}

const programForm = mongoose.model('Program Form', progFormSchema)

module.exports = programForm