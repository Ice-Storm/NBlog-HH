var async = require('async');
var fs = require('fs');
var path = require('path');
var util = require('../common/util');
var db = require('../models/db.js');


var dealGet = function (req, res, next) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	} 

	//middlewares.freshSession(req, res, next);
	console.log('--------------')
	console.log(req.session)
	console.log('--------------')
	
	var urlInfo = util.urlparse(req.url);
	var memory = {};
	async.waterfall([
		function (cb) {
			memory = process.memoryUsage();
			cb(null, memory);
		}/*, function (n, cb) {
			console.log(path.join(__dirname,'..'))
			fs.stat(__filename, function (err, stats) {
				console.log(stats)
				//memory.size = stats.size;
				cb(err, memory);
			})
		}*/
	], function (e, r) {
		console.log(r)
		res.render('adminSta', {
			info: r,
			adminBase: 'adminBase',
			css: 'adminIndex.adminSta'
		});
	})
}


module.exports.dealGet= dealGet;