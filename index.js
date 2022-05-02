const open = require('open');

var express = require('express'),
    path = require('path'),
    app = express();

const PORT = process.env.PORT || 8080;
app.set('port', PORT);

app.use(express.static('public'));

app.listen(app.get('port'), function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Running on port: ' + app.get('port')); }
    open("http://localhost:"+PORT);
});