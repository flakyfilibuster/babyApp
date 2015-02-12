var db = require('../leveldb').connect();

function Base(data) {
  this.dateStart = null;
  this.dateEnd = null;
  this.lastEntry = Date.now();
}


Base.prototype = {
  // in order to calculate the time between entries
  calcTimePassed: function(start, end) {
    var temp = secs = Math.floor((end.valueOf() - start.valueOf()) / 1000),
        hours = Math.floor(secs/3600),
        mins = Math.floor((temp %= 3600) / 60);

    return {hours: hours,
            mins: mins,
            secs: secs};
  },

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

  getTimeSinceLastEntry: function(cb) {
    var self = this;

    db.createValueStream({
      reverse: true, 
      gte: this.type + '-!', 
      lte: this.type + '~',
      limit: 1
    }).on('end', function() {
      cb(
        self.calcTimePassed(
          new Date(self.lastEntry),
          new Date(Date.now())
        )
      );
    }).on('data', function(lastEntry) {
      self.lastEntry = JSON.parse(lastEntry).dateEnd
    });
  },

  getDateStart: function() {
    if(this.dateStart) {
      return this.dateStart;
    } 
    this.dateStart = new Date(Date.now());
    return this.dateStart;
  },

  getDateEnd: function() {
    if(this.dateEnd) {
      return this.dateEnd;
    } 
    this.dateEnd = new Date(Date.now());
    return this.dateEnd;
  },

  save: function(data) {
    db.put(this.type + '-' + this.getDateStart().valueOf(), JSON.stringify(data));
  },

  resetTime: function() {
    this.dateStart = this.dateEnd = null;
  }
}

module.exports = Base;
