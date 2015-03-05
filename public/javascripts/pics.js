function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#picPrev').attr('src', e.target.result);
      $('#picPrev').removeClass('hidden');
      $('#picUpload').removeClass('hidden');
    }

    reader.readAsDataURL(input.files[0]);
  }
}

$("#picInput").change(function(){
  readURL(this);
});

$("#picForm").submit(function(e) {
  e.preventDefault()

  $.ajax({
    type: "POST",
    url: "/pics",
    processData: false,
    contentType: false,
    data: new FormData($("#picForm")[0])
  }).success(function() {
    $('#picPrev').addClass('hidden');
    $('#picUpload').addClass('hidden');
  })
});
