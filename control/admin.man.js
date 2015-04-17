var async = require('async');
var util = require('../common/util');
var db = require('../models/db.js');
var URL = require('url');

var dataObj = {
	selAdminInfo: {
		table: 'Nblog_admin',
		field: ['id', 'user', 'password', 'flag', 'ip', 'time'],
		condition: {
			1: 1,
			limit: 10,
		},
		close: 'true'
	},

	delAdminObj: {
		table: 'Nblog_admin',
		condition: {
			
		},
		close: 'true'
	},

	insAdminObj: {
		table: 'Nblog_admin',
		close: true
	},

	selAdminJudge: {
		table: 'Nblog_admin',
		field: ['id', 'flag'],
		condition: {

		},
		close: 'true'
	},

	countAdminObj: {
		table: 'nblog_admin',
		rename: 'count',
		condition: {
			flag: 1
		},
		close: 'true'
	},

	selAdminEditor: {
		table: 'Nblog_admin',
		field: ['user', 'password', 'qq', 'email', 'name', 'flag'],
		condition: {

		},
		close: 'true'
	},
}


var dealGet = function (req, res) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	}

	var query = URL.parse(req.url, true).query;

	if (!query.delete && !query.editor) {

		var urlInfo = util.urlparse(req.url);
		async.waterfall([
			function (cb) {
				dataObj.selAdminInfo.condition.skip = urlInfo.page - 1;
				cb(null, dataObj.selAdminInfo);
			}, function (n, cb) {
				db.getData(n, cb);
			}
		], function (e, r) {
			for (i = 0; i < r.length; i++) {
				r[i].time = r[i].time.toString().split(' ')[3] + '--' + r[i].time.toString().split(' ')[4];
			}

			res.render('adminMan', {
				info: r,
				spanInfo: '添加管理',
				adminBase: 'adminBase',
				css: 'adminIndex.adminMan'
			});
		})

	}

    if (query.delete && query.id) {
		async.waterfall([
			function (cb) {
				dataObj.selAdminJudge.condition.id = query.id;
				cb(null, dataObj);
			}, 
			function (judgeObj, cb) {
				db.getData(dataObj.selAdminJudge, cb);
			},
			function (data, cb) {
				var session = req.session;
				var errInfo = {
					// error
					// flag
				};
				if(data[0].id != session.adminId && session.status != 1) {
					errInfo.message = '没有权限';
				}
				errInfo.flag = data[0].flag;
				cb(null, errInfo);
			},
			function (data, cb) {
				// 判断超级管理员数量
				var total = {};
				db.getResultCount(dataObj.countAdminObj, function (err, r) {
					total.result = r;
					total.errInfo = data;
					cb(err, total);
				})
			},
			function (data, cb) {
				if (data.result[0].count < 2 && data.errInfo.flag == 1) {
					data.errInfo.message = '少于一个超级管理员';
				}
				cb(null, data);
			},
			function (data, cb) {
				if (data.errInfo.message) {
					//有错就传递
					cb(null, data.errInfo.message);
				} else {
					//不能删除自己
					if (query.id != req.session.adminId) {
						dataObj.delAdminObj.condition.id = query.id;
						db.del(dataObj.delAdminObj, cb);
					} else {
						data.errInfo.message = '不能删除自己';
						cb(null, data.errInfo.message);
					}
				}
			}
		], function (err, result) {
			// 前端没有加错误回显
			console.log(result)
			res.redirect('/admin/adminIndex/dealRightMenuList/man/1/');
		})
	}

	if (query.editor && query.id) {
		async.waterfall([
			function (cb) {
				dataObj.selAdminJudge.condition.id = query.id;
				cb(null, dataObj);
			}, 
			function (judgeObj, cb) {
				db.getData(dataObj.selAdminJudge, cb);
			},
			function (data, cb) {
				var session = req.session;
				var errInfo = {
					// error
					// flag
				};
				if(data[0].id != session.adminId && session.status != 1) {
					errInfo.message = '没有权限';
				}
				cb(null, errInfo);
			},
			function (data, cb) {
				if (data.message) {
					cb(null, data);
				} else {
					dataObj.selAdminEditor.condition.id = query.id;
					db.getData(dataObj.selAdminEditor, cb)
				}
			}
		], function (err, result) {
			console.log(result)
			res.json(result);
		})
	}
}

var dealPost = function (req, res) {
	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	}

	//超级管理员可以添加
	if (req.session.status == 1) {

		// 密码没有加密

		dataObj.insAdminObj.user = req.body.username;
		dataObj.insAdminObj.name = req.body.petname;
		dataObj.insAdminObj.password = req.body.password;
		dataObj.insAdminObj.qq = req.body.qq;
		dataObj.insAdminObj.email = req.body.email;
		dataObj.insAdminObj.flag = req.body.flag;
		dataObj.insAdminObj.ip = req._remoteAddress;
		dataObj.insAdminObj.time = null;
		db.insert(dataObj.insAdminObj, function (err, data) {
			res.redirect('/admin/adminIndex/dealRightMenuList/man/1/');
		})

	} else {
		//未处理
	}
}


module.exports.dealGet= dealGet;

module.exports.dealPost= dealPost;