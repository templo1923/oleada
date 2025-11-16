(function ($) {
	"use strict";
	
/*--------------------------------------------------------------------------------------------
	document.ready ALL FUNCTION START
---------------------------------------------------------------------------------------------*/	


// > Video responsive function by = custom.js ========================= //	
	function video_responsive(){	
		$('iframe[src*="youtube.com"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
		$('iframe[src*="vimeo.com"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');	
	}  

// > magnificPopup function	by = magnific-popup.js =========================== //
	function magnific_popup(){
        $('.mfp-gallery').magnificPopup({
          delegate: '.mfp-link',
          type: 'image',
          tLoading: 'Loading image #%curr%...',
          mainClass: 'mfp-img-mobile',
          gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0,1] // Will preload 0 - before current, and 1 after the current image
          },
          image: {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
          }
       });
	}

// > magnificPopup for video function	by = magnific-popup.js ===================== //	
	function magnific_video(){	
		$('.mfp-video').magnificPopup({
			type: 'iframe',
		});
	}

// Vertically center Bootstrap modal popup function by = custom.js ==============//
	function popup_vertical_center(){	
		$(function() {
			function reposition() {
				var modal = $(this),
				dialog = modal.find('.modal-dialog');
				modal.css('display', 'block');
				
				// Dividing by two centers the modal exactly, but dividing by three 
				// or four works better for larger screens.
				dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
			}
			// Reposition when a modal is shown
			$('.modal').on('show.bs.modal', reposition);
			// Reposition when the window is resized
			$(window).on('resize', function() {
				$('.modal:visible').each(reposition);
			});
		});
	}

// > Main menu sticky on top  when scroll down function by = custom.js ========== //		
	function sticky_header(){
		if($('.sticky-header').length){
			var sticky = new Waypoint.Sticky({
			  element: $('.sticky-header')
			});
		}
	}
	

	// > Sidebar sticky  when scroll down function by = custom.js ========== //		
	function sticky_sidebar(){		
		$('.rightSidebar')
			.theiaStickySidebar({
				additionalMarginTop: 100
			});		
	}	
	
	// > Price range slide function by = jquery.ui.js ========== //			
  if($("#slider-range" ).length){
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 100, 300 ],
      slide: function( event, ui ) {
        $( "#amount" ).html( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
		$( "#amount1" ).val(ui.values[ 0 ]);
		$( "#amount2" ).val(ui.values[ 1 ]);
      }
    });
    $( "#amount" ).html( "$" + $( "#slider-range" ).slider( "values", 0 ) +
    " - $" + $( "#slider-range" ).slider( "values", 1 ) );

	$( "#amount1" ).val($( "#slider-range" ).slider( "values", 0 ));
	$( "#amount2" ).val($( "#slider-range" ).slider( "values", 1 ));
	
  }	


// > page scroll top on button click function by = custom.js ===================== //	
	function scroll_top(){
		$("button.scroltop").on('click', function() {
			$("html, body").animate({
				scrollTop: 0
			}, 1000);
			return false;
		});

		$(window).on("scroll", function() {
			var scroll = $(window).scrollTop();
			if (scroll > 900) {
				$("button.scroltop").fadeIn(1000);
			} else {
				$("button.scroltop").fadeOut(1000);
			}
		});
	}
	
// > input type file function by = custom.js ========================== //	 	 
	function input_type_file_form(){
		$(document).on('change', '.btn-file :file', function() {
			var input = $(this),
				numFiles = input.get(0).files ? input.get(0).files.length : 1,
				label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
			input.trigger('fileselect', [numFiles, label]);
		});

		$('.btn-file :file').on('fileselect', function(event, numFiles, label) {
			var input = $(this).parents('.input-group').find(':text'),
				log = numFiles > 10 ? numFiles + ' files selected' : label;
			if (input.length) {
				input.val(log);
			} else {
				if (log) alert(log);
			}
		});	
	}

// > input Placeholder in IE9 function by = custom.js ======================== //	
	function placeholderSupport(){
	/* input placeholder for ie9 & ie8 & ie7 */
		$.support.placeholder = ('placeholder' in document.createElement('input'));
		/* input placeholder for ie9 & ie8 & ie7 end*/
		/*fix for IE7 and IE8  */
		if (!$.support.placeholder) {
			$("[placeholder]").on('focus', function () {
				if ($(this).val() === $(this).attr("placeholder")) $(this).val("");
			}).blur(function () {
				if ($(this).val() === "") $(this).val($(this).attr("placeholder"));
			}).blur();

			$("[placeholder]").parents("form").on('submit', function () {
				$(this).find('[placeholder]').each(function() {
					if ($(this).val() === $(this).attr("placeholder")) {
						 $(this).val("");
					}
				});
			});
		}
		/*fix for IE7 and IE8 end */
	}	


// > footer fixed on bottom function by = custom.js ======================== //	
	function footer_fixed() {
	  $('.site-footer').css('display', 'block');
	  $('.site-footer').css('height', 'auto');
	  var footerHeight = $('.site-footer').outerHeight();
	  $('.footer-fixed > .page-wraper').css('padding-bottom', footerHeight);
	  $('.site-footer').css('height', footerHeight);
	}
	
	
// > accordion active calss function by = custom.js ========================= //	
	function accordion_active() {
		$('.acod-head a').on('click', function() {
			$('.acod-head').removeClass('acc-actives');
			$(this).parents('.acod-head').addClass('acc-actives');
			$('.acod-title').removeClass('acc-actives'); //just to make a visual sense
			$(this).parent().addClass('acc-actives'); //just to make a visual sense
			($(this).parents('.acod-head').attr('class'));
		 });
	}	
	
//  > Top Search bar Show Hide function by = custom.js =================== //	

	function site_search(){
		
	  $(".header-search-icon").on('click', function(){
		$("#search-toggle-block").slideToggle("slow");
		$('.header-search-icon').toggleClass('close');
	  });
	  
	}	
	
// Home product showcase function by = owl.carousel.js ========================== //
	function product_show_slider(){
	$('.product-show-slider').owlCarousel({
		loop:true,
		autoplay:true,
		nav:true,
		dots: false,
		center:true,	
		margin:10,
		responsiveClass:true,
		navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
		responsive:{
			0:{
				items:1,
			},
			640:{
				items:1,
			},			
			768:{
				items:2,
     		},				
			991:{
				items:2,
			},
			1366:{
				items:2,
			},			
			1400:{
				items:3
			}		
		}
	});
	}
	
	
// Home product showcase function by = owl.carousel.js ========================== //
	function product_show_slider2(){
	$('.product-show-slider2').owlCarousel({
		loop:true,
		autoplay:false,
		nav:false,
		dots: true,
		center:true,	
		margin:10,
		navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
		responsive:{
			0:{
				items:1,
			},
			640:{
				items:1,
			},			
			767:{
				items:2,
     		},				
			991:{
				items:2,
			},
			1366:{
				items:2,
			},			
			1400:{
				items:2
			}		
		}
	});
	}	
// Home page video gallery 1 function by = owl.carousel.js ========================== //
	function video_gallery_one(){
	$('.video-gallery-one').owlCarousel({
		loop:true,
		autoplay:false,
		nav:false,
		dots: true,	
		margin:0,
		navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
		responsive:{
			0:{
				items:1,
			},
			640:{
				items:1,
			},			
			767:{
				items:2,
     		},				
			991:{
				items:3,
			},
			1366:{
				items:5,
			},			
			1400:{
				items:5
			}		
		}
	});
	}	

	
// featured products Slider function by = owl.carousel.js ========================== //
	function featured_products(){
	$('.featured-products').owlCarousel({
		loop:true,
		autoplay:true,
		nav:true,
		dots: false,	
		margin:30,
		navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
		responsive:{
			0:{
				items:1,
			},
			640:{
				items:2,
			},			
			767:{
				items:2,
     		},				
			991:{
				items:3,
			},
			1024:{
				items:3,
			}	
		}
	});
	}

// Gallery Large Slider function by = slick.js ========================== //
	function gallery_large(){
	 $('.slider-for').slick({
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  arrows: false,
	  fade: true,
	  asNavFor: '.slider-nav'
	});
	$('.slider-nav').slick({
	  slidesToShow: 3,
	  slidesToScroll: 1,
	  asNavFor: '.slider-for',
	  dots: false,
	  arrows: false,
	  centerMode: false,
	  focusOnSelect: true
	});
	}
	
	
// Service Detail  Slider function by = slick.js ========================== //
	function service_detail_slider(){
	 $('.service-detail-for').slick({
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  arrows: false,
	  fade: true,
	  asNavFor: '.service-detail-nav'
	});
	$('.service-detail-nav').slick({
	  slidesToShow: 3,
	  slidesToScroll: 1,
	  asNavFor: '.service-detail-for',
	  dots: false,
	  arrows: false,
	  centerMode: false,
	  focusOnSelect: true
	});
	}	
	
// > TouchSpin box function by  = jquery.bootstrap-touchspin.js =============== // 

	function input_number_vertical_form() {	
		$(".cart .qty").TouchSpin({
		  verticalbuttons: true,
		  verticalupclass: 'fa fa-plus',
		  verticaldownclass: 'fa fa-minus'
		});	
	}
	
// Home page Testimonial Slider function by = owl.carousel.js ========================== //
	function testimonial_1_content(){
	$('.testimonial-1-content').owlCarousel({
		loop:true,
		autoplay:false,
		nav:true,
		dots: true,	
		margin:30,
		navText: ['<i class="flaticon-arrows"></i>', '<i class="flaticon-point-to"></i>'],
		responsive:{
			0:{
				items:1,
			},
			1400:{
				items:1
			}		
		}
	});
	}
	
// Home page Testimonial Slider function by = owl.carousel.js ========================== //
	function testimonial_2_content(){
	$('.testimonial-2-content').owlCarousel({
		loop:true,
		autoplay:false,
		nav:true,
		dots: true,	
		margin:30,
		navText: ['<i class="flaticon-arrows"></i>', '<i class="flaticon-point-to"></i>'],
		responsive:{
		
			0:{
				items:1,
			},
			1400:{
				items:1
			}					
		}
	});
	}	
	
// Gallery slider function by = owl.carousel.js ========================== //
	function gallery_slider(){
	$('.gallery-slider').owlCarousel({
		loop:true,
		autoplay:false,
		nav:true,
		dots: false,	
		margin:30,
		navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
		responsive:{
			0:{
				items:1,
			},
			640:{
				items:2,
			},			
			767:{
				items:2,
     		},				
			991:{
				items:3,
			},
			1024:{
				items:3,
			},	
			
			1200:{
				items:4,
			},					
			1366:{
				items:4,
			},			
			1400:{
				items:5
			}		
		}
	});
	}	
	
	
// Gallery slider function by = owl.carousel.js ========================== //
	function gallery_slider2(){
	$('.gallery-slider2').owlCarousel({
		loop:true,
		autoplay:true,
		nav:false,
		dots: true,	
		margin:30,
		navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
		responsive:{
			0:{
				items:1,
			},
			640:{
				items:2,
			},			
			767:{
				items:2,
     		},				
			991:{
				items:3,
			},
			1024:{
				items:3,
			}
		}
	});
	}	
	
	
// Project slider function by = owl.carousel.js ========================== //
	function project_detail_slider(){
	$('.project-detail-slider').owlCarousel({
		loop:true,
		autoplay:false,
		nav:true,
		dots: false,	
		margin:30,
		navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
		responsive:{
			0:{
				items:1,
			},
			480:{
				items:2,
			},			
			767:{
				items:3,
			},
			1000:{
				items:3
			}
		}
	});
	}		
	


//  home_client_carouse function by = owl.carousel.js ========================== //
	function home_client_carousel_2(){
	$('.home-client-carousel-2').owlCarousel({
		loop:false,
		nav:false,
		dots: false,				
		margin:10,
		autoplay:false,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsive:{
			0:{
				items:2,
			},
			480:{
				items:3,
			},			
			767:{
				items:4,
			},
			1000:{
				items:6
			}
		}
	});
	}	
	
	//  Counter Section function by = counterup.min.js
	function counter_section(){
		$('.counter').counterUp({
			delay: 10,
			time: 3000
		});	
	}	

		
	$('.nav-tabs a').on('click', function(e) {
		e.preventDefault();
		$(this).tab('show');
	});
	
	$('.wt-accordion a').on('click', function(e) {
		e.preventDefault();
		$(this).tab('show');
	});	
	
// >Backgroung image scroling right function by = $.bgscroll.js		
	function bg_image_moving(){
		if($('.bg-image-moving').length){	
			$( function() {			  
			$('.bg-image-moving').bgscroll({scrollSpeed:20 , direction:'h' });
			});
		}
	}

/*--------------------------------------------------------------------------------------------
	Window on load ALL FUNCTION START
---------------------------------------------------------------------------------------------*/


	// > masonry function function by = isotope.pkgd.min.js ========================= //	
	function masonryBox() {
        if ( $().isotope ) {      
            var $container = $('.masonry-wrap');
                $container.isotope({
                    itemSelector: '.masonry-item',
                    transitionDuration: '1s',
					originLeft: true,
					stamp: '.stamp'
                });

            $('.masonry-filter li').on('click',function() {                           
                var selector = $(this).find("a").attr('data-filter');
                $('.masonry-filter li').removeClass('active');
                $(this).addClass('active');
                $container.isotope({ filter: selector });
                return false;
            });
    	}
	}		
	

// > background image parallax function by = stellar.js ==================== //	
	function bg_image_stellar(){
		$(function(){
				$.stellar({
					horizontalScrolling: false,
					verticalOffset:100
				});
			});			
	}	

// > page loader function by = custom.js ========================= //		
	function page_loader() {
		$('.loading-area').fadeOut(1000);
	}

/*--------------------------------------------------------------------------------------------
    Window on scroll ALL FUNCTION START
---------------------------------------------------------------------------------------------*/

    function color_fill_header() {
        var scroll = $(window).scrollTop();
        if(scroll >= 100) {
            $(".is-fixed").addClass("color-fill");
        } else {
            $(".is-fixed").removeClass("color-fill");
        }
    }
	
	// Bootstrap Select box function by  = bootstrap-select.min.js
	function Bootstrap_Select(){	
			$('.selectpicker').selectpicker();
		}	

/*--------------------------------------------------------------------------------------------
	document.ready ALL FUNCTION START
---------------------------------------------------------------------------------------------*/
	jQuery(document).ready(function($) {
		// > Top Search bar Show Hide function by = custom.js  		
		site_search(),	
		// > Video responsive function by = custom.js 
		video_responsive(),
		// > magnificPopup function	by = magnific-popup.js
		magnific_popup(),
		// > magnificPopup for video function	by = magnific-popup.js
		magnific_video(),
		// > Vertically center Bootstrap modal popup function by = custom.js
		popup_vertical_center();
		// > Main menu sticky on top  when scroll down function by = custom.js		
		sticky_header(),
	    // > Sidebar sticky  when scroll down function by = custom.js ========== //		
	    sticky_sidebar(),		
		// > page scroll top on button click function by = custom.js	
		scroll_top(),
		// > input type file function by = custom.js	 	
		input_type_file_form(),
		// > input Placeholder in IE9 function by = custom.js		
		placeholderSupport(),
		// > footer fixed on bottom function by = custom.js	
		footer_fixed(),
		// > accordion active calss function by = custom.js ========================= //			
		accordion_active(),
		
		// Gallery slider function by = owl.carousel.js ========================== //
	    gallery_slider2(),
		// Project slider function by = owl.carousel.js ========================== //
		project_detail_slider(),		
		// Home product showcase function by = owl.carousel.js ========================== //
		product_show_slider(),
		// Home product showcase function by = owl.carousel.js ========================== //
	    product_show_slider2(),	
		// Home page video gallery 1 function by = owl.carousel.js ========================== //
		video_gallery_one(),
        // featured products Slider function by = owl.carousel.js ========================== //
	    featured_products(),
		// Gallery Large Slider function by = slick.js ========================== //
	    gallery_large(),
		// Service Detail  Slider function by = slick.js ========================== //
		service_detail_slider(),			
		// > TouchSpin box function by  = jquery.bootstrap-touchspin.js =============== // 
		input_number_vertical_form(),		
		// Home page Testimonial Slider function by = owl.carousel.js ========================== //
	    testimonial_1_content(),
		// Home page Testimonial Slider function by = owl.carousel.js ========================== //
		testimonial_2_content(),
		// Gallery slider function by = owl.carousel.js ========================== //
		gallery_slider(),		
		//  Client logo Carousel function by = owl.carousel.js ========================== //
		home_client_carousel_2(),
		//  Counter Section function by = counterup.min.js ========================== //
		counter_section(),
		// >Backgroung image scroling right function by = jquery.bgscroll.js	
	    bg_image_moving();		 	
	}); 	
/*--------------------------------------------------------------------------------------------
	Window Load START
---------------------------------------------------------------------------------------------*/
	$(window).on('load', function () {
		// Bootstrap Select box function by  = bootstrap-select.min.js
		 Bootstrap_Select(),		
		// > masonry function function by = isotope.pkgd.min.js		
		masonryBox(),
		// > background image parallax function by = stellar.js	
		bg_image_stellar(),
		// > page loader function by = custom.js		
		page_loader();
});

 /*===========================
	Window Scroll ALL FUNCTION START
===========================*/

	$(window).on('scroll', function () {
	// > Window on scroll header color fill 
		color_fill_header();
	});
	
/*===========================
	Window Resize ALL FUNCTION START
===========================*/

	$(window).on('resize', function () {
	// > footer fixed on bottom function by = custom.js		 
	 	footer_fixed();
	});

/*===========================
	Document on  Submit FUNCTION START
===========================*/

	// > Contact form function by = custom.js	
	$(document).on('submit', 'form.cons-contact-form', function(e){
		e.preventDefault();
		var form = $(this);
		/* sending message */
		$.ajax({
			url: 'http://thewebmax.com/dronza/form-handler2.php',
			data: form.serialize() + "&action=contactform",
			type: 'POST',
			dataType: 'JSON',
			beforeSend: function() {
				$('.loading-area').show();
			},

			success:function(data){
				$('.loading-area').hide();
				if(data['success']){
				$("<div class='alert alert-success'>"+data['message']+"</div>").insertBefore('form.cons-contact-form');
				}else{
				$("<div class='alert alert-danger'>"+data['message']+"</div>").insertBefore('form.cons-contact-form');	
				}
			}
		});
		$('.cons-contact-form').trigger("reset");
		return false;
	});
		
	
})(window.jQuery);