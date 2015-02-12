var Base = require('./base.js');

function Diaper(data) {
  Base.call(this, data);
  this.type = 'diaper';
}

Diaper.prototype = Object.create(Base.prototype);
Diaper.prototype.constructor = Diaper;

module.exports = Diaper;
