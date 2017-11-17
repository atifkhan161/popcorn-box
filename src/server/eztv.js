const express = require('express');
const router = express.Router();
const axios = require('axios');
const _ = require('underscore');

var apiUrl = "https://eztv.ag/api/get-torrents";
var popcornApiUrl = "https://tv-v2.api-fetch.website";


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


// Get query
router.get('/search/:id', (req, res) => {
  var imdbId = req.params.id.substr(2);
  fetchShows(imdbId, 1).then(function(obj){
    if(obj.torrents_count > 100) {
      fetchShows(imdbId, 1).then(function(arr){
        obj.torrents.push(arr);
        res.send(obj.torrents);
      })
    }
    else {
      res.send(obj.torrents);
    }
  });
});
router.get('/popcorn/:id', (req, res) => {
  var imdbId = req.params.id;
  axios.get(popcornApiUrl + '/show/' + imdbId)
  .then(function (obj) {
    let flatData = obj.data;
    flatData.episodes = _.map(obj.data.episodes, episode => {
      let torrents = [];
      let keys = _.allKeys(episode.torrents);
      _.forEach(keys, key => {
        let torrent = episode.torrents[key];
        torrent.quality = key;
        torrents.push(torrent);
      });
      episode.torrents = torrents;
      return episode;
    });
    res.send(flatData);
  })
  .catch(function (error) {
    res.send(error);
  });
});
function fetchShows(imdbId, page) {
  return axios.get(apiUrl + '?imdb_id=' + imdbId + '&limit=100&page=' + page)
    .then(function (obj) {
      return obj.data;
    })
    .catch(function (error) {
      return error;
    });
}
module.exports = router;
