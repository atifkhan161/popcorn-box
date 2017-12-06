let axios = require('axios');
let _ = require('underscore');
// const Promise = require("bluebird");
const cheerio = require('cheerio');

let self = this;
self.base_link = 'https://xmovies8.tv';
self.search_link = '/movies/search?s=%s';

function xMovies() {
  return {
    getMovie: async function (movie) {
      let returnUrls = [];

      return returnUrls;
    },
    getEpisode: async function (show) {
      let returnUrls = [];

      return returnUrls;
    }
  }
}
module.exports = xMovies;
