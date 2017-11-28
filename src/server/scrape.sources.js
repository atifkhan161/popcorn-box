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
router.post('/movie',async (req, res) => {
  var movie = req.body;
  let urls = [];
  sources[0].forEach(source => {
    source.getMovie(movie).then(function(srcs){
      if (srcs && srcs.length > 0) {
        urls.push(srcs);
      }
      res.send(_.flatten(urls));
    });
  });
});
// Get movies
router.post('/episode',async (req, res) => {
  var show = req.body;
  let urls = [];
  sources[1].forEach(source => {
    source.getEpisode(show).then(function(srcs){
      if (srcs && srcs.length > 0) {
        urls.push(srcs);
      }
      res.send(_.flatten(urls));
    });
  });
});

module.exports = router;
