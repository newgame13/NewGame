var fireEvent;
(function(jQuery){
	 'use strict';
    jQuery(document).ready(function(){		//when DOM is ready
        theme.init();
    });
    jQuery(window).resize(function() {
        clearTimeout(fireEvent);
        fireEvent = setTimeout(theme.resizeEvent, 200);
	});
})(jQuery);
jQuery(window).load(function() {
    theme.resizePostCategorySliderOverlays();
	theme.resizeGalleryOverlays();
	theme.initAffixSidebar();
});

var theme = {
	mosaicTimeout: false,
    init: function() {
		theme.initOverlayClicks();
		theme.initPostTabSwitcher();
		theme.initCategorySliderSwitching();
		theme.initTopReviewsWidgetForm();
		theme.initSliderBlurOverlay();
		theme.initScrollTop();
		theme.resizePostCategorySliderOverlays();
		theme.resizePostSliderLargeOverlays();
		theme.resizeGalleryOverlays();
		theme.initGalleryLightbox();
		theme.initGallerySliderControls();
		theme.bindPostCategorySliderSlideResizeEvent();
		theme.initSocialShareButtons();
		theme.initWeatherWidget();
		theme.initDropdownCategoryPostTabs();
		theme.initLoginLightbox();
		theme.initSearchLightbox();
		theme.initLikeButtons();
		theme.initReviewSummary();
		theme.initReaderReviews();

		theme.initDockTrendingPosts();
		theme.initMoreCategoryPopup();
		theme.initLargeTrending();
		theme.initFeaturedPostPhoto();
		theme.initExclusivePosts();

		theme.activeMenuItemTitle();
		theme.IeEdgeFilters();
		theme.initTouchMenu();

		theme.addMobileBodyClass();

		theme.initHomepageSlider();
		
		theme.initTwitchStreamWidget();
		theme.initTwitchStreamBlock();
		
		theme.initRatingCircle();

        theme.preventMobileScrollHoverEvents();
	},
    resizeEvent: function() {
		theme.resizeSLiderBlurOverlay();
		theme.resizePostCategorySliderOverlays();
		theme.adjustGalleryLightboxHeight();
		theme.initLargeTrending();
		theme.initFeaturedPostPhoto();
		theme.resizeRatings();
    },
	initOverlayClicks: function() {

		jQuery('*[data-click-url]').click(function(){
			window.location.href = jQuery(this).data('click-url');
			return false;
		});

	},
	initPostTabSwitcher: function() {

		jQuery('.goodgame_sidebar_post_tabs .sorting .buttons a').click(function(){
			console.log(000);
            var parent = jQuery(this).parents('.goodgame_sidebar_post_tabs');
            var index = parent.find('.sorting .buttons a').index(jQuery(this));

			parent.find('.sorting .buttons a').removeClass('active');
            jQuery(this).addClass('active');

            parent.find('.switcher-tab-content').fadeOut(250).promise().done(function(){
                parent.find('.switcher-tab-content').eq(index).fadeIn(250);
            });

            return false;
        });

	},
	initCategorySliderSwitching: function() {

        jQuery('.dynamic-category-slider .buttons .btn-sort').click(function(e){

            e.preventDefault();

			if(jQuery(this).hasClass('active')) return false;

			var parent = jQuery(this).parents('.dynamic-category-slider');
			var is_platform = parent.data('platform');
			var block = 'slider-' + jQuery(this).attr('id').substring(4);

			//set tab item active
			parent.find('.buttons .btn-sort').removeClass('active');
			jQuery(this).addClass('active');

			parent.find('.dynamic-slide').fadeOut(300).promise().done(function(){

				var item = parent.find('#' + block);

				if(item.find('.goodgame-loader').length > 0)
				{
					item.show();

					var data = {
						action: 'load_post_slider_items',
						count: item.data('count'),
						is_platform: item.data('platform'),
						slug: item.data('slug'),
						unique_id: item.data('unique_id'),
						interval: item.data('interval'),
					};

					jQuery.post(goodgame_js_params.ajaxurl, data, function(response) {
						item.html(response).hide().fadeIn(300).promise().done(function(){
							theme.initMoreCategoryPopup();
							theme.resizePostCategorySliderOverlays();
							theme.initRatingCircle();
						});
					});
				}
				else
				{
					item.fadeIn(300).promise().done(function(){
						theme.resizePostCategorySliderOverlays();
					});
				}

			});

        });
    },
	initTopReviewsWidgetForm: function() {
		var form = jQuery('.form-top-reviews');
		form.find('select').change(function(){
			var current_form = jQuery(this).parents('form').eq(0);
			var data = current_form.serialize();
			var widget = current_form.parent('.post-block');
			var items_wrapper = widget.find('.items-wrapper');
			items_wrapper.height(items_wrapper.height());
			
			items_wrapper.fadeOut(300).promise().done(function(){
				items_wrapper.html('<div class="goodgame-loader"><div class="box"></div><div class="box"></div><div class="box"></div><div class="box"></div></div>');
				
				items_wrapper.fadeIn(300).promise().done(function(){
					jQuery.post(goodgame_js_params.ajaxurl, data, function(response) {
						items_wrapper.fadeOut(300).promise().done(function(){
							items_wrapper.html(response);
							items_wrapper.height('');
							items_wrapper.fadeIn(300).promise().done(function(){
								theme.initRatingCircle();
							});
						});
					});
				});
			});
		});
	},
	initSliderBlurOverlay: function() {
		theme.resizeSLiderBlurOverlay();

		//show slider after the init
		jQuery('.goodgame-slider ').hide().css('visibility','visible').fadeIn(200);
	},
	resizeSLiderBlurOverlay: function() {
		var slidewidth = jQuery('.goodgame-slider .slide').width();
		var containerwidth = jQuery('.goodgame-slider .slide .container').width();
		var overlay = jQuery('.goodgame-slider .slide .overlay-wrapper').width();
		var sidemargin = (slidewidth - containerwidth) / -2;

		jQuery('.goodgame-slider .slide .overlay').css('left', sidemargin).css('right', - (containerwidth - overlay) + sidemargin);
	},
    setFeaturedOverlayPosition: function(elem) {

        elem.css('height', 'auto');

        var postfeaturedheight = elem.parents('.post-block').outerHeight();

        var btnheight = 0;
        if(jQuery(window).outerWidth() > 992) {	//don't hide the read more on mobile
            var btnheight = elem.find('.title .btn').eq(0).outerHeight(true);
        }

        elem.css('height', postfeaturedheight);
        var overlayposition = elem.outerHeight() - elem.find('.overlay-wrapper').outerHeight();

        elem.find('.overlay-wrapper .overlay').css('top', -overlayposition - btnheight);
        elem.find('.overlay-wrapper').css('bottom', (btnheight*-1) ); //position read more below the content frame
        elem.find('.overlay-wrapper .overlay').css('bottom', btnheight);
    },
	recalculateOverlayPosition: function(elem) {

		var parent = elem.parents('.post-featured');
		var overlayposition = parent.outerHeight() - parent.find('.overlay-wrapper').outerHeight();

		if(elem.hasClass('hovered'))
		{
			parent.find('.overlay').animate({
				top: -overlayposition,
				bottom: 0
			}, {duration: 150, queue: false});

			parent.find('.overlay-wrapper').animate({
				bottom: 0
			}, {duration: 150, queue: false});
		}
		else
		{
			var btnheight = elem.find('.btn').eq(0).outerHeight(true);

			parent.find('.overlay').animate({
				top: -overlayposition -btnheight,
				bottom: btnheight
			}, {duration: 150, queue: false});

			parent.find('.overlay-wrapper').animate({
				bottom: -btnheight
			}, {duration: 150, queue: false});
		}

	},
	resizePostCategorySliderOverlays: function() {
		jQuery('.post-video').each(function(){
			var videothumbnail = jQuery(this).find('.image').outerHeight();
			jQuery(this).find('.overlay-wrapper').css('height', videothumbnail);
		});
	},
	resizeGalleryOverlays: function(){
		jQuery('.post-gallery').each(function(){
			var videothumbnail = jQuery(this).find('.image').outerHeight();
			jQuery(this).find('.overlay-wrapper').css('height', videothumbnail);
		});
	},
	bindPostCategorySliderSlideResizeEvent: function() {
		jQuery('.dynamic-category-slider').on('slid.bs.carousel', function () {
			theme.resizePostCategorySliderOverlays();
		});
	},
    resizePostSliderLargeOverlays: function(){
        jQuery('.goodgame_post_carousel .article-carousel .carousel').on('slid.bs.carousel', function (e) {

            jQuery(e.currentTarget).find('.active .post-featured').each(function(){

                var overlayposition = jQuery(this).outerHeight() - jQuery(this).find('.overlay-wrapper').outerHeight();
                jQuery(this).find('.overlay').css({ top: -overlayposition});

            });
        });
    },
    initComments: function() {
        //form submit
        jQuery('#comment-submit').click(function(){
            jQuery('#hidden-submit').trigger('click');
            return false;
        });
    },
	initScrollTop: function() {
		var offset = 500;
		var duration = 300;

		jQuery(window).scroll(function() {
			if (jQuery(this).scrollTop() > offset) {
				jQuery('.back-to-top').fadeIn(duration);
			}
			else {
				jQuery('.back-to-top').fadeOut(duration);
			}
		});

		jQuery('.back-to-top').click(function(event) {
			event.preventDefault();
			jQuery('html, body').animate({scrollTop: 0}, duration);
			return false;
		});
	},
	initGallerySliderControls: function() {
		if(jQuery('body').hasClass('single-gallery'))
		{

			jQuery('.thumbs .thumb a').click(function(){

				var parent = jQuery(this).parents('.thumbs');

				var index = parent.find('a').index(jQuery(this));
				jQuery('.gallery-slideshow').cycle(index);

				jQuery('.thumbs .thumb').removeClass('active');
				jQuery('.thumbs').each(function(){
					jQuery(this).find('.thumb').eq(index).addClass('active');
				});

				var total_slides = jQuery('.single-photo-thumbs .controls').data('total');
				jQuery('.single-photo-thumbs .controls s').html((index+1) + ' / ' + total_slides);

				return false;
			});

			jQuery('.gallery-slideshow').on('cycle-update-view', function(event, optionHash, slideOptionsHash, currentSlideEl) {

				var index = optionHash.currSlide;

				jQuery('.thumbs .thumb').removeClass('active');
				jQuery('.thumbs').each(function(){
					jQuery(this).find('.thumb').eq(index).addClass('active');
				});

				var total_slides = jQuery('.single-photo-thumbs .controls').data('total');
				jQuery('.single-photo-thumbs .controls s').html((index+1) + ' / ' + total_slides);

			});

			jQuery('.gallery-slideshow').on('cycle-initialized', function(event, optionHash, slideOptionsHash, currentSlideEl) {

				jQuery(this).hide().css('opacity', 1).fadeIn(500);

			});

			jQuery('.gallery-slideshow').cycle();
		}
	},
	initSocialShareButtons: function() {

		if(jQuery('.share-button').length > 0)
		{
			var button = jQuery('.share-button').eq(0);

			config = {
				url: button.data().url,
				title: button.data().title,
				description: button.data().description,
				image: button.data().image,
				ui: {
					buttonText: button.data().buttonText,
					icon_font: false,
					flyout: 'bottom right'
				},
				networks: {
					whatsapp: {
						enabled: false
					},
					reddit: {
						enabled: false
					},
					email: {
						enabled: false
					}
				}
			};

			var share = new ShareButton(config);
			//    flyout:       // change the flyout direction of the shares. chose from `top left`, `top center`, `top right`, `bottom left`, `bottom right`, `bottom center`, `middle left`, or `middle right` [Default: `top center`]

		}


        //secondary share
        jQuery('.social.share-popup > a').click(function(){

            var href = jQuery(this).attr('href');
            window.open(href, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');

            return false;
        });
	},
	initWeatherWidget: function() {

		if(jQuery('.weather-ajax-container').length > 0)
		{
			var cached = theme.getWeatherWidgetCache();

			if(cached !== false && cached.length > 0)
			{
				jQuery('.weather-ajax-container').html(cached);
			}
			else
			{
				var data = {
					action: 'weather_widget',
				};

				jQuery.post(goodgame_js_params.ajaxurl, data, function(response) {

					jQuery('.weather-ajax-container').html(response);
					theme.setWeatherWidgetCache(response);
				});
			}
		}
	},
	setWeatherWidgetCache: function(data) {
		if(typeof(Storage) !== "undefined") {

			sessionStorage.setItem('weatherWidget', data);
		}
	},
	getWeatherWidgetCache: function() {
		if(typeof(Storage) !== "undefined") {

			var cached = sessionStorage.getItem('weatherWidget');
			if(typeof cached !== "undefined" && cached !== null)
			{
				return cached;
			}
		}

		return false;
	},
	initDropdownCategoryPostTabs: function() {

		if(jQuery('.goodgame_dropdown_category_posts').length > 0)
		{

			jQuery('.mega-menu-wrapper').on('click', '.goodgame_dropdown_category_posts .sorting a', function(){

				var href = jQuery(this).attr('href');
				jQuery(this).siblings().removeClass('active');
				jQuery(this).addClass('active');

				var items = jQuery(href);
				if(typeof items != 'undefined')
				{
					jQuery(this).parents('.goodgame_dropdown_category_posts').find('.items').hide();
					items.show();

					jQuery(this).parents('.goodgame_dropdown_category_posts').find('.btn-more a').attr('href', items.data('url'));

				}

				return false;

			});

		}

	},
	initLoginLightbox: function() {

		jQuery('.login .show-lightbox').click(function(){
			jQuery('body').addClass('lightboxed-login');
		});

		jQuery('.lightbox .close').click(function(){
			jQuery('body').removeClass('lightboxed-login');
		});
	},
	initGalleryLightbox: function() {
		jQuery('.galleries .btn-maximize').click(function(){

            jQuery('.lightbox-gallery .container-fluid').height(jQuery(window).outerHeight());

			jQuery('.lightbox-gallery').removeClass('lightbox-hidden');
			jQuery('body').addClass('lightboxed-gallery');
			return false;
		});
		jQuery('.lightbox .close').click(function(){
			jQuery('body').removeClass('lightboxed-gallery');
			jQuery('.lightbox-gallery').addClass('lightbox-hidden');
			return false;
		});

		theme.adjustGalleryLightboxHeight();
	},
	adjustGalleryLightboxHeight: function() {
		jQuery('.lightbox-gallery').each(function(){

			var vh = jQuery( window ).height();
			var wrap = jQuery(this).find('.image-wrapper');

			var title = wrap.find('.gallery-title').outerHeight(true);
			var thumbs = wrap.find('.single-photo-thumbs').outerHeight(true);
			var margin_b = 80;

			console.log(vh);
			console.log(title);
			console.log(thumbs);

			wrap.find('.gallery-slideshow').height(vh - title - thumbs - margin_b);
		});
	},
	initSearchLightbox: function() {

		jQuery('.lightbox-search .container > .row').each(function(){
			var lightboxwidth = jQuery(this).outerWidth();
			var searchbuttonwidth = jQuery(this).find('.btn-search-lightbox').outerWidth();
			jQuery(this).find('.search-input-lightbox').css('width', lightboxwidth - searchbuttonwidth);
		});

		jQuery('.search-launcher').click(function(){
			jQuery('body').addClass('lightboxed-search');
			return false;
		});

		jQuery('.lightbox .close').click(function(){
			jQuery('body').removeClass('lightboxed-search');
			return false;
		});
	},
	initLikeButtons: function() {

		jQuery('.post-controls .like, .post-controls .dislike').click(function(){

			var type = 1;
			if(jQuery(this).hasClass('dislike'))
			{
				type = 2;
			}

			var parent = jQuery(this).parents('.post-controls');
			var postid = parent.attr('id').substring(7);

			var nonce = parent.data('nonce');

			var data = {
				action: 'post_like',
				id: postid,
				type: type,
				_ajax_nonce: nonce
			};

			jQuery.post(goodgame_js_params.ajaxurl, data, function(response) {

				jQuery('.post-controls .likes').html(response.likes);
				jQuery('.post-controls .dislikes').html(response.dislikes);

				var percent = (response.likes/(response.likes + response.dislikes)) * 100;
				jQuery('.post-controls .bar s').width(percent + '%');

			}, 'json');

			return false;
		});
	},
	initReviewSummary: function() {
        jQuery('.review-summary-gg').bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
            if (isInView === true) {

                var bar_w = jQuery(this).find('.row .bar').width();
				var review_item = jQuery(this);

                jQuery(this).find('.row .bar s').each(function(){
                    var percent = jQuery(this).attr('data-value');
                    var add_width = ((percent*bar_w)/100)+'px';
                    jQuery(this).animate({
                        'width': '+=' + add_width
                    }, 1000, 'easeInQuart').promise().done(function(){
						theme.displayPreviousRating(review_item.find('.reader-reviews'));
					});
                });
                jQuery(this).unbind('inview');
            }
        });
    },
	initReaderReviews: function() {
		if(jQuery('.reader-reviews').length > 0)
		{
			jQuery('.reader-reviews').each(function(){

				var review_item = jQuery(this);
				var contain = jQuery(this).find('.bar');
				var bar_width = contain.width();
				var grip = contain.find('.grip');
				var saved = review_item.data('msg_saved');

				grip.draggable({
					containment: contain,
					axis: 'x',
					cursor: 'move',
					drag: function(event, ui) {

						theme.displayRatingStars(grip, bar_width);
					},
					stop: function(event, ui) {

						theme.snapRating(review_item, parseInt(grip.css('left')), bar_width);
						theme.displayRatingStars(grip, bar_width);

						var result = theme.getStarRating(parseInt(grip.css('left')), bar_width, '');

						if(result)
						{
							var postid = review_item.data('post_id');
							var nonce = review_item.data('nonce');

							if(result.length === 1) { result += '0'; }

							var data = {
								action: 'post_reader_rate',
								id: postid,
								rating: result,
								_ajax_nonce: nonce
							};

							jQuery.post(goodgame_js_params.ajaxurl, data, function(response) {

								if(response.status === 'ok')
								{
									var star_class = '';

									if(typeof String(response.rating)[1] !== 'undefined' && String(response.rating)[1] == '5')
									{
										star_class = 's-' + String(response.rating)[0] + '-' + String(response.rating)[1];
									}
									else
									{
										star_class = 's-' + String(response.rating)[0];
									}

									grip.find('.tooltip').prepend(saved);
									review_item.find('.bar s').width((response.rating * 2) + '%');
									review_item.find('.overview-title i').attr('class', 'stars rating ' + star_class);
								}

							}, 'json');

						}
					}
				});

			});
		}
	},
	displayRatingStars: function(grip, bar_width) {
		var result = theme.getStarRating(parseInt(grip.css('left')), bar_width, '-');
		if(result)
		{
			grip.find('.tooltip').html('<i class="stars rating s-' + result + '"></i>');
		}
	},
	displayPreviousRating: function(review_item) {

		var postid = review_item.data('post_id');
		var rating = String(getCookie('goodgame_reader_rate_' + postid));

		if(rating == 'false') return false;

		var contain = review_item.find('.bar');
		var bar_width = contain.width();
		var current_progress = contain.find('s').width();
		var grip = contain.find('.grip');

		var your = review_item.data('msg_your');

		var star_class = '';

		if(typeof rating[1] !== 'undefined' && rating[1] == '5')
		{
			star_class = 's-' + rating[0] + '-' + rating[1];
		}
		else
		{
			star_class = 's-' + rating[0];
		}

		grip.find('.tooltip').html(your + '<i class="stars rating ' + star_class + '"></i>');

		var left = (bar_width * rating * 2) / 100;

		if(current_progress > left)
		{
			grip.css('right', (current_progress-left) + 'px');
		}
		else
		{
			grip.css('right', (current_progress-left)*-1 + 'px');
		}

	},
	getStarRating: function(pos, width, separator) {

		var stars = Math.round((pos / width) * 5 * 10 ) / 10;
		var parts = (stars + '').split('.');
		var result = false;

		if(typeof parts[0] !== 'undefined')
		{
			if(typeof parts[1] === 'undefined') { parts[1] = '0'; }

			if(parseInt(parts[1]) >= 0 && parseInt(parts[1]) < 3)
			{
				result = parts[0];
			}
			else if(parseInt(parts[1]) >= 3 && parseInt(parts[1]) < 8)
			{
				result = parts[0] + separator + '5';
			}
			else	//round up
			{
				result = parseInt(parts[0]) + 1;
			}
		}

		return String(result);
	},
	snapRating: function(review_item, pos, width) {

		var stars = Math.round((pos / width) * 5 * 10 ) / 10;
		var star_val = (Math.round(stars * 2) / 2).toFixed(1) * 10;
		var snap_pos = (width / 50) * star_val;
		review_item.find('.bar .grip ').css('left', snap_pos );
	},
	resizeRatings: function() {

		jQuery('.review-summary').each(function(){

			var bar_w = jQuery(this).find('.row .bar').width();

			jQuery(this).find('.row .bar s').each(function(){
				var percent = jQuery(this).attr('data-value');
				var add_width = ((percent*bar_w)/100)+'px';
				jQuery(this).width(add_width);
			});
		});
	},
	initDockTrendingPosts: function() {
		jQuery('#trending-posts').carousel();
	},
	initMoreCategoryPopup: function() {

		jQuery( '.show-more').unbind('click');
		jQuery('.show-more').on('click', function(e) {

			var postid = false;

			if(jQuery('.dynamic-more-dropdown').length > 0)
			{
				postid = jQuery('.dynamic-more-dropdown').eq(0).find('.more-dropdown').data('post_id');
				jQuery('.dynamic-more-dropdown').remove();
			}

			var original = jQuery(this).parent().find('.more-dropdown').eq(0);
			var offset = original.offset();
			var dropdown = original.clone();

			//simply close the dropdown if, it's clicked again
			if(postid)
			{
				if(postid === original.data('post_id'))
				{
					return false;
				}
			}

			dropdown.addClass('active');
			dropdown.wrap('<div class="tags"></div>');
			dropdown = dropdown.parent();

			dropdown.offset({left: offset.left, top: offset.top});
			dropdown.addClass('dynamic-more-dropdown');
            dropdown.css('position', 'absolute');

			jQuery('body').after(dropdown);

			return false;
		});

		//remove all dropdowns on body click
		jQuery('.focus').click(function(){
			if(jQuery('.dynamic-more-dropdown').length > 0)
			{
				jQuery('.dynamic-more-dropdown').remove();
			}
		});

	},
	initLargeTrending: function() {
		jQuery('.trending-posts-main-content').each(function(){
			var postswidth = jQuery(this).outerWidth();
			var titlewidth = jQuery(this).find('.title-default').outerWidth();
			var controlswidth = jQuery(this).find('.controls').outerWidth();
			jQuery(this).find('.carousel-inner').css('width', postswidth - titlewidth - controlswidth -31);
		});
	},
	initFeaturedPostPhoto: function() {
		var window_height = jQuery(window).outerHeight();
		var admin_bar_height = jQuery('#wpadminbar').outerHeight(true);
		var dock_height = jQuery('.dock').outerHeight();
		var header_height = jQuery('.header').outerHeight(true);
		var megamenu_height = jQuery('.mega-menu-wrapper').outerHeight();
		var megamenu_half_height = Math.floor(megamenu_height / 2);
		var controls_height = jQuery('.controls').eq(0).outerHeight(true);
		
		var img_container = jQuery('.featured-post-content');
		
		//set height of featured image container
		img_container.height( window_height - admin_bar_height - dock_height - header_height - megamenu_half_height - controls_height + 1 );
		theme.recalculateOverlayPosition(img_container.find('.title'));
		jQuery('body.featured-post .post-page-title, body.featured-post .post-page-title .overlay-wrapper').hide().css('visibility','visible').fadeIn(200);
	
		if(jQuery(window).outerWidth() >= 992)
		{
			//title affix
			jQuery('body.featured-post .post-page-title').affix({
				offset: {
					top: admin_bar_height + dock_height + header_height + megamenu_half_height - 1
				}
			});
			
			//wrapper affix
			jQuery('body.featured-post .parallax-wrapper').affix({
				offset: {
					top: admin_bar_height + dock_height + header_height + megamenu_half_height - 1
				}
			});
			//affix adjust margin top
			jQuery('body.featured-post .parallax-wrapper').on('affix.bs.affix',function(){
				var windowheight = jQuery(window).outerHeight();
				var headerheight = jQuery('.header').outerHeight();
				var dockheight = jQuery('.dock').outerHeight();
				var megamenuheight = jQuery('.mega-menu-wrapper').outerHeight();
				jQuery(this).css('margin-top', window_height - admin_bar_height - dock_height - header_height - megamenu_height - controls_height + 1);
			});
			//adjust opacity on scroll
			jQuery(window).scroll(function (){
				if(jQuery('.post-page-title').hasClass('affix'))
				{
					var headerheight = jQuery('.header').outerHeight(true);
					var dockheight = jQuery('.dock').outerHeight(true);
					var megamenuheight = (jQuery('.mega-menu-wrapper').outerHeight() / 2);
					var currentScrollTop = jQuery(window).scrollTop() - headerheight - dockheight - megamenuheight - 37;
					var contentHeight = jQuery('body.featured-post .affix .featured-post-content').height();
					var opacity = 1 - currentScrollTop/contentHeight;
					if (opacity < 0.4) {
						opacity = 0.4;
					}
					jQuery('body.featured-post .affix .featured-post-content').css('opacity',opacity);
				}
				else
				{
					jQuery('body.featured-post .affix .featured-post-content').css('opacity', 1);
				}
			});
		}
	},
	initExclusivePosts: function() {
		jQuery('.post-exclusive').each(function(){
			var height = jQuery(this).outerHeight(true);
			jQuery(this).find('.image, .text > .title').css('height', height);
		});
	},
	activeMenuItemTitle: function() {

		if(jQuery('.mega-menu').length > 0)
		{

			var active = jQuery('.mega-menu .menu-item.active');
			if(active.length > 0)
			{
				jQuery('.mega-menu .togglemenu span').text(active.find('a > span').eq(0).text());
			}

		}
	},
	IeEdgeFilters: function() {
		if(/Edge/.test(navigator.userAgent))
		{
			jQuery('html').addClass('no-cssfilters');
		}
	},
	initAffixSidebar: function() {
        if(goodgame_js_params.enable_sidebar_affix === 'on' && !isMobileDevice())
        {
			//regular sidebar
			if(jQuery('.sidebar').length > 0 && jQuery(window).width() > 970-15)
            {
                var main_content = jQuery('.main-content');
                var sidebar = jQuery('.sidebar');
				var menu_offset = 45;	//affixed sidebar height
                if(main_content.outerHeight() > sidebar.outerHeight())
                {
					var offset_top;
					if(jQuery('body').hasClass('featured-post'))
					{
						var admin_bar_height = 0;
							if(jQuery('#wpadminbar').length > 0) admin_bar_height = jQuery('#wpadminbar').outerHeight(true);
						var dock_height = 0;
							if(jQuery('.dock').length > 0) dock_height = jQuery('.dock').outerHeight(true);
						var header_height = jQuery('.header').outerHeight(true);
						var menu_half_height = 37;
						var overlay_height = jQuery('.featured-post-content').height();
						var content_padding = 40;
						offset_top = admin_bar_height + dock_height + header_height + menu_half_height + overlay_height + content_padding - menu_offset;
					}
					else
					{
						offset_top = sidebar.offset().top - menu_offset;
					}
                    jQuery('.sidebar').wrapInner('<div class="sidebar-affix-wrap affix-top"></div>');
					jQuery('.sidebar-affix-wrap').width(jQuery('.sidebar').width());
                    jQuery('.sidebar-affix-wrap').affix({
                        offset: {
                            top: offset_top,
                            bottom: function () {
                                return (this.bottom = jQuery('.footer').outerHeight(true) + jQuery('.copyright').outerHeight(true) + 50)
                            }
                        }
                    });
                }
            }
			//home affix
			if(jQuery('.sidebar-affix').length > 0 && jQuery(window).width() > 970-15)
            {
                jQuery('.sidebar-affix').each(function(){
					var sidebar = jQuery(this);
					var main_content = sidebar.siblings('.wpb_column').eq(0);
					var menu_offset = 45;	//affixed sidebar height
					if(main_content.outerHeight() > sidebar.outerHeight())
					{
						sidebar.wrapInner('<div class="sidebar-affix-wrap affix-top"></div>');
						sidebar.find('.sidebar-affix-wrap').width(sidebar.width());
						jQuery('.sidebar-affix-wrap').affix({
							offset: {
								top: sidebar.parent().offset().top - menu_offset,
								bottom:  jQuery(document).height() - (sidebar.parent().offset().top + sidebar.parent().height())
							}
						});
					}
				});
			}
        }
    },
	initTouchMenu: function() {
        if('ontouchstart' in document)
        {

            //no dropdown
			jQuery('.mega-menu .nav > .menu-item:not(.dropdown) > a').on('touchstart', function(){
				if(jQuery(window).outerWidth() > 992)
				{
					return true;
				}
			});

            //first level of dropdowns
            jQuery('.mega-menu .nav > .menu-item.dropdown > .dropdown-toggle').on('touchstart', function(){

				if(jQuery(window).outerWidth() > 992)
				{
					var current_item = jQuery(this);
					//if there are other open menus, hide them
					if(jQuery('.nav .menu-item.dropdown.hover .dropdown-toggle').not(this).length > 0)
					{
						jQuery('.nav .menu-item.dropdown.hover').each(function(){
							if(current_item.parent() !== jQuery(this))
							{
								jQuery(this).removeClass('hover');
							}
						});
					}

					var parent = jQuery(this).parent();
					if(!parent.hasClass('hover'))
					{
						jQuery(this).parent().addClass('hover');
						return false;
					}
				}
            });

            //second level of dropdowns
            jQuery('.mega-menu .nav > .menu-item.dropdown .dropdown > a').on('touchstart', function(){
				if(jQuery(window).outerWidth() > 992)
				{
					var current_item = jQuery(this).parent();

					//if there are other open menus, hide them
					if(jQuery('.nav .menu-item.dropdown .dropdown').not(current_item).length > 0)
					{
						jQuery('.nav .menu-item.dropdown .dropdown.hover').each(function(){
							if(current_item.parent() !== jQuery(this))
							{
								jQuery(this).removeClass('hover');
							}
						});
					}

					if(!current_item.hasClass('hover'))
					{
						current_item.addClass('hover');
						return false;
					}
				}
            });

            //close menu
			jQuery('.main-content-wrapper, .header, .footer').on('touchstart', function(){
				if(jQuery(window).outerWidth() > 992)
				{
					var open = jQuery('.mega-menu .nav .hover');
					if(open.length > 0)
					{
						open.removeClass('hover');
					}
				}
			});

        }
    },
    addMobileBodyClass: function() {

        if(isMobileDevice())
        {
            jQuery('body').addClass('mobile-device');
        }
    },
	initHomepageSlider: function() {

        var owl = jQuery('.owl-carousel');

        owl.owlCarousel({
			  items: 4,
			  pagination: true,
			  navigation: true,
			  navigationText: ['<span>'+goodgame_js_params.slider_prev+'</span>','<span>'+goodgame_js_params.slider_next+'</span>'],
//            singleItem: true,
//            slideSpeed : 500,
//            paginationSpeed : 500,
//            afterAction : function(elem){
//                var indicators = elem.siblings('.carousel-indicators');
//                indicators.find('li').removeClass('active');
//                indicators.find('li').eq(this.owl.currentItem).addClass('active');
//            }
        });
    },
	initRatingCircle: function() {

		window.randomize = function() {
			jQuery('.radial-progress').each(function() {
				var transform_styles = ['-webkit-transform', '-ms-transform', 'transform'];
		  jQuery(this).find('span').fadeTo('slow', 1);
				var score = jQuery(this).data('score');
				var deg = (((100 / 10) * score) / 100) * 180;
				var rotation = deg;
				var fill_rotation = rotation;
				var fix_rotation = rotation * 2;
				for(i in transform_styles) {
					jQuery(this).find('.circle .fill, .circle .mask.full').css(transform_styles[i], 'rotate(' + fill_rotation + 'deg)');
					jQuery(this).find('.circle .fill.fix').css(transform_styles[i], 'rotate(' + fix_rotation + 'deg)');
				}
			});
		};
		setTimeout(window.randomize, 200);
	},
	initTwitchStreamWidget: function(){
		var widgets = jQuery('.widget-default.goodgame_twitch_stream');
		
		if(widgets.length > 0)
		{
			widgets.each( function (){
				var curr_item = jQuery(this);
				var username = curr_item.find('.post-block').data('username');
				var data = {
					action: 'load_twitch_stream_widget',
					username: username
				};

				jQuery.post(goodgame_js_params.ajaxurl, data, function(response) {
					curr_item.find('.post-block').html(response).hide().fadeIn(300);
					theme.initTwitchPlayer('#' + curr_item.attr('id') + ' .twitch-iframe');
				});
			});

		}
	},
	initTwitchStreamBlock: function(){
		var blocks = jQuery('.twitch-stream-wrapper');
		
		if(blocks.length > 0)
		{
			blocks.each( function (){
				var curr_item = jQuery(this);
				var username = curr_item.data('username');
				var data = {
					action: 'load_twitch_stream_vc_block',
					username: username
				};

				jQuery.post(goodgame_js_params.ajaxurl, data, function(response) {
					curr_item.html(response).hide().fadeIn(300);
					theme.initTwitchPlayer('#' + curr_item.find('.twitch-iframe').attr('id'));
				});
			});
		}
	},
	initTwitchPlayer: function(target_id){
		var block;
		
		if(jQuery(target_id).length > 0) {
			block = jQuery(target_id);
		} else {
			return;
		}

		block.children('.btn-play').click(function(){
			var video = jQuery(this).parent('.twitch-iframe');
			var id = video.attr('id');
			var channel = video.data('channel');
			video.html('');

			var options = {
//				width: 854,
//				height: 480,
//				video: "{VIDEO_ID}",
				playsinline: false,
				channel: channel
			};
			var player = new Twitch.Player(id, options);
			player.setVolume(0.5);
		});
	},
    preventMobileScrollHoverEvents: function() {
        if (jQuery('html').hasClass('touchevents')) {

            var body = document.body, timer;

            window.addEventListener('scroll', function () {
                clearTimeout(timer);
                if (!body.classList.contains('disable-hover')) {
                    body.classList.add('disable-hover')
                }

                timer = setTimeout(function () {
                    body.classList.remove('disable-hover')
                }, 300);
            }, false);
        }
    }
};

//split array in chunks
function chunk (arr, len) {

  var chunks = [],
      i = 0,
      n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }

  return chunks;
}

function calcParallax(tileheight, speedratio, scrollposition) {
  //    by Brett Taylor http://inner.geek.nz/
  //    originally published at http://inner.geek.nz/javascript/parallax/
  //    usable under terms of CC-BY 3.0 licence
  //    http://creativecommons.org/licenses/by/3.0/
  return ((tileheight) - (Math.floor(scrollposition / speedratio) % (tileheight+1)));
}

function getCookie(name){
    var pattern = RegExp(name + '=.[^;]*')
    matched = document.cookie.match(pattern)
    if(matched){
        var cookie = matched[0].split('=')
        return cookie[1]
    }
    return false
}

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = '; expires='+date.toGMTString();
    }
    else var expires = '';
    document.cookie = name+'='+value+expires+'; path=/';
}

function isMobileDevice() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        return true;
    }
    return false;
}