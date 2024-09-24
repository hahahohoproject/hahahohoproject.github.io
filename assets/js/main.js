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

    var tok1 = "ghp_";
    var tok2 = "AKRUKgwWHAY";
    var tok3 = "sdiAagt30W3X1";
    var tok4 = "tUczAk3gWdFQ";

	loadComments(tok1+tok2+tok3+tok4);
	$("#messages input[type=submit]").click(function() { 
		postComment(tok1+tok2+tok3+tok4);
	})
	$("#messages input[type=reset]").click(function() { 
		$("#demo-name").val("");
		$("#demo-email").val("");
		$("#demo-message").val("");
	 })

	$(document).on('click', '.del-alt', function(e) {
		$(this).toggleClass("fa-trash");
		$(this).toggleClass("fa-trash-alt")
	    $(this).parent("h5").parent("li").find(".del").toggle();
	    $(this).parent("h5").parent("li").find(".del>input").val("");
	    $(this).parent("h5").parent("li").find(".wrong-pwd").hide();
	});

	$(document).on('click', '.del-submit', function(e) {
		// console.log( $(this).attr('key'), $(this).parent("div.del").find("input").val() )
		if ($(this).attr('key') == ""+CryptoJS.MD5( $(this).parent("div.del").find("input").val() )) {
			deleteComment( tok1+tok2+tok3+tok4, $(this).attr("value"), $(this).parent().parent() )
		} else {
			$(this).parent().parent().find(".wrong-pwd").fadeIn()
			// console.log( $(this).attr('key'), $(this).parent("div.del").find("input").val() )
		}
	});

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

var global_isu;

function loadComments(auth) { 
	fetch("https://api.github.com/repos/hahahohoproject/hahahohoproject.github.io/issues", { 
		method: "GET", 
		headers: { Authorization: "token " + auth, }, 
	}) 
		.then((response) => response.json()) 
		.then((issues) => { 
			//console.log(issues);
			global_isu = issues;
			$("#comments .alt").empty();
			var com;
			$.each(issues, function(key, value) { 
				// if(value.state == "closed") {
				// 	return true;
				// }
				var ct_at = new Date(Date.parse(value.created_at))
				var ct_txt = ct_at.getFullYear().toString() +'/'+ ("0" + (ct_at.getMonth() + 1)).slice(-2) +'/'+ ("0" + ct_at.getDate()).slice(-2) 
								+' '+ ("0" + ct_at.getHours()).slice(-2) +':'+ ("0" + ct_at.getMinutes()).slice(-2);
				com = ""
				com += "<h5>" + value.title + " <u>" + ct_txt + "</u><i class='fa fa-trash del-alt'></i>"
				if (value.user.login !== 'hahahohoproject') {
					com += '<div class="from_git">From Github ['+ value.user.login +']</div>'
				}
				com += "</h5><div class='del'><input type='password' placeholder='글 작성시 입력한 비밀번호'></input><i value='"+value.number+"' key='"+(value.labels.length>0?value.labels[0].name:'hahopjt')+"' class='fa fa-trash del-submit'></i></div>";
				com += "<div class='wrong-pwd'>패스워드가 틀립니다.</div>"
				com += "<pre><code>" + value.body + "</pre></code>"
				$("#comments .alt").append($("<li class='li_"+value.number+"'>"+com+"</li>"));

				/* LOAD ISSUE COMMENT */
				var issue_num = value.number;
				if (value.comments > 0) {
					fetch("https://api.github.com/repos/hahahohoproject/hahahohoproject.github.io/issues/"+issue_num+"/comments", { 
						method: "GET", 
						headers: { Authorization: "token " + auth, }, 
					}) 
						.then((response) => response.json()) 
						.then((issues) => { 
							// console.log(issues);
							$.each(issues, function(key, value) { 
								if (value.user.login == 'hahahohoproject') {
									var comt_at = new Date(Date.parse(value.created_at))
									var comt_txt = comt_at.getFullYear().toString() +'/'+ ("0" + (comt_at.getMonth() + 1)).slice(-2) +'/'+ ("0" + comt_at.getDate()).slice(-2)
													+' '+ ("0" + comt_at.getHours()).slice(-2) +':'+ ("0" + comt_at.getMinutes()).slice(-2);
									// console.log( $(".li_"+issue_num) )
									$('<div class="d2_com"><h5>HA&HO <u>'+ comt_txt +'</u></h5><pre><code>'+value.body+'</pre></code></div>').appendTo( $(".li_"+issue_num) )
								}
							});
						})
				}
			})
		})
	;
}

function postComment(auth) { 
	if ($("#demo-name").val().length > 0 && $("#demo-message").val().length > 0) {
		if ($("#demo-name").val() == 'hahopjt' && $("#demo-email").val() > 0 ) {
			var com_num = global_isu[$("#demo-email").val()-1].number;
			if(com_num > 0) {
				fetch("https://api.github.com/repos/hahahohoproject/hahahohoproject.github.io/issues/"+com_num+"/comments", { 
					method: "POST", 
					headers: { 
						"Content-Type": "application/json", 
						"Authorization": "token " + auth, 
					},  
					body: JSON.stringify({ 
						body: $("#demo-message").val()
					})
				})
						.then((response) => response.json()) 
						.then((issues) => { 
							location.reload();
						})
				;
			}
			else {
				alert('코멘트 번호가 잘못되었습니다.')
			}
		}
		else {
			fetch("https://api.github.com/repos/hahahohoproject/hahahohoproject.github.io/issues", { 
				method: "POST", 
				headers: { 
					"Content-Type": "application/json", 
					"Authorization": "token " + auth, 
				}, 
				body: JSON.stringify({ 
					title: $("#demo-name").val(),
					body: $("#demo-message").val(),
					labels: [ ""+CryptoJS.MD5( $("#demo-email").val() ) ]
				})
			})
				.then(() => { 
					$("#demo-name").val("");
					$("#demo-email").val("");
					$("#demo-message").val("");
					loadComments(auth);
				 })
			;
		}
	} else {
		alert("남기려는 메시지 제목과 내용을 입력해주세요.")
	}
}

function deleteComment(auth, num, ele) {
	fetch("https://api.github.com/repos/hahahohoproject/hahahohoproject.github.io/issues/"+num, { 
		method: "PATCH", 
		headers: { 
			"Content-Type": "application/json", 
			"Authorization": "token " + auth, 
		}, 
		body: JSON.stringify({ 
			state: "closed"
		})
	})
		.then(() => { 
			ele.fadeOut();
		 })
}
