var db = require('../leveldb').connect();

// Base superclass that every other model inherits from
function Base(data) {
  this.dateStart = null;
  this.dateEnd = null;
  this.lastEntry = Date.now();
}


Base.prototype = {
  findAll: function(order, cb) {
    var all = [],
        order = "reverse" ? true : false;
    db.createReadStream({
      reverse: order,
      limit: 10,
      gte: this.type + '-!',
      lte: this.type + '~'
    })
      .on('error', function(err) {
        cb(err);
      })
      .on('data', function(data) {
        all.push(data);
      })
      .on('end', function() {
        cb(all);
      });
  },

  save: function(data) {
    db.put(this.type + '-' + this.getDateStart().valueOf(), JSON.stringify(data));
  },

  resetTime: function() {
    this.dateStart = this.dateEnd = null;
  }
}

module.exports = Base;
