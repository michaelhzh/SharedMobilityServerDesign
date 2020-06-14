const express = require ('express');

const router =  express.Router();

router.get('/', (req, res)=> {
    res.send('we are on rider page');
});

module.exports = router;