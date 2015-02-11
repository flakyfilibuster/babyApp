var express = require('express'),
  mealsRoute = express.Router(),
  Meal = require('../models/meal.js'),
  meal = new Meal();

mealsRoute
.get('/', function (req, res) {
  meal.getTimeSinceLastMeal(function(timeSinceLastMeal) {
    meal.findAll('reverse', function(mealData) {
      res.render('index', {
        title: 'Line babyApp',
        dateStart: meal.dateStart,
        message: 'Meals',
        timeSinceLastMeal: timeSinceLastMeal,
        data: mealData
      });
    })
  });
})


.get('/:status', function(req, res) {
  console.log(req.params);
  if(req.params.status === 'start') {

    var timesOfMeal = {
      dateStart: meal.getDateStart().valueOf(),
      dateEnd: "no end yet",
      total: "..."
    };

    res.render('tr', timesOfMeal);

    meal.save(timesOfMeal);

  } else if(req.params.status === 'stop') {

    var timesOfMeal = {
      dateStart: meal.getDateStart().valueOf(),
      dateEnd: meal.getDateEnd().valueOf(),
      total: meal.calcTimePassed(meal.getDateStart(), meal.getDateEnd()).mins
    };

    res.render('tr', timesOfMeal);

    // save updated time
    meal.save(timesOfMeal);

    //reset both start and end time
    meal.resetTime();
  }
})

module.exports = mealsRoute;
