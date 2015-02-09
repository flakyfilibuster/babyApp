var mealButton = document.querySelector('#timerBtn');
var mealTable = document.getElementById('mealTableBody');

//utility function to toggle multiple classes at once
DOMTokenList.prototype.toggleMany = function() {
  var array = [].slice.call(arguments);
  array.forEach(function(toggleClass) {
    this.toggle(toggleClass);
  }, this)
  return this;
};


// clickHandler for the mealButton
mealButton.addEventListener('click', function(e) {
  e.preventDefault();
  var clickTarget = e.target;
  clickTarget.setAttribute('disabled', true);

  if (clickTarget.className.match(/start/i)) {
    ajax('get','/start', null,
      function success(data) {
        var myRow = document.createElement("tr");
        myRow.classList.add('current')
        myRow.innerHTML = data;
        mealTable.insertBefore(myRow, mealTable.firstChild);
        clickTarget.classList.toggleMany("btn-success","mealStart","btn-warning","mealStop");
        clickTarget.innerHTML = 'Stop Meal'
        clickTarget.removeAttribute('disabled');
      },
      function error(err) {
        console.log(err);
        clickTarget.removeAttribute('disabled');
    });
  } else if (clickTarget.className.match(/stop/i)) {
    ajax('get','/stop', null,
      function success(data) {
        var myRow = document.createElement("tr");
        myRow.innerHTML = data;
        var replaceRow = mealTable.querySelector(".noEnd") || mealTable.querySelector(".current");
        replaceRow.parentNode.replaceChild(myRow, replaceRow)
        clickTarget.classList.toggleMany("btn-success","mealStart","btn-warning","mealStop");
        clickTarget.innerHTML = 'Start Meal'
        clickTarget.removeAttribute('disabled');
      },
      function error(err) {
        console.log(err);
        clickTarget.removeAttribute('disabled');
    });
  }


}, false);


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


// websocket playground
var host = window.document.location.host.replace(/:.*/, '');
var ws = new WebSocket('ws://' + host + ':3000');

ws.addEventListener('message', function(e) {
  if(JSON.parse(e.data).type === "data") {
    console.log('data received');
  }
})
