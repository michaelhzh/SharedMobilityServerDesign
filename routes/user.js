const express = require ('express');
const router =  express.Router();
const User = require('../models/user');
const Mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require ("jsonwebtoken");


router.get('/:driverId', async (req, res, next)=> {
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

router.post('/signup', async (req, res, next) => {
    try{
        const userfinder = await User.find({username:req.body.username});
        if (userfinder.length >= 1){
            res.status(409).json({
                message:"This username exists already, please choose a new one to continue"
            })
        }
        else{
            bcrypt.hash(req.body.password, 10,(err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error:err
                    });
                }
                else{
                    const user = new User ({
                        _id: new Mongoose.Types.ObjectId(),
                        username : req.body.username,
                        password : hash
                    });
                    try{ 
                        user.save();
                        res.status(201).json({
                            message : "User information has been created",
                        });
                    }
                    catch (err){
                        res.status(500).json({error :err});
                    }  
                }
            })
        }
    }
    catch{
    }
});     

router.post('/login', async (req, res, next) => {
    try{
        const user = await User.find({username: req.body.username});
        if (user.length < 1 ) {
            return res.status(401).json({
                message: 'Login Failed'
            });
        }
        else{
            bcrypt.compare(req.body.password, user[0].password, (err, result) =>{
                if (err) {
                    return res.status(401).json({
                        message: 'Login Failed'
                    });
                }
                if (result){
                    const token = jwt.sign({
                        username: user[0].username,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, 
                    {
                        expiresIn: "1h"
                    });
                    return res.status(200).json({
                        message: 'Login Success',
                        token: token
                    });
                }
                return res.status(401).json({
                    message: 'Login Failed'
                });
            })
        }

    }
    catch(err){
        res.status(500).json({
            error: "Not a Valid Entry",
            message: err
        })
    }
});

router.delete("/:userId", async (req, res, next) => {
    const id = req.params.userId;
    try{
        await User.deleteOne({_id: id});
        res.status(200).json({message: "User  " + id  + " has been removed"}); //the message shows up when trying to remove valid ID that did not exist in database (could be a source of error)
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