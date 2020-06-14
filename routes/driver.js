const express = require ('express');

const router =  express.Router();

const Post = require('../models/post');

router.get('/', (req, res)=> {
    res.send('we are on driver page');
});

router.post('/', (req, res) => {
    const post = new Post ({
        name : req.body.name,
        destination : req.body.destination,
        from : req.body.from,
        time : req.body.time
    });

    post.save()
    .then(data => {
        res.status(200).json(data)
    })
    .catch (err =>{
        res.status(404).json({message :err})
    }  )
});

module.exports = router;