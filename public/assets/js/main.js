/*
	Spectral by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#page-wrapper'),
		$banner = $('#banner'),
		$header = $('#header');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		//$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 500);
		//});

	// Mobile?
		if (browser.mobile)
			$body.addClass('is-mobile');
		else {

			breakpoints.on('>medium', function() {
				$body.removeClass('is-mobile');
			});

			breakpoints.on('<=medium', function() {
				$body.addClass('is-mobile');
			});

		}

	// Scrolly.
		$('.scrolly')
			.scrolly({
				speed: 1500,
				offset: $header.outerHeight()
			});

	// Menu.
		$('#menu')
			.append('<a href="#menu" class="close"></a>')
			.appendTo($body)
			.panel({
				delay: 500,
				hideOnClick: true,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'right',
				target: $body,
				visibleClass: 'is-menu-visible'
			});

	// Header.
		if ($banner.length > 0
		&&	$header.hasClass('alt')) {

			$window.on('resize', function() { $window.trigger('scroll'); });

			$banner.scrollex({
				bottom:		$header.outerHeight() + 1,
				terminate:	function() { $header.removeClass('alt'); },
				enter:		function() { $header.addClass('alt'); },
				leave:		function() { $header.removeClass('alt'); }
			});

		}

	$(document).on('click', '.btn_groom', function(e) {
		$("#modal").fadeIn();
		$("#modal").find(".groom_info").fadeIn();
		$("#modal").find(".bride_info").fadeOut();
	});

	$(document).on('click', '.btn_bride', function(e) {
		$("#modal").fadeIn();
		$("#modal").find(".groom_info").fadeOut();
		$("#modal").find(".bride_info").fadeIn();
	});

	$(document).on('click', '.modal_close, #modal_wrapper', function(e) {
		$("#modal").fadeOut();
		$("#modal").find(".groom_info").fadeOut();
		$("#modal").find(".bride_info").fadeOut();
	});

	$(document).on('click', '.video_list>li>.txt_wrp', function(e) {
		$(this).toggleClass("opened");
		$(this).parent("li").find(".video_wrp").toggle();
	});

	$(window).on('load', function(){ 
		$("#gallery_wrapper").height($(window).height() > $('#thumbnails').height() + 150 ? $(window).height() : $('#thumbnails').height() + 150); 
	});

	$(window).resize(function() { 
		$("#gallery_wrapper").height($(window).height() > $('#thumbnails').height() + 150 ? $(window).height() : $('#thumbnails').height() + 150); 
	});

})(jQuery);

function toggleMenu() {
	const nav = document.getElementById('side-nav');
	const overlay = document.getElementById('menu-overlay');
        
	// 클래스 토글 (있으면 제거, 없으면 추가)
	nav.classList.toggle('active');
	overlay.classList.toggle('active');
}
