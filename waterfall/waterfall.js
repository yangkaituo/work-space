(function($) {
	var Tools = function() {
		var hash = {
			0: 'hide',
			1: {bottom:'9px', top:'0px'},
			2: ["<span>接口异常</span>", {top: '9px'}],
			3: ["<span>数据加载完成</span>", {bottom:'9px', top:'0px'}],
			4: ["<span>接口配置不完善</span>", {bottom:'9px', top:'0px'}]
		};
	
		var pin = $('#loadingPins');
		return function(i) {
				i == 0 ? pin.hide() : i == 1 ? 
					pin.css(hash[i]).show() : i == 2 ?
						pin.html(hash[i][0]).css(hash[i][0]).show() : i == 3 ?
							pin.html(hash[i][0]).css(hash[i][1]).show() : i == 4 ?
								pin.html(hash[i][0]).show() : pin.hide();				
			}
	};
	
var waterfall = function(api, This) {
	var tools = new Tools();
	var cols, colspan, width, settings,
	    key = false;
	
	var checkApiTools = (function(api) {
	
		if (typeof api !== 'object') {
			if(api.debug && console) console.log('bug in here!');
			tools(4);
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
		
	}(api));
	
	if (key) {
		tools(4);
		return;
	}
	
	settings = $.extend({
		cols: 2,
		colspan: 10,
		width: 230,
		debug: false
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
			return max;
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
        		            	  
        		    var html = api.renderItemHtml(item);
        		    
					_updateColumnHeight(item.col, item.height);	
								
					This.append(html);					
					$("." + item.data_id).fadeIn(5000);
				
					This.css({
						height: _getHeightestColumn()
					});
								
				});

			
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

	var end = function(o) {
		if(settings.debug && console) console.log('i am ending');
		
		if(o) {
			tools(3); 
		}else{
			tools(4);
		}
		switch_bind.pause(); 
	};
			
	var callback = function(items, hasNextPage) {
	
		if (! hasNextPage) {
			end();
		}

		if (!items) {
			tools(2); 
			end();
		}
	
		tools(0); 
		$('#BackToTop').show();	
			
		wf.readyImage(items);
		switch_bind.start(); 
	};
	
	settings.getImageData(callback);
	
	$(window).resize(function (){reSize(wf)});
	
	$('#BackToTop').bind('click', function() {
		$('#BackToTop').scrollTop(0);
	});
};

$.WaterFall = function(option, This) {
	$.data(This, 'WaterFall', new waterfall(option, This));
	return This;
}

$.fn.WaterFall = function(option) {
	$.WaterFall(option, this);
//	new waterfall(option, $(this));
}
}(jQuery));
