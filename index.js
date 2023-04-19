require('dotenv').config();
const express = require('express');
const apicache = require("apicache");
const axios = require('axios');

const API_KEY = process.env.API_KEY;

const app = express();

// Enable caching for 5 minutes
let cache = apicache.middleware;
app.use(cache('5 minutes'));

/**
 * @route GET /
 * @desc Get top 10 news
 * @access Public
 * @returns {JSON} Top 10 news
 * @example http://localhost:3000/
 * 
 */
app.get('/', (req, res) => {
    axios.get(`https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=us&max=10&apikey=${API_KEY}`)
    .then(response => {
        res.send(response.data);
    });
});

/**
 * @route GET /top/:count
 * @desc Get top news
 * @param {Number} count - Number of news to fetch
 * @access Public
 * @returns {JSON} Top news
 * @example http://localhost:3000/top/5
 * @example http://localhost:3000/top/5?category=general&lang=en&country=us
 */
app.get('/top/:count', (req, res) => {
    let category = "general";
    if(req.query.category){
        category = req.query.category;  
    }
    let lang = "en";
    if(req.query.lang){
        lang = req.query.lang;  
    }
    let country = "us";
    if(req.query.country){
        country = req.query.country;
    }
    axios.get(`https://gnews.io/api/v4/top-headlines?category=${category}&lang=${lang}&country=${country}&max=${req.params.count}&apikey=${API_KEY}`)
    .then(response => {
        res.send(response.data);
    });
});

/**
 * @route GET /search
 * @desc Search news
 * @param {String} q - Search query
 * @access Public
 * @returns {JSON} Search results
 * @example http://localhost:3000/search?q=bitcoin
 *  
 */
app.get('/search', (req, res) => {
    let query = req.query.q;
    if(query){   
        axios.get(`https://gnews.io/api/v4/search?q=${query}&max=10&lang=en&country=us&apikey=${API_KEY}`)
            .then(response => {
                res.send(response.data);
        }); 
    }
    else {
        let err = new Error('Bad Request');
        err.statusCode = 400;
        throw err;
    }
});


app.listen(3000, () => console.log('Server started on port 3000'));
