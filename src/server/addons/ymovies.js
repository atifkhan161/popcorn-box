let axios = require('axios');
let _ = require('underscore');
// const Promise = require("bluebird");
const cheerio = require('cheerio');

let self = this;
self.domains = ['solarmoviez.to'];
self.base_link = 'https://yesmovies.to';
self.search_link = '/movie/search/';
self.info_link = '/ajax/movie_info/%s.html?is_login=false';
self.server_link = '/ajax/v4_movie_episodes/';
self.embed_link = '/ajax/movie_embed/%s';
self.token_link = '/ajax/movie_token?eid=';
self.source_link = '/ajax/movie_sources/';

function yMovies() {
  //Fetch the Homepage url of the movie
  const _fetchHomePage = async function (url, movie, show) {
    return axios.get(url).then(resp => {
      let $ = cheerio.load(resp.data);
      let movieHome = {};
      $('.ml-item').children().each((i, elem) => {
        let title = $(elem).attr('title');
        if (show) {
          let re = title.match(/(.*?)\s+-\s+Season\s+(\d)/);
          let dataId = -1;
          if (re && re.length > 1 && re[1] == show.title && re[2] == show.episode.season) {
            const dataInfo = $(elem).attr('data-url');
            let reInfo = dataInfo.match(/(\d+)/);
            let dataId = -1;
            if (reInfo) {
              dataId = reInfo[0];
            }
            movieHome = {
              Url: $(elem).attr('href'),
              dataInfo: dataInfo,
              dataId: dataId
            };
          }
        } else {
          if (movie.title == title) {
            const dataInfo = $(elem).attr('data-url');
            let re = dataInfo.match(/(\d+)/);
            let dataId = -1;
            if (re) {
              dataId = re[0];
            }
            movieHome = {
              Url: $(elem).attr('href'),
              dataInfo: dataInfo,
              dataId: dataId
            };
          }
        }
      });
      return movieHome;
    }).catch(err => {
      return [];
    });
  };

  //Fetch the Homepage url of the movie
  const _fetchSourcesIds = async function (url, show) {
    return axios.get(url).then(resp => {
      let $ = cheerio.load(resp.data.html);
      let servers = [];
      let lis = $('.pas-list').find('li').each((id, li) => {
        if (show){
          let epTitle = $(li).find('a').attr('title');
          let re = epTitle.toLowerCase().match(/episode.*?(\d+).*?/);
          let dataId = -1;
          if (re && re.length >0 && re[1] == show.episode.number) {
            let server = {
              id: $(li).attr('data-id'),
              server: $(li).attr('data-server'),
              title: $(li).find('a').attr('title')
            }
            servers.push(server);
          }
        }
        else {
          let server = {
            id: $(li).attr('data-id'),
            server: $(li).attr('data-server'),
            title: $(li).find('a').attr('title')
          }
          servers.push(server);
        }
      });
      return servers;
    }).catch(err => {
      return [];
    });
  };
  async function _fetchMovieToken(url) {
    return axios.get(url).then(resp => {
      return {
        x: resp.data.match(/\_x=['\"]([^\"']+)/)[1],
        y: resp.data.match(/\_y=['\"]([^\"']+)/)[1]
      };
    }).catch(err => {
      return '';
    });
  }
  const _fetchMovieSource = async function (url) {
    return axios.get(url).then(resp => {
      let sources = [];
      if (resp.data && resp.data.playlist && resp.data.playlist.length > 0) {
        sources = resp.data.playlist[0].sources;
      }
      return sources;
    }).catch(err => {
      return {};
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
  return {
    getMovie: async function (movie) {
      let returnUrls = [];
      //Fetch homepage of movie
      let homePage = await _fetchHomePage(self.base_link + self.search_link + movie.title.replace(/ /g, "+") + ".html", movie);
      if (!homePage.dataId) {
        return returnUrls;
      }
      //Load souces 
      let dataUrl = self.base_link + self.server_link + homePage.dataId;
      let souceServers = await _fetchSourcesIds(dataUrl);
      if (!souceServers || souceServers.length == 0) {
        return returnUrls;
      }
      let mapSourceUrls = await souceServers.map(async(source) => {
        let tokenUrl = self.base_link + self.token_link + source.id + '&mid=' + homePage.dataId;
        let movieToken = await _fetchMovieToken(tokenUrl);
        if (!movieToken) {
          return [];
        }
        let movieSourceUrl = self.base_link + self.source_link + source.id + '?x=' + movieToken.x + '&y=' + movieToken.y;
        let movieSource = await _fetchMovieSource(movieSourceUrl);
        if (_.isEmpty(movieSource)) {
          return [];
        }
        return movieSource;
      });
      returnUrls = await Promise.all(mapSourceUrls);
      returnUrls = _.filter(_.flatten(returnUrls), url => {
        if (_.isEmpty(url)) {
          return false;
        }
        let keys = _.keys(url);
        return _.contains(keys, "file");
      });
      returnUrls = _.map(returnUrls, url => {
        url.provider = "Yes Movies";
        return url;
      });
      return returnUrls;
    },
    getEpisode: async function (show) {
      let returnUrls = [];
      //Fetch homepage of season
      let seasonTitle = show.title + ' Season ' + show.episode.season;
      let homePage = await _fetchHomePage(self.base_link + self.search_link + seasonTitle.replace(/ /g, "+") + ".html", null, show);
      if (!homePage.dataId) {
        return returnUrls;
      }
      //Load souces 
      let dataUrl = self.base_link + self.server_link + homePage.dataId;
      let souceServers = await _fetchSourcesIds(dataUrl, show);
      if (!souceServers || souceServers.length == 0) {
        return returnUrls;
      }
      let mapSourceUrls = await souceServers.map(async(source) => {
        let tokenUrl = self.base_link + self.token_link + source.id + '&mid=' + homePage.dataId;
        let movieToken = await _fetchMovieToken(tokenUrl);
        if (!movieToken) {
          return [];
        }
        let movieSourceUrl = self.base_link + self.source_link + source.id + '?x=' + movieToken.x + '&y=' + movieToken.y;
        let movieSource = await _fetchMovieSource(movieSourceUrl);
        if (_.isEmpty(movieSource)) {
          return [];
        }
        return movieSource;
      });
      returnUrls = await Promise.all(mapSourceUrls);
      returnUrls = _.filter(_.flatten(returnUrls), url => {
        if (_.isEmpty(url)) {
          return false;
        }
        let keys = _.keys(url);
        return _.contains(keys, "file");
      });
      returnUrls = _.map(returnUrls, url => {
        url.provider = "Yes Movies";
        return url;
      });
      return returnUrls;
    }
  }
}

module.exports = yMovies;
