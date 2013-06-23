/**
 * @name A pure HTML5 version of the Home
 * @version 1.0.2
 * @create 2013.4.25
 * @lastmodified 2013.4.25
 * @description Based on jQuery 1.4+
 * @author Kaito  (yangkaituo@gmail.com)
 */
 
/**
 * ENV 浏览器探测
 * @return hash ‘浏览器名称:版本号’
 */
function ENV() {
	var ua = navigator.userAgent.toLowerCase();
	var browser = {};
		
	/mise ([\d.]+)/.test(ua) ? browser.ie = ua.match(/msie ([\d.]+)/)[1] : 
	/firefox\/([\d.]+)/.test(ua) ? browser.firefox = ua.match(/firefox\/([\d.]+)/)[1] :
	/chrome\/([\d.]+)/.test(ua) ? browser.chrome = ua.match(/chrome\/([\d.]+)/)[1] : 
	/opera.([\d.]+)/.test(ua) ? browser.opera = ua.match(/opera.([\d.]+)/)[1] :
	/version.([\d.]+).*?safari/.test(ua) ? browser.safari = ua.match(/version\/([\d.]+)/)[1] : 0;
        
	console.log(browser);
	return browser;
}

/**
 * @constructor  基础类用来生成一些工具
 * @param        obj对象，传入一个初始值
 * @return       对象，包括初始化好的对象，以方便全局实用和一个获取Y值的方法
 */
function Base(obj) {
	var baseObj = obj || {};
	
	var init = (function(obj) {
		baseObj.window_width = $(window).width();
		baseObj.window_height = $(window).height();
		baseObj.main_height = $('#main_frame').height();
		
		//console.log('window width ' + baseObj.window_width);
		//console.log('window height ' + baseObj.window_height);
		//console.log('main height ' + baseObj.main_height);
		
		$(obj.container).css({  
			width: baseObj.window_width,
			height: baseObj.window_height,
			overflow: 'hidden'
		});

	}(baseObj));
	
	return {
		isFirefox: function() {
			var a = ENV();
			if (a.firefox) {
				return true;
			}
			return false;
		},
		
		SpeedToAxis: function(o) {
			var axis = 0,
				max_delta = 0;         //缓存最大的加速度
			
			var option = $.extend({
				max: 20,
				min: 2
			}, o);
		
			return function(delta) {
				var offset = 0;
				delta = delta || 0;
			
				if (Math.abs(delta) > max_delta) {
					max_delta = Math.abs(delta); 
				}
			
				offset = max_delta == 0 ?  option.min : option.max * Math.abs(delta) / max_delta; 
				offset =  delta > 0 ? -offset : offset;			
				axis += offset;
				//console.log(axis);			
				return Math.floor(axis <= 0 ? 0 : axis);
			}
		
		},
		
		window_height: baseObj.window_height,
		
		window_width:  baseObj.window_width
	}
}

/**
 * class
 */
function Dispather(mousewheel, window_height) {
	var array = [];

	var init = (function() {
		$.each($('hgroup '), function(i, e){
			if (i > 0 ) {
				var obj = {};
				obj.id     = e.id;
				obj.width  = e.clientWidth;
				obj.height = e.clientHeight;
				obj.show   = parseInt($('#'+e.id).data('axis').split(',')[0]);
				obj.hide   = parseInt($('#'+e.id).data('axis').split(',')[1]);
				obj.bg     = '';
				array.push(obj);
			}
		});

	})();
	
	this.scroll = mousewheel;
	this.window_height = window_height;
	this.pause = function() {
		$(window).unbind(this.scroll);
	}
	this.array = array;
}

Dispather.prototype.notify = function(y) {
	//console.dir(this.array);
	//console.log(y);
	var that = this;
	$.each(this.array, function(i, e) {
		var element = $('#' + e.id);
		//console.log(e);
				
		if (y >= e.show && y <= e.hide) {
			//console.log(1);
			if (element.css('display') == 'none') {
				//console.log('open' + e.id + y);
				element.show();							
			}
			//console.log(e.show);
			var translatedY = y - e.show;
			that.scrollBar.call(that, translatedY, e.height, element);
			
						
			
			//if (translatedY > 0) {
			//	console.log('i am here!');
				//this.pause();
			//}
			//e.callback.apply(transltedY;)
					
		} else if (y > e.hide || y < e.show) {
			//console.log(2);
			if (element.css('display') != 'none') {
				//console.log('close' + e.id + y);
				element.hide();							
			}
		}
	});
}

Dispather.prototype.scrollBar = function(y, main_height, element) { 
	var that = this;

	var move = Math.floor(y / main_height * this.window_height);
	//console.log(y + ' ' + main_height + ' ' + this.window_height);
	console.log(move);
	//return move;

	$('#scroll_bar').fadeIn().css({top: move});
	window.scrollBy(move);
}