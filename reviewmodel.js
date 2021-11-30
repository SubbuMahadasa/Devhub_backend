const mongoose = require('mongoose');

const reviewData = mongoose.Schema({
    reviewProvider : {
        type : String , 
        // required : true
    },
    reviewWorker : {
        type : String , 
        // required : true
    } , 
    rating : {
        type : String , 
        // required : true
    }
})

module.exports = mongoose.model('reviewData' , reviewData);