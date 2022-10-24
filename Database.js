const {createPool} = require('pg')

const pool = createPool({
    host: "localhost",
    user: "postgres",
    port: 5342,
    password: "Dimi2023",
    database: "expense",
    connectionLimit: 5,
})

pool.connect()



