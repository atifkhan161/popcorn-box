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
router.post('/movie', async(req, res) => {
  var movie = req.body;
  let promisUrls = [];
  sources[0].forEach(source => {
    promisUrls.push(source.getMovie(movie).then(function (srcs) {
      if (srcs && srcs.length > 0) {
        return srcs;
      }
      return [];
    }));
  });
  let result = await Promise.all(promisUrls);
  res.send(_.flatten(result));
});
// Get movies
router.post('/episode', async(req, res) => {
  var show = req.body;
  let promisUrls = [];
  sources[1].forEach(source => {
    promisUrls.push(source.getEpisode(show).then(function (srcs) {
      if (srcs && srcs.length > 0) {
        return srcs;
      }
      return [];
    }));
  });
  let result = await Promise.all(promisUrls);
  res.send(_.flatten(result));
});

module.exports = router;
