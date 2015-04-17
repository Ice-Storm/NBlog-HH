var async = require('async');
var upload = require('../common/upload');
var db = require('../models/db.js');
var URL = require('url');
var config = require('../config.default.js');
var fs = require('fs');

var dataObj = {
	updateObj: {
		table: 'nblog_config',
		//blog_right_img: imgName + '.' + extname,
		condition: {
			id: 1
		},
		close: true
	},

	uploadObj: {
		//uploadName
		//uploadFormName
	}

}

var dealGet = function (req, res) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	} 
	var indexData = {};

	res.render('adminElsTwo', {
		adminBase: 'adminBase',
		css: 'adminIndex.adminElsTwo',
		data:　indexData
	});

}

var dealPost = function (req, res) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	}

	async.waterfall([
		function (cb) {
			var query = URL.parse(req.url, true).query;
			if(query.where == 'index') {
				dataObj.uploadObj.fileName = 'index';
				upload.uploadImg(req, dataObj.uploadObj, cb);
			} else {
				dataObj.uploadObj.fileName = 'artical';
				dataObj.uploadObj.uploadFormName = 'imgFileE';
				upload.uploadImg(req, dataObj.uploadObj, cb);
			}
		},
		function (result, cb) {
			if (result.uploadFormName == 'imgFile') {
				dataObj.updateObj.blog_right_img = result.fileName;
			} else {
				dataObj.updateObj.blog_artical_img = result.fileName;
			}
			db.update(dataObj.updateObj, function () {
				res.redirect('/admin/adminIndex/dealRightMenuList/else2')
			});
		}
	], function (err, result) {
		if (err) throw err;
		res.json({error: 0, message: 'ok', url: config.uploadFile + result.fileName});
	})
}

module.exports.dealGet= dealGet;

module.exports.dealPost= dealPost;