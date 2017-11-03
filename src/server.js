// exports.createServer = function (app, ipcServer) {
//   const server = ipcServer.createServer(app);

//   server.get('/oauth/device/code', (req, res) => {
//     // create user, then...
//     console.log('api /oauth/device/code');
//     res.status(200).send(`AAQPZ546c`)
//   })
// };
exports.createExpressServer = function (app) {
  var express = require('express')
  var expressApp = express();
  // sets port 8080 to default or unless otherwise specified in the environment
  app.set('port', process.env.PORT || 8787);
  console.log('Express started on port :8989');
  // respond with "hello world" when a GET request is made to the homepage
  expressApp.get('/movies/trending', function (req, res) {
    var movies = {
      data: "Lion king"
    };
    res.send(movies);
  });
};
