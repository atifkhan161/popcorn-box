// module.exports = () => {
  const express = require('express');
  const bodyParser = require('body-parser');
  const path = require('path');
  const http = require('http');
  const app = express();

  // API files
  const api = require('./server/api');
  const yify = require('./server/yify');
  const eztv = require('./server/eztv');
  const scrape = require('./server/scrape.sources');

  // Parsers
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));

  //304 error
  app.disable('etag');

  // Angular DIST output folder
  app.use(express.static(path.join(__dirname, '../dist')));

  // API location
  app.use('/api', api);
  app.use('/yify', yify);
  app.use('/eztv', eztv);
  app.use('/scrape', scrape);

  // Send all other requests to the Angular app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
  app.listen("8787", "localhost");
// }
