const _ = require('underscore');
const Datastore = require('nedb-promise'),
  traktMovieDb = new Datastore({
    filename: './trakt.movies.db',
    autoload: true
  }),
  traktShowDb = new Datastore({
    filename: './trakt.shows.db',
    autoload: true
  }),
  traktUser = new Datastore({
    filename: './trakt.user.db',
    autoload: true
  })

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
    },
    fetchUser: async function(){
      let result = await traktUser.findOne({
        type: 'user'
      });
      return result ? result : {};
    },
    setUser: async function(data){
      let doc = {
        timestamp: new Date(),
        type: 'user'
      };
      doc = _.extend(doc, data);
      let newDoc = await traktUser.insert(doc);
      return newDoc;
    }
  }
}
module.exports = dbService;
