const express = require('express');
const router = express.Router();

const pool = require('../middleware/db');

const word_meanings = require('../resources/dbDetails/word_meanings');
const history = require('../resources/dbDetails/history');

//Retrieve a word for the test
router.get('/tests', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(401).json({
                message: 'Failure in getting connection'
            })
        }

        let query = `Select * from ${history.TABLE_NAME};`;
        connection.query(query, (error, results, fields) => {
            connection.release();
            if (error) {
                return res.status(401).json({
                    message: 'Failure in getting query results'
                })
            }

            return res.status(201).json({
                message: 'Success',
                history: results
            })
        })
    })
    /*return res.status(401).json({
        message: 'Failure'
    })*/
})

//Post the Test Results
router.post('/submit', (req, res, next) => {
    //Must insert all the relevant values
    let meaning=history.MEANING, mnemonic=history.MNEMONIC, sentence=history.SENTENCE;
    let meaning_val=false, mnemonic_val=false, sentence_val=false;
    let meaning_sc=null, mnemonic_sc=null, sentence_sc=null;
    let meaning_sc_val=null, mnemonic_sc_val=null, sentence_sc_val=null;
    if (req.body.meaning) {
        meaning = history.MEANING;
        meaning_val = true;
        meaning_sc = history.MEANING_SC;
        meaning_sc_val = req.body.meaning_sc;
    }
    if (req.body.mnemonic) {
        mnemonic = history.MNEMONIC;
        mnemonic_val = true;
        mnemonic_sc = history.MNEMONIC_SC;
        mnemonic_sc_val = req.body.mnemonic_sc;
    }
    if (req.body.sentence) {
        sentence = history.SENTENCE;
        sentence_val = true;
        sentence_sc = history.SENTENCE_SC;
        sentence_sc_val = req.body.sentence_sc;
    }

    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(401).json({
                message: 'Failure in getting connection'
            })
        }
        
        //Generate the query
        let columns = `(`+
            `${history.RANDOM+','}`+
            `${!req.body.random? history.INDEX_START+',': ''}`+
            `${meaning+','}`+
            `${meaning_val? meaning_sc+',': ''}`+
            `${mnemonic+','}`+
            `${mnemonic_val? mnemonic_sc+',': ''}`+
            `${sentence+','}`+
            `${sentence_val? sentence_sc+',': ''}`+
            `${history.TOTAL}`+
        `)`

        let values = `(`+
            `${req.body.random+','}`+
            `${!req.body.random? req.body.index_start+',': ''}`+
            `${meaning_val+','}`+
            `${meaning_val? meaning_sc_val+',': ''}`+
            `${mnemonic_val+','}`+
            `${mnemonic_val? mnemonic_sc_val+',': ''}`+
            `${sentence_val+','}`+
            `${sentence_val? sentence_sc_val+',': ''}`+
            `${req.body.total}`+
        `)`

        let query = `Insert into ${history.TABLE_NAME}${columns} VALUES${values};`;
        console.log(query);

        connection.query(query, (error, results, fields) => {
            connection.release();
            if (error) {
                return res.status(401).json({
                    message: 'Failure in submitting Test'
                })
            }

            return res.status(201).json({
                message: 'Success',
                results: results
            })
        })

        /*res.status(201).json({
            query: query
        })*/
    })
})

module.exports = router;