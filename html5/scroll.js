$('document').ready(function() {
	var container = $('#container'),
		wrapper = $('#wrapper'),
	    baseObj = {
			window_width: 0,
			window_height: 0,
			main_height: 0
		};
		
	var init = (function() {
		baseObj.window_width = $(window).width();
		baseObj.window_height = $(window).height();
		baseObj.main_height = $('#main_frame').height();
		console.log('window width ' + baseObj.window_width);
		console.log('window height ' + baseObj.window_height);
		console.log('main height ' + baseObj.main_height);
		
		container.css({  
			width: baseObj.window_width,
			height: baseObj.window_height,
			//overflow: 'hidden'
		});	
		/*
		wrapper.css({
			width: baseObj.window_width + 20,
			height: baseObj.window_height + 10,
			overflow: 'scroll'
		})	
		*/
	}());
	
	// 接受对象 return x, y

	container.bind("mousewheel", function(e){
		var scroll_bar = $('#scroll_bar');
		console.log(e.originalEvent.wheelDelta);
		var cc = (e.originalEvent.wheelDelta / 120) * 20 ;		
		
		console.log($('#main_frame').css('top'));
		var move = $('#main_frame').css('top');
		if (cc < 0) {
			move += Math.abs(cc);
		}
		//console.log(scroll_top);
		console.log(move);		
		//scroll_bar.fadeIn().css({
		//	top: scroll_top
		//});		
	});	
	
});