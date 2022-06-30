const mongoose = require('mongoose') ;

var Schema = mongoose.Schema ;

var complaintschema = new Schema({
    author : String,
    email : String,
    complaintstatement : String,
    userview : String,
    viewed : Boolean,
    answered : Boolean,
    remembered : Boolean
}) ;

const Complaint = mongoose.model('Complaint', complaintschema) ;

module.exports = Complaint ;