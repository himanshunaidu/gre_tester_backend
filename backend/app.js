const express = require('express');
const bodyparser = require('body-parser');
const mysql = require('mysql');

const TestRoutes = require('./routes/test-routes');
const HistoryRoutes = require('./routes/history-routes');

const app = express();

app.use(bodyparser.json());
//app.use(bodyparser.urlencoded({extended: false}));

app.use((req, res, next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'gre'
})
//table_name: word_meanings

connection.connect((err) => {
  if (err) {
    console.error('Error Connecting: '+ err.stack);
    return;
  }
  console.log('Successfully connected: '+ connection.threadId);
});

//console.log(connection);

/*app.use((req, res, next)=>{
  console.log('Getting to front end');
  res.send('Get to front-end');
});*/

app.use('/test', TestRoutes);
app.use('/history', HistoryRoutes);

connection.end();
  
module.exports = app;  