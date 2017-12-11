//Import Sources
const sources = require('./addons/addons');
let _ = require('underscore');
let axios = require('axios');
let clientId = "42ee8abf7aa0c5c2d275a81877a323dafe105b821dec2785f848bd3d9bf7ccb7";
let clientSecret = "37c4043b6481b17fd95f8f7cacec18ad21c907296458cbeabfefc824de8b148d";
const dbService = require('./db/db.service')();

async function createSocket(server, app) {
  let io = require('socket.io')(server);
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

    // when the client emits 'traktAuthenticated', this listens and executes
    socket.on('traktAuthenticated', function (data) {
      let task_is_running = false;
      let expiresIn = data.expires_in;
      let refreshIntervalId = setInterval(function(){
        expiresIn = expiresIn - 10;
          if(expiresIn > 0 && !task_is_running){
              task_is_running = true;
              axios.post("https://api.trakt.tv/oauth/device/token", {
                "code": data.device_code,
                "client_id": clientId,
                "client_secret": clientSecret
              })
              .then(function (req) {
                task_is_running = false;
                if (req.status == 200){
                  expiresIn = 0;
                  dbService.setUser(req.data);
                  socket.emit('traktAuthenticated',{ authenticated : true});
                  axios.defaults.headers.common['Authorization'] = "Bearer " + req.data.access_token;   
                  app.set('user', req.data);
                  clearInterval(refreshIntervalId);              
                }            
              })
              .catch(function (error) {
                task_is_running = false;
              });
          }
      }, 10000);        
    });

  });
}
module.exports = createSocket;
