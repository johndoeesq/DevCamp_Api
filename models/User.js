const mongoose= require('mongoose');

//Including the bcrypt for encryption
const bcrypt=require('bcryptjs');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
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

//Encrypting the password
UserSchema.pre('save',async function(next){
    const salt= await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})
module.exports=mongoose.model('User',UserSchema);