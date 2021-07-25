//Including the custom errorHandler
const ErrorResponse = require('../utils/errorResponse');

//Including the asyncHandler
const asyncHandler = require('../middleware/async');

//Including the respective model
const User = require('../models/User');


//@desc     Register User
//@router   POST api/v1/user/register
//@access   public
exports.register=asyncHandler(async(req,res,next)=>{
    const {name,email,password,role}=req.body;

    //Create User
    const user=await User.create({
        name,
        email,
        password,
        role
    });

    //Create token
    const token=user.getSignedJwtToken();
    
    res.status(200).json({
        status:true,
        token
    })
})

//@desc     Login User
//@router   POST api/v1/user/register
//@access   public
exports.login=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;
   
    //Validating email and password
    if(!email || !password){
        return next(
            new ErrorResponse('Please provide the email and the password'),400
        )
    }

    //Check for the user
    const user= await User.findOne({email}).select('+password');

    //Validating for the user
    if(!user){
        return next(
            new ErrorResponse('Invalid Cerenditials'),401
        )
    }

    //Check if password matches
    const isMatch=await user.matchPassword(password);

    if(!isMatch){
        return next(
            new ErrorResponse('Invalid Cerenditials'),401
        )
    }

    //Create token
    const token=user.getSignedJwtToken();
    
    res.status(200).json({
        status:true,
        token
    })
})


//Getting token from Model,Creating Cookie and sending response
const sendTokenResponse=(user,statusCode,res)=>{
    //Create token
    const token=user.getSignedJwtToken();
}