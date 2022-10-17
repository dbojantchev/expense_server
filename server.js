var express = require("express");
var request = require('request');
var app = express();

app.get(`/api/time`, (req, res) => {
    res.json(`${(new Date).toTimeString()}`);
});

app.get(`/api/nasa`, (req, res) => {
    request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, _res, body) => {
        if (err) { return console.log(err); }
        res.json(body.explanation);
    });
});

app.get(`/api/expense`, (req, res) => {
    // get all expenses from table
});

app.get(`/api/expense/id`, (req, res) => {
    // get one expenses from table defined by id
});

app.put(`/api/expense/`, (req, res) => {
    // create a new expense record
});

app.post(`/api/expense/id`, (req, res) => {
    // update anexpense record
});

app.delete(`/api/expense/id`, (req, res) => {
    // delete an expense record
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});