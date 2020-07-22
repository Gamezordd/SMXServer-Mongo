var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
var Nexmo = require('nexmo');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Get request to users');
});

var nexmo_instance = new Nexmo({
  apiKey: '3712cd1b',
  apiSecret: 'RAI6fV32BB5pThJN',
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}),
    req.body.password, (err, user) =>{
      console.log(req.body.details);
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else{
        console.log("Signup request: ", req.body);
        if(req.body.name){
          user.name = req.body.name;
          user.details = req.body.details;
        }
        user.save((err, user) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err:err});
            return;
          }
        })
        passport.authenticate('local')(req, res, () => {
          req.session.user = 'authenticated';
          req.session.username = req.body.username;
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Success'});
        });
      }
    });
});

var generated_otp = null;

router.get('/sendotp/:phNum', (req, res) => {
  var success = false;
  generated_otp = parseInt(Math.random() * 1000000);
  new Promise((resolve, reject) => {
    nexmo_instance.message.sendSms('TESTAPP', req.params.phNum, `OTP for logging in is: ${generated_otp}`, {}, (err, res) => {
      if(err){
        console.log("error: ", err);
        reject();
      }
      if(res){
        console.log("response: ", res);
        resolve();
      }
    });
  }).then(() => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.send('OTP has been sent').end();
  }, () =>{
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.send('An error has occured').end();
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  if(generated_otp && req.body.otp === generated_otp){
    req.session.username = req.body.username;
    var token = authenticate.getToken({_id: req.user._id});
    console.log("username: ", req.session.username);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'Successfully logged in!'})
  }
  else{
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end("Please regenerate OTP to log in.")
  }
});



router.get('/logout', (req, res) => {
  if (req.user){
    req.session.destroy();
    res.clearCookie('session-id');
    res.json({logout: true})
  }
  else{
    var err = new Error('You are not logged in');
    err.status = 403;
    next(err);
    return;
  }
});

module.exports = router;
