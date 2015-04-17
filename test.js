var http = require('http');
var async = require('async');

/*var getNode = function () {

}*/

for (var i = 0; i < 1000; i++) {
	(function (i) {
		//async.parallel()
		var req = http.request({
			port: 3000,
			path: '/',
			hostname: '127.0.0.1',
			method: 'GET'
		}, function (res) {
			console.log(i);

		})
		req.end();
		
	})(i)
}

