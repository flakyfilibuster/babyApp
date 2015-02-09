var express = require('express');
var levelup = require('levelup');
var db = levelup('./mydb');
var temp = express.Router();

function findAll(input, order, cbSuccess, cbError) {
  var result = [],
      re = new RegExp(input);
      order = "reverse" ? true : false;
  db.createReadStream({reverse: order})
    .on('error', function() {
      cbError();
    })
    .on('data', function(data) {
      if(data.key.match(re)) {
        result.push(data);
      }
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
