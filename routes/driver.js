const express = require ('express');
const router =  express.Router();
const Post = require('../models/post');
const Mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth")

router.get('/', checkAuth, async (req, res, next)=> {
    try {
        const posts = await Post.find().select("name destination from time").exec();
        res.status(200).json({
            count: posts.length,
            Posts: posts.map( posts => {
                //map to new array
                return {
                    name: posts.name,
                    destination: posts.destination,
                    from: posts.from,
                    time: posts.time,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/driver/' + posts._id
                    }
                }
            })
        });
    }
    catch(err){
        res.status(500).json({error:err});
    }
});

router.get('/:driverId', checkAuth, async (req, res, next)=> {
    const id = req.params.driverId;
    try {
        const post = await Post.findById(id)
        if (post){
            res.status(200).json(post);
            //maybe include a link that gets all the posts
        }
        else{
            res.status(404).json({message: "No Valid Post for This ID"}); // probably don't need this line with try catch block
        }
    }
    catch(err){
        res.status(500).json({
            error: "Not a Valid Entry",
            message:err});
    }
})

router.post('/', checkAuth, async (req, res, next) => {
    const post = new Post ({
        _id: new Mongoose.Types.ObjectId(),
        name : req.body.name,
        destination : req.body.destination,
        from : req.body.from,
        time : req.body.time
    });

    try{ 
        const savedPost = await post.save();
        res.status(201).json({
            message : "Your post has been saved",
            CreatedPost:{
                name: savedPost.name,
                destination: savedPost.destination,
                from : savedPost.from,
                time: savedPost.time
            },
            request: {
                type : 'GET',
                url: "http://localhost:3000/driver/" + savedPost._id
            }
        });
    }
    catch (err){
        res.status(500).json({error :err});
    }  
});

router.delete("/:driverId", checkAuth, async (req, res, next) => {
    const id = req.params.driverId;
    try{
        await Post.deleteOne({_id: id});
        res.status(200).json({message: "Post  " + id  + " has been removed"}); //the message shows up when trying to remove valid ID that did not exist in database (could be a source of error)
    }
    catch(err){
        res.status(500).json({
            error: "invalid ID Entry",
            message: err
        })
    }
});

//do not include router patch unless if is significantly faster than delete and post 
module.exports = router;