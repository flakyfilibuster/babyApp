var express = require('express');
var app = express();
var multer  = require('multer');
var db = require('./leveldb').connect();
var WebSocket = require('ws').Server;

app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(multer({ dest: './uploads/'}));
app.set('views', './views');
app.set('view engine', 'jade');

// ROOT ROUTE
app.get('/', function (req, res) {
  res.redirect(301, '/meals');
});

// ROUTES
app.use('/temps', require('./routes/temps.js'));
app.use('/diapers', require('./routes/diapers.js'));
app.use('/meals', require('./routes/meals.js'));

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Listening at http://%s:%s', host, port)
});

