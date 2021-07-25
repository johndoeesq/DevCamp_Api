const express=require('express');

//Calling all the functions from the Course Controller
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
}=require('../controllers/courses');


//Including the course model
const Course=require('../models/Course');

//Including the advanceResults middleware
const advanceResults=require('../middleware/advanceResult');

//Including the router module
const router= express.Router({mergeParams:true});

//Creating the route
router
.route('/')
.get(advanceResults(Course,{
        path: 'bootcamp',
        select: 'name description'
    }),getCourses)
.post(createCourse)

//Creating the route with the id
router
.route('/:id')
.get(getCourse)
.put(updateCourse)
.delete(deleteCourse)

module.exports=router;