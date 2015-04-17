var db = require('../models/db.js');

var path = require('path');

var fs = require('fs');

var URL = require('url');

var formidable = require('formidable');

var async = require('async');

var config = require('../config.default.js');

var upload = require('../common/upload.js');

var dataObj = {
	delObj: {
		table: 'Nblog_img',
		condition: {
			//img_name: i.img_name
		},
		close: 'true'
	},

	insertObj: {
		table: 'Nblog_img',
		//id: null,
		//img_name: n.fileName,
		//foreign_p: req.session.articalID,
		close: 'true'
	}

}

var dealGet = function (req, res) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	} 

	req.session.articalID = new Date().getTime();

	res.render('adminAddArt', {
		adminBase: 'adminBase',
		css: 'adminIndex.adminAddArt'
	})
}

var dealPost = function (req, res) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	} 

	var param = URL.parse(req.url, true).query.dir;

	if (param == 'image') {
		
		async.waterfall([
			function (cb) {
				//上传文件
				upload.uploadImg(req, {}, cb);
			},
			function (n, cb) {
				//插入数据库 与文章对应
				dataObj.insertObj.img_name = n.fileName;
				dataObj.insertObj.foreign_p = req.session.articalID;
				db.insert(dataObj.insertObj, cb(null, n));
			},
			function (n, cb) {
				// 查找文章与图片未对应的图片并且删除
				var sql = 'select img_name from Nblog_img where foreign_p not in ( select foreign_p from Nblog_img where exists (select * from Nblog_artical where Nblog_img.foreign_p = Nblog_artical.img_p))';
				db.selectAuto(sql, function (err, data) {
					async.each(data, function (i, callback) {

						dataObj.delObj.condition.img_name = i.img_name;

						db.del(dataObj,delObj, function () {console.log('删除成功')});
						fs.unlink(n.uploadPath + i.img_name, callback(err, i));
					}, function (err) {
						cb(err, n)
					});
				});
			}
		], function (err, result) {
			if (err) throw err;
			res.json({error: 0, message: 'ok', url: config.uploadFile + result.fileName});
		})
	} else {	
		var insertObj = {
			table: 'Nblog_artical',
			id: null,
			title: req.body.title,
			content: req.body.content,
			sort: req.body.sort,
			img_p: req.session.articalID,
			com_p: new Date().getTime(),
			flag: req.body.flag,
			close: 'true'
		}

		db.insert(insertObj, function () {
			res.redirect('/admin/adminIndex/dealRightMenuList/art/1/');
		})
	}
}

module.exports.dealGet = dealGet;

module.exports.dealPost = dealPost;