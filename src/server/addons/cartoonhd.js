let axios = require('axios');
let _ = require('underscore');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

let self = this;
self.base_link = 'https://cartoonhd.life';
self.movie_link = '/full-movie/';
self.show_link = '/show/';
self.ajax_link = 'https://cartoonhd.life/ajax/vsozrflxcw.php';

function cartoonHd() {
  //Fetch the Homepage url of the movie
  const _fetchHomePage = async function (url, movie, show) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let sources = {};
    page.on('response', async response => {
      if (response.url == self.ajax_link) {
        return response.json().then(data => {
          // browser.close();
          sources = data;
          return data;
        }).catch(err => {
          browser.close();
          return {};
        })
      }
    });
    await page.goto(url, {
      waitUntil: 'networkidle2'
    });
    return sources;
  }
  const _fetchSourcesIds = async function (dataObj) {
    let files = _.map(dataObj, data => {
      let src = {};
      let $ = cheerio.load(data.embed);      
      src.file = $('iframe').attr('src');
      src.type = data.type;
      src.embed = true;
      src.provider = "Cartoon Hd";
      return src;
    });
    return files;
  }
  return {
    getMovie: async function (movie) {
      let returnUrls = [];
      //Fetch homepage of movie
      let homePage = await _fetchHomePage(self.base_link + self.movie_link + movie.title.toLowerCase().replace(/ /g, "-") , movie, null);
      if (!homePage) {
        return returnUrls;
      }
      //Load souces 
      returnUrls = await _fetchSourcesIds(homePage);
      return returnUrls;
    },
    getEpisode: async function (show) {
      let returnUrls = [];
      //Fetch homepage of movie
      let homePage = await _fetchHomePage(self.base_link + self.show_link + show.title.toLowerCase().replace(/ /g, "-") + '/season/' + show.episode.season + '/episode/' + show.episode.number, null, show);
      if (!homePage) {
        return returnUrls;
      }
      //Load souces 
      returnUrls = await _fetchSourcesIds(homePage);
      return returnUrls;
    }
  }
}
module.exports = cartoonHd;
