var express = require("express");
var request = require('request');
var app = express();

const { Pool } = require('pg')
const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Dimi2023",
    database: "expense",
    connectionLimit: 5,
})

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
    console.log("get all expenses from table")
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query('SELECT * from expense ', (err, result) => {
            release()
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            console.log(result.rows)
            res.json(result.rows)
        })
    })
});

app.get(`/api/expense/id`, (req, res) => {
    console.log("get one expenses from table defined by id")
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query('SELECT * from expense WHERE id = 2', (err, result) => {
            release()
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            console.log(result.rows)
            res.json(result.rows)
        })
    })
});

app.post(`/api/expense`, (req, res) => {
    console.log("create a new expense record")
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query("INSERT INTO expense (id, name, amount, create_date, update_date) values (nextval('firstsequence'), 'Node expense', 57.872, '2022-10-17', '2022-11-09')", (err, result) => {
            release()
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            console.log(result.rows)
        })
    })
});

app.put(`/api/expense/{expense}`, (req, res) => {
    console.log("update an expense record")
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query('UPDATE EXPENSE SET AMOUNT = 2 WHERE ID = 1', (err, result) => {
            release()
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            console.log(result.rows)
        })
    })
});

app.delete(`/api/expense/id`, (req, res) => {
    console.log("delete an expense record")
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query('DELETE FROM expense WHERE ID=5;', (err, result) => {
            release()
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            console.log(result.rows)
        })
    })
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});