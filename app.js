require('dotenv').config() ;

const express = require("express") ;
const ejs = require('ejs') ;
const engine = require('ejs-mate') ;
const mongoose = require('mongoose') ;
const path = require('path') ;
const passport = require('passport') ;
const session = require('express-session') ;
const bodyParser = require('body-parser')
const complainroute = require('./routes/complainroutes') ;
const adminroute = require('./routes/adminroute') ;
const emailrouter = require('./routes/email.js') ;

// mongoose.connect('mongodb://127.0.0.1/complaints', { ureNewUrlParser : true, useUnifiedTopology : true }) ;
mongoose.connect('mongodb://127.0.0.1/bhrwebsite', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express() ;
app.use(express.static(path.join(__dirname, 'public'))) ;
app.engine('ejs', engine) ;
app.set('view engine', 'ejs') ;
app.use('/complain', complainroute) ;
app.use('/admin', adminroute) ;
app.use('/email',emailrouter) ;
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req,res) => {
    res.render('home.ejs', { navopt : 'home'}) ;
})

app.get('/wardencouncil', (req,res) => {
    res.render('wardencouncil.ejs', { navopt : 'lorem1'}) ;
})

app.get('/lorem2', (req, res) => {
    res.render('lorem2.ejs', { navopt : 'lorem2'}) ;
})

app.listen(3000, () => {
    console.log("listening") ;
})