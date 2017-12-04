const Solar = require('./solar.moviez');
const yMovies = require('./ymovies');
const cartoonHd =  require('./cartoonhd');

const sources = [
  movieSources = [
    Solar(),
    yMovies(),
    cartoonHd()
  ],
  showSources = [
    Solar(),
    yMovies(),
    cartoonHd()
  ]
]

module.exports = sources;
