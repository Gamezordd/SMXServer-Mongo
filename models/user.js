var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    name:{
        type: String,
        default:''
    },
    details:{
        type: Object
    }
}, {strict: false});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);