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
				if(DEBUG && console) console.log('notice ' + i);
				i == 0 ? pin.hide() : i == 1 ? 
					pin.css(hash[i]).show() : i == 2 ?
						pin.html(hash[i][0]).css(hash[i][0]).show() : i == 3 ?
							pin.html(hash[i][0]).css(hash[i][1]).show() : i == 4 ?
								pin.html(hash[i][0]).show() : pin.hide();				
			}
	};
	
var waterfall = function(api, This) {
	var tools = new Tools();
	var cols, colspan, width,
	    key = false;
	
	var check_api_tools = (function(api) {
	
		if (typeof api !== 'object') {
			if(DEBUG && console) console.log('bug in here!');
			tools(4);
			key = true;
		}
		
		if (! api.hasOwnProperty('get_image_data') && api.hasOwnProperty('min_col') && 
			  api.hasOwnProperty('width') && api.hasOwnProperty('colspan')) {
			  	if(DEBUG && console) console.log('bug in here!');
				key = true;					  
		}
		
		if ( typeof api.get_image_data !== 'function') {
				if(DEBUG && console) console.log('bug in here!');
				key = true;
		}
		
		if ( typeof api.min_col !== 'number' || api.min_col == 0 ) {
				if(DEBUG && console) console.log('bug in here!');
				key = true;
		}
		
		if ( typeof api.width !== 'number' || api.width == 0 ) {
				if(DEBUG && console) console.log('bug in here!');
				key = true;
		}
		
		if ( typeof api.colspan !== 'number' || api.colspan == 0 ) {
				if(DEBUG && console) console.log('bug in here!');
				key = true;
		}
		
	}(api));
	
	if (key) {
		tools(4);
		return;
	}
	
	var init = (function() {
			width = This.width();
			if(DEBUG && console) console.log('width' + width);
			var min_width = api.min_col * (api.width + 10);
			if(DEBUG && console) console.log('最小宽度 ' + min_width);
	
			if (width > min_width) {
				cols = Math.floor(width/api.width);		
				colspan = Math.floor((width - cols * api.width) / (cols - 1));		
			}

	}());	
	if(DEBUG && console) console.log('实际列 ' + cols);
	if(DEBUG && console) console.log('实际列间距 ' + colspan);
	
	function reSize(WaterFall) {		
		var newWidth =  This.width();
		var min_width = api.min_col * api.width;
		
		if (newWidth > min_width) {
			cols = Math.floor(newWidth / api.width);
			if(DEBUG && console) console.log('resize cols ' + cols);
			colspan = Math.floor((newWidth - cols * api.width) / (cols - 1));
			if(DEBUG && console) console.log('resize colspan ' + colspan);	
		}		
		WaterFall.reflow();
	}
	
	var WF = function() {
		var colsHeight = [];
	
		var init = (function() {
			for(var i = 0; i < cols; i++) {
				colsHeight[i] = 0;
			}	
		})();
		if(DEBUG && console) console.log('init array' + colsHeight);
	
		var _getShortestColumnNumber = function() {
			var ret = 0;
			for (var i = 0; i < cols; i++) {
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
			return col * (api.width + colspan);
		};
	
		var _getHeightestColumn = function() {
			var max = 0;
			for (var i = 0; i < cols; i++) {
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
				
				for (var i in data) {
					var items = data[i];									
					
					var col = _getShortestColumnNumber();
					var top = _getTop(col);
					var left = _getLeft(col);
					var height = items[3] + 42;		
					var img_height = items[3];
					var href = items[1];
					var title = items[2];
					var img_src = items[0] 
					var data_col = 'data_col_' + col;
					var data_id = 'data_' + top + left;
	        		
        			var images_html = '<div class="pin '+ data_col +' '+ data_id +'" style="'+
        			               'top:'+ top +'px;left:'+ left + 'px; height:'+ height +'px">' + 	
								  '<a href="' + href + '" class="image">' +
        		    	          '<img height="'+ img_height +'px" style="height:' + img_height + 
        		        	      'px" alt="'+ title +'" src="'+ img_src +'">' +
        		            	  '</a><p class="description">' + title + '</p></div>';	
        		    
					_updateColumnHeight(col, height);	
								
					This.append(images_html);					
					$("."+data_id).fadeIn(5000);
				
					This.css({
						height: _getHeightestColumn()
					});
								
				}
			
			},
			reflow: function() {
					var newCols = cols;
					var newColspan = colspan;
		
			        if (DEBUG && console) console.log('new colspan: ' + newColspan);
		        
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
			
						if (DEBUG && console) console.log('id:'+ i + ' col:' + col + ' left: ' + left + 'top: ' + top + ' height='+height);
						item.css({
							left: left,
							top: top
						});
						_updateColumnHeight(col, height);	
			
					});
		
					$(api.exper).css({
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
				if(DEBUG && console) console.log('scroll top:' + exper_scroll);

				var exper_height = This.height();
				if(DEBUG && console) console.log('exper height:' + exper_height);
	
				var window_height = $(window).height();
				if(DEBUG && console) console.log('window height:' + window_height);

				if (exper_height -  (exper_scroll + window_height) < 20 ) {
					if(DEBUG && console)console.log("i am here ");
				
					tools(1);
					api.get_image_data(success, end);
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
		if(DEBUG && console) console.log('i am ending');
		
		if(o) {
			tools(3); 
		}else{
			tools(4);
		}
		switch_bind.pause(); 
	};
			
	var success = function(item) {

		if (!item) {
			tools(2); 
		}
	
		tools(0); 
		$('#BackToTop').show();	
			
		wf.readyImage(item);
		switch_bind.start(); 
	};
	
	api.get_image_data(success, end);
	
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
	$.WaterFall(option, $(this));
//	new waterfall(option, $(this));
}
}(jQuery));
