var fs = require('fs');
var path = require('path');
// get uploads directory
var dir = path.resolve(__dirname, '../public/uploads/') + '/';

var Base = require('./base.js');

function Pic(data) {
  Base.call(this, data);
  this.type = 'pic';
}

Pic.prototype = Object.create(Base.prototype);
Pic.prototype.constructor = Pic;

Pic.prototype.findAll = function(order, cb) {
  // get the images and sort them by modified date
  return fs.readdirSync(dir).sort(function(a, b) {
    return fs.statSync(dir + b).mtime.getTime() - fs.statSync(dir + a).mtime.getTime();
  }).slice(0,12);
};

module.exports = Pic;
