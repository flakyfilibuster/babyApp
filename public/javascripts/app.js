var marsApp = marsApp || {};

marsApp.meals = (function($) {
  'use strict'

  var mealTable = $('table tbody');

  // clickHandler for the mealButton
  $('#timerBtn .btn').on('click', function(e) {
    e.preventDefault();

    var self = $(this);
    self.prop("disabled", true);

    if (self.hasClass("mealStart")) {
      $.ajax({
        type: "GET",
        url: "/meals/start"
      })
      .error(function(err) {
        console.log(err);
        self.prop("disabled", false);
      })
      .done(function(data) {
        // create tr element via $
        var myRow = $(data).addClass("noEnd animated fadeInDown");

        mealTable.find("tr:first").before(myRow);

        self.toggleClass("btn-success mealStart btn-warning mealStop");
        self.text('Stop Meal');
        self.prop("disabled", false);
      });
    } else if (self.hasClass("mealStop")) {
      $.ajax({
        type: "GET",
        url: "/meals/stop"
      })
      .error(function(err) {
        console.log(err);
        self.prop('disabled', false);
      })
      .done(function(data) {
        // create tr element via $
        var myRow = $(data).addClass("animated fadeInUp");

        // find the row with no end time and replace it
        mealTable.find(".noEnd").addClass("animated fadeOutDown")
          .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(item) {
            $(item.target).replaceWith(myRow);
          });
        self.toggleClass("btn-success mealStart btn-warning mealStop");
        self.text('Start Meal');
        self.prop('disabled', false);
      });
    }
  });
})(jQuery);
