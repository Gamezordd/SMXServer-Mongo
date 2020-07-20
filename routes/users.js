var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Get request to users');
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}),
    req.body.password, (err, user) =>{
      User.create(req.body.name);
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else{
        console.log("Signup request: ", req.body);
        if(req.body.name){
          user.name = req.body.name;
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
          console.log("username: ", req.session.username);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Success'});
        });
      }
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  req.session.user = 'authenticated';
  req.session.username = req.body.username;
  console.log("username: ", req.session.username);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'Successfully logged in!'})
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
