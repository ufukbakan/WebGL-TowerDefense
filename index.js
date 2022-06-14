const open = require('open');
const { prcTimeout } = require('precision-timeout-interval');
const NODE_ENV = process.env["NODE_ENV"];

var express = require('express'),
  path = require('path'),
  app = express();

const PORT = process.env.PORT || 8080;
app.set('port', PORT);

app.use(express.static('public'));

let server = app.listen(app.get('port'), function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Running on port: ' + app.get('port'));
  }
  if (NODE_ENV != "test") {
    open("http://localhost:" + PORT);
  }
});

module.exports = server;