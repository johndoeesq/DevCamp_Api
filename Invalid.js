//To initialize a middleware 
//const logger= require('./middleware/logger');

//sending the get request
// app.get('/',(req,res)=>{
//    // res.send("Hello from the other side");
//     //res.json({name:"Express"})
    

//     //sending back certain status
//     //res.sendStatus(400);

//     //Sending message with the status
//     res.status(400).json({
//         status:false,
//         message:'Sorry Bad Request'
//     })
// })



//dev logging middleware
// if(process.env.NODE_ENV==='development'){
//     //app.use(morgan('tiny'))
//     app.use(morgan('dev'))
// }

//running the middleware
//app.use(logger);


//In the Bootcamp.js Controller
//exports.createBootcamp = async (req, res, next) => {
    // console.log(req.body);
    // res.status(200).json({
    //     status:true,
    //     message:"Bootcamp successfully addded!"
    // })

    //Courses getAllcourse in else
    // query=Course.find().populate('bootcamp');
        //If only selected field from the bootcamp is to be displayed then
        // query = Course.find().populate({
        //     path: 'bootcamp',
        //     select: 'name description'
        // })
    // }

    // const courses = await query;


    // //Setting the response
    // res.status(200).json({
    //     status: true,
    //     message: "All the courses fetched",
    //     count: courses.length,
    //     data: courses
    // })