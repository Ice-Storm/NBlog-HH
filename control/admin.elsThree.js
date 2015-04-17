var async = require('async');
var util = require('../common/util');
var db = require('../models/db.js');

var dataObj = {
	selContentObj: {
		table: 'nblog_words',
		field: ['content'],
		condition: {
			id: 1
		},
		close: 'true'
	},

	insertContent: {
		table: 'nblog_words',
		condition: {
			id: 1
		},
		//content: req.body.editorContent
		close: true
	}
}

var dealGet = function (req, res) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	} 

	async.auto({
		content: function (cb) {
			db.getData(dataObj.selContentObj, cb);
		}
	}, function (err, result) {
		console.log(result);
		res.render('adminElsThree', {
			data: result,
			adminBase: 'adminBase',
			css: 'adminIndex.adminElsThree'
		});
	})

}

var dealPost = function (req, res) {

	if (!req.session.isAdmin) {
		// 未登录管理员 或者 超时
		return res.redirect('/login');
	} 

	async.auto({
		insertCon: function (cb) {
			dataObj.insertContent.content = req.body.editorContent;
			db.update(dataObj.insertContent, cb);
		}
	}, function (err, result) {
		console.log(result);
		res.redirect('/admin/adminIndex/dealRightMenuList/else3')
	})
}


module.exports.dealGet = dealGet;

module.exports.dealPost= dealPost;