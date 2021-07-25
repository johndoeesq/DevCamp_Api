const express= require('express');

//Accessing all the user functions
const {
    register,
login}=require('../controllers/auth');

//Including the router method
const router=express.Router();

//Route for the user authentication
router.post('/register',register)
router.post('/login',login)


module.exports=router;

