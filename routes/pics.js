var express = require('express');
var db = require('../leveldb').connect();
var picture = express.Router();
var fs = require('fs');
var path = require('path');

picture
.get('/', function (req, res) {
  // get path for uploaded images
  var dir = path.resolve(__dirname, '../public/uploads/') + '/';

  // get the images and sort them by modified date
  var pictures = fs.readdirSync(dir).sort(function(a, b) {
    return fs.statSync(dir + b).mtime.getTime() - fs.statSync(dir + a).mtime.getTime();
  });

  res.render('pics', {
    title: 'Line babyApp',
    message: 'pictures',
    data: pictures
  });
})

.post('/', function(req, res) {
  res.status(200).send('all ok');
})

module.exports = picture;
