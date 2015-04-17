var EXPIRES = 20 * 60 * 1000;

exports.freshSession = function (req, res, next) {
	if(req.session.isAdmin) {
		//req.session.cookie.expires = new Date(Date.now() + EXPIRES);
		req.session.cookie.expires = (new Date()).getTime() + EXPIRES;
		req.session.cookie.maxAge = EXPIRES;
		next();
	} else {
		next();
	}
}