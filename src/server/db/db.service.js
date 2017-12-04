const Datastore = require('nedb-promise'),
  traktMovieDb = new Datastore({
    filename: './trakt.movies.db',
    autoload: true
  }),
  traktShowDb = new Datastore({
    filename: './trakt.shows.db',
    autoload: true
  });

function dbService() {
  return {
    updateMovies: async function (movies, listType, page) {
      let doc = {
        timestamp: new Date(),
        page: page ? page : 1,
        listType: listType,
        data: movies
      };
      let newDoc = await traktMovieDb.insert(doc);
      return newDoc;
    },
    fetchMovies: async function (listType, page) {
      let result = await traktMovieDb.findOne({
        listType: listType,
        page: page ? page : 1
      });
      return result ? result : {
        data: []
      };
    },
    updateShows: async function (movies, listType, page) {
      let doc = {
        timestamp: new Date(),
        page: page ? page : 1,
        listType: listType,
        data: movies
      };
      let newDoc = await traktShowDb.insert(doc);
      return newDoc;
    },
    fetchShows: async function (listType, page) {
      let result = await traktShowDb.findOne({
        listType: listType,
        page: page ? page : 1
      });
      return result ? result : {
        data: []
      };
    }
  }
}
module.exports = dbService;
