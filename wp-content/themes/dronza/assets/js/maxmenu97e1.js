/* global jQuery */
/* global document */

jQuery(function () {
  'use strict';

  document.addEventListener("touchstart", function () {}, false);
  jQuery(function () {

    jQuery('<div class="overlapblackbg"></div>').prependTo('.maxmenu');

    jQuery('#maxnavtoggle').click(function () {
      jQuery('body').toggleClass('maxactive');
    });

    jQuery('.maxanimated-arrow').click(function () {
      jQuery('body').removeClass('max-ulexpend');
    });

    jQuery('.overlapblackbg').click(function () {
      jQuery("body").removeClass('maxactive');
    });

    jQuery('.maxmenu > .maxmenu-list > li').has('.sub-menu').prepend('<span class="maxmenu-click"><i class="maxmenu-arrow"></i></span>');

    jQuery('.maxmenu-click').click(function () {
      jQuery(this).toggleClass('max-activearrow')
        .parent().siblings().children().removeClass('max-activearrow');
      jQuery(".maxmenu > .maxmenu-list > li > .sub-menu").not(jQuery(this).siblings('.maxmenu > .maxmenu-list > li > .sub-menu')).slideUp('slow');
      jQuery(this).siblings('.sub-menu').slideToggle('slow');
    });

    jQuery('.maxmenu > .maxmenu-list > li > ul > li').has('.sub-menu').prepend('<span class="maxmenu-click02"><i class="maxmenu-arrow"></i></span>');
    jQuery('.maxmenu > .maxmenu-list > li > ul > li > ul > li').has('.sub-menu').prepend('<span class="maxmenu-click02"><i class="maxmenu-arrow"></i></span>');

    jQuery('.maxmenu-click02').click(function () {
      jQuery(this).children('.maxmenu-arrow').toggleClass('maxmenu-rotate');
      jQuery(this).siblings('li > .sub-menu').slideToggle('slow');
    });

    jQuery(window).on('resize', function () {

      if (jQuery(window).outerWidth() < 992) {
        jQuery('.maxmenu').css('height', jQuery(this).height() + "px");
        
      } else {
        jQuery('.maxmenu').removeAttr("style");
        jQuery('body').removeClass("maxactive");
        jQuery('.maxmenu > .maxmenu-list > li > ul.sub-menu, .maxmenu > .maxmenu-list > li > ul.sub-menu > li > ul.sub-menu, .maxmenu > .maxmenu-list > li > ul.sub-menu > li > ul.sub-menu > li > ul.sub-menu').removeAttr("style");
        jQuery('.maxmenu-click').removeClass("max-activearrow");
        jQuery('.maxmenu-click02 > i').removeClass("maxmenu-rotate");
      }

    });

    jQuery(window).trigger('resize');

  });
}()); 