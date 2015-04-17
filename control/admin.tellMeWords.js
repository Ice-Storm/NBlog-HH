var async = require('async');
var util = require('../common/util');
var pageChange = require('../common/pageChange');
var db = require('../models/db.js');
var URL = require('url');

var dataObj = {
	selectCon: {
		table: 'Nblog_words_comment',
		field: ['id', 'content', 'time', 'author', 'email'],
		condition: {
			1: 1,
			limit: 10,
			order: 'desc',
			orderField: 'id'
		},
		close: 'true'
	},

	comCount: {
		table: 'Nblog_words_comment',
		rename: 'count',
		condition: {
			1:1
		},
		close: 'true'
	},

	delComment: {
		table: 'Nblog_words_comment',
		condition: {
			//id 动态获取
		},
		close: 'true'
	}

}


var dealGet = function (req, res) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	}

	var urlInfo = util.urlparse(req.url);

	var query = URL.parse(req.url, true).query;

	if(query.delete) {
		dataObj.delComment.condition.id = query.id;
		db.del(dataObj.delComment, function (err) {
			res.redirect('/admin/adminArtical/deal/tellMeWords/1');
		})
	} else {
		async.auto({
			comment: function (cb) {
				dataObj.selectCon.condition.skip = (urlInfo.page - 1) * 10;
				db.getData(dataObj.selectCon, cb);
			},
			comCount: function (cb) {
				db.getResultCount(dataObj.comCount, cb);
			}
		}, function (err, result) {

			for (var i = 0; i < result.comment.length; i++) {
				result.comment[i].time = util.dateFormat(result.comment[i].time);
			}

			var count = result.comCount[0].count;

			var pageObj= pageChange.pageChange(count, urlInfo.page, 10);

			pageObj.curPage = urlInfo.page;

			res.render('adminTellMeWords', {
				adminBase: 'adminBase',
				css: 'adminIndex.tellMeWords',
				data: result,
				page: pageObj
			});
		})
	}
}


module.exports.dealGet= dealGet;