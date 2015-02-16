var Base = require('./base.js');

function Temp(data) {
  Base.call(this, data);
  this.type = 'temp';
}

Temp.prototype = Object.create(Base.prototype);
Temp.prototype.constructor = Temp;

module.exports = Temp;
