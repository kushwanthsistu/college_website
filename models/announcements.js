const mongoose = require('mongoose') ;

const schema = mongoose.Schema ;

var announcementschema = new schema ({
    title : String,
    line : String
}) ;

var Announcement = mongoose.model('Announcement', announcementschema) ;

module.exports = Announcement ;
