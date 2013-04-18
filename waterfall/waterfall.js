(function($) {
	var Tools = function(pin, debug) {
		var hash = {
			0: '',
			1: '',
			2: "<span>接口异常</span>",
			3: "<span>数据加载完成</span>",
			4: "<span>配置不完善</span>"
		};

		return function(i) {
		if(debug && console) console.log(i);
				i == 1 ? $(pin).removeClass('top').addClass("bottom").show() : i == 2 ?
					$(pin).html(hash[i]) : i == 3 ?
						$(pin).html(hash[i]).show() : i == 4 ?
							$(pin).html(hash[i]).show() : pin.hide();				
			}
	};
	
	var checkApiTools = function(api) {
		var key = false;

		if (typeof api !== 'object') {
			if(api.debug && console) console.log('bug in here!');
			key = true;
		}
		
		if (! api.hasOwnProperty('getImageData') && api.hasOwnProperty('col') && 
			  api.hasOwnProperty('width') && api.hasOwnProperty('colspan')) {
			  	if(api.debug && console) console.log('bug in here!');
				key = true;					  
		}
		
		if ( typeof api.getImageData !== 'function') {
				if(api.debug && console) console.log('bug in here!');
				key = true;
		}
		
		if ( typeof api.col !== 'number' || api.col == 0 ) {
				if(api.debug && console) console.log('bug in here!');
				key = true;
		}
		
		if ( typeof api.width !== 'number' || api.width == 0 ) {
				if(api.debug && console) console.log('bug in here!');
				key = true;
		}
		
		if ( typeof api.colspan !== 'number' || api.colspan == 0 ) {
				if(api.debug && console) console.log('bug in here!');
				key = true;
		}
		
		if ( typeof api.backtotop !== 'string' || (! /^\#/.test(api.backtotop))) {
				if(api.debug && console) console.log('bug in here!');
				key = true
		}
		
		if ( typeof api.notice !== 'string' || (! /^\#/.test(api.notice))) {
				if(api.debug && console) console.log('bug in here!');
				key = true
		}
		
		return key;
	}
	
var waterfall = function(api, This, tools) {
	var cols, colspan, width, settings;
	
	settings = $.extend({
		cols: 2,
		colspan: 10,
		width: 230,
		debug: false,
		backtotop: '#BackToTop',
		notice: '#loadingPins',
	}, api);
		
	var init = (function(o) {
			width = This.width();
			if(o.debug && console) console.log('width' + width);
			o.min_width = o.col * (o.width + 10);
			if(o.debug && console) console.log('最小宽度 ' + o.min_width);
	
			if (width > o.min_width) {
				o.cols = Math.floor(width/o.width);		
				o.colspan = Math.floor((width - o.cols * o.width) / (o.cols - 1));		
			}
			
			$(o.notice).show();
			return o;
	}(settings));	
	
	if(settings.debug && console) console.dir(settings);
	if(settings.debug && console) console.log('实际列 ' + settings.cols);
	if(settings.debug && console) console.log('实际列间距 ' + settings.colspan);
	
	function reSize(WaterFall) {		
		var newWidth =  This.width();
		if(settings.debug && console) console.log('new width ' + newWidth);
		
		var o = {};
		if (newWidth > settings.min_width) {			
			o.cols = Math.floor(newWidth / settings.width);			
			o.colspan = Math.floor((newWidth - settings.cols * settings.width) / (settings.cols - 1));
		}
			
		if(settings.debug && console) console.log(o);
		settings = $.extend(settings, o);
		if(settings.debug && console) console.dir(settings);	
		
		WaterFall.reflow();
	}
	
	var WF = function() {
		var colsHeight = [];
	
		var init = (function() {
			for(var i = 0; i < settings.cols; i++) {
				colsHeight[i] = 0;
			}	
		})();
		if(settings.debug && console) console.log('init array' + colsHeight);
	
		var _getShortestColumnNumber = function() {
			var ret = 0;
			for (var i = 0; i < settings.cols; i++) {
				if (colsHeight[i] < colsHeight[ret]) {
					ret = i;
				}
			}
			return ret;
		};
	
		var _getTop = function(col) {
			return colsHeight[col];
		};
	
		var _updateColumnHeight = function(col, height){
		
			height += 30;
			colsHeight[col] += height;
		};
	
		var _getLeft = function(col) {
			return col * (settings.width + settings.colspan);
		};
	
		var _getHeightestColumn = function() {
			var max = 0;
			for (var i = 0; i < settings.cols; i++) {
				if (colsHeight[i] > max) {
					max = colsHeight[i];
				}
			}
			return max + 46;
		};
		
		return {
			readyImage: function(data) { 
				if (!data) {
					return;
				}
				
				$.each(data, function(i, item) {
														
					item.col      = _getShortestColumnNumber();
					item.top      = _getTop(item.col);
					item.left     = _getLeft(item.col);
					item.height   = item.img_height + 42;
					item.data_col = 'data_col_' + item.col;
					item.data_id  = 'data_' + item.top + item.left;        		    
        		    
					_updateColumnHeight(item.col, item.height);	
				
					This.css({
						height: _getHeightestColumn()
					});
								
				});
				
				var html = api.renderItemHtml(data);

				This.append(html);					
			},
			reflow: function() {
					var newCols = settings.cols;
					var newColspan = settings.colspan;
		
			        if (settings.debug && console) console.log('new colspan: ' + newColspan);
		        
					for(var i = 0; i < newCols; i++) {
						colsHeight[i] = 0;
					}
		
					This.children().each(function(i, e){
						var item = $(e);
			
						var height = item.css('height');
							height = height.replace('px', '');
							height = parseInt(height);
							
						var col = _getShortestColumnNumber();
						var left = _getLeft(col);
						var top = _getTop(col);
			
						if (settings.debug && console) console.log('id:'+ i + ' col:' + col + ' left: ' + left + 'top: ' + top + ' height='+height);
						item.css({
							left: left,
							top: top
						});
						
						_updateColumnHeight(col, height);	
			
					});
		
					This.css({
						height: _getHeightestColumn()
					});
	   
			}
			
		};	
	};
	
	var switch_bind = {
		start: function() {			
			var self = this;
			$(window).bind("scroll", function(){
				var exper_scroll = $(window).scrollTop();
				if(settings.debug && console) console.log('scroll top:' + exper_scroll);

				var exper_height = This.height();
				if(settings.debug && console) console.log('exper height:' + exper_height);
	
				var window_height = $(window).height();
				if(settings.debug && console) console.log('window height:' + window_height);

				if (exper_height -  (exper_scroll + window_height) < 20 ) {
					if(settings.debug && console) console.log("i am here ");
				
					tools(1);
					settings.getImageData(callback);
					self.pause();			
				}
			});
		},
	
		pause: function() {
			$(window).unbind('scroll');
		}

	};

	var wf = new WF();
			
	var callback = function(items, hasNextPage) {
	
		this.end = function() {
			if(settings.debug && console) console.log('i am ending');

			switch_bind.pause(); 
		};
	
		if (! hasNextPage) {
			tools(3); 
			this.end();
			return;
		}

		if (!items) {
			tools(2); 
			this.end();
			return
		}
	
		$(settings.notice).hide(); 
		$(settings.backtotop).show();	
			
		wf.readyImage(items);
		switch_bind.start(); 
	};
	
	settings.getImageData(callback);
	
	$(window).resize(function (){reSize(wf)});
	
	$(settings.backtotop).bind('click', function() {
		$(settings.backtotop).scrollTop(0);
	});
};

$.WaterFall = function(option, This, tools) {
	$.data(This, 'WaterFall', new waterfall(option, This, tools));
	return This;
}

$.fn.WaterFall = function(option) {
	
	var key = checkApiTools(option);
	var tools = new Tools(option.notice, option.debug);
	
	if (key) {
		tools(4);
		return;
	}
	$.WaterFall(option, this, tools);
}
}(jQuery));
