const express = require('express');
const router = express.Router();
let axios = require('axios');
const cachios = require('cachios');
const _ = require('underscore');
var Promise = require("bluebird");

var clientId = "42ee8abf7aa0c5c2d275a81877a323dafe105b821dec2785f848bd3d9bf7ccb7";
var clientSecret = "37c4043b6481b17fd95f8f7cacec18ad21c907296458cbeabfefc824de8b148d";
var apiUrl = "https://api.trakt.tv";
var fanartKey = "56fcab76d7f694fb089ed43765482ee6";
var fanartUrl = "http://webservice.fanart.tv/v3/";

//axios
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['trakt-api-version'] = 2;
axios.defaults.headers.common['trakt-api-key'] = clientId;
// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};


//Cache instance after axios config
axios = cachios.create(axios);
const cacheDuration = 15 *60; //15 min
// Response handling
let response = {
  status: 200,
  data: [],
  message: null
};

// Get movies
router.get('/movies/:type', (req, res) => {
  var listType = req.params.type;
  axios.get(apiUrl + `/movies/${listType}?extended=full&limit=50`, { ttl: cacheDuration })
    .then(function (obj) {
      // res.send(obj.data);
      _mapImages(obj.data, res);
    })
    .catch(function (error) {
      console.log(error);
      res.send(error);
    });
});
// Get movies by query params
router.get('/movies/search/:query', (req, res) => {
  var query = req.params.query;
  axios.get(apiUrl + `/movies/popular?extended=full&limit=50&query=${query}`, { ttl: cacheDuration })
    .then(function (obj) {
      _mapImages(obj.data, res);
    })
    .catch(function (error) {
      console.log(error);
      res.send(error);
    });
});

// Get device code
router.get('/device/code', (req, res) => {
  axios.post(apiUrl + '/oauth/device/code', {
      "client_id": clientId
    })
    .then(obj => {
      res.send(obj.data);
    })
    .catch(function (error) {
      sendError(error, res);
    });
});

function _mapImages(data, res) {

  let promises = [];
  _.forEach(data, function (obj) {
    var imdbId = "";
    if (_.has(obj, 'movie')) {
      imdbId = obj.movie.ids.imdb;
    } else {
      imdbId = obj.ids.imdb;
    }
    promises.push(axios.get(fanartUrl + `movies/${imdbId}?api_key=${fanartKey}`, { ttl: cacheDuration }));
  });
  _promise_all(promises).then(function (args) {
    let allResult = _.pluck(args, 'data');
    var movies = _.map(data, function (mov) {
      var images = _.filter(allResult, function (obj) {
        if (!obj) {
          return false;
        }
        var imdbId = "";
        if (_.has(mov, 'movie')) {
          imdbId = mov.movie.ids.imdb;
        } else {
          imdbId = mov.ids.imdb;
        }
        return obj.imdb_id == imdbId;
      });
      if (images) {
        if (_.has(mov, 'movie')) {
          mov = _.extend(mov.movie, images[0]);
        } else {
          mov = _.extend(mov, images[0]);
        }
      }
      return mov;
    });
    res.send(movies);
  });
}
//Promise all
_promise_all = function (promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let count = 0;
    promises.forEach((promise, idx) => {
      promise
        .catch(err => {
          return err;
        })
        .then(valueOrError => {
          results[idx] = valueOrError;
          count += 1;
          if (count === promises.length) resolve(results);
        });
    });
  });
};
module.exports = router;
