const mongoose = require('mongoose');
const slugify = require('slugify');

const BootCampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please enter the name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
   slug: String,
    description: {
        type: String,
        required: [true, 'Please add the description'],
        maxlength: [500, 'Description  cannot be more than 500 characters']
    },
    website: {
        type: String,
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number cannot be more than 20']
    },
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            'Pease enter the valid email'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please enter the address']
    },
    careers: {
        type: [String],
        required: [true, 'Please choose a careers'],
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]

    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating cannot be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        dafault: false
    },
    acceptGi1: {
        type: Boolean,
        default: false
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:'true'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


//Creating Bootcamp Slug from the name
BootCampSchema.pre('save',function(next){
    this.slug=slugify(this.name,{  
        lower:true
    })
    next();
})

//Cascade deleting courses when a bootcamp is deleted
BootCampSchema.pre('remove', async function (next) {
    console.log("The courses are being deleted")
    await this.model('Course').deleteMany({ bootcamp: this._id });
    next();
})

//Reverse populate with virtuals
BootCampSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOnce: false
})


//Exporting the bootcamp model
module.exports = mongoose.model('Bootcamp', BootCampSchema);