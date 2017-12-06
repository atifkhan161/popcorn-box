let axios = require('axios');
let _ = require('underscore');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

let self = this;
self.base_link = 'https://afdah.to';
self.movie_link = '/full-movie/';
self.show_link = '/show/';
self.ajax_link = 'http://afdah.to/wp-content/themes/afdah/ajax-search2.php';

function afdah() {
  //Fetch the Homepage url of the movie
  const _fetchHomePage = async function (url, movie, show) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let rslSrc;
    let srcPromise = new Promise((resolve, reject) => {
      rslSrc = resolve;
    });
    let source = "";
    page.on('response', async response => {
      if (response.url == self.ajax_link || _.contains(response.url, 'ajax-search')) {
          response.text().then(data => {
            let $ = cheerio.load(data);
            source = $('li').find('a').attr('href');
            browser.close();            
            rslSrc(source);
          }).catch(err => {
            browser.close();
            rslSrc('');
          });
      }
    });
    
    await page.goto(url);
    await page.focus('.searchinput');
    await page.keyboard.type(movie.title, {waitUntil: 'networkidle'});
    // browser.close();
    return srcPromise; 
  }
  const _fetchSourcesIds = async function (homepageUrl) {
    return axios.get(homepageUrl).then(resp => {
      let $ = cheerio.load(resp.data);
      let movieHome = [];
      $('.tabContent').find('a').each((i, elem) => {
        let title = $(elem).attr('href');
        if (title.indexOf('/embed') != -1) {
          let src = {};
          src.file = title;
          src.type = 'afdah';
          src.embed = true;
          src.provider = "afdah";
          movieHome.push(src);
        }
      });
      return movieHome;
    }).catch(err => {
      return [];
    });
  }
  return {
    getMovie: async function (movie) {
      let returnUrls = [];
      //Fetch homepage of movie
      let homePage = await _fetchHomePage(self.base_link, movie, null);
      if (!homePage) {
        return returnUrls;
      }
      //Load souces 
      returnUrls = await _fetchSourcesIds(self.base_link + homePage);
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
module.exports = afdah;
