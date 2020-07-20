var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema({
    message: {
        type: String,
        required: true
    },
    likes:{
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Post', Post);