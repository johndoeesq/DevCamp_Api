const mongoose= require('mongoose');

const UserSchema=new mongoose.Schema({
    name:{
        type:Stirng,
        required:[true,'Please enter the name'],
        unique:true
    },
    email:{
        type: String,
        required:[true,'Please add the email'],
        unique:true,
        match: [
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            'Pease enter the valid email'
        ]
    },
    role:{
        type:String,
        enum:['user','publisher'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please add a password'],
        minlength:6,
        select:false,
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('User',UserSchema);