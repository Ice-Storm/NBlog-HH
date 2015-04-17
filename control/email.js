var db = require('../models/db.js');
var config = require('../config.default.js');
var cryptoInfo = require('../common/cryptoInfo.js');

var dataObj = {
		selUserObj: {
		table: 'nblog_admin',
		field: ['password'],
		condition: {
			// id
		},
		close: 'true'
	},

	updateAdmin: {
		table: 'Nblog_admin',
		condition: {
			// id 动态获取
		},
		close: 'true'	
	}

}

var dealGet = function (req, res) {
	
	var urlHash = req.params.hash;
	dataObj.selUserObj.condition.id = req.params.id;
	db.getData(dataObj.selUserObj, function (err, data) {
		var checkHash = cryptoInfo.cryptoInfo('sha1', 'hex', data[0] + config.urlsecret);
		if (checkHash == urlHash) {
			res.render('emailReSetPwd');
			//返回修改密码页面
		} else {
			console.log('err');
			//返回出错页面
		}
	})
}

var dealPost = function (req, res) {
	if(req.body.password = req.body.rePassword) {
		dataObj.updateAdmin.password = req.body.password;
			db.update(dataObj.updateArtical, function (err, flag) {
			res.redirect('/admin/login');
		})
	}
}

module.exports.dealGet = dealGet;

module.exports.dealPost = dealPost;