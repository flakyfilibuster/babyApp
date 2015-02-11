var express = require('express');
var db = require('../leveldb').connect();
var temp = express.Router();

function findAll(namespace, order, cbSuccess, cbError) {
  var result = [],
      order = "reverse" ? true : false;
  db.createReadStream({
    reverse: order, 
    gte: namespace+'!', 
    lte: namespace+'~'
  })
    .on('error', function() {
      cbError();
    })
    .on('data', function(data) {
        result.push(data);
    })
    .on('end', function() {
      cbSuccess(result);
    });
}

temp
.get('/', function(req, res) {
  findAll('temp-', 'reverse', function(temps) {
    res.render('temp', {
      title: 'Line babyApp',
      message: 'Temperature',
      data: temps
    });
  });
})
.post('/', function(req, res) {
  var tempTime = new Date(Date.now());

  var tempInfo  = {
    tempTime : tempTime.valueOf(),
    degree: req.body.temp
  };

  res.render('tempTr', tempInfo);

  db.put('temp-' + tempTime.valueOf(), JSON.stringify(tempInfo));
});

module.exports = temp;
