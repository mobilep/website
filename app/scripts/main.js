$(document).ready(() => {
  $('.header__btn').click(clickHeaderBtn);

  var $scrollStatus = $('.scroll-status');

  let top = 70;
  if ($('body').width() > 767) {
    top = 90;
  }

  $('.header__nav').navScroll({
    mobileDropdown: true,
    mobileBreakpoint: 768,
    scrollSpy: true,
    navHeight: top,
    onScrollStart: () => {
      $scrollStatus.show();
      $scrollStatus.text('Started scrolling');
    },
    onScrollEnd: () => {
      $scrollStatus.text('Scrolling ended');
      setTimeout(() => {
        $scrollStatus.fadeOut(200);
      }, 1000);
    }
  });

  $('.header__nav').on('click', '.header__a', (e) => {
    e.preventDefault();
    $('.header__nav ul').slideToggle('fast');
    $(e.target).closest('body').removeClass('header__btn_active');
    $(e.target).closest('body').find('.header__btn').toggleClass('header__btn_active');
  });

});

$(window).on('load resize scroll', () => {
  headerSticky();
});


function clickHeaderBtn() {
  $(this).toggleClass('header__btn_active');
  $(this).closest('body').toggleClass('header__btn_active');
}

function headerSticky() {
  const sticky = $('.header');
  const scroll = $(window).scrollTop();
  if (scroll >= 1) {
    sticky.addClass('header_fixed');
  } else {
    sticky.removeClass('header_fixed');
  }
}
