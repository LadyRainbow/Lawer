$(document).ready(function () {

    var $openB2bPopUp = $('.open-b2b-pop-up');
    var $openB2cPopUp = $('.open-b2c-pop-up');
    var $generalPopUp = $('.pop-up-overlay-wrapper');
    var $tableB2b = $('.pop-up-table-b2b');
    var $tableB2c = $('.pop-up-table-b2c');
    var $closePopUpBtn = $('.pop-up-close-btn');
    //
    // function openTHNX () {
    //     $popUpForm.fadeOut();
    //     $popUpFormOrder.fadeOut();
    //     $popUpWRP.fadeIn();
    //     $popuUpTHNX.fadeIn();
    // };
    //
    // // $('.btn-send').click(openTHNX);
    //
    $openB2bPopUp.click(function () {
        $generalPopUp.fadeIn();
        $tableB2b.fadeIn();
    });
    $openB2cPopUp.click(function () {
        $generalPopUp.fadeIn();
        $tableB2c.fadeIn();
    });
    //
    //
    $(document).mouseup(function (e){ // событие клика по веб-документу
		var $table = $(".pop-up-table"); // тут указываем ID элемента
		if (!$table.is(e.target) // если клик был не по нашему блоку
		    && $table.has(e.target).length === 0) { // и не по его дочерним элементам
                $generalPopUp.fadeOut();
                $table.fadeOut(); // скрываем его
		}
	});

    $closePopUpBtn.click(function () {
        $generalPopUp.fadeOut();
        $tableB2b.fadeOut();
        $tableB2c.fadeOut();
    });

   //  $(window).scroll(function() {
   // if ($(this).scrollTop() >= $(window).height()) {
   //     $('.main-screen').css("height", '150vh');
   //   }
   //   else{
   //     $('.main-screen').css("height", '100vh');
   //   }
   // });




    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    // We listen to the resize event
    // window.addEventListener('resize', () => {
    //   // We execute the same script as before
    //   let vh = window.innerHeight * 0.01;
    //   document.documentElement.style.setProperty('--vh', `${vh}px`);
    // });


    // soft scroll to block
    $(".scrollTo").on("click", function (event) {
        // исключаем стандартную реакцию браузера
        event.preventDefault();
        // получем идентификатор блока из атрибута href
        var id  = $(this).attr('href'),
        // находим высоту, на которой расположен блок
            top = $(id).offset().top;
        // анимируем переход к блоку, время: 800 мс
        $('body,html').animate({scrollTop: top}, 500);
    });

    $('#backToTop').click(function(){
        // исключаем стандартную реакцию браузера
        event.preventDefault();
        // получем идентификатор блока из атрибута href
        var id  = $(this).attr('href');
        // находим высоту, на которой расположен блок
        if ($(window).width() > 991) {
            var top = $(id).offset().top - 125;
        } else {
            var top = $(id).offset().top - 50;
        };
        // анимируем переход к блоку, время: 800 мс
        $('body,html').animate({scrollTop: top}, 500);
  });

    // SLIDER
    $('.eightth-slider').slick({
          // centerMode: true,
          dots: true,
          // centerPadding: '22%',
          slidesToShow: 2,
          prevArrow: $('.prev-arrow'),
          nextArrow: $('.next-arrow'),
          responsive: [
            {
              breakpoint: 1199,
              settings: {
                // arrows: false,
                // centerMode: true,
                // centerPadding: '14%',
                slidesToShow: 3
              }
            },
            {
              breakpoint: 769,
              settings: {
                // arrows: false,
                // centerMode: true,
                // centerPadding: '14%',
                slidesToShow: 2
              }
            },
            {
              breakpoint: 590,
              settings: {
                // arrows: false,
                // centerMode: true,
                // centerPadding: '13%',
                slidesToShow: 1
              }
            }
          ]
      });

    $('.b2c-slider').slick({
          dots: true,
          // centerPadding: '22%',
          slidesToShow: 3,
          prevArrow: $('.prev-arrow-b2c'),
          nextArrow: $('.next-arrow-b2c'),
          responsive: [
            {
              breakpoint: 1199,
              settings: {
                // arrows: false,
                // centerMode: true,
                // centerPadding: '14%',
                slidesToShow: 2
              }
            },
            {
              breakpoint: 991,
              settings: {
                // arrows: false,
                // centerMode: true,
                // centerPadding: '14%',
                slidesToShow: 1
              }
            },
          ]
      });

      // set slider height on main
      function setHeiHeight() {
          var slidePaddingBottom = 50;
          var slideProcentgBottom = ($('.slide').height() * 16) / 100;
          var amountHeight = $('.eightth-slider-decor-wrp').outerHeight() + 9 - slidePaddingBottom - slideProcentgBottom;
            $('.eightth-screen-content').css({
                height: amountHeight + 'px'
            });
            $('.eightth-screen').css({
                'padding-bottom': slideProcentgBottom + slidePaddingBottom + 'px'
            });
        };
        if($('main').length && $(window).width() > 1199) {
            setHeiHeight(); // устанавливаем высоту окна при первой загрузке страницы
            $(window).resize( setHeiHeight ); // обновляем при изменении размеров окна
        };
        // set slider height on main END

        var phoneMobBtn = $('.phone-mob-btn');

        // open/close phone block
        $('.phone-mob-btn').click(function () {
            $('.header-mobile-bottom').toggleClass('open');
        });

        $(document).mouseup(function (e){ // событие клика по веб-документу
            var div = $('.header-mob-phone-number'); // тут указываем ID элемента
            if (!div.is(e.target) && !phoneMobBtn.is(e.target)// если клик был не по нашему блоку
                && div.has(e.target).length === 0 && phoneMobBtn.has(e.target).length === 0) { // и не по его дочерним элементам
              $('.header-mobile-bottom').removeClass('open'); // скрываем его
            }
        });








        $('.burger-btn').click(function () {
          if($(this).hasClass('burger-btn-close')) {
              $('.menu-mob-list-wrp').removeClass('open');
              setTimeout(function () {
                  $('body').removeClass('overflow-hidden');
                  $('.burger-btn').removeClass('burger-btn-close');
                  $('.menu-mob-overlay-wrp').fadeOut();
              }, 200);

          } else {
              $('body').addClass('overflow-hidden');
              $('.burger-btn').addClass('burger-btn-close');
              $('.menu-mob-overlay-wrp').fadeIn();
              setTimeout(function () {
                  $('.menu-mob-list-wrp').addClass('open');
              }, 200);
          }
      });

      $(function(){
          $("[data-tooltip]").mousemove(function (eventObject) {
              $data_tooltip = $(this).attr("data-tooltip");
              if ($(window).width() > 960) {
                  $("#tooltip").html($data_tooltip)
                      .css({
                        "top" : eventObject.pageY + 5,
                        "left" : eventObject.pageX - 325
                      })
                      .show();
              } else {
                  $("#tooltip").html($data_tooltip)
                      .css({
                        "top" : eventObject.pageY + 5,
                        "left" : 20
                      })
                      .show();
              };

              }).mouseout(function () {
                $("#tooltip").hide()
                  .html("")
                  .css({
                      "top" : 0,
                      "left" : 0
                  });
          });
    });



});
