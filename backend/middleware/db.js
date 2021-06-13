//Please change settings according to your MySQL environment
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'gre'
})
//table_name: word_meanings


module.exports = pool;