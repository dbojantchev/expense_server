var express = require("express");
var bodyParser = require('body-parser')
var request = require('request');
var app = express();
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(urlencodedParser)
app.use(jsonParser)

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

// test with http://localhost:3001/api/expense/4

app.get(`/api/expense/:id`, (req, res) => {
    var id = req.params.id; //!!!!!
    console.log(`get one expenses from table defined by id = ${id}`)
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query(`SELECT * from expense WHERE id = ${id}`, (err, result) => {
            release()
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            console.log(result.rows)
            res.json(result.rows)
        })
    })
});

// Test with http://localhost:3001/api/expense2?id=3
app.get(`/api/expense2/`, (req, res) => {
    console.log(JSON.stringify(req.query))
    var id = req.query.id; //!!!!!
    console.log(`get one expense from table defined by id = ${id}`)
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query(`SELECT * from expense WHERE id = ${id}`, (err, result) => {
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
    console.log(`create a new expense record req.body = ${JSON.stringify(req.body)}`)
    //console.log(`name : ${JSON.stringify(req.body["name"])} \n`)

    const name  =  JSON.stringify(req.body["name"]);
    const amount = parseFloat(req.body["amount"]);
    const date  =  JSON.stringify(req.body["date"]);
    console.log( `amount int = ${amount}\n`)

    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query("INSERT INTO expense (id, name, amount, create_date, update_date, person_id) " +
            "values (nextval('firstsequence'), ($1), ($2), ($3), ($4), 1)",[name, amount, date, date],
            (err, result) => {
                console.log(`res = ${result}`)
                //console.log(`error = ${err}`)
                release()
            if (err) {
                console.error('Error executing query', err.stack)
                res.json({err})
                return
            }
            res.json(result)
        })
    })
});

/*app.post(`/api/expense`, (req, res) => {
    console.log(`create a new expense record req.body = ${JSON.stringify(req.body)}`)
    const { name } = req.body;
    const { amount } = req.body;
    const { date } = req.body;
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query("INSERT INTO expense (id, name, amount, create_date, update_date, person_id) " +
            "values (nextval('firstsequence'), ($1), ($2), ($3), ($4), 1",[name], [amount], [date], [date],
            (err, result) => {
                console.log(`res = ${result}`)
                console.log(`error = ${err}`)
                release()
                if (err) {
                    console.error('Error executing query', err.stack)
                    res.json({err})
                    return
                }
                res.json(result)
            })
    })
});*/

app.put(`/api/expense/:id`, (req, res) => {
    var id = req.params.id; //!!!!!


    const name  =  req.body.name;
    const amount = parseFloat(req.body["amount"]);
    //const date  =  req.body.date;
    console.log(`update an expense record id: ${id}  name: ${name}`)

    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query('UPDATE EXPENSE SET NAME = $1, AMOUNT = $2 WHERE ID = $3', [name, amount, req.params.id],  (err, result) => {
            release()
            if (err) {
                res.json({err})
                return console.error('Error executing query', err.stack)
            }
            console.log(result.rows)
            res.json(result)
        })
    })
});

app.delete(`/api/expense/:id`, (req, res) => {
    console.log("delete an expense record")
    var id = req.params.id; //!!!!!
    console.log(`delete id: ${id}`)
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
            client.query(`DELETE FROM expense WHERE ID=${id}`, (err, result) => {
            release()
            if (err) {
                res.json({err})
                return console.error('Error executing query', err.stack)
            }
            console.log(result.rows)
                res.json(result)
        })
    })
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});