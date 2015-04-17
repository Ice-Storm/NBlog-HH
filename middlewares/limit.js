var config = require('../config.default.js');

var limitPost = function (req, res, next) {
	if (req.method == 'POST') {
		if (!req.session.postTime) {
			req.session.postTime = (new Date()).getTime();
			next();
		} else {
			if (req.session.postTime + config.postInterval > (new Date).getTime()) {
				//细节有待完善
				return res.send('发帖太快了');
			} else {
				req.session.postTime = (new Date()).getTime();
				next();
			}
		}
	} else {
		next();
	}
}

module.exports.limitPost = limitPost;