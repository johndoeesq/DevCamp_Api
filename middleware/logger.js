//creating a middleware
const logger=(req,res,next)=>{
   
    // req.hello='Hello From Middleware'
     console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
     next();
 }

 module.exports=logger;