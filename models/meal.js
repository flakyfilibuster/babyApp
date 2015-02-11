var db = require('../leveldb').connect();

function Meal(data) {
  this.dateStart = null;
  this.dateEnd = null;
  this.lastMeal = Date.now();
}


Meal.prototype = {
  // in order to calculate the time between meals
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
      gte: 'meal-!', 
      lte: 'meal~'
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

  getTimeSinceLastMeal: function(cb) {
    var self = this;

    db.createValueStream({
      reverse: true, 
      gte: 'meal-!', 
      lte: 'meal~',
      limit: 1
    }).on('end', function() {
      cb(
        self.calcTimePassed(
          new Date(self.lastMeal),
          new Date(Date.now())
        )
      );
    }).on('data', function(lastMeal) {
      self.lastMeal = JSON.parse(lastMeal).dateEnd
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
    db.put('meal-' + this.getDateStart().valueOf(), JSON.stringify(data));
  },

  resetTime: function() {
    this.dateStart = this.dateEnd = null;
  }
}

module.exports = Meal;
