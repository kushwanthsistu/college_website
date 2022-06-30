require('dotenv').config() ;

const express = require('express') ;
const passport = require('passport') ;
const session = require('express-session') ;
const router = express.Router() ;
const path = require('path') ;
const ejs = require('ejs') ;
const engine = require('ejs-mate') ;
const mongoose = require('mongoose') ; 
const bodyParser = require('body-parser')
const Complaint = require('../models/complaintmodels.js') ;
const nodemailer = require('nodemailer') ;

require('../passportsetup') ;


router.use(express.static(path.join(__dirname, 'public'))) ;
router.use(passport.initialize()) ;
router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true }))
router.use(session({
    name: 'tuto-session',
    keys: ['key1', 'key2'],
    saveUninitialized : false ,
    secret : "keyboardcat" ,
    resave : false, 
  }))
router.use(passport.session()) ;

function isLoggedIn(req, res, next) {
    if(req.user)
    next() ;
    else
    res.render('lorem3.ejs', { authorized : false, name : ""}) ;
}

router.get('/', (req, res) => {
    if(req.user) {
        res.render('lorem3.ejs', {authorized : true, name : req.user.displayName}) ;
    }
    else {
        res.render('lorem3.ejs', { authorized : false, name : ""}) ;
    }
})

router.get('/login', passport.authenticate('google', { scope : ['profile', 'email']})) ;

router.get('/login/status',passport.authenticate('google', {failureRedirect : '/complain/login/failure'}), (req, res) => {
    res.render('redirecting.ejs') ;
})

router.get('/login/failure', (req, res) => {
    req.session.destroy()
    res.clearCookie('connect.sid')
    res.render('failurepage.ejs') ;
})

router.get('/logout', (req, res) => {
    req.session = null ;
    req.logout() ;
    req.redirect('/') ;
})

// function sendmail(complaintobj) {
//     var transporter = nodemailer.createTransport({
//         service : 'email',
//         auth : {
//             user : 'kushwanthsistu@gmail.com',
//             pass : '9441707864'
//         }
//     }) ;
//     var mailoptions = {
//         from : 'kushwanthsistu@gmail.com',
//         to : complaintobj.email,
//         subject : 'Regarding complaint in the website',
//         html : `<p>We got a complaint from you on the website as,<br> <b>${complaintobj.complaintstatement}</b>
//         <br>and you wanted to <br><b>${complaintobj.userview} </b><br>. we will reach out you after 
//         taking a look at it.`
//     } ;
//     transporter.sendMail(mailoptions, (error, info) => {
//         if(error) {
//             console.log(error) ;
//         } else {
//             console.log("email sent successfully" + info.response ) ;
//         }
//     }) ;
// }

router.post('/complaint', isLoggedIn, async(req, res) => {
    const complaintobj = new Complaint({
        // const complaintobj = ({
        author : req.user.displayName,
        email : req.user.email,
        complaintstatement : req.body.complaintstatement,
        userview : req.body.useridea,
        viewed : false,
        answered : false,
        remembered : false
    }) ;
    await complaintobj.save() ;
    // sendmail(complaintobj) ;
    req.session.destroy() ;
    res.redirect('/') ;
})

router.get('/testing', (req, res) => {
    console.log(req.user) ;
    res.redirect('/') ;
})

module.exports = router ;