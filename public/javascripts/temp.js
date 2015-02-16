var marsApp = marsApp || {};

marsApp.temps = (function($) {
  'use strict'

  var tempForm = $(".tempForm");

  tempForm.on('submit', function(e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: "/temps",
      processData: false,
      contentType: false,
      data: new FormData(this)
    })
    .done(function(data) {
      // when all went well through the new row in the table
      $('table tbody').find("tr:first")
        .before($(data).hide()
                .show('slow'));
      tempForm.find('.btn').text('submit');
      tempForm.find('.temp').val(38);
    });
  })

  tempForm.on('input', function(e) {
    tempForm.find('.btn').text(tempForm.find('.temp').val() + " C ");
  });

})(jQuery);
