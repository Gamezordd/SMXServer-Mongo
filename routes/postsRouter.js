var express = require('express');
var router = express.Router();
var authenticate = require('../authenticate');
var Post = require('../models/post');


router.get('/:post_id', authenticate.verifyUser, (req, res,next) =>{
    Post.findById(req.params.post_id, (err, result) => {
        if(result){
            var currentLikes = result.likes;
            
            console.log("liked by: ", result.liked_by);
            if(result.liked_by.length > 0 && result.liked_by.find(name => name === req.session.username)){
                Post.findByIdAndUpdate({_id: req.params.post_id}, {
                    likes : currentLikes - 1,
                    liked_by: [{...result.liked_by.map((element, index) => {
                        if(element === req.session.username){
                            return result.liked_by.splice(index,1);
                        }
                    })}]
                }, (error, re) => {
                    
                });
            }
            else{
                const new_liked_by = [...result.liked_by.concat(req.session.username)];
                Post.findByIdAndUpdate({_id: req.params.post_id}, {
                    likes : currentLikes + 1,
                    liked_by: new_liked_by
                }, (error, re) => {
                    
                });
            }
        }
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end("Likes Updated");
});

router.post('/', authenticate.verifyUser, (req, res, next) => {
    var newPost = {message: req.body.message, poster: req.session.username};
    Post.create(newPost).then(() => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end("Post created");
    });
    
});

module.exports = router;