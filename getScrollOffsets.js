<script>
function getScrollOffsets(w) {
	//使用指定的窗口，如果不带参数则使用当前窗口
	w = w || window;
	
	//除了IE 8及更早的版本以外，兼容各个浏览器版本
	if (w.pageXOffset != null) {
		return {x: w.pageXOffset, y:w.pageYOffset};
	}
	
	//对标准模式下的IE
	var d = w.document;
	if (document.compatMode == "CSS1Compat") {
		return {x:d.documentElement.scrollLeft, y:d.documentElement.scrollTop};
	}
	
	//对怪异模式下的浏览器(没有doctype)
	return {x: d.body.scrollLeft, y: d.body.scrollTop};
}
</script>