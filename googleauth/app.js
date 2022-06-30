require('dotenv').config() ;

const express = require('express') ;
const passport = require('passport') ;
const session = require('express-session') ;
let RedisStore = require("connect-redis")(session) ;

require('./passportsetup') ;

// const { createClient } = require("redis") ;
// let redisClient = createClient() ;
// const { createClient } = require('redis') ;
// let redisClient = createClient({ legacyMode : true }) ;
// redisClient.connect().catch(console.error) ;

const app = express() ;
app.use(passport.initialize()) ;
app.use(session({
    store : new RedisStore({ client : redisClient }),
    name: 'tuto-session',
    keys: ['key1', 'key2'],
    saveUninitialized : false ,
    secret : "keyboardcat" ,
    resave : false, 
  }))
app.use(passport.session()) ;

function isLoggedIn(req, res, next) {
    if(req.user)
    next() ;
    else
    res.send('not valid') ;
}

app.get('/', (req, res) => {
    res.render('index.ejs') ;
})

app.get('/google', passport.authenticate('google', { scope : ['profile', 'email']})) ;

app.get('/google/callback',passport.authenticate('google', {failureRedirect : '/failure'}), (req, res) => {
    res.redirect('/success') ;
})

app.get('/success', isLoggedIn, (req, res) => {
    res.send('<h1>hello') ;
})

app.get('/logout', (req, res) => {
    req.session = null ;
    req.logout() ;
    req.redirect('/') ;
})

app.listen(3000, () => {
    console.log("listening") ;
})