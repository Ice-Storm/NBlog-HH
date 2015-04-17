var async = require('async');
var util = require('../common/util');
var db = require('../models/db.js');


var dealGet = function (req, res) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	} 

	var indexData = {};

	async.waterfall([
		function (cb) {
			var selectCon = {
				table: 'Nblog_config',
				condition: {
					all: '*'
				},
				close: 'true'
			}
			db.getData(selectCon, cb);
		},
		function (data, cb) {
			indexData.config = data;
			var selectMen = {
				table: 'Nblog_menu',
				condition: {
					all: '*'
				},
				close: 'true'
			}
			db.getData(selectMen, cb);
		},
		function (data, cb) {
			indexData.menu = data;
			var selectTag = {
				table: 'Nblog_tag',
				condition: {
					all: '*'
				},
				close: 'true'
			}
			db.getData(selectTag, cb);
		},
		function (data, cb) {
			indexData.tag = data;
			var selectMenu = {
				table: 'Nblog_menu',
				condition: {
					all: '*',
					foreign_p: 2
				},
				close: 'true'
			}
			db.getData(selectMenu, cb);
		},
		function (data, cb) {
			indexData.childMenu = data;
			cb(null, 1);
		}
	], function (err, result) {
		res.render('adminEls', {
			adminBase: 'adminBase',
			css: 'adminIndex.adminEls',
			data:　indexData
		});
	})
}

var dealPost = function (req, res) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	} 

	if (req.body.blogName) {
		var arr = [];

		for (i = 1; i <= 3; i++) {
			var menu = {};
			menu.menu_name = req.body['blogMenu' + i];
			menu.table = 'Nblog_menu';
			menu.close = 'true';
			menu.foreign_p = 1;
			menu.condition = {
				id: i
			}
			arr.push(menu);
		}

		async.waterfall([
			function (cb) {

				var updateObj = {
					table: 'Nblog_config',
					blog_name: req.body.blogName,
					blog_sign: req.body.blogSign,
					blog_rights: req.body.blogRight,
					blog_address: req.body.blogAdmin,
					blog_github: req.body.blogGit,
					blog_menu_p: 1,
					blog_function_p: 1,
					close: 'true',
					condition: {
						id: 1
					}
				}

				async.each(arr, function (i, callback){
					//如果数据库中没有数据更新就有问题，需要判断一下，但是没写

					db.update(i, callback(null, 1));
				}, function (err) {
					if (err) throw err;
					cb(null, updateObj);
				})
			}, function (n, cb) {
				db.update(n, cb(null, 1));
			}
		], function (err, r) {
			if (err) throw err;
			res.redirect('/admin/adminIndex/dealRightMenuList/else');
		})
	} else {
		var arr = [];
		var tagArr = [];

		for (i = 1; i <= 2; i++) {
			if (req.body['menu_min' + i]) {
				var menu = {};
				menu.menu_name = req.body['menu_min' + i];
				menu.table = 'Nblog_menu';
				menu.close = 'true';
				menu.foreign_p = 2;
				menu.condition = {
					id: i + 3
				}
				arr.push(menu);
			}
			
		}


		for (i = 1; i <= 6; i++) {
			var tag = {};
			tag.table = 'Nblog_tag';
			tag.close = 'true';
			tag.foreign_p = 1;
			tag.condition = {
				id: i
			}
			if (req.body['tag' + i]) {
				tag.tag_name = req.body['tag' + i];
				tagArr.push(tag);
			} else {
				tag.tag_name = '';
				tagArr.push(tag);
			}
		}
		async.waterfall([
			function (cb) {
				async.each(arr, function (i, callback) {
					db.update(i, callback(null, 1));
				}, function (err) {
					if (err) throw err;
					cb(null, 1);
				})
			},
			function (n, cb) {
				async.each(tagArr, function (i, callback) {
					db.update(i, callback(null, 1));
				}, function (err) {
					if (err) throw err;
					cb(null, 1);
				})
			}
		], function (err, r) {
			if (err) throw err;
			res.redirect('/admin/adminIndex/dealRightMenuList/else');
		})
	}
}


module.exports.dealGet= dealGet;

module.exports.dealPost= dealPost;