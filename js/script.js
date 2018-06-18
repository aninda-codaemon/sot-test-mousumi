$(window).on('load', function () {
    var shouldLoadData = false;
    var $progressBar = $('#progress-bar');
    var $progressBarMessage = $('div.progress-message');
    var $ajaxLoader = $('.ajax-load');
    var msgSteps = 0;
    var duration = 30000;
    var stepDuration = duration / $progressBarMessage.length + 2;

    /* Preloader */
    $('#preloader').delay(550).fadeOut('slow');

    /* Scroll Top */
    $('.jumper').on('click', function(e) {
      e.preventDefault();
      $('body, html').animate({
        scrollTop: $($(this).attr('href')).offset().top
      }, 1000);
    });

    function initProgressBar() {
      var initialProgress = $($progressBar).animate({ width: '100%' }, {
        duration,
        progress(animation, progress) {
          var progression = Math.ceil(progress * 100);
          $($progressBar).html(progression + '%');
          console.log(progression + " " + progress);
        },
      });
      showStepMessages();
      $.when(initialProgress).done(() => {
        window.setTimeout(function() {
          $('#progress-bar-container').hide();
          $('#show-data').removeClass('hidden');
        }, 3000);
      });
    }

    function showStepMessages() {
      if (msgSteps < $progressBarMessage.length) {
        $progressBarMessage.eq(msgSteps).show();
        window.setTimeout(function() {
          $progressBarMessage.eq(msgSteps).hide();
          msgSteps++;
          showStepMessages();
        }, stepDuration);
      }
    }

    $(window).scroll(function() {
      // if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
      // if ($('#show-data').height() >= $('.table-responsive').height()) {

      if ($('#show-data').is(':visible')) {
        shouldLoadData = true;
        if (shouldLoadData) {
          if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
            shouldLoadData = false;
            console.log('Scrolling: ' + ($(window).scrollTop() + $(window).height()) + ' ' + $(document).height());
            console.log('shouldLoadData outside: ' + shouldLoadData);
            console.log('shouldLoadData inside: ' + shouldLoadData);
            // var last_id = $(".post-id:last").attr("id");
            // loadMoreData(last_id);
            showPageLoader();
          }
        }
      }
    });

    function showPageLoader() {
      $ajaxLoader.show();
      window.setTimeout(function() {
        $ajaxLoader.hide();
        loadMoreData();
        shouldLoadData = true;
      }, 5000);
    }

    function loadMoreData() {
      console.log('loadMoreData');
      var appendData = '<tr>'
                          + '<td>1</td>'
                          + '<td>Mark</td>'
                          + '<td>Otto</td>'
                          + '<td>@mdo</td>'
                          + '<td>a@mdo.com</td>'
                          + '<td></td>'
                        + '</tr>'
                        + '<tr>'
                          + '<td>2</td>'
                          + '<td>Jacob</td>'
                          + '<td>Thornton</td>'
                          + '<td>@fat</td>'
                          + '<td>b@fat.com</td>'
                          + '<td></td>'
                        + '</tr>'
                        + '<tr>'
                          + '<td>3</td>'
                          + '<td colspan="2">Larry the Bird</td>'
                          + '<td>@twitter</td>'
                          + '<td>c@twitter.com</td>'
                          + '<td></td>'
                        + '</tr>';
      $('.table tbody').append(appendData);
    }

    $('#filter-search').on('click', function(e) {
      e.preventDefault();
      initProgressBar();      
    });
});

/* Team */
(function(){
    // $('#team-members').owlCarousel({
    //     items: 2,
    //     autoplay: true,
    //     smartSpeed: 700,
    //     loop: true,
    //     autoplayHoverPause: true,
    //     nav: true,
    //     navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
    //     dots: false,
    // });
})();
