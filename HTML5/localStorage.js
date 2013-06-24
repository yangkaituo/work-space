var Nao = (function(){
	var Nao = {
		version : 0.01,
		
		get: function(key) {
			var value = localStorage.getItem(key);
			
			if (value === null || value === undefined) {
				value = 'null';
			}else{
				value = value.toString();
			}
			console.log(typeof value);
			return JSON.parse(value);
		},
		
		set: function(key, value) {
			return localStorage.setItem(key, JSON.stringify(value));
		},
		
		remove: function(key) {
			localStorage.removeItem(key);
		},
		
		clear: function() {
			localStorage.clear();
		}		
	};
	
	return Nao;
}());