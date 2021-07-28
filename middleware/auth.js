const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');

//To look up the user as per the id
const User = require('../models/User');
const { token } = require('morgan');

//Protecting the routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        //taking out the token
        token = req.headers.authorization.split(' ')[1];
    }

    //verifying the token
    if (!token) {
        return next(
            new ErrorResponse('Not authorize to access this route', 401));
    }

    try {
        //Verifying the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Checking for the user_id
        req.user = await User.findById(decoded.id)

        next();
    } catch (err) {
        return next(
            new ErrorResponse('Not authorize to access this route since the id was not found'
            , 401));

    }
});

//Granting the access to the specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(`Role: ${req.user.role} is not authorize to accessthis route`
                , 401));
        }
        next();
    }
}