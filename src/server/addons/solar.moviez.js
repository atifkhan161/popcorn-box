let axios = require('axios');
let _ = require('underscore');
const Promise = require("bluebird");
const cheerio = require('cheerio');

let async = require('asyncawait/async');
let await = require('asyncawait/await');

let self = this;
self.domains = ['solarmoviez.to'];
self.base_link = 'https://solarmoviez.to';
self.search_link = '/movie/search/';
self.info_link = '/ajax/movie_info/%s.html?is_login=false';
self.server_link = '/ajax/v4_movie_episodes/';
self.embed_link = '/ajax/movie_embed/%s';
self.token_link = '/ajax/movie_token?eid=';
self.source_link = '/ajax/movie_sources/';

function Solar() {
  //Loads html page
  const _fetchHtml = function (url) {
    let res = await (axios.get(url));
    return res.data;
  };

  //Fetch the Homepage url of the movie
  const _fetchHomePage = async(function (url, movie) {
    return axios.get(url).then(resp => {
      let $ = cheerio.load(resp.data);
      let movieHome = {};
      $('.ml-item').children().each((i, elem) => {
        let title = $(elem).attr('title');
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
      });
      return movieHome;
    }).catch(err=>{
      return [];
    });
  });

  //Fetch the Homepage url of the movie
  const _fetchSourcesIds = function (url) {
    return axios.get(url).then(resp => {
      let $ = cheerio.load(resp.data.html);
      let servers = [];
      let lis = $('.pas-list').find('li').each((id, li) => {
        let server = {
          id: $(li).attr('data-id'),
          server: $(li).attr('data-server'),
          title: $(li).find('a').attr('title')
        }
        servers.push(server)
      });
      return servers;
    }).catch(err=>{
      return [];
    });
  };
  const _fetchMovieToken = function (url) {
    return axios.get(url).then(resp => {
      return {
        x: resp.data.match(/\_x=['\"]([^\"']+)/)[1],
        y: resp.data.match(/\_y=['\"]([^\"']+)/)[1]
      };
    }).catch(err=>{
      return '';
    });
  }
  const _fetchMovieSource = function (url) {
    return axios.get(url).then(resp => {
      let sources = [];
      if (resp.data && resp.data.playlist && resp.data.playlist.length > 0) {
        sources = resp.data.playlist[0].sources;
      }
      return sources;
    }).catch(err=>{
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
    getMovieAsync: function (movie, cb) {
      let returnUrls = [];
      return _fetchHomePage(self.base_link + self.search_link + movie.title.replace(/ /g, "+") + ".html", movie).then(moviePage => {
        let dataUrl = self.base_link + self.server_link + moviePage.dataId;
        return _fetchSourcesIds(dataUrl).then(sources => {
          returnUrls = sources.map(source => {
            let tokenUrl = self.base_link + self.token_link + source.id + '&mid=' + moviePage.dataId;
            return _fetchMovieToken(tokenUrl).then(token => {
              let movieSourceUrl = self.base_link + self.source_link + source.id + '?x=' + token.x + '&y=' + token.y;
              return _fetchMovieSource(movieSourceUrl).then(source => {
                return source;
              })
            })
          });
          return _promise_all(returnUrls).then(res => {
            return res;
          });
        });
      });
    },
    getMovie: async(function(movie) {
      let returnUrls = [];
      //Fetchj homepage of movie
      let homePage = await(_fetchHomePage(self.base_link + self.search_link + movie.title.replace(/ /g, "+") + ".html", movie));
      if(!homePage.dataId){
        return returnUrls;
      }
      //Load souces 
      let dataUrl = self.base_link + self.server_link + homePage.dataId;
      let souceServers = await(_fetchSourcesIds(dataUrl));
      if (!souceServers || souceServers.length == 0){
        return returnUrls;
      }
      let mapSourceUrls = souceServers.map(source => {
        let tokenUrl = self.base_link + self.token_link + source.id + '&mid=' + homePage.dataId;
        let movieToken = await(_fetchMovieToken(tokenUrl));
        if (!movieToken){
          return [];
        }
        let movieSourceUrl = self.base_link + self.source_link + source.id + '?x=' + movieToken.x + '&y=' + movieToken.y;
        let movieSource = await(_fetchMovieSource(movieSourceUrl));
        if (_.isEmpty(movieSource)){
          return [];
        }
        return movieSource;
      });
      returnUrls = _.filter(mapSourceUrls, url=>{
        return !_.isEmpty(url);
      });
      return _.flatten(returnUrls);
    })
  }
}

module.exports = Solar;
