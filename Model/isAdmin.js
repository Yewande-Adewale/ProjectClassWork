const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, "username Required"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email Required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password Required"]
    },
    isVerify: {
        type: Boolean,
        default: false
    },

    isAdmin: {
        type: Boolean,
        default: true
    },
    
    isSuperAdmin: {
        type: Boolean,
        default: true
    },
    token: {
        type: String
    }
}, {
    timestamps: true
})

const adminModel = mongoose.model('admin', userSchema)

module.exports = adminModel  