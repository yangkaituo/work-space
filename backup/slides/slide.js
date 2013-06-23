function Slide(obj) {
	var control = obj.control;
	//var array = $('#control > img');
	//console.dir(array);
	$.each($('#control > img'), function(i, e) {
		console.log(e);
	})
}
var obj = {
	container: '#container',
	control: '#control',
	direction: top
}
var slide = new Slide(obj);