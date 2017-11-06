const express = require('express');
const router = express.Router();
const axios = require('axios');
const _ = require('underscore');

var apiUrl = "https://yts.ag/api/v2/list_movies.json";

//axios
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
};

//Yify params
let trackers = [
  'udp://open.demonii.com:1337',
  'udp://tracker.istole.it:80',
  'http://tracker.yify-torrents.com/announce',
  'udp://tracker.publicbt.com:80',
  'udp://tracker.openbittorrent.com:80',
  'udp://tracker.coppersurfer.tk:6969',
  'udp://exodus.desync.com:6969',
  'http://exodus.desync.com:6969/announce'
].join('&tr=')

const magnetURI = (hash, title) => {
  return `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}&tr=${trackers}`
}

// Get movies
router.get('/movie/:id', (req, res) => {
  var imdbId = req.params.id;
  axios.get(apiUrl + '?query_term=' + imdbId)
    .then(function (obj) {
      if (obj.data.status == "ok" && obj.data.data.movie_count > 0) {
        var movie = obj.data.data.movies[0];
        _.map(movie.torrents, source => {
            source.url = magnetURI(source.hash, movie.title);
            return source;
        });
        res.send(movie);
      }
    })
    .catch(function (error) {
      console.log(error);
      res.send(error);
    });
});

module.exports = router;
