var express = require('express');
var db = require('../leveldb').connect();
var diaper = express.Router();

function findAll(input, order, cbSuccess, cbError) {
  var result = [],
      order = "reverse" ? true : false;
  db.createReadStream({reverse: order, gte: input+'!', lte: input+'~'})
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

diaper
.get('/', function (req, res) {
  findAll('diaper-', 'reverse', function(diapers) {
    res.render('diaper', {
      title: 'Line babyApp',
      message: 'Diapers',
      data: diapers
    });
  })
})
.post('/', function(req, res) {
  var diaperTime = new Date(Date.now());

  var diaperInfo  = {
    diaperTime : diaperTime.valueOf(),
    type: req.body.form
  };

  res.render('diaperTr', diaperInfo);

  db.put('diaper-' + diaperTime.valueOf(), JSON.stringify(diaperInfo));
})

module.exports = diaper;
