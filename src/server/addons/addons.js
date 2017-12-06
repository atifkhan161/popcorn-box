const Solar = require('./solar.moviez');
const yMovies = require('./ymovies');
const cartoonHd =  require('./cartoonhd');
const afdah = require('./afdah');

const sources = [
  movieSources = [
    Solar(),
    yMovies(),
    cartoonHd(),
    afdah()
  ],
  showSources = [
    Solar(),
    yMovies(),
    cartoonHd()
  ]
]

module.exports = sources;
