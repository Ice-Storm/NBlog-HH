var async = require('async');
var util = require('../common/util');
var db = require('../models/db.js');
var URL = require('url');
var pageChange = require('../common/pageChange');


var dataObj = {
	selArtical: {
		table: 'Nblog_artical',
		field: ['id', 'title', 'author', 'sort', 'flag', 'time'],
		condition: {
			1: 1,
			limit: 10,
			order: 'desc',
			orderField: 'id'
		},
		close: 'true'
	},

	delArtical: {
		table: 'Nblog_artical',
		condition: {
			//id 动态获取
		},
		close: 'true'
	},

	selEditorArtical: {
		table: 'Nblog_artical',
		field: ['title', 'content', 'flag', 'sort'],
		condition: {
			// id 动态获取
		},
		close: 'true'
	},

	updateArtical: {
		table: 'Nblog_artical',
		condition: {
			// id 动态获取
		},
		close: 'true'	
	},

	articalCount: {
		table: 'nblog_artical',
		rename: 'count',
		condition: {
			1:1
		},
		close: 'true'
	}
}

var dealGet = function (req, res) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	} 

	function isEmpty(obj){
		for (var name in obj) {
			return false;
		}
		return true;
	};

	var urlInfo = util.urlparse(req.url);

	var query = URL.parse(req.url, true).query;

	if (isEmpty(query)) {
		//正常GET请求

		if(urlInfo.page <= 0) {
			urlInfo.page = 1;
		} else {
			dataObj.selArtical.condition.skip = (urlInfo.page - 1) * 10;
		}

		
		async.parallel({
			artical: function (cb) {
				db.getData(dataObj.selArtical, cb);
			},
			articalCount: function (cb) {
				db.getResultCount(dataObj.articalCount, cb);
			}
		}, function (e, result) {
			var t;
			for (var i = 0; i < result.artical.length; i++) {
	
				result.artical[i].time = util.dateFormat(result.artical[i].time);
				
				if (result.artical[i].flag == 1) {
					result.artical[i].flag = '顶';
				} else {
					result.artical[i].flag = '---';
				}
			}

			//处理分页
			var count = result.articalCount[0].count;

			var pageObj= pageChange.pageChange(count, urlInfo.page, 10);

			res.render('adminArt', {
				info: result.artical,
				page: pageObj,
				adminBase: 'adminBase',
				css: 'adminIndex.adminArt'
			});
		})
	} else {
		// 编辑或者删除请求
		if(query.editor) {
			dataObj.selEditorArtical.condition.id = query.id;
			db.getData(dataObj.selEditorArtical, function (err, result) {
				res.send(result)
			})
		} else if (query.delete) {
			dataObj.delArtical.condition.id = query.id;
			db.del(dataObj.delArtical, function (err, r) {
				res.redirect('/admin/adminIndex/dealRightMenuList/art/1');
			})
		}
	}
}

var dealPost = function (req, res) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	} 
	
	dataObj.updateArtical.title = req.body.title;
	dataObj.updateArtical.content = req.body.content;
	dataObj.updateArtical.flag = req.body.flag;
	dataObj.updateArtical.sort = req.body.sort;
	dataObj.updateArtical.condition.id = req.body.id;
	db.update(dataObj.updateArtical, function (err, flag) {
		res.redirect('/admin/adminIndex/dealRightMenuList/art/1/');
	})
}


module.exports.dealGet= dealGet;

module.exports.dealPost= dealPost;