var express = require("express");
var request = require('request');
var app = express();
app.listen(3001, () => {
    console.log("Server running on port 3001");
});

app.get(`/api/time`, (req, res) => {
    res.json(`${(new Date).toTimeString()}`);
});

app.get(`/api/google`, (req, res) => {
    request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, _res, body) => {
        if (err) { return console.log(err); }
        console.log(body.url);
        console.log(body.explanation);
        res.json(body.explanation);
    });
});
