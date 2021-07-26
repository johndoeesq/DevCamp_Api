const express = require('express');

//Accessing all the user functions
const {
    register,
    login,
getMe } = require('../controllers/auth');

//Bringing in the protect method
const {protect}=require('../middleware/auth');

//Including the router method
const router = express.Router();

//Route for the user authentication
router.post('/register', register)
router.post('/login', login)
router.get('/getme',protect,getMe)


module.exports = router;

