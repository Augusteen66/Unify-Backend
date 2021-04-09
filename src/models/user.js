const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    isNGO: {
        type: Boolean,
        required: true
    },
    name : {
        type: String,
        required: true,
        trim: true,
    }, 
    email: {
        type:String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        },
        unique : true
    },
    password: {
        type: String,
        minlength: [8, 'Password should contain minimum 8 characters'],
        required: true,
        /*validate(value) {
            if (!validator.isAlphanumeric(value, 'en-IN')) {
                throw new Error('Password should be alphanumeric!')
            }
        }*/
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
    city: {
        type: String,
        required: true,
        trim: true,
    },
    description : {
        type: String,
        trim: true
    }, 
    tokens : [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    },
    registeredPrograms: [{
        registeredProgram: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Program Form'
        }
    }],
    donors: [{
        donor : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donor'
        }
    }]
})

// Virtual entity to store user-task relationship
userSchema.virtual('myForms', {
    ref: 'Program Form',
    localField: '_id',    // local and foreign field are both user ids
    foreignField: 'owner'
})

// Hiding some details
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()  // userObject will be manipulated now

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    delete userObject.donors

    return userObject
}

// Generating Auth token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id : user._id.toString()}, 'thisismylaptop')
    
    user.tokens = user.tokens.concat({ token })
    
    await user.save()

    return token
}

// Function to find user by credentials and login
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error("Unable to login")
    }

    return user

}

// To hash passsword before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User