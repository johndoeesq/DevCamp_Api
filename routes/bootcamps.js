const express = require('express');

//Accessing all the bootcamps
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp 
} = require('../controllers/bootcamps');

const router = express.Router();

//Re-routing to the courses router
const courseRouter=require('./courses');

//Routing to the courses
router.use('/:bootcampId/courses',courseRouter);

//getting the http methods
router
.route('/')
.get(getBootcamps)
.post(createBootcamp)

router
.route('/:id')
.get(getBootcamp)
.put(updateBootcamp)
.delete(deleteBootcamp)



module.exports = router;