const express= require('express');

//Accessing all the user functions
const {register}=require('../controllers/auth');

//Including the router method
const router=express.Router();

//Route for the user authentication
router.post('/register',register)

module.exports=router;

