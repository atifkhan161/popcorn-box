let axios = require('axios');
let _ = require('underscore');
// const Promise = require("bluebird");
const cheerio = require('cheerio');

let self = this;
self.base_link = 'https://seriesfree.to';
self.search_link = '/search/';

function seriesfree() {
  //Fetch the Homepage url of the movie
  const _fetchHomePage = async function (url, movie, show) {
    return axios.get(url).then(resp => {
      let $ = cheerio.load(resp.data);
      let movieHome = {};
      $('.infoside').each((i, elem) => {
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
module.exports = seriesfree;
