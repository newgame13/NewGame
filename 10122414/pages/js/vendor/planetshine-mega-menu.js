var mega_fire_event;
(function(jQuery){
	 "use strict";
    jQuery(document).ready(function(){		//when DOM is ready
        mega_menu.init();
    });

    var event_type = 'resize';
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) == true )
    {
        event_type = 'orientationchange';
    }
    jQuery(window).bind(event_type, function() {
		clearTimeout(mega_fire_event);
        mega_fire_event = setTimeout(mega_menu.resize, 100);
	});
})(jQuery);

var mega_menu = {
	init: function() {
		jQuery(".nav li > a").each(function() {
			if (jQuery(this).next().length > 0) {
				jQuery(this).addClass("parent");
			};
		});

		jQuery(".togglemenu").click(function(e) {
			e.preventDefault();
			jQuery(this).toggleClass("active");
			jQuery(".nav").toggle();
		});

		//set featued image height
		jQuery('.post-block-90').each(function(){
			var postheight = jQuery(this).parents('li').find('.post-featured').height();
			jQuery(this).css('min-height', postheight);
		});

		//set affix for non mobile devices
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) == false )
        {
            jQuery(".mega-menu").affix({
                offset: {
					top: jQuery('#wpadminbar').outerHeight(true) + jQuery(".dock").outerHeight(true) + jQuery(".header").outerHeight(true)
                }
            });
        }

		mega_menu.mobile_dropdown_trigger();
	},
	resize: function() {
		mega_menu.mobile_dropdown_trigger();
	},
	adjust_menu: function() {
		var ww = document.body.clientWidth;

		if (ww < 975)
		{
			jQuery(".togglemenu").css("display", "inline-block");

			if (!jQuery(".togglemenu").hasClass("active"))
			{
				jQuery(".nav").hide();
			}
			else
			{
				jQuery(".nav").show();
			}

			jQuery(".nav li").unbind('hover');
			jQuery(".nav li").removeClass("hover");

			var custom_event = jQuery.support.touch ? "tap" : "click";

			jQuery(".nav li > a.mobile-dropdown-trigger").off(custom_event).on(custom_event, function(e){

				var parent = jQuery(this).parent("li");
				if(parent.hasClass('hover'))
				{
					parent.removeClass('hover');
				}
				else
				{
					parent.addClass('hover');
				}

				return false;
			});
		}
		else if (ww >= 975)
		{
			var custom_event = jQuery.support.touch ? "tap" : "click";
			jQuery(".togglemenu").css("display", "none");
			jQuery(".nav").show();
			jQuery(".nav li").removeClass("hover");
			jQuery(".nav li > a.mobile-dropdown-trigger").unbind(custom_event);

			jQuery(".nav li").hover(
				function(){
					jQuery(this).addClass('hover');
				},
				function(){
					jQuery(this).removeClass('hover');
				}
			);
		}
	},
	mobile_dropdown_trigger: function() {

		if(jQuery(window).outerWidth() < 975)
		{
			var items = jQuery('.mega-menu .nav li.dropdown');
			items.each(function(){

				if(jQuery(this).find('.mobile-dropdown-trigger').length < 1)
				{
					jQuery(this).children('a').eq(0).after('<a href="#" class="parent mobile-dropdown-trigger"><i></i></a>');
				}

			});
		}

		mega_menu.adjust_menu();
	}
};
