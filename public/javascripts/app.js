var mealButton = $('#timerBtn .btn');
var mealTable = document.getElementById('mealTableBody');

// clickHandler for the mealButton
mealButton.on('click', function(e) {
  e.preventDefault();

  var self = $(this);
  self.prop("disabled", true);

  if (self.hasClass("mealStart")) {
    ajax('get','/meals/start', null,
      function success(data) {
        var myRow = document.createElement("tr");
        myRow.classList.add('current')
        myRow.innerHTML = data;
        mealTable.insertBefore(myRow, mealTable.firstChild);
        self.toggleClass("btn-success mealStart btn-warning mealStop");
        self.text('Stop Meal');
        self.prop("disabled", false);
      },
      function error(err) {
        console.log(err);
        self.prop("disabled", false);
    });
  } else if (self.hasClass("mealStop")) {
    ajax('get','/meals/stop', null,
      function success(data) {
        var myRow = document.createElement("tr");
        myRow.innerHTML = data;
        var replaceRow = mealTable.querySelector(".noEnd") || mealTable.querySelector(".current");
        replaceRow.parentNode.replaceChild(myRow, replaceRow)
        self.toggleClass("btn-success mealStart btn-warning mealStop");
        self.text('Start Meal')
        self.prop('disabled', false);
      },
      function error(err) {
        console.log(err);
        self.prop('disabled', false);
    });
  }
});


// ajax utility function
function ajax(method, url, params, cbSuccess, cbError) {
  var xhr = new XMLHttpRequest()
  xhr.open(method, url, true);
  xhr.addEventListener('load', function(e) {
    if(xhr.readyState === 4) {
      if(xhr.status === 200) {
        cbSuccess(xhr.response);
      } else {
        cbError(xhr.response);
      }
      console.log('done');
    }
  });
  xhr.send(params);
};
