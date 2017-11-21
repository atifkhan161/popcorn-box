const express = require('express');
const router = express.Router();
let axios = require('axios');
const cachios = require('cachios');
const _ = require('underscore');

//Import Sources
const sources = require('./addons/addons');

// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};


//Cache instance after axios config
axios = cachios.create(axios);
const cacheDuration = 15 * 60; //15 min
// Response handling
let response = {
  status: 200,
  data: [],
  message: null
};

// Get movies
router.post('/movie', (req, res) => {
  var movie = req.body;
  let urls = [];
  sources.forEach(source => {
    let url = source.getMovie(movie);
    if (url) {
      urls.push(url);
    }
  });
});

module.exports = router;
