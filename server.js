const express= require('express');
const dotenv= require('dotenv');
const morgan= require('morgan');
const path=require('path');
const errorHandler=require('./middleware/error');
const fileupload=require('express-fileupload');
const connectDatabase= require('./config/db');


//loading the config file
dotenv.config({path:'./config/config.env'});

//Route files
const bootcamps= require('./routes/bootcamps');
const courses=require('./routes/courses');


//Connecting to the database
connectDatabase();


//using the applicaion
const app= express();

//Body Parser
app.use(express.json());

//using the logger middleware module
app.use(morgan('tiny'));

//Middleware for the fileupload
app.use(fileupload());

//Setting the public as a static folder
app.use(express.static(path.join(__dirname,'public')));

//Mounting the bootcamp routers
app.use('/api/v1/bootcamps',bootcamps);

//Mounting the courses routers
app.use('/api/v1/courses',courses);


//Using the errorHandler middleware
app.use(errorHandler);


const PORT= process.env.PORT ||5000;


const server=app.listen(
    PORT,()=>{
    console.log(`Server is in ${process.env.NODE_ENV} mode on ${PORT}`)
})


//Handling the unhandled rejections
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error:${err.message}`);
    server.close();
})