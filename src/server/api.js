const express = require('express');
const router = express.Router();
const axios = require('axios');

var clientId = "42ee8abf7aa0c5c2d275a81877a323dafe105b821dec2785f848bd3d9bf7ccb7";
var clientSecret = "37c4043b6481b17fd95f8f7cacec18ad21c907296458cbeabfefc824de8b148d";
var apiUrl = "https://api.trakt.tv";

//axios
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['trakt-api-version'] = 2;
axios.defaults.headers.common['trakt-api-key'] = clientId;
// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
};

// Get movies
router.get('/movies/trending', (req, res) => {
  axios.get(apiUrl + '/movies/trending')
    .then(function (obj) {
      res.send(obj.data);
    })
    .catch(function (error) {
      console.log(error);
      res.send(error);
    });
});

// Get movies
router.get('/device/code', (req, res) => {
  axios.post(apiUrl + '/oauth/device/code', {
      "client_id": clientId
    })
    .then(obj => {
        res.send(obj.data);
    })
    .catch(function (error) {
        sendError(error, res);
    });
});

module.exports = router;
