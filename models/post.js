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
    },
    author:{
        type: String,
        required: true
    },
    liked_by:{
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('Post', Post);