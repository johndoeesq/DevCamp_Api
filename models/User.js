const mongoose = require('mongoose');

//Including the core module for generating and hashing the token
const crypto=require('crypto');

//Including the bcrypt for encryption
const bcrypt = require('bcryptjs');

//Including the JsonWebToken
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter the name'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please add the email'],
        unique: true,
        match: [
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            'Pease enter the valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})


//Encrypting the password
UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

//Method to match user entered method to match with the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//Generate and hash the password token
UserSchema.methods.getResetPasswordToken=function(){

    //Generate the token
    const resetToken=crypto.randomBytes(20).toString('hex')

    //Hashing the token and setting it to resetPasswordToken field
    this.resetPasswordToken=crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

    //Setting up the resetPasswordExpire to be 10 minutes
    this.resetPasswordExpire=Date.now()+10*60*1000

    //Returning the unhashed resetToken
    return resetToken;

}

module.exports = mongoose.model('User', UserSchema);