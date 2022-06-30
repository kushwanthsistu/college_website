const express = require('express') ;
const mongoose = require('mongoose') ;
const Announcement = require('../models/announcements.js') ;
const Complaint = require('../models/complaintmodels.js') ;
const session = require('express-session') ;
const passport = require('passport') ;
const localstrategy = require('passport-local') ;
const Admin = require('../models/admin.js') ;

const router = express.Router() ;

router.use(session({
    name: 'adminsession',
    keys: ['key1', 'key2'],
    saveUninitialized : false ,
    secret : "keyboardcat" ,
    resave : false, 
  }))
router.use(express.urlencoded({ extended: true })) ;
router.use(passport.initialize()) ;
router.use(passport.session()) ;
passport.use(new localstrategy(Admin.authenticate())) ;

passport.serializeUser(Admin.serializeUser()) ;
passport.deserializeUser(Admin.deserializeUser()) ;

router.get('/', (req, res) => {
    res.render('adminregister.ejs') ;
})

router.get('/home', async (req, res) => {
    await Announcement.find({}).then((data) => {
        Complaint.find({ viewed : false}).then((complaintdata) => {
            var number = complaintdata.length ;
            res.render('adminhomepage.ejs', { data, number }) ;
        })
    }) ;
    // res.send(noticeboard[0]) ;
    // res.render('adminhomepage.ejs') ;
})

router.post('/register', async (req, res) => {
    const {email, password} = req.body ;
    const username = email ;
    const newadmin = new Admin({ email , username}) ;
    await Admin.register(newadmin, password) ;
    res.redirect('/') ;
})

router.get('/complaints/:category', async (req, res) => {
    if(req.params.category == "remembered") {
        await Complaint.find({ remembered : true }).then((data) => {
            res.render('admincomplaints.ejs', { data }) ;
        })
    }
    else if(req.params.category == "toview") {
        await Complaint.find({ viewed : false }).then((data) => {
            res.render('admincomplaints.ejs', { data }) ;
        })
    }
    else if(req.params.category == "toanswer") {
        await Complaint.find({ answered : false }).then((data) => {
            console.log(data) ;
            res.render('admincomplaints.ejs', { data }) ;
    })
    }
    else {
        await Complaint.find().then((data) => {
            res.render('admincomplaints.ejs', { data }) ;
        })
    }
})

router.get('/complaints/view/:id', async (req, res) => {
    await Complaint.findByIdAndUpdate(req.params.id, { viewed : true }).then((data) => {
        res.render('complaintviewer.ejs', { data }) ;
    })
})

router.get('/register', (req, res) => {
    res.render('adminregister.ejs') ;
})

router.get('/complaint/:id/toremember', async (req, res) => {
    await Complaint.findByIdAndUpdate(req.params.id, { remembered : true }) ;
    console.log("remembered") ;
    res.redirect('back') ;
})

router.get('/complaint/:id/toforget', async(req, res) => {
    await Complaint.findByIdAndUpdate(req.params.id, { remembered : false}) ;
    res.redirect('back') ;
})

router.post('/complaint/:id/solution', async (req, res) => {
    const data = req.body.adminsolution ;
    if(data) {
        await Complaint.findByIdAndUpdate(req.params.id, { answered : true }) ;
        // res.send("working") ;
    }
    else {
        await Complaint.findByIdAndUpdate(req.params.id, { answered : false }).then((data) => {
        }) ;
        // res.send("not working") ;
    }
    // res.send(req.body) ;
    res.redirect('http://localhost:3000/admin/complaints/all');
})

router.get('/complaint/:id/delete', async (req, res) => {
    await Complaint.findByIdAndDelete(req.params.id) ;
    res.redirect('http://localhost:3000/admin/complaints/all') ;
})

router.get('/announcement/delete/:id', async (req, res) => {
    await Announcement.findByIdAndDelete(req.params.id).then((data) => {
        res.redirect('/admin/home') ; 
    })
})

router.get('/new', (req, res) => {
    res.render('announcementviewer.ejs') ;
})

router.post('/new', async (req, res) => {
    const announcementobj = new Announcement ({
        title : req.body.announcementtitle ,
        link : req.body.announcementlink
    }) ;
    await announcementobj.save() ;
    res.redirect('/admin/home') ;                                          
})

module.exports = router ;