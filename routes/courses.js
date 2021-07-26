const express = require('express');

//Calling all the functions from the Course Controller
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses');

//Bringing in the protect function from the auth middleware
const{protect,authorize}=require('../middleware/auth');

//Including the course model
const Course = require('../models/Course');

//Including the advanceResults middleware
const advanceResults = require('../middleware/advanceResult');

//Including the router module
const router = express.Router({ mergeParams: true });

//Creating the route
router
    .route('/')
    .get(advanceResults(Course, {
        path: 'bootcamp',
        select: 'name description'
    }), getCourses)
    .post(protect,authorize('publisher','admin'),createCourse)

//Creating the route with the id
router
    .route('/:id')
    .get(getCourse)
    .put(protect,authorize('publisher','admin'),updateCourse)
    .delete(protect,authorize('publisher','admin'),deleteCourse)

module.exports = router;