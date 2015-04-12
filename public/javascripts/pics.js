function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#picPrev').attr('src', e.target.result);
      $('.jumbotron.starter-template').animate(
        {"height" : "260px"}, function() {
          $('#picPrev').removeClass('hidden').addClass('animated fadeInDown');
          $('#picUpload').removeClass('hidden').addClass('animated fadeInRight');
          $('.btn-default.btn-file').addClass('animated fadeInLeft');
        }
      );
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
  }).done(function() {
    $('#picPrev').addClass('fadeOutUp')
      .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(item) {
        $(item.target)
          .addClass('hidden')
          .removeClass('animated fadeInDown fadeOutUp')
          .attr('src', '');
      });
    $('#picUpload').addClass('fadeOutRight')
      .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(item) {
        $(item.target).addClass('hidden').removeClass('animated fadeInRight fadeOutRight');
        $('.jumbotron.starter-template').animate({"height" : "100px"});
      });
  })
});
