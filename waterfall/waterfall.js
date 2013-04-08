var tools = function() {
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
				pin.html(hash[i][0]).css(hash[i][0]) : i == 3 ?
					pin.html(hash[i][0]).css(hash[i][1]) : i == 4 ?
						pin.html(hash[i][0]) : pin.hide();				
	}
}();

//init waterfall
var init_wf = (function(wf) {
	if(DEBUG && console) console.log(wf);
		
	wf = wf || {};
		
	var min_col   = wf.min_col,
	    img_width = wf.width,
	    container = wf.exper,
        width     = $(container).width();
	
	var min_width = min_col * img_width + 30;
	if(DEBUG && console) console.log('最小宽度 ' + min_width);
	
	if (width > min_width) {
		wf.cols = Math.floor(width/img_width);		
		wf.colspan = Math.floor((width - wf.cols * img_width) / (wf.cols - 1));		
	}
	
	if(DEBUG && console) console.log('实际列 ' + wf.cols);
	if(DEBUG && console) console.log('实际列间距 ' + wf.colspan);

	return wf		
})(wf_config);
if(DEBUG && console) console.log(wf_config);
	
// get api and return images hash 
// key is data array number 
// value is an array, 0,img_src 1,a_href 2,title, 3,image height
 
var get_image_data = function(api) {	
	if(DEBUG && console) console.log(api);	
	
	if(!api){ 
		tools(4);
		return
	} 
	
	if (api.page > api.per_page ) {
		tools(3);
		switch_bind.pause();
		return
	}
	
	var apiCall = api.url + '?method=' + api.method + '&api_key=' + api.api_key +
				  '&tags=' + api.tags + '&page=' + api.page +'&per_page=' + api.per_page +
				  '&format=' + api.format +'&_ksTS=1365144900923_27&jsoncallback=?';

	$.getJSON(apiCall, function(data){
		if(DEBUG && console) console.log(data);

		var item = {};
		if (data.stat === "ok") {
			$.each(data.photos.photo, function(i, photo) {
				var img_src = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + 
		                      '/' + photo.id + '_' + photo.secret + '_' + 'm.jpg';
		                      
		        var a_href = "http://www.flickr.com/photos/" + photo.owner + "/" + photo.id + "/";
		        var title  = photo.title;
		        
		        if(DEBUG && console) console.log('img_src ' + img_src);
		        if(DEBUG && console) console.log('a_href ' + a_href);
		        
		        var height = Math.round(Math.random()*(300 - 180) + 180);
		        if(DEBUG && console) console.log(height);
		        
		        var array = [];
		        array.push(img_src, a_href, title, height);
		        if(DEBUG && console) console.log(array);
		        
		        item[i] = array;
		        if(DEBUG && console) console.log(item);				      
			})
				success(item);	

		}else{
			tools(2);
		}

	})	
}

get_image_data(api)

var switch_bind = {
	start: function() {
		var self = this;
		$(window).bind("scroll", function(){
			var exper_scroll = $(window).scrollTop();
			if(DEBUG && console) console.log('scroll top:' + exper_scroll);

			var exper_height = $(wf_config.exper).height();
			if(DEBUG && console) console.log('exper height:' + exper_height);
	
			var window_height = $(window).height();
			if(DEBUG && console) console.log('window height:' + window_height);
	
	
			if (exper_height -  (exper_scroll + window_height) < 20 ) {
				if(DEBUG && console)console.log("wf page " + api.page);

				tools(1);
				get_image_data(api);
				self.pause();
			}			
		
		});
	},
	
	pause: function() {
		$(window).unbind('scroll');
	}

};

function reSize(wf, WaterFall) {		
		var newWidth =  $(wf.exper).width();
		//console.log('newWidth: ' + newWidth);
		var min_width = wf.min_col * wf.width;
		//console.log('cols width:' + wf.width);
		//console.log('min width: ' + min_width);
		
		if (newWidth > min_width) {
			wf.cols = Math.floor(newWidth / wf.width);
			//console.log('new cols:' + wf.cols);
			wf.colspan = Math.floor((newWidth - wf.cols * wf.width) / (wf.cols - 1));	
		}
		
		//console.log('resize wf:' + wf);
		
		WaterFall.reflow(wf);
}

var WaterFall = function(wf) {
	var colsHeight = [];
	
	var init = (function() {
		for(var i = 0; i < wf.cols; i++) {
			colsHeight[i] = 0;
		}	
	})();
	//if(DEBUG && console) console.log('init array' + colsHeight);
	
	var _getShortestColumnNumber = function() {
		var ret = 0;
		for (var i = 0; i < wf.cols; i++) {
			if (colsHeight[i] < colsHeight[ret]) {
				ret = i;
			}
		}
		return ret;
	};
	
	var _getTop = function(col) {
		//console.log('return top :' + this.colsHeight[col]);
		return colsHeight[col];
	};
	
	var _updateColumnHeight = function(col, height){
		
		height += 30;
		//console.log('update ' + this.colsHeight[col]);
		colsHeight[col] += height;
	};
	
	var _getLeft = function(col) {
		return col * (wf.width + wf.colspan);
	};
	
	var _getHeightestColumn = function() {
		var max = 0;
		for (var i = 0; i < wf.cols; i++) {
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

			var i = 0; //, images_html = '';
			for (i; i < 20; i++) {
				var items = data[i];				
				//console.log(i + ':' + items);	
				
				var col = _getShortestColumnNumber();
				//console.log(col);
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
        		//console.log(images_html);	
				_updateColumnHeight(col, height);	
								
				$(wf.exper).append(images_html);					
				$("."+data_id).fadeIn(5000);
				
				//console.log('exper height:' + this._getHeightestColumn());
				$(wf.exper).css({
					height: _getHeightestColumn()
				});
								
			}
			
		},
		reflow: function(wf) {
				var newCols = wf.cols;
				var newColspan = wf.colspan;
		
		        console.log('new colspan: ' + newColspan);
		        
				for(var i = 0; i < newCols; i++) {
					colsHeight[i] = 0;
				}
		
				//var This = this;
				$(wf.exper + ' > div').each(function(i, e){
					var item = $(e);
			
					var height = item.css('height');
						height = height.replace('px', '');
						height = parseInt(height);
					var col = _getShortestColumnNumber();
					var left = _getLeft(col);
					var top = _getTop(col);
			
					//console.log('id:'+ i + ' col:' + col + ' left: ' + left + 'top: ' + top + ' height='+height);
					item.css({
						left: left,
						top: top
					});
					_updateColumnHeight(col, height);	
			
				});
		
				$(wf.exper).css({
					height: _getHeightestColumn()
				});
	   
		}
			
	};
}

var test = new WaterFall(wf_config);

function success(item) {
	console.log(item);
	
	if (!item) {
		console.log('接口异常');
	}
	
	tools(0);
	$('#BackToTop').show();	
			
	test.readyImage(item);
	switch_bind.start();
	api.page += 1;	
}

$(window).resize(function (){reSize(wf_config, test)});

$('#BackToTop').bind('click', function() {
	$('#BackToTop').scrollTop(0);
});
