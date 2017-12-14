const express = require('express');
const router = express.Router();
const dbService = require('./db/db.service')();

let axios = require('axios');
const cachios = require('cachios');
const _ = require('underscore');
var Promise = require("bluebird");
var idope = require('idope-search');
const moment = require('moment');

var clientId = "42ee8abf7aa0c5c2d275a81877a323dafe105b821dec2785f848bd3d9bf7ccb7";
var clientSecret = "37c4043b6481b17fd95f8f7cacec18ad21c907296458cbeabfefc824de8b148d";
var apiUrl = "https://api.trakt.tv";
var fanartKey = "56fcab76d7f694fb089ed43765482ee6";
var fanartUrl = "http://webservice.fanart.tv/v3/";

//axios
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['trakt-api-version'] = 2;
axios.defaults.headers.common['trakt-api-key'] = clientId;
// axios.defaults.headers.common['Authorization'] = "Bearer e1607c5a57eb902b5b2a31b2e6d2d6e191e91f756e4fb29179ec7bad6bdb7145"; 
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
router.get('/movies/:type', async (req, res) => {
  var listType = req.params.type;
  let dbList = await dbService.fetchMovies(listType);
  if (dbList.data.length > 0) {
    res.send(dbList.data);
  } else {
    let traktList = await axios.get(apiUrl + `/movies/${listType}?extended=full&limit=50`, {
      ttl: cacheDuration
    });

    if (traktList.data.length > 0) {
      let result = await _mapImages(traktList.data);
      res.send(result);
      dbService.updateMovies(result, listType);
    }
  }
});
// Get movies by query params
router.get('/movies/search/:query', async (req, res) => {
  var query = req.params.query;
  axios.get(apiUrl + `/movies/popular?extended=full&limit=50&query=${query}`, {
      ttl: cacheDuration
    })
    .then(async (obj) => {
      let result = await _mapImages(obj.data, res);
      res.send(result);
    })
    .catch(function (error) {
      console.log(error);
      res.send(error);
    });
});

// Get shows
router.get('/shows/:type',async (req, res) => {
  var listType = req.params.type;
  let dbList = await dbService.fetchShows(listType);
  if (dbList.data.length > 0) {
    res.send(dbList.data);
  } else {
    let traktList = await axios.get(apiUrl + `/shows/${listType}?extended=full&limit=50`, {
      ttl: cacheDuration
    });

    if (traktList.data.length > 0) {
      let result = await _mapShowsImages(traktList.data);
      res.send(result);
      dbService.updateShows(result, listType);
    }
  }
});
// Get shows episodes
router.get('/shows/:imdb/seasons', (req, res) => {
  var imdb = req.params.imdb;
  axios.get(apiUrl + `/shows/${imdb}/seasons?extended=episodes`, {
      ttl: cacheDuration
    })
    .then(function (obj) {
      res.send(obj.data);
    })
    .catch(function (error) {
      console.log(error);
      res.send(error);
    });
});
// Get shows by query params
router.get('/shows/search/:query',async (req, res) => {
  var query = req.params.query;
  axios.get(apiUrl + `/shows/popular?extended=full&limit=50&query=${query}`, {
      ttl: cacheDuration
    })
    .then(async (obj) => {
      let result = await _mapShowsImages(obj.data, res);
      res.send(result);
    })
    .catch(function (error) {
      res.send(error);
    });
});

let user;
// Get device code
router.get('/device/code',async (req, res) => {
  user = await dbService.fetchUser();
  if (_.isEmpty(user)){
  axios.post(apiUrl + '/oauth/device/code', {
      "client_id": clientId
    })
    .then(obj => {
      res.send(obj.data);
    })
    .catch(function (error) {
      sendError(error, res);
    });
  }
  else {
    res.send({authenticated : true});
    axios.axiosInstance.defaults.headers.common['Authorization'] = "Bearer " + user.access_token;   
  }
});

//Idope Search
router.post('/idope', (req, res) => {
  var query = req.body.query;

  axios.get('https://idope.se/search/' + query)
    .then(function (obj) {
      res.send(obj.data);
    })
    .catch(function (error) {
      res.send(error);
    });
});

async function _mapImages(data, res) {

  let promises = [];
  _.forEach(data, function (obj) {
    var imdbId = "";
    if (_.has(obj, 'movie')) {
      imdbId = obj.movie.ids.imdb;
    } else {
      imdbId = obj.ids.imdb;
    }
    promises.push(axios.get(fanartUrl + `movies/${imdbId}?api_key=${fanartKey}`, {
      ttl: cacheDuration
    }));
  });
  let args = await _promise_all(promises);
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
  return movies;
}

async function _mapShowsImages(data, res) {

  let promises = [];
  _.forEach(data, function (obj) {
    var tvdbId = "";
    if (_.has(obj, 'show')) {
      tvdbId = obj.show.ids.tvdb;
    } else {
      tvdbId = obj.ids.tvdb;
    }
    promises.push(axios.get(fanartUrl + `tv/${tvdbId}?api_key=${fanartKey}`, {
      ttl: cacheDuration
    }));
  });
  let args = await _promise_all(promises);
  let allResult = _.pluck(args, 'data');
  var shows = _.map(data, function (tv) {
    var images = _.filter(allResult, function (obj) {
      if (!obj) {
        return false;
      }
      var tvdbId = "";
      if (_.has(tv, 'show')) {
        tvdbId = tv.show.ids.tvdb;
      } else {
        tvdbId = tv.ids.tvdb;
      }
      return obj.thetvdb_id == tvdbId;
    });
    if (images) {
      if (_.has(tv, 'show')) {
        tv = _.extend(tv.show, images[0]);
      } else {
        tv = _.extend(tv, images[0]);
      }
    }
    return tv;
  });
  return shows;
}
//Promise all
_promise_all = async function (promises) {
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

//User list
router.get('/sync/collection', async (req, res) => {
  var listType = "collection";
  let dbList = await dbService.fetchMovies(listType);
  if (dbList.data.length > 0) {
    res.send(dbList.data);
  } else {
    let traktList = await axios.get(apiUrl + `/sync/collection/movies?extended=full`, {
      ttl: cacheDuration
    });

    if (traktList.data.length > 0) {
      let result = await _mapImages(traktList.data);
      res.send(result);
      dbService.updateMovies(result, listType);
    }
  }
});
router.get('/sync/watchlist', async (req, res) => {
  var listType = "watchlist";
  let dbList = await dbService.fetchMovies(listType);
  if (dbList.data.length > 0) {
    res.send(dbList.data);
  } else {
    let traktList = await axios.get(apiUrl + `/sync/watchlist/movies?extended=full`, {
      ttl: cacheDuration
    });

    if (traktList.data.length > 0) {
      let result = await _mapImages(traktList.data);
      res.send(result);
      dbService.updateMovies(result, listType);
    }
  }
});
router.get('/sync/recommendations', async (req, res) => {
  var listType = "recommendations";
  let dbList = await dbService.fetchMovies(listType);
  if (dbList.data.length > 0) {
    res.send(dbList.data);
  } else {
    let traktList = await axios.get(apiUrl + `/recommendations/movies?extended=full&limit=50`, {
      ttl: cacheDuration
    });

    if (traktList.data.length > 0) {
      let result = await _mapImages(traktList.data);
      res.send(result);
      dbService.updateMovies(result, listType);
    }
  }
});

router.get('/sync/nexttowatch', async (req, res) => {
  var listType = "nexttowatch";
  let listResult = [];
  let watchedList;
  let dbList = await dbService.fetchShows(listType);
  if (dbList.data.length > 0) {
    res.send(dbList.data);
  } else {
    watchedList = await axios.get(apiUrl + `/users/me/watched/shows?extended=full`, {
      ttl: cacheDuration
    });
    let promises = await _.map(watchedList.data, async (show) => {
      let lastSeason = show.seasons[show.seasons.length - 1];
      let lastEpisode = lastSeason.episodes[lastSeason.episodes.length - 1];
      //check for next Episode
      return await _nextEpisode(show, lastSeason.number, lastEpisode.number + 1);
    });
    let args = await _promise_all(promises);
    let promises2 = args.map(async obj => {
      if (obj.empty) {
      }
      else if (obj.season) {
        listResult.push(obj);
      }
      else if (obj.lastSeason) {
        return await _nextEpisode(obj.show, obj.lastSeason + 1, 1);
      }
    });
    let args2 = await _promise_all(promises2);
    _.each(args2, async (rsp) => {
      if (rsp && rsp.season) {
        listResult.push(rsp);
      }
    });
    let result = await _mapShowsImages(listResult);
    dbService.updateShows(result, listType);
    res.send(result);
  }
});
const _nextEpisode = async function(show, lastSeason, lastEpisode){
  let rslSrc, rjlSrc;
  let srcPromise = new Promise(async (resolve, reject) => {
    rslSrc = resolve;
    rjlSrc = reject;
  });
  let nextEpisode = await axios.get(apiUrl + `/shows/${show.show.ids.trakt}/seasons/${lastSeason}/episodes/${lastEpisode}?extended=full`, {
    ttl: cacheDuration
  }).catch((error)=>{
    let data = {
      "show" : show, "lastSeason" : lastSeason
    }
    return { "data" : data };
  })
  if (!_.isEmpty(nextEpisode.data) && nextEpisode.data.first_aired != null && moment().isSameOrAfter(nextEpisode.data.first_aired)) {
    //Add episode to list
    let showToAdd = show.show;
    showToAdd.season =  lastSeason;
    showToAdd.episode = lastEpisode;
    rslSrc(showToAdd);
  }
  else if (nextEpisode.data.lastSeason) {
    //check for new season
    rslSrc(nextEpisode.data);
  }
  else {
    rslSrc({ empty : true })
  }
  return srcPromise;  
}
module.exports = router;
