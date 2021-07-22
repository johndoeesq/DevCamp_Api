//Including the Error Handler middleware
const asyncHandler = require('../middleware/async');

//Including the course model
const Course = require('../models/Course');

//Including the Custom errorHandler Response
const errorResponse = require('../utils/errorResponse');

//Including the bootcamp model
const Bootcamp = require('../models/Bootcamp');

//Including the errorResponse
const ErrorResponse = require('../utils/errorResponse');


//@desc     Get all the courses along with the bootcamp_id
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId })
    } else {
        // query=Course.find().populate('bootcamp');
        //If only selected field from the bootcamp is to be displayed then
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        })
    }

    const courses = await query;

    //Checking if there or not 
    if (!courses) {
        return next(
            new ErrorResponse(`No Course found with the id: ${req.params.id}`),
            404);
    }

    //Setting the response
    res.status(200).json({
        status: true,
        message: "All the courses fetched",
        count: courses.length,
        data: courses
    })
})


//Getting only a single course
exports.getCourse = asyncHandler(async (req, res, next) => {

    //Finding the specific course
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })
 
    //Checking if the course exists or not
    if (!course) {
        return next(
            new ErrorResponse(`No Course found with the id: ${req.params.id}`),
            404);
    }

    //Setting the responses
    res.status(200).json({
        status: true,
        message: `Fetched the course with ${req.params.id}`,
        data: course
    })

})


//Adding new course
//Private
exports.createCourse = asyncHandler(async (req, res, next) => {
    //Passing the bootcamp Id to be on the request body
    req.body.bootcamp = req.params.bootcampId;

    //Now finding the specific Bootcamp
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    //Checking if the bootcamp exits or not
    if (!bootcamp) {
        return next(
            new ErrorResponse(`No bootcamp is found with the ${req.params.bootcampId}`), 404);
    }

    //Creating the course
    const course = await Course.create(req.body);

    //Setting the response
    res.status(201).json({
        status: true,
        message: 'New course added succesfully',
        data: course

    })
})


//Updating the Course
//Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

    //Finding the respective course
    let course = await Course.findById(req.params.id);

    //Checking if the course exists or not
    if (!course) {
        return next(
            new ErrorResponse(`No Course found with the id: ${req.params.id}`),
            404);
    }

    //Updating the respective course
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    //Setting up the response
    res.status(200).json({
        status: true,
        message: `Successfully updated the Course ${req.params.id}`,
        data: course
    })
})


//Deleting the course
//Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    //Finding the specific course
    let course = await Course.findById(req.params.id);

    //Checking if the course exists or not
    if (!course) {
        return next(
            new ErrorResponse(`No Course with the id:${req.params.id} found`), 404);
    }

    //Removing the specific course
    await course.remove();

    //Setting up the response
    res.status(200).json({
        status: true,
        message: `Successfully deleted the course with id:${req.params.id}`
    })
})