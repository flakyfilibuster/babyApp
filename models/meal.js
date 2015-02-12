var Base = require('./base.js');

function Meal(data) {
  Base.call(this, data);
  this.type = 'meal';
}

Meal.prototype = Object.create(Base.prototype);
Meal.prototype.constructor = Meal;

module.exports = Meal;
