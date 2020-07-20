var express = require('express');
var router = express.Router();
var authenticate = require('../authenticate');
var Post = require('../models/post');


router.get('/:post_id', authenticate.verifyUser, (req, res,next) =>{
    Post.findById(req.params.post_id, (err, result) => {
        if(result){
            var currentLikes = result.likes;
            Post.findByIdAndUpdate({_id: req.params.post_id}, {
                likes : currentLikes + 1
            }, (error, re) => {
                console.log("after update: ", re);
            });
        }
    });
    console.log("likes: ", );
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end("Likes Updated");
});

router.post('/', authenticate.verifyUser, (req, res, next) => {
    Post.create(req.body).then(() => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end("Post created");
    });
    
});

module.exports = router;