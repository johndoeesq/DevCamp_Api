const advanceResults =(model,populate)=>async(req,res,next)=>{
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
 let query = model.find(JSON.parse(queryStr));

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
 const total = await model.countDocuments();

 //Setting up the query
 query = query.skip(startIndex).limit(limit);

 //If something is passed on the populate
 if(populate){
     query=query.populate(populate);
 }


 //Executing the query
 const results = await query;

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

 //Setting up the response
 res.advanceResults={
     status:true,
     count:results.length,
     pagination,
     data:results
 }
 next();
}


module.exports=advanceResults;