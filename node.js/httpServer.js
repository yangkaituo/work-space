var http = require('http');
var fs = require('fs');

var server = new http.Server();
server.listen(8000);

server.on("request", function(request, response) {
	var url = require('url').parse(request.url);
	console.log(url.query);

	if (url.pathname === "/test/delay") {
		var delay = parseInt(url.query) || 2000;

		response.writeHead(200, {"Content-Type": "text/plain; charset=UTF-8"});
		response.write("Sleeping for " + delay + " milliseconds...");
		setTimeout(function() {
			response.write("done.");
			response.end();
		}, delay);
	}else if (url.pathname === "/test/mirror") {
		response.writeHead(200, {"Content-Type": "text/plain; charset=UTF-8"});
		response.write(request.method + " " + request.url + " HTTP/" + request.httpVersion + "\r\n");

		for(var h in request.headers) {
			response.write(h + ": " + request.headers[h] + "\r\n");
		}
		response.write("\r\n");
		request.on("data", function(chunk) {
			response.write(chunk);
		});
		request.on("end", function(chunk) {
			response.end();
		});
	}else{
		var filename = url.pathname.substring(1);
		var type;
		switch(filename.substring(filename.lastIndexOf(".")+1)) {
			case "html":    
			case "htm":     type = "text/html; charset=UTF-8"; break;
			case "js":      type = "application/javascript; charset=UTF-8"; break;
			case "css":     type = "text/css; carset=UTF-8"; break;
			case "txt":     type = "text/cache-manifest; charset=UTF-8"; break;
			case "manifest":type = "application/octet-stream"; break;
			default:
		}
		fs.readFile(filename, function(err, content) {
			if(err) {
				response.writeHead(404, {
					"Content-Type": "text/plain; charset=UTF-8"
				});
				response.write(err.message);
				response.write('file no found');
				response.end();
			}else{
				response.writeHead(200, {"Content-Type": type});
				response.write(content);
				response.end();
			}
		});
	}
});
