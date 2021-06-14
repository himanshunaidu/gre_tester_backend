const express = require('express');
const router = express.Router();
const fs = require('fs');
const process = require('process')

const pool = require('../middleware/db');

const word_meanings = require('../resources/dbDetails/word_meanings');
const history = require('../resources/dbDetails/history');

//Retrieve a word for the test
router.get('/word', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Failure in getting connection'
            })
        }

        let query = `Select * from ${word_meanings.TABLE_NAME} where ${word_meanings.MAIN_ID}=${req.query.index} order by ${word_meanings.MAIN_ID};`;
        connection.query(query, (error, results, fields) => {
            connection.release();
            if (error) {
                return res.status(401).json({
                    success: false,
                    message: 'Failure in getting query results'
                })
            }

            console.log(results);
            let output;
            if (results.length>=1) {
                output = results[0];
                return res.status(201).json({
                    success: true,
                    message: 'Success',
                    word_meaning: output
                })
            }
            else {
                return res.status(201).json({
                    success: false,
                    message: 'Word Limit Exceeded'
                })
            }
        })
    })
    /*return res.status(401).json({
        message: 'Failure'
    })*/
})

//Get total number of words
router.get('/total_words', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Failure in getting connection'
            })
        }

        let query = `Select COUNT(*) from ${word_meanings.TABLE_NAME};`;
        connection.query(query, (error, results, fields) => {
            connection.release();
            if (error) {
                return res.status(401).json({
                    success: false,
                    message: 'Failure in getting query results'
                })
            }

            let length = results[0]["COUNT(*)"];
            //console.log(length);

            return res.status(201).json({
                success: true,
                message: 'Success',
                total_words: length
            })
        })
    })
    /*return res.status(401).json({
        message: 'Failure'
    })*/
})

router.post('/failed_words', (req, res, next) => {
    fs.appendFile('failed_words.txt', req.body, (err)=>{
        if (err) throw err;
        console.log('Saved!');
    })
})

module.exports = router;