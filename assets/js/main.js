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
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

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

    var tok = "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";
	loadComments(tok);
	$("#messages input[type=submit]").click(function() { 
		postComment(tok);
	})
	$("#messages input[type=reset]").click(function() { 
		$("#demo-name").val("");
		$("#demo-email").val("");
		$("#demo-message").val("");
	 })

})(jQuery);

function loadComments(auth) { 
	fetch("https://api.github.com/repos/hahahohoproject/hahahohoproject.github.io/issues", { 
		method: "GET", 
		headers: { Authorization: "token " + auth, }, 
	}) 
		.then((response) => response.json()) 
		.then((issues) => { 
			console.log(issues);
			$("#comments .alt").empty();
			var com;
			$.each(issues, function(key, value) { 
				com = ""
				com += "<h5>" + value.title + " <u>" + value.created_at + "</u></h5>"
				com += "<pre><code>" + value.body + "</pre></code>"
				$("#comments .alt").append("<li>"+com+"</li>");
			})
		})
	;
}

function postComment(auth) { 
	if ($("#demo-name").val().length > 0 && $("#demo-message").val().length > 0) {
		fetch("https://api.github.com/repos/hahahohoproject/hahahohoproject.github.io/issues", { 
			method: "POST", 
			headers: { 
				"Content-Type": "application/json", 
				"Authorization": "token " + auth, 
			}, 
			body: JSON.stringify({ 
				title: $("#demo-name").val(),
				body: $("#demo-message").val()
			})
		})
			.then(() => { 
				$("#demo-name").val("");
				$("#demo-email").val("");
				$("#demo-message").val("");
				loadComments(auth);

				windows.location.href = "#comments";
			 })
		;
	} else {
		alert("Please text your message.")
	}
}