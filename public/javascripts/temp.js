var tempForm = document.querySelector(".tempForm")
var tempTable = document.getElementById('tempTableBody');

tempForm.addEventListener('submit', function(e) {
  var tempInfo = new FormData(tempForm);
  e.preventDefault();
  ajax('post', '/temp', tempInfo, function success(data) {
    var myRow = document.createElement("tr");
    myRow.innerHTML = data;
    tempTable.insertBefore(myRow, tempTable.firstChild);
  }, function error(err) {
    console.log(err);
  });
})

tempForm.addEventListener('input', function(e) {
  tempForm.tmpBtn.innerHTML = tempForm.temp.value + " C";
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
