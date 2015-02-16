var marsApp = marsApp || {};

marsApp.diapers = (function($) {
  'use strict'

  // post formData with the type of diaper
  $('.diaperForm').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/diapers",
      processData: false,
      contentType: false,
      data: new FormData(this)
    })
    .done(function(data) {
      // when all went well through the new row in the table
      $('table tbody').find("tr:first").before($(data));
    });
  })
})(jQuery);
