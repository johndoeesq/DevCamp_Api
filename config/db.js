const mongoose = require('mongoose');

//setting up the connection with the database
const connectDatabase=async ()=>{
    const conn= await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology:true
    })
    console.log(`Connected MongoDb:${conn.connection.host}`);
}

module.exports= connectDatabase;