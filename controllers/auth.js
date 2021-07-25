//Including the custom errorHandler
const ErrorResponse = require('../utils/errorResponse');

//Including the asyncHandler
const asyncHandler = require('../middleware/async');

//Including the respective model
const User = require('../models/User');


//@desc     Register User
//@router   GET api/v1/user/register
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
    
    res.status(200).json({
        status:true
    })
})