const express = require('express');
const mongoose  = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

const app = express();

//middlewares
app.use(bodyParser.json());

//Import routes
const driverRoutes =  require('./routes/driver');
app.use ('/driver', driverRoutes);

const riderRoutes =  require('./routes/rider');
app.use ('/rider', riderRoutes);

//Routes
app.get('/', (req, res) =>{
    res.send('we are on home');
});

//database connection 
mongoose.connect(
    process.env.DB_connection, 
    { useNewUrlParser: true, useUnifiedTopology: true  },
    () => console.log("connected to MongoDB")
);

//Listening to the server

app.listen(3000);