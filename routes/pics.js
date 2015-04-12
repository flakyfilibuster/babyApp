var express = require('express'),
  db = require('../leveldb').connect(),
  picsRoute = express.Router(),
  Pic = require('../models/pic.js'),
  pic = new Pic();

picsRoute
.get('/', function (req, res) {
  var pictures = pic.findAll();

  res.render('pics', {
    title: 'Line babyApp',
    message: 'Pics',
    data: pictures
  });
})

.post('/', function(req, res) {
  res.status(200).send('all ok');
});

module.exports = picsRoute;
