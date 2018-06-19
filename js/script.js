$(window).on('load', function () {
    var shouldLoadData = false;
    var $progressBar = $('#progress-bar');
    var $progressBarMessage = $('div.progress-message');
    var $ajaxLoader = $('.ajax-load');
    var msgSteps = 0;
    var duration = 30000;
    var stepDuration = (duration / $progressBarMessage.length) + 1000;
    var searchData = {};

    function resetProgressBar() {
      msgSteps = 0;
      $($progressBar).css('width', '0%');
      $('#show-data').hide();
      $('.table tbody').html('');
      $('#progress-bar-container').show();
    }

    function initProgressBar() {
      resetProgressBar();
      var barProgress = $($progressBar).animate({ width: '100%' }, {
        duration,
        progress(animation, progress) {
          var progression = Math.ceil(progress * 100);
          $($progressBar).html(progression + '%');
          // console.log(progression + " " + progress);
        },
      });
      showStepMessages();
      $.when(barProgress).done(() => {
        window.setTimeout(function() {
          $('#progress-bar-container').hide();
          $('#show-data').show();
        }, 3000);
      });
    }

    function showStepMessages() {
      console.log('Step duration: ' + stepDuration);
      if (msgSteps < $progressBarMessage.length) {
        $progressBarMessage.eq(msgSteps).show();
        window.setTimeout(function() {
          $progressBarMessage.eq(msgSteps).hide();
          msgSteps++;
          showStepMessages();
        }, stepDuration);
      }
    }

    function pageScroller() {
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
    }

    function showPageLoader() {
      $ajaxLoader.show();
      window.setTimeout(function() {
        $ajaxLoader.hide();
        loadMoreData();
        shouldLoadData = true;
      }, 5000);
    }

    function getSearchUrl(searchedData) {
      var searchQuery = '';
      var baseUrl = 'https://data.cityofnewyork.us/resource/aiza-48ch.json?$limit=100&$offset=0';
      var appID = (searchedData.appId ? searchedData.appId : '');
      var businessName = searchedData.businessName ? encodeURI(searchedData.businessName) : '';
      var cityName = searchedData.cityName ? encodeURI(searchedData.cityName) : '';
      
      if (appID) {
        searchQuery += '&application_id=' + appID.toString();
      }

      if (businessName) {
        searchQuery += '&business_name=' + businessName;
      }

      if (cityName) {
        searchQuery += '&city=' + cityName;
      }

      var url = baseUrl + searchQuery;
      return url;
    };

    function getSearchedData(searchedData) {
      var xhrData = $.ajax({
        url: getSearchUrl(searchedData),
        dataType: 'json',
        // jsonpCallback: 'parseResults',
        statusCode: {
          503: function () {
            console.log('Status 503');
          }
        }
      });
      excessResults = false;
      return $.when(xhrData)
        .then(function(xhrResult) {
          console.log('Ajax Data: ' + xhrResult);
          searchData.response = xhrResult;
          $.each(xhrResult, function(key, row) {
            console.log('Ajax Each: ' + row.application_id);
            createRowData(row);
          });
          // After the fetching and calculation is done
          // Start the progress bar
          // startTheProgressBar();
          return teaserDataObj;
        });
    }

    function createRowData(row) {
      console.log('loadMoreData');
      var appendData = '<tr>'
                          + '<td class="hidden-xs">'+row.application_id+'</td>'
                          + '<td class="hidden-xs">'+row.application_category+'</td>'
                          + '<td class="hidden-xs">'+row.business_name+'</td>'
                          + '<td class="hidden-xs">'+row.application_or_renewal+'</td>'
                          + '<td class="hidden-xs">'+(row.license_number?row.license_number:'N/A')+'</td>'
                          + '<td class="hidden-xs">'+row.city+'</td>'
                          + '<td class="hidden-xs">'+row.status+'</td>'
                              + '<td class="visible-xs table-mob col-xs-12">'
                                + '<h2>'+row.application_id+'</h2>'
                                + '<h4><i class="fa fa-user-o" aria-hidden="true"></i>'+row.application_category+'</h4>'
                                + '<p><i class="fa fa-phone" aria-hidden="true"></i>'+row.business_name+'</p>'
                                + '<p><i class="fa fa-envelope-o" aria-hidden="true"></i>'+row.application_or_renewal+'</p>'
                                + '<p><i class="fa fa-envelope-o" aria-hidden="true"></i>'+(row.license_number?row.license_number:'N/A')+'</p>'
                                + '<p><i class="fa fa-map-marker" aria-hidden="true"></i>'+row.city+'</p>'
                                + '<p><i class="fa fa-address-card-o" aria-hidden="true"></i>'+row.status+'</p>'
                              + '</td>'
                        + '</tr>';
      $('.table tbody').append(appendData);
    }

    function filterSearchCallback(e) {
      e.preventDefault();
      searchData.appId = $('#txt_app_id').val().trim();
      searchData.businessName = $('#txt_business_name').val().trim();
      searchData.cityName = $('#txt_city_name').val().trim();
      // var cityHasLetters = /[a-z]+/i.test(searchData.cityName);
      getSearchedData(searchData);
      initProgressBar();
      // pageScroller();
    }

    function addEvents() {
      $('#filter-search').on('click', filterSearchCallback);

      /* Preloader */
      $('#preloader').delay(550).fadeOut('slow');

      /* Scroll Top */
      $('.jumper').on('click', function(e) {
        e.preventDefault();
        $('body, html').animate({
          scrollTop: $($(this).attr('href')).offset().top
        }, 1000);
      });
    }

    function init() {
      addEvents();
    }

    init();
});
