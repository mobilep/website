$(document).ready(() => {
  $('a').click(clickA);
  $('.header__btn').click(clickHeaderBtn);
});

$(window).on('load resize scroll', function() {
  headerSticky();
});


function clickHeaderBtn() {
  $(this).toggleClass('header__btn_active');
  $(this).closest('body').toggleClass('header__btn_active');
}

function clickA(event) {
  const link = event.currentTarget.getAttribute('href');
  if(link.length > 1 && link.indexOf('#') === 0) {
    event.preventDefault();
    event.stopPropagation();

    navbar($(this));

    const section = document.querySelector(link);
    if(section) {
      let top = 70;
      if($(section).closest('body').width() > 767) {
        top = 90;
      }
      $('html, body').animate({
        scrollTop: $(link).offset().top - top
      }, 500);
      window.location.hash = link;
      return false;
    }
  }
}

function navbar(active) {
  if(active.hasClass('header__a')) {
    active.closest('li').addClass('header__li_active').siblings('li').removeClass('header__li_active');
    active.closest('body').removeClass('header__btn_active');
    active.closest('body').find('.header__btn').toggleClass('header__btn_active');
  }
}

function headerSticky() {
  const sticky = $('.header');
  const scroll = $(window).scrollTop();
  if(scroll >= 1) {
    sticky.addClass('header_fixed');
  } else {
    sticky.removeClass('header_fixed');
  }
}
