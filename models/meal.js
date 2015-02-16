var db = require('../leveldb').connect();
var Base = require('./base.js');

// set up Meal subclass
function Meal(data) {
  Base.call(this, data);
  this.type = 'meal';
}

Meal.prototype = Object.create(Base.prototype);
Meal.prototype.constructor = Meal;

// define Meal specific methods
Meal.prototype.calcTimePassed = function(start, end) {
  var temp = secs = Math.floor((end.valueOf() - start.valueOf()) / 1000),
      hours = Math.floor(secs/3600),
      mins = Math.floor((temp %= 3600) / 60);

  return {hours: hours,
          mins: mins,
          secs: secs};
};

Meal.prototype.getTimeSinceLastEntry = function(cb) {
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
};

Meal.prototype.getDateStart = function() {
  if(this.dateStart) {
    return this.dateStart;
  }
  this.dateStart = new Date(Date.now());
  return this.dateStart;
};

Meal.prototype.getDateEnd = function() {
  if(this.dateEnd) {
    return this.dateEnd;
  }
  this.dateEnd = new Date(Date.now());
  return this.dateEnd;
};


module.exports = Meal;
