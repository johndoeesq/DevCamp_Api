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

//Bringing the advanceResults middleware
const advanceResults=require('../middleware/advanceResult');

//Bringing the bootcamp model
const Bootcamp=require('../models/Bootcamp');

//Including the router module
const router = express.Router();

//Re-routing to the courses router
const courseRouter=require('./courses');

//Routing to the courses
router.use('/:bootcampId/courses',courseRouter);

//Route for the photo upload
router.route('/:id/photo')
.put(uploadPhoto)

//getting the http methods
router
.route('/')
.get(advanceResults(Bootcamp,'courses'),getBootcamps)
.post(createBootcamp)

router
.route('/:id')
.get(getBootcamp)
.put(updateBootcamp)
.delete(deleteBootcamp)



module.exports = router;