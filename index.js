const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = require('express')();
let port = process.env.PORT || 3000;
let mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';

const crawler = require('./controllers/crawler');
const display = require('./controllers/display');


var option = {
    reconnectTries: process.env.MONGO_RECONN_TRIES,
    reconnectInterval: process.env.MONGO_RECONN_TIME,
    dbName: process.env.DB || "crawler",
    useUnifiedTopology: true,
    useNewUrlParser: true
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


mongoose.connect(mongoUrl, option, err => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to DB");
    }
});

app.get('/crawl', crawler.start);
app.get('/getData', display.getParsedUrls);

app.listen(port, function () {
    console.log('Server started on port ', port);
});