const mongoose = require('mongoose') ;
const Schema = mongoose.Schema ;
const passport = require('passport') ;
const passportlocalmongoose = require('passport-local-mongoose') ;

const adminSchema = new Schema({
    email : String
}) ;

adminSchema.plugin(passportlocalmongoose) ;

module.exports = mongoose.model('Admin', adminSchema) ;
