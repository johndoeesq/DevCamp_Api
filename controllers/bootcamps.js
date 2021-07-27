//Including the custom errorHandler
const ErrorResponse = require('../utils/errorResponse');


//Including the asyncHandler
const asyncHandler = require('../middleware/async');


//Including the respective model
const Bootcamp = require('../models/Bootcamp');

//Including the path module
const path = require('path');

//@desc     Get all the bootcamps
//@router   GET api/v1/bootcamps
//@access   public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    //Setting the response
    res.status(200).json(res.advanceResults);

});

//@desc     Get specific bootcamp
//@router   GET api/v1/bootcamps/:id
//@access   public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    //Checking if the bootcamp exists or not
    if (!bootcamp) {
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
    //Adding user to the request body
    req.body.user=req.user.id;

    //Checking for the published Bootcamp
    const publishedBootcamp=await Bootcamp.findOne({user:req.user.id});

    //Checking if the user is publisher and has not added any bootcamp
    if(publishedBootcamp && req.user.role!=='admin'){
        return next(
            new ErrorResponse(
                `The user with ${req.user.id} has already added a bootcamp`),
                400
        )
    }
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

    //Making sure the user is the bootcamp owner
    if(bootcamp.user.toString()!==req.user.id && req.user.role !=='admin'){
        return next(
            new ErrorResponse(
                `User with the ${req.user.id} cannot update the bootcamp`), 404);
    }

    //Updating the requested bootcamp
    bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
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

    //Making sure the user is the bootcamp owner
    if(bootcamp.user.toString()!==req.user.id && req.user.role !=='admin'){
        return next(
            new ErrorResponse(
                `User with the ${req.user.id} cannot delete the bootcamp`), 404);
    }

    //Removing the bootcamp from the database
    await bootcamp.remove();
    res.status(200).json({
        status: true,
        message: `Deleted Bootcamp ${req.params.id}`
    })
});

//@desc      upload photo for bootcamp
//@router   PUT api/v1/bootcamps/:id/photo
//@access   private
exports.uploadPhoto = asyncHandler(async (req, res, next) => {

    //Finding the specific Bootcamp
    let bootcamp = await Bootcamp.findById(req.params.id)

    //Checking if the bootcamp exists or not
    if (!bootcamp) {
        return next(
            new ErrorResponse(`No Bootcamp with id:${req.params.id} found`), 404)
    }
    
    //Making sure the user is the bootcamp owner
    if(bootcamp.user.toString()!==req.user.id && req.user.role !=='admin'){
        return next(
            new ErrorResponse(
                `User with the ${req.user.id} cannot update the bootcamp`), 404);
    }

    //Checking if the file exists or not
    if (!req.files) {
        return next(
            new ErrorResponse(`Please select the file`), 400
        )
    }
    
    const file = req.files.file;

    //Checking if the file is the photo
    if (!file.mimetype.startsWith('image')) {
        return next(
            new ErrorResponse(`Please select the image file`), 400
        )
    }

    //Checking for the maximum file sizw
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(`Please upload the image less than${preocess.env.MAX_FILE_UPLOAD}`)
            , 400
        )
    }

    // //Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    //Upload the file
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(
                new ErrorResponse(`Problem with file upload`), 500)
        }
    });

    //Updating the database

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
        status: true,
        message: "Succesfully updated the file",
        data: file.name
    })
});