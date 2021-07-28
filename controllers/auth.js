//Including the custom errorHandler
const ErrorResponse = require('../utils/errorResponse');

//Including the asyncHandler
const asyncHandler = require('../middleware/async');

//Including the respective model
const User = require('../models/User');


//@desc     Register User
//@router   POST api/v1/auth/register
//@access   public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    //Create User
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    //Create token
    sendTokenResponse(user, 200, res);
})

//@desc     Login User
//@router   POST api/v1/auth/register
//@access   public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    //Validating email and password
    if (!email || !password) {
        return next(
            new ErrorResponse('Please provide the email and the password',400))
    }

    //Check for the user
    const user = await User.findOne({ email }).select('+password');

    //Validating for the user
    if (!user) {
        return next(
            new ErrorResponse('Invalid Cerenditials', 401));
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(
            new ErrorResponse('Invalid Cerenditials', 401));
    }

    //Create token,cookie and send response
    sendTokenResponse(user, 200, res);

})


//@desc     Getting the User
//@router   GET api/v1/auth/getme
//@access   private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        status: true,
        data: user
    })
})


//@desc     Forgot the password
//@router   POST api/v1/user/forgotpassword
//@access   Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(
        new ErrorResponse(`There is no user with that email`,404));
    }

    res.status(200).json({
        status: true,
        data: user
    })
})



//Getting token from Model,Creating Cookie and sending response
const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 1000),
        httpOnly: true,
    };

    //Setting up for the production environment
    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    //Setting up the response
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            status: true,
            token
        })
}
