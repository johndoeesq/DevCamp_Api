const express=require('express');

//Calling all the functions from the Course Controller
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
}=require('../controllers/courses');

const router= express.Router({mergeParams:true});

//Creating the route
router
.route('/')
.get(getCourses)
.post(createCourse)

//Creating the route with the id
router
.route('/:id')
.get(getCourse)
.put(updateCourse)
.delete(deleteCourse)

module.exports=router;