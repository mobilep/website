"use strict";function clickHeaderBtn(){$(this).toggleClass("header__btn_active"),$(this).closest("body").toggleClass("header__btn_active")}function headerSticky(){var e=$(".header");$(window).scrollTop()>=1?e.addClass("header_fixed"):e.removeClass("header_fixed")}$(document).ready(function(){$(".header__btn").click(clickHeaderBtn);var e=$(".scroll-status"),t=70;$("body").width()>767&&(t=90),$(".header__nav").navScroll({mobileDropdown:!0,mobileBreakpoint:768,scrollSpy:!0,navHeight:t,onScrollStart:function(){e.show(),e.text("Started scrolling")},onScrollEnd:function(){e.text("Scrolling ended"),setTimeout(function(){e.fadeOut(200)},1e3)}}),$(".header__nav").on("click",".header__a",function(e){e.preventDefault(),$(".header__nav ul").slideToggle("fast"),$(e.target).closest("body").removeClass("header__btn_active"),$(e.target).closest("body").find(".header__btn").toggleClass("header__btn_active")})}),$(window).on("load resize scroll",function(){headerSticky()});