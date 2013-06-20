	
	var frame_index, frame_start, frame_intro, frame_wiki, frame_chat, frame_social, frame_share,
	    frame_shopping, frame_radio, frame_discover;
	    
	frame_index = {
		id: '#index',
		width: 100 + '%',
		height: 1056,
		y_show: 0,
		y_hidden: 1057,
		background: ''
	};
	frame_start = {
		id: '#start',
		width: 927,
		height: 425,
		y_show: 1056,
		y_hidden: 1482,
		background: ''	
	};
	frame_intro = {
		id: '#intro',
		width: 927,
		height: 5000,
		y_show: 1481,
		y_hidden: 6482,
		background: ''	
	};
	frame_wiki  = {
		id: '#wiki',
		width: 927,
		height: 2872,
		y_show: 6481,
		y_hidden: 9354,
		background: ''	
	};
	frame_chat  = {
		id: '#chat',
		width: 927,
		height: 2200,
		y_show: 9353,
		y_hidden: 11554,
		background: ''	
	};
	frame_social = {
		id: '#social',
		width: 927,
		height: 3600,
		y_show: 11553,
		y_hidden: 15153,
		background: ''	
	};
	frame_share = {
		id: '#share',
		width: 927,
		height: 2600,
		y_show: 15153,
		y_hidden: 17754,
		background: ''	
	};
	frame_shopping = {
		id: '#shopping',
		width: 927,
		height: 3600,
		y_show: 17753,
		y_hidden: 21354,
		background: ''	
	};
	frame_radio = {
		id: '#radio',
		width: 927,
		height: 1400,
		y_show: 21353,
		y_hidden: 22754,
		background: ''
	};
	frame_discover = {
		id: '#discover',
		width: 927,
		height: 2900,
		y_show: 22753,
		y_hidden: 25654,
		background: '' 	
	};
	var container = $('#container');
		
	var baseObj = {
			window_width: 0,
			window_height: 0,
			main_height: 0
		};
		
	var init = (function() {
		baseObj.window_width = $(window).width();
		baseObj.window_height = $(window).height();
		baseObj.main_height = $('#main_frame').height();
		
		//console.log('window width ' + baseObj.window_width);
		//console.log('window height ' + baseObj.window_height);
		//console.log('main height ' + baseObj.main_height);
		
		container.css({  
			width: baseObj.window_width,
			height: baseObj.window_height,
			overflow: 'hidden'
		});	
	}());
	console.dir(baseObj);
	
	var SpeedToAxis = function(obj) {
		var axis = 0,
			max_delta = 0;         //缓存最大的加速度
			
		var option = $.extend({
			max: 20,
			min: 2
		}, obj);
		
		console.log(option);
		
		return function(delta) {
			var offset = 0;
			if (delta === 0) {
				return 0;
			}
			
			if (Math.abs(delta) > max_delta) {
				max_delta = Math.abs(delta); 
			}
			
			if (max_delta == 0) {
				offset = option.min ;
			}else{
				offset = option.max * Math.abs(delta) / max_delta; 
			}
			
			if (delta > 0) {
				offset = -offset
			} 
			
			axis += offset;
			//console.log(axis);
			
			if (axis <= 0) {
				axis = 0;
			}
			
			return Math.floor(axis);
		}
		
	}
	
	var scrollBar = function(y) {
		var max, min, move;
		
		max = baseObj.window_height;
		min = 2;
		move = Math.floor(y / baseObj.main_height * max);
		console.log(y + ' ' + baseObj.main_height + '  ' + max);
		return move;
	}

				
	var ScrollDispather = function() {
		var array = [frame_index, frame_start, frame_intro, frame_wiki, frame_chat, frame_social, frame_share,
	    frame_shopping, frame_radio, frame_discover];	
		
		return {
			register: function() {
			
			},
			
			notify: function(y) {
				console.log('y ' + y);
				$.each(array, function(i, e) {
					var element = $(e.id);
					//console.log(element);					
					if (y >= e.y_show && y <= e.y_hidden) {
						if (element.css('display') == 'none') {
							console.log('open' + e.id + y);
							element.show();							
						}
						//console.log(e.y_show);
						element.scrollTop(e.y_show);
						
						//var translatedY = y / e.y_show;
						//e.callback.apply(transltedY;)
					
					} else if (y > e.y_hidden || y < e.y_show) {
					    if (element.css('display') != 'none') {
					    	console.log('close' + e.id + y);
							element.hide();							
						}
					}
				});
			}
		}	
	}

	var speedToAxis = new SpeedToAxis({max: 20, min: 5});
	var scrollDispather = new ScrollDispather();
	
	container.bind("mousewheel", function(e){
		var scroll_bar = $('#scroll_bar');

		var wheel_delta =  e.originalEvent.wheelDelta / 120;		
		var y = speedToAxis(wheel_delta);
		scrollDispather.notify(y);
	
	});	
