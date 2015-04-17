var async = require('async');
var util = require('../common/util');
var db = require('../models/db.js');
var middlewares = require('../middlewares/auth.js');
var email = require('../common/email.js');
var cryptoInfo = require('../common/cryptoInfo.js');
var config = require('../config.default.js');

var dataObj = {
	seluserObj: {
		table: 'nblog_admin',
		field: ['id', 'user', 'password', 'flag'],
		condition: {
			// user
			// password
		},
		close: 'true'
	},

	selUserEmail: {
		table: 'nblog_admin',
		field: ['id', 'user', 'email'],
		condition: {
			// username
		},
		close: 'true'
	}

}

var dealGet = function (req, res, next) {
	res.render('login', {
		info: ''
	});
}


var dealPost = function (req, res, next) {

	if (req.body.usernameReSet) {

		//多次发送电子邮件锁号 未完成

		dataObj.selUserEmail.condition.user = req.body.usernameReSet; 
		db.getData(dataObj.selUserEmail, function (err, data) {

			if(data[0].email) {
				var cryUrl = data[0].user + config.urlsecret;
				var token = cryptoInfo.cryptoInfo('sha1', 'hex', cryUrl);
				email.sendResetPassMail(data[0].email, token, data[0].user, data[0].id, 3);
				res.send('邮件已发送');
			} else {
				console.log('邮箱都没写，我也是醉了');
			}

		})
	} else {

		// 多次错误登录锁账号 未完成

		dataObj.seluserObj.condition.user = req.body.username;
		dataObj.seluserObj.condition.password = req.body.password;

		db.getData(dataObj.seluserObj, function (err, data) {
			if (data.length) {
				
				//访问控制

				req.session.user = data[0].user;

				req.session.isAdmin = true;

				req.session.status = data[0].flag;

				req.session.adminId = data[0].id;
				
				res.redirect('/admin/adminIndex/dealRightMenuList/man/1/');
			} else {
				res.render('login', {
					info: '账号或密码错误'
				})
			};
		})
	}
}

module.exports.dealGet = dealGet;

module.exports.dealPost = dealPost;