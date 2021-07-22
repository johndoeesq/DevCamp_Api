const fs= require('fs');
const mongoose= require('mongoose');
const dotenv= require('dotenv');

//loading env variables
dotenv.config({path:'./config/config.env'});

//loading the model
const Bootcamp= require('./models/Bootcamp');
const Course=require('./models/Course');

//Connecting the database
mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology:true
    })

//Read the JSON files
const bootcamp=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));
const course=JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'));

//Importing the data to the database
const importData= async()=>{
    try{
      await Bootcamp.create(bootcamp);
      await Course.create(course);
      console.log('Data Imported....');
      process.exit();
    }
    catch(err){
     console.log(err.message);
    }
}

//Deleting the data
const deleteData= async()=>{
    try{
      await Bootcamp.deleteMany();
      await Course.deleteMany();
      console.log('Data Destroyed....');
      process.exit();
    }
    catch(err){
     console.log(err.message);
    }
}

//Adding an argument to symblise whether to import or delete
if(process.argv[2]==="-i"){
     importData();
}else if(process.argv[2]==="-d"){
    deleteData();
}
