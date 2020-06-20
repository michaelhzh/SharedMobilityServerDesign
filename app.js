const express = require('express');
const mongoose  = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require("morgan")
require('dotenv/config');

const app = express();

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

//CORS 
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*"); //should look up what do each header represent to decide which ones to allow
    if (req.method === "Options") {
        res.header("Access-Control-Allow-Origin", "POST, GET, DELETE, PUT, HEAD"); 
        return res.status(200).json({});
    }
    next();
})


//Import routes
const driverRoutes =  require('./routes/driver');
app.use ('/driver', driverRoutes);

const riderRoutes =  require('./routes/rider');
app.use ('/rider', riderRoutes);

app.use((req, res, next) =>{
    const error = new Error("NOT FOUND");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

//Routes
app.get('/', (req, res, next) =>{
    res.send('we are on home');
});

//database connection 
mongoose.connect(
    process.env.DB_connection, 
    { useNewUrlParser: true, useUnifiedTopology: true  },
    () => console.log("connected to MongoDB")
);  

mongoose.Promise = global.Promise;

//Listening to the server

app.listen(3000);