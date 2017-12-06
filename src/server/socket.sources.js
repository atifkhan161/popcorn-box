//Import Sources
const sources = require('./addons/addons');
let _ = require('underscore');

async function createSocket(server) {
  var io = require('socket.io')(server);
  io.on('connection', function (socket) {
    // when the client emits 'scrapeMovie', this listens and executes
    socket.on('scrapeMovie', function (movie) {
      let promisUrls = [];
      sources[0].forEach(source => {
        source.getMovie(movie).then(function (srcs) {
          if (srcs && srcs.length > 0) {
            // we tell the client to execute 'scrapeMovie'
            socket.emit('scrapeMovie', {
              movie: movie,
              data: _.flatten(srcs)
            });
          }
        });
      });
    });

    // when the client emits 'scrapeEpisode', this listens and executes
    socket.on('scrapeEpisode', function (show) {
      let promisUrls = [];
      sources[1].forEach(source => {
        source.getEpisode(show).then(function (srcs) {
          if (srcs && srcs.length > 0) {
            // we tell the client to execute 'scrapeEpisode'
            socket.emit('scrapeEpisode', {
              show: show,
              data: _.flatten(srcs)
            });
          }
        });
      });
    });

  });
}
module.exports = createSocket;
