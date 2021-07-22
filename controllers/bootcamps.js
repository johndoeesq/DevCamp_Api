//Including the custom errorHandler
const ErrorResponse = require('../utils/errorResponse');


//Including the asyncHandler
const asyncHandler = require('../middleware/async');


//Including the respective model
const Bootcamp = require('../models/Bootcamp');



//@desc     Get all the bootcamps
//@router   GET api/v1/bootcamps
//@access   public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    //Copying the query
    let reqQuery = { ...req.query };

    //Fields to remove
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //loop through the query and remove the reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    //Creating query string
    let queryStr = JSON.stringify(reqQuery);

    //Changing the query by putting the $ sign infront of the comparison operator
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //Finding the bootcamp data
    let query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    //Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //Sort fields
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy)
    } else {

        //Searching in descending order
        query = query.sort('-createdAt');
        
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 2;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    //To count the total number of documents
    const total = await Bootcamp.countDocuments();

    //Setting up the query
    query = query.skip(startIndex).limit(limit);


    //Executing the query
    const bootcamps = await query;

    //Pagination
    const pagination = {};

    //Display the current page
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    //The previous page 
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    //Setting the response
    res.status(200).json({
        status: true,
        count: bootcamps.length,
        pagination,
        message: "All Bootcamps data!",
        data: bootcamps
        //hello:req.hello
    })

});

//@desc     Get specific bootcamp
//@router   GET api/v1/bootcamps/:id
//@access   public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    //Checking if the bootcamp exists or not
    if(!bootcamp){
        return next(
            new ErrorResponse(`No Course found with the id: ${req.params.id}`),
            404);
    }

    //Setting up the response
    res.status(200).json({
        status: true,
        data: bootcamp
    })

});


//@desc     create bootcamp
//@router   POST api/v1/bootcamps
//@access   private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        status: true,
        data: bootcamp
    })

});


//@desc     updating the bootcamp
//@router   PUT api/v1/bootcamps/:id
//@access   private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    //Finding the requested bootcamp
    let bootcamp = await Bootcamp.findById(req.params.id);

    //Checking if the bootcamp exists or not
    if (!bootcamp) {
        return next(
            new ErrorResponse(`No Bootcamp with id ${req.params.id}`), 404);
    }

    //Updating the requested bootcamp
    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidator: true
    })
    res.status(200).json({
        status: true,
        message: `Updated Bootcamp ${req.params.id}`,
        data: bootcamp
    })

});


//@desc     Delete specific bootcamp
//@router   DELETE api/v1/bootcamps/:id
//@access   private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    //Finding the specific Bootcamp
    let bootcamp = await Bootcamp.findById(req.params.id)

    //Checking if the bootcamp exists or not
    if (!bootcamp) {
        return next(
            new ErrorResponse(`No Bootcamp with id:${req.params.id} found`), 404)
    }

    //Removing the bootcamp from the database
    await bootcamp.remove();
    res.status(200).json({
        status: true,
        message: `Deleted Bootcamp ${req.params.id}`
    })
});