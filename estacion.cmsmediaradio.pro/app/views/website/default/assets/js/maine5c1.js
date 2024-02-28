/* © Copyright RadioBS - Created by Lugsoft - lugsoft.com.br */

//ajaxifly
let ajaxify = new Ajaxify({
	elements: '#ajaxArea',
	scrolltop: true,
	prefetchoff: true,
	memoryoff: true,
	inlineskip: "",
});

(function ($) {
	"use strict";

	var playerAudio = document.querySelector('#player_audio');
	var timeMsg;
	var LoadApiTime;

	document.addEventListener('pronto.beforeload', function (e) {
		clearTimeout(LoadApiTime);
	});

	document.addEventListener('pronto.render', function (e) {
		App();
		var bsOffcanvas = bootstrap.Offcanvas.getInstance($('#offcanvas'))
		if (bsOffcanvas) { bsOffcanvas.hide() }
	});

	App();
	autoPlay();
	//init menu Active
	menuActive()

	function App() {


		// play - top music
		$('.top-music-card .b-play, .top-music-card .b-stop').click(function (e) {
			e.preventDefault();
			audioPlay(this);
		});

		$('.podcast .b-play, .podcast .b-stop').click(function (e) {
			e.preventDefault();
			audioPodcast(this)
		});

		//init Share
		ShareBS();

		//init Ligtbox
		lightboxCarousel()

		//load all api
		LoadApiTime = setTimeout(() => {
			loadApi()
		}, 1000)

		//crop image
		cropImageModal();

		//input username filter
		if ($('#user_name_reg').length > 0) {
			document.getElementById("user_name_reg").onkeypress = function (e) {
				var chr = String.fromCharCode(e.which);
				if ("1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM".indexOf(chr) < 0)
					return false;
			};
		}
	}

	// podcast player
	function audioPodcast(data) {
		if ($('.podcast audio').length) {
			var playerPodcast = document.querySelector('.podcast audio');
			var audioUrl = $(data).attr('data-audio');
			$('.podcast audio').html('<source id="audio_url" src="' + audioUrl + '" type="audio/mp3">');
			playerPodcast.load();
			playerAudio.pause();
			var class_name = data.getAttribute('class');
			$('.b-stop').removeClass('b-stop').addClass('b-play');
			$('.podcast ul li').removeClass('active');
			if (class_name == 'b-play') {
				$(data).removeClass('b-play').addClass('b-stop');
				$(data).closest('li').addClass('active')
				playerPodcast.play().then(() => {
					console.log('play success');
				}).catch((e) => {
					console.log('play failed');
				});
			} else {
				$(data).removeClass('b-stop').addClass('b-play');
				playerPodcast.pause();
			}
		}
	}

	// play - player
	$('#player .b-play, #player .b-stop').click(function (e) {
		e.preventDefault();
		audioPlay(this);
	});

	// audio play
	function audioPlay(data) {
		var StreamUrl = $(data).attr('data-stream');
		$('#player_audio').html('<source id="radio_stream" src="' + StreamUrl + '" type="audio/mp3">');
		playerAudio.load();

		if ($('.podcast audio').length) {
			var playerPodcast = document.querySelector('.podcast audio');
			playerPodcast.pause();
		}

		var class_name = data.getAttribute('class');
		$('.b-stop').removeClass('b-stop').addClass('b-play');
		if (class_name == 'b-play') {
			$(data).removeClass('b-play').addClass('b-stop');
			playerAudio.play().then(() => {
				console.log('play success');
			}).catch((e) => {
				console.log('play failed');
			});
		} else {
			$(data).removeClass('b-stop').addClass('b-play');
			playerAudio.pause();
		}
	}

	//player controls - volume
	if ($('.player-volume').length) {
		var slider_volume = document.getElementById('slider-volume');
		playerAudio.volume = 0.8;
		$('#volume-mute').click(function () {
			var muted = document.querySelector('#volume-mute').className;

			if (muted == 'b-volume') {
				$('#volume-mute').removeClass('b-volume').addClass('b-mute');
				slider_volume.value = "0";
				playerAudio.volume = 0.0;
			} else {
				$('#volume-mute').removeClass('b-mute').addClass('b-volume');
				slider_volume.value = "80";
				playerAudio.volume = 0.8;
			}
		});
		slider_volume.oninput = () => {
			playerAudio.volume = ~~(slider_volume.value) * 0.01;
			if (playerAudio.volume == 0) {
				$('#volume-mute').removeClass('b-volume').addClass('b-mute');
			} else {
				$('#volume-mute').removeClass('b-mute').addClass('b-volume');
			}
		}
	}

	// autoplay
	function autoPlay() {
		if (!$('.podcast audio').length) {
			var StreamUrl = $('#player .b-play').attr('data-stream');
			$('#player_audio').html('<source id="radio_stream" src="' + StreamUrl + '" type="audio/mp3">');
			playerAudio.load();
			let playAttempt = setInterval(() => {
				if (playerAudio.paused) {
					playerAudio.play().then(() => {
						$('#player .b-play').removeClass('b-play').addClass('b-stop');

						clearInterval(playAttempt);
						console.log("autoplay success");
					}).catch((e) => {
						console.log("autoplay failed");
					});
				} else {
					$('#player .b-play').removeClass('b-play').addClass('b-stop');
					console.log("clean autoplay");
					clearInterval(playAttempt);
				}
			}, 3000);
		}
	}

	//Share social
	function ShareBS() {
		if ($('#shareBS').length) {
			var share = $('#shareBS');
			var url = share.attr('data-url');
			var text = share.attr('data-title');
			var fb = '<button class="btn-fb" id="fb" aria-label="Share Facebook"><span class="fab fa-facebook"></span></button>';
			var tw = '<button class="btn-tw" id="tw" aria-label="Share Twitter"><span class="fab fa-twitter"></span></button>';
			var wa = '<button class="btn-wa" id="wa" aria-label="Share WhatsApp"><span class="fab fa-whatsapp"></span></button>';
			var sr = '<button class="btn-sr" id="sr" aria-label="More Share"><span class="fas fa-share"></span></button>';
			share.html('<div>' + fb + tw + wa + sr + '</div>');
			$('#shareBS button').click(function (e) {
				var id = $(this).attr('id');
				//links
				if (id == 'fb') {
					openurl('https://facebook.com/sharer/sharer.php?u=' + url);
				}
				if (id == 'tw') {
					openurl('https://twitter.com/share?url=' + url + '&text=' + text);
				}
				if (id == 'wa') {
					openurl('https://wa.me/?text=' + url);
				}
				if (id == 'sr') {
					navigator.share({ title: text, url: url });
				}
			});
			function openurl(url) {
				window.open(url);
			}
		}
	}

	// prefers-color-scheme
	const setThemeMode = function (theme) {
		if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			document.documentElement.setAttribute('data-bs-theme', 'dark')
		} else {
			document.documentElement.setAttribute('data-bs-theme', theme)
		}
	}
	setThemeMode(CONFIG.themeMode);


	// lightbox
	function lightboxCarousel() {
		if ($('.image-grid').length) {
			const imageGrid = document.querySelector(".image-grid");
			const links = imageGrid.querySelectorAll("a");
			const imgs = imageGrid.querySelectorAll("a");
			const lightboxModal = document.getElementById("lightbox-modal");
			const bsModal = new bootstrap.Modal(lightboxModal);
			const modalBody = document.querySelector(".modal-body .container-fluid");

			for (const link of links) {
				link.addEventListener("click", function (e) {
					e.preventDefault();
					const currentImg = link;
					const lightboxCarousel = document.getElementById("lightboxCarousel");
					if (lightboxCarousel) {
						const parentCol = link.parentElement.parentElement;
						const index = [...parentCol.parentElement.children].indexOf(parentCol);
						const bsCarousel = new bootstrap.Carousel(lightboxCarousel);
						bsCarousel.to(index);
					} else {
						createCarousel(currentImg);
					}
					bsModal.show();
				});
			}

			function createCarousel(img) {
				const markup = `
				<div id="lightboxCarousel" class="carousel slide ">
				<div class="carousel-inner">
					${createSlides(img)}
				</div>
				<button class="carousel-control-prev" type="button" data-bs-target="#lightboxCarousel" data-bs-slide="prev">
				<span class="prev" aria-hidden="true"><i class="fas fa-angle-left"></i></span>
				<span class="visually-hidden">Previous</span>
				</button>
				<button class="carousel-control-next" type="button" data-bs-target="#lightboxCarousel" data-bs-slide="next">
					<span class="next" aria-hidden="true"><i class="fas fa-angle-right"></i></span>
					<span class="visually-hidden">Next</span>
				</button>
				</div>`;
				modalBody.innerHTML = markup;
			}
			function createSlides(img) {
				let markup = "";
				const currentImgSrc = img.getAttribute("href");
				for (const img of imgs) {
					const imgSrc = img.getAttribute("href");
					const imgAlt = img.getAttribute("alt");
					const imgCaption = img.getAttribute("data-caption");
					markup += `
					<div class="carousel-item${currentImgSrc === imgSrc ? " active" : ""}">
					<img loading="lazy" src=${imgSrc} alt=${imgAlt}>
					${imgCaption ? createCaption(imgCaption) : ""}
					</div>`;
				}
				return markup;
			}
			function createCaption(caption) {
				return `<div class="carousel-caption">
				<p class="m-0">${caption}</p>
				</div>`;
			}
		}
	}

	// menu active
	function menuActive() {
		var href = CONFIG.pathSystem + CONFIG.page1;
		if (href == CONFIG.pathSystem + 'home') {
			$('#home-active').addClass('active')
			$('#home-active').attr('aria-current', 'page')
		} else {
			$('header ul li a[href="' + href + '"]').addClass('active')
			$('header ul li a[href="' + href + '"]').attr('aria-current', 'page')
			$('header ul li a[href="' + href + '"]').closest('.dropdown').children().addClass('active')
		}
		$('header ul li a').click(function (e) {
			e.preventDefault()
			if ($(this).attr('id') != 'dropdown-toggle') {
				$(".dropdown-toggle").dropdown("hide")
				$('header ul li a').removeAttr('aria-current', 'page')
				$('header ul li a').removeClass('active')
			} else {
				$('header ul li a.nav-link').removeAttr('aria-current', 'page')
				$('header ul li a.nav-link').removeClass('active')
			}
			$(this).addClass('active')
			$(this).attr('aria-current', 'page')
			$(this).closest('.dropdown').children().addClass('active')
		})
	}


	function cropImageModal() {
		let instance = ''
		let openNewModal = 'true'
		let imgw = ''
		let imgh = ''
		let imgCrop = ''
		let imgPrev = ''
		let modalView = $('#viewModal')
		let modalCrop = $('#modal-crop')
		$(document).on('change', '.crop-image-modal', function (e) {

			// button
			$(".btn-crop-submit").removeClass('d-none')
			$("#btn-crop-cancel").removeClass('d-none')
			$("#crop-load").removeClass('d-block')

			// vars
			imgPrev = document.querySelector('#modal-crop #image')
			imgw = Number($(this).attr('data-imgw'))
			imgh = Number($(this).attr('data-imgh'))
			instance = $(this).attr('data-instance')
			openNewModal = $(this).attr('data-newmodal')
			imgCrop = document.getElementById('crop-instance-' + instance)

			let cropper = []
			let input = this

			if (input.files && input.files[0]) {
				let reader = new FileReader()
				reader.onload = function (e) {
					imgPrev.src = e.target.result
					if (openNewModal == 'true') {
						modalView.modal('hide')
					}

					modalCrop.modal('show')
				}
				reader.readAsDataURL(input.files[0])
			}

			$("#crop").click(function () {
				// button crop
				$(".btn-crop-submit").addClass('d-none')
				$("#btn-crop-cancel").addClass('d-none')
				$("#crop-load").addClass('d-block')
				$('#cropclick').attr('value', 1)

				// result
				if (cropper[instance]) {
					let canvas = cropper[instance].getCroppedCanvas({ width: imgw, height: imgh })
					imgCrop.src = canvas.toDataURL()
				}
				modalCrop.modal('hide');
			});

			modalCrop.on('shown.bs.modal', function () {
				cropper[instance] = new Cropper(imgPrev, {
					aspectRatio: imgw / imgh,
					viewMode: 2,
					movable: true,
					zoomable: true,
					rotate: 0,
					rotatable: false,
					scalable: false,
					autoCropArea: 1,
					crop: function (e) {
						$('#x').val(e.detail.x)
						$('#y').val(e.detail.y)
						$('#w').val(e.detail.width)
						$('#h').val(e.detail.height)
					},
					ready: function () {
						$('body').addClass('modal-open')
					}
				})

			}).on('hidden.bs.modal', function () {
				// check crop
				let cropclick = $('#cropclick').attr('value');
				cropclick == 0 ? input.value = '' : ''
				//destroy
				cropper[instance].destroy()
				cropper[instance] = null
				if (openNewModal == 'true') {
					modalView.modal('show')
				}
			})

		})
	}

	//cookies
	var cookieAlert = document.querySelector(".cookiealert");

	if (!cookieAlert) { return; }
	cookieAlert.offsetHeight;
	if (!getCookie("acceptCookies")) {
		cookieAlert.classList.add("show");
		$(".cookiealert").html(`
			<b>${CONFIG.lang.this_uses_cookies}</b> ${CONFIG.lang.using_agree_to_our} <a href="${CONFIG.pathSystem}privacy-policy">${CONFIG.lang.privacy_policy}</a>
			<button type="button" class="btn btn-primary btn-sm acceptcookies">${CONFIG.lang.to_accept}</button>
		`);
		var acceptCookies = document.querySelector(".acceptcookies");
		acceptCookies.addEventListener("click", function () {

			setCookie("acceptCookies", true, 365);
			cookieAlert.classList.remove("show");
			window.dispatchEvent(new Event("cookieAlertAccept"))
		});
	}

	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}
	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	function requestApi(ref, data, service, method) {
		return $.ajax({
			method: method,
			url: CONFIG.pathSystem + 'api/' + service,
			data: data,
			dataType: "json",
			processData: false,
			contentType: false,
			cache: false,
			beforeSend: function () {
				$(ref + ' .loading').removeClass('d-none');
				$(ref + ' .submit').addClass('d-none');
			},
			success: function (res) {
				$(ref + ' .loading').addClass('d-none');
				$(ref + ' .submit').removeClass('d-none');
				if (res.status) {
					$(ref + ' #res-message').html('<span class="text-success">' + res.message + '</span>');
				} else {
					$(ref + ' #res-message').html('<span class="text-danger">' + res.message + '</span>');
				}

				clearTimeout(timeMsg);
				timeMsg = setTimeout(() => { $(ref + ' #res-message').html('') }, 7000);
			}
		});
	}

	//load page refresh
	function loadApi() {
		contactForm();
		commentForm();
		LoadAds();
		chatBS();
		announcerOnAir();
		lastSeen();
		userLogout();
		userEditProfile();
		userEditPass();
		userEditPassReset();

		if ($('.captcha-code')) {
			generateCaptcha()
		}
	}

	// load single
	userPassReset();
	userLogin();
	codeVerify();
	userRegister();
	requestMusic();

	setTimeout(() => {
		playingNow();
		clickAds();
	}, 800)

	//load interval
	setInterval(() => { lastSeen(); }, 150000);
	setInterval(() => { announcerOnAir(); }, 120000);
	setInterval(() => { playingNow(); }, 90000);
	setInterval(() => { LoadAds(); }, 300000);

	function contactForm() {
		var ref = '#contact-form';
		if ($(ref).length) {
			$(ref).submit(function (e) {
				e.preventDefault();
				var data = new FormData(this);
				requestApi(ref, data, 'contactForm', 'POST')
					.done(function (res) {
						if ($('.captcha-input')) {
							$('.captcha-input').val('')
							generateCaptcha()
						}
						if (res.status) {
							$(ref + ' #message_contact').val('');
						}
					});
			});
		}
	}

	function requestMusic() {
		var ref = '#musicRequest';
		if ($(ref).length) {
			$(ref).submit(function (e) {
				e.preventDefault();
				var data = new FormData(this);
				requestApi(ref, data, 'musicRequest', 'POST')
					.done(function (res) {
						if ($('.captcha-input')) {
							$('.captcha-input').val('')
							generateCaptcha()
						}
						if (res.status) {
							$(ref + ' #request_music').val('');
						}
					});
			});
		}
	}

	function commentForm() {
		var ref = '#comment-form';
		if ($(ref).length) {
			$(ref).submit(function (e) {
				e.preventDefault();
				var data = new FormData(this);
				requestApi(ref, data, 'commentForm', 'POST')
					.done(function (res) {
						if (res.status) {
							$(ref + ' #comment').val('');
							$('#append-comment').prepend(`
							<div class="comment mb-3">
								<div class="me-3">
									<img class="avatar rounded-circle" loading="lazy" src="${CONFIG.pathSystem}public/avatar/${res.data.avatar}" alt="${res.data.full_name}">
								</div>
								<div class="card w-100">
									<div class="p-3">
										<span class="author">${res.data.full_name}</span>
										<p class="mb-1">${res.data.comment}</p>
										<small class="text-muted float-end">${res.data.elapsedTime}</small>
									</div>
								</div>
							</div>
						`);
						}
					});
			});
		}
	}

	function userEditProfile() {
		var ref = '#userEditProfile';
		if ($(ref).length) {
			$(ref).submit(function (e) {
				e.preventDefault();
				var data = new FormData(this);
				requestApi(ref, data, 'user', 'POST')
					.done(function (res) {
						if (res.status) {
							$('.name-user').text(res.data.full_name)
							if (res.data.avatar) {
								$('.avatar-user').attr('src', CONFIG.pathSystem + 'public/avatar/' + res.data.avatar)
							}
						}
					});
			});
		}
	}

	function userEditPass() {
		var ref = '#userEditPass';
		if ($(ref).length) {
			$(ref).submit(function (e) {
				e.preventDefault();
				var data = new FormData(this);
				requestApi(ref, data, 'user', 'POST')
					.done(function (res) {
						if (res.status) {
							$('#new_password').val('')
							$('#confirm_password').val('')
						}
					});
			});
		}
	}

	function userEditPassReset() {
		var ref = '#userEditPassReset';
		if ($(ref).length) {
			$(ref).submit(function (e) {
				e.preventDefault();
				var data = new FormData(this);
				requestApi(ref, data, 'user', 'POST')
					.done(function (res) {

						if (res.status) {
							$('#new_password').val('')
							$('#confirm_password').val('')
							$(ref + ' #changesuccess').html('')
							setTimeout(() => {
								location.reload()
							}, 2000);
						}
					});
			});
		}
	}

	function userRegister() {
		var ref = '#userRegister';
		if ($(ref).length) {
			$(ref).submit(function (e) {
				e.preventDefault();
				var data = new FormData(this);
				requestApi(ref, data, 'register', 'POST')
					.done(function (res) {
						if ($('.captcha-input')) {
							$('.captcha-input').val('')
							generateCaptcha()
						}
						if (res.status) {
							$('#action_verify').val('codeRegisterVerify');
							$('#modalRegister').modal('hide');
							if (res.data.code_verify) {
								$('#modalVerify').modal('show');
							} else {
								location.reload();
							}
						}
					});
			});
		}
	}

	function userLogin() {
		var ref = '#userLogin';
		if ($(ref).length) {
			$(ref).submit(function (e) {
				e.preventDefault();
				var data = new FormData(this);
				requestApi(ref, data, 'login', 'POST')
					.done(function (res) {
						if (res.status) {
							if (res.data.code_verify) {
								$('#modalLogin').modal('hide');
								$('#modalVerify').modal('show');
								$('#action_verify').val('codeRegisterVerify');
							} else {
								$('#modalLogin').modal('hide');
								location.reload();
							}
						}
					});
			});
		}
	}

	function userLogout() {
		$('#logout, #logout-md').click(function (e) {
			e.preventDefault();
			location.reload();
		});
	}

	function codeVerify() {
		var ref = '#codeVerify';
		if ($(ref).length) {
			$(ref).submit(function (e) {
				e.preventDefault();
				var data = new FormData(this);
				requestApi(ref, data, 'codeVerify', 'POST').done(function (res) {
					if (res.status) {
						$('#modalVerify').modal('hide');

						if (res.data.passReset) {
							window.location.href = CONFIG.pathSystem + 'passreset';
						} else {
							location.reload();
						}

					} else {
						if (res.data.codeAttempts) {
							$('#modalVerify').modal('hide');
							$('#modalMsg').modal('show');
							$('#modalMsg #title').html(res.title)
							$('#modalMsg #content').html('<span class="text-danger">' + res.message + '</span>')
						}
					}
					$('#code_verify').val('');
				});
			});
		}
	}

	function userPassReset() {
		const ref = '#userPassReset';
		if ($(ref).length) {
			$(ref).submit(function (e) {
				e.preventDefault();
				let data = new FormData(this);
				requestApi(ref, data, 'passReset', 'POST').done(function (res) {
					if (res.status) {
						$('#action_verify').val('codePassReset');
						$('#modalPassReset').modal('hide');
						$('#modalVerify').modal('show');
					}
				});
			});
		}
	}

	function announcerOnAir() {
		const ref = '.announcer-air-card';
		if ($(ref).length) {
			requestApi(ref, '', 'onAir', 'GET').done(function (res) {
				if (res.status) {
					$(ref + ' .info').removeClass('d-none')
					$(ref + ' .message').addClass('d-none')
					$(ref + ' .avatar img').attr('src', CONFIG.pathSystem + 'public/avatar/' + res.data.avatar).attr('alt', res.data.announcer)
					$(ref + ' .announcer').text(res.data.announcer)
					$(ref + ' .program').text(res.data.program)
					$(ref + ' .date').text(res.data.time)
					$(ref + ' .message').text('')
				} else {
					$(ref + ' .info').addClass('d-none')
					$(ref + ' .message').removeClass('d-none')
					$(ref + ' .message').html('<p class="mb-0">' + res.message + '</p>')
				}
			});
		}
	}

	function lastSeen() {
		if (CONFIG.clientId) {
			let data = new FormData();
			if ($('#rank_value').length || $('#points_value').length) {
				data.append('rank', true);
			}
			requestApi('#notref', data, 'lastSeen', 'POST').done(function (res) {
				if (res.status) {
					if ($('#rank_value').length || $('#points_value').length) {
						$('#rank_value').text(res.data.rank)
						$('#points_value').text(res.data.points)
					}
				}
			});
		}
	}

	function LoadAds() {
		const ref = '.adsPub';
		if ($(ref).length) {
			requestApi(ref, '', 'loadAds', 'GET').done(function (res) {
				if (res.data) {
					res.data.map((item) => {
						if (item.ads && item.ref) {
							let adsShow = ''
							//slide
							if (item.type == 'slide') {
								//init
								adsShow = adsRotation(item)
								$(item.ref + ' .carousel-inner').html(adsShow)
								//change resize
								window.addEventListener("resize", function (e) {
									adsShow = adsRotation(item)
									$(item.ref + ' .carousel-inner').html(adsShow)
								});
							} else {
								//fixed
								item.ads.map((item) => {
									if (item.link) {
										adsShow = `<a class="click-ads" href="${item.link}" target="${item.link_target}" id="${item.id}">
										<img class="img-fluid" src="${CONFIG.pathSystem + 'public/banner/' + item.image}" alt="${item.title}"></a>`
									} else {
										adsShow = `<img class="img-fluid" src="${CONFIG.pathSystem + 'public/banner/' + item.image}" alt="${item.title}">`
									}
								})
								$(item.ref).html(adsShow)
							}

						}
					})
				}
			});

			function adsRotation(item) {
				let adsShow = ''
				let adsContainer = document.querySelector(item.ref + ".ads-rotation").clientWidth
				let adsItem
				let adsCol
				let adsCount = 0

				if (item.size == '400x400') {
					if (adsContainer > 1000) {
						adsItem = 4
						adsCol = 3
					} else if (adsContainer > 768) {
						adsItem = 3
						adsCol = 4
					} else if (adsContainer < 768 && adsContainer > 420) {
						adsItem = 2
						adsCol = 6
					} else {
						adsItem = 1
						adsCol = 12
					}
				} else {
					if (adsContainer > 1000) {
						adsItem = 2
						adsCol = 6
					} else if (adsContainer > 768) {
						adsItem = 1
						adsCol = 12
					}
				}

				item.ads.map((v, k) => {
					adsCount++

					if (adsCount == 1) {
						adsShow += `<div class="carousel-item ${k == 0 ? 'active' : ''}"><div class="row justify-content-center">`
					}

					if (adsCount < adsItem) {
						adsShow += `
							<div class="col-${adsCol}" >
								<a class="click-ads" href="${v.link ? v.link : '#'}" target="${v.link_target}" id="${v.id}">
									<img class="img-fluid" src="${CONFIG.pathSystem + 'public/banner/' + v.image}" alt="${v.title}" />
									<div class="overlay"><div class="text"><i class="fas fa-link"></i></div></div>
								</a>
							</div>
						`
						if (item.ads.length == k + 1) {
							adsShow += '</div></div>'
						}

					} else {
						adsShow += `
								<div class="col-${adsCol}" >
									<a class="click-ads" href="${v.link ? v.link : '#'}" target="${v.link_target}" id="${v.id}">
										<img class="img-fluid" src="${CONFIG.pathSystem + 'public/banner/' + v.image}" alt="${v.title}" />
										<div class="overlay"><div class="text"><i class="fas fa-link"></i></div></div>
									</a>
								</div>
							</div>
						</div>
						`
						adsCount = 0
					}
				})
				return adsShow;
			}

		}
	}

	function clickAds() {
		const ref = '.adsPub';
		if ($(ref).length) {
			$(document).on('click', '.click-ads', function (e) {
				let data = new FormData();
				const id = $(this).attr('id');
				data.append('id', id);
				requestApi('#notref', data, 'clickAds', 'POST');
			});
		}
	}

	function chatBS() {
		var ref = '#chatBS';
		if ($(ref).length) {
			var refMsgs = $(ref + ' #messages');

			var scrollstatus = true;
			refMsgs.scroll(function (e) { scrollstatus = false; });
			refMsgs.scrollTop(refMsgs.prop("scrollHeight"))

			loadChat();
			var loadChatInterval = setInterval(() => { loadChat(); }, 5000);
			document.addEventListener('pronto.render', function (e) {
				clearInterval(loadChatInterval);
			});
			$(ref + ' #message-input button').click(function (e) {
				e.preventDefault();
				sendMsg()
			});

			$(ref + ' #message-input textarea').keypress(function (e) {
				if (e.which === 13 && !e.shiftKey) {
					e.preventDefault();
					sendMsg()
				}
			});

			$(ref + ' #usertoggle').click(function (e) {
				e.preventDefault();
				var userToggle = $(ref + ' #users').attr('class')

				if (!userToggle) {
					$(ref + ' #users').addClass('d-block')
					$(ref + ' .btn-user-close').removeClass('d-none')
					$(ref + ' .btn-user-open').addClass('d-none')
				} else {
					$(ref + ' #users').removeClass('d-block');
					$(ref + ' .btn-user-close').addClass('d-none')
					$(ref + ' .btn-user-open').removeClass('d-none')
				}

			});

			function sendMsg() {
				var message = $(ref + ' #message-input textarea')
				var data = new FormData();
				data.append('message', message.val());

				requestApi(ref, data, 'chat', 'POST')
					.done(function (res) {
						if (res.status) {
							message.val('')
							loadChat();
							refMsgs.scrollTop(refMsgs.prop("scrollHeight"))
						}
					});
			}

			function loadChat() {
				if (CONFIG.clientId) {
					requestApi(ref, '', 'chat', 'GET')
						.done(function (res) {
							if (res.status) {
								$(ref + ' #login-view').addClass('d-none');
								$(ref + ' .btn-user-open span').text(res.countOn);
								if (res.dataMsg) {
									$(ref + ' #messages ul').html('');
									$.each(res.dataMsg, function (key, value) {
										if (value.level == 0) {
											var level = ''
										} else if (value.level == 1) {
											var level = 'color_3'
										} else {
											var level = 'color_4'
										}
										$(ref + ' #messages ul').append(`
										<li class="d-flex">
											<img class="rounded-circle" src="${CONFIG.pathSystem + 'public/avatar/' + value.avatar}" alt="${value.full_name}">
											<div>
												<span>${value.full_name}</span>
												<span class="message ${level}">${value.message}</span>
											</div>
										</li>
									`);
									})
								}
								if (res.dataUser) {
									$(ref + ' #users ul').html('');
									$.each(res.dataUser, function (key, value) {
										if (value.level == 0) {
											var level = ''
										} else if (value.level == 1) {
											var level = 'color_1'
										} else {
											var level = 'color_2'
										}
										$(ref + ' #users ul').append(`<li class="color ${level}">${value.full_name}</li>`);
									})
								}

								if (scrollstatus) {
									refMsgs.scrollTop(refMsgs.prop("scrollHeight"))
								}

							} else {
								$(ref + ' #messages ul').html('');
								$(ref + ' #users ul').html('');
								$(ref + ' #login-view').removeClass('d-none');
							}
						});
				} else {
					$('#chatBS .btn-user-open').css('display', 'none');
				}
			}
		}
	}

	function playingNow() {
		var ref = '#player .player-radio'
		requestApi(ref, '', 'playingNow', 'GET')
			.done(function (res) {
				if (res.status) {
					if (res.data.playingNow) {
						$(ref + ' #playingNow').text(res.data.playingNow);
					} else {
						$(ref + ' #playingNow').text('...');
					}
					if (res.data.albumCover) {
						var albumCover = res.data.albumCover.replace('100x100', "300x300");
						//var albumCover = res.data.albumCover;
						$(ref + ' .player-info img').attr('src', albumCover);
					}

					if ('mediaSession' in navigator) {
						navigator.mediaSession.metadata = new MediaMetadata({
							title: res.data.trackName,
							artist: res.data.siteTitle,
							//album: res.data.siteTitle,
							artwork: [
								{ src: albumCover, sizes: '384x384', type: 'image/png' },
							]
						});
						console.log('init mediaSession metadata');
					} else {
						console.log('mediaSession not available');
					}
				}
			});
	}

	function generateCaptcha() {
		if (!CONFIG.clientId) {
			const $ref = $('.captcha-code-modal, .captcha-code')
			if ($ref) {
				requestApi('#noref', '', 'captchaCode', 'GET').done(function (res) {
					if (res.status) {
						let data = res.data
						$ref.html(`
							<div class="text-center mb-3">
								<img style="margin-bottom:6px;width:120px" src="${CONFIG.pathSystem}api/captchaImage" alt="${data.alt}">
								<div class="form-floating">
									<input type="text" class="form-control captcha-input" placeholder="${data.label}" name="captcha-input" required="" maxlength="6">
									<label>${data.label}</label>
								</div>
							</div>
						`)
					}
				})
			}
		}
	}

	document.addEventListener('show.bs.modal', function (e) {
		generateCaptcha()
	})

})(jQuery);

