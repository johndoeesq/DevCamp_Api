const express = require('express');


//Accessing all the bootcamps
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    uploadPhoto
} = require('../controllers/bootcamps');

//Bringing in the protect function from the auth middleware
const{protect,
    authorize}=require('../middleware/auth');

//Bringing the advanceResults middleware
const advanceResults = require('../middleware/advanceResult');

//Bringing the bootcamp model
const Bootcamp = require('../models/Bootcamp');

//Including the router module
const router = express.Router();

//Re-routing to the courses router
const courseRouter = require('./courses');

//Routing to the courses
router.use('/:bootcampId/courses', courseRouter);

//Route for the photo upload
router.route('/:id/photo')
    .put(protect,authorize('publisher','admin'),uploadPhoto)

//getting the http methods
router
    .route('/')
    .get(advanceResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect,authorize('publisher','admin'),createBootcamp)

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect,authorize('publisher','admin'),updateBootcamp)
    .delete(protect,authorize('publisher','admin'),deleteBootcamp)



module.exports = router;