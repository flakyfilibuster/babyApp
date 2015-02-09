var diaperForm = document.querySelector(".diaperForm")
var diaperTable = document.getElementById('diaperTableBody');

diaperForm.addEventListener('submit', function(e) {
  var diaperInfo = new FormData(diaperForm);
  e.preventDefault();
  ajax('post', '/addDiaper', diaperInfo, function success(data) {
    var myRow = document.createElement("tr");
    myRow.innerHTML = data;
    diaperTable.insertBefore(myRow, diaperTable.firstChild);
  }, function error(err) {
    console.log(err);
  });
})


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
