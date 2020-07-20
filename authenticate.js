var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var passport = require('passport');
var session = require('express-session');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.verifyUser = (req, res, next) => {
    if(req.session.user === 'authenticated'){
        return next();
    }
    else{
        console.log("not logged in");
        err.status = 401;        
        return next(err);
    }
}