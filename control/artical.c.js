var async = require('async');
var db = require('../models/db.js');
var URL = require('url');
var util = require('../common/util');


var dataObj = {

	selConfigObj: {
		table: 'nblog_config',
		condition: {
			all: '*'
		},
		close: 'true'
	},

	selMenuObj: {
		table: 'nblog_menu',
		field: ['menu_name'],
		close: 'true'
	},

	selArticalObj: {
		table: 'nblog_artical',
		field: ['title', 'content', 'author', 'time', 'com_p'],
		condition: {
			//title:  动态添加
		},
		close: 'true'	
	},

	selPubArticalObj: {
		table: 'nblog_artical',
		field: ['title', 'time'],
		condition: {
			1:1,
			skip: 1,
			limit: 5,
			order: 'desc',
			orderField: 'id'
		},
		close: 'true'	
	},

	selCommObj: {
		table: 'nblog_comment',
		field: ['id', 'content', 'author', 'time', 'replay_p', 'foreign_p'],
		condition: {
			// foreign_p 动态添加
		},
		close: 'true'
	},

	insertReplayObj: {
		table: 'nblog_comment',
		/*
		author
		content
		email
		获取当前 time
		*/
		close: 'true'
	},

	selJudgeArticalObj: {
		table: 'nblog_artical',
		field: ['title'],
		condition: {
			//title = urlinfo.articalName
		},
		close: 'true'
	},

	selRecentlyReplay: {
		table: 'nblog_comment',
		field: ['author', 'foreign_p'],
		condition: {
			1:1,
			skip: 1,
			limit: 7,
			order: 'desc',
			orderField: 'id'
		},
		close: 'true'
	},

	selRecentlyRepTit: {
		table: 'nblog_artical',
		field: ['title', 'time'],
		condition: {
			// foreign_p
		},
		close: 'true'
	},

	countObj: {
		table: 'nblog_comment',
		rename: 'count',
		condition: {
			//foreign_p: com_p[item]
		},
		close: 'true'
	},

}

var articalGet = function (req, res) {
	var param = URL.parse(req.url, true).query.replay;

	if (param) {
		req.session.replayId = param;
		res.send('1');
	} else {
		var infoUrl = util.urlparse(req.path);

		async.auto({
			config: function (cb) {
				db.getData(dataObj.selConfigObj, cb);
			},
			menu: function (cb) {
				db.getData(dataObj.selMenuObj, cb);
			},
			artical: function (cb) {
				dataObj.selArticalObj.condition.title = infoUrl.articalName;
				db.getData(dataObj.selArticalObj, cb);	
			},
			pubArtical: function (cb) {
				db.getData(dataObj.selPubArticalObj, cb);	
			},
			recentlyReplay: function (cb) {
				db.getData(dataObj.selRecentlyReplay, cb);
			},
			commentCount:['artical' ,function (cb, result) {
				if (result.artical[0] && result.artical[0].com_p) {
					dataObj.countObj.condition.foreign_p = result.artical[0].com_p;
					db.getResultCount(dataObj.countObj, cb);
				} else {
					cb('artical not find', 1);
				}
			}],
			comment: ['artical', function (cb, result) {
				if (result.artical[0] && result.artical[0].com_p) {
					dataObj.selCommObj.condition.foreign_p = result.artical[0].com_p;
					db.getData(dataObj.selCommObj, cb);
				} else {
					cb('artical not find', 1);
				}
			}],
			recentlyReplayTitle: ['recentlyReplay', function (cb, result) {

				// 静态链表，查找评论和子评论
				async.map(result.recentlyReplay, function (item, callback) {
					dataObj.selRecentlyRepTit.condition.com_p = item.foreign_p;
					delete item.foreign_p;
					db.getData(dataObj.selRecentlyRepTit, callback)
				}, function (err, data) {
					cb (err, data);
				})
			}]
		}, function (err, result) {
			
			//异常处理
			if (err) return res.send(err);

			req.session.com_p = result.artical[0].com_p;
			// 合并结果集
			for (var i = 0; i < result.recentlyReplayTitle.length; i++) {
				if (result.recentlyReplayTitle[i][0]) {
					result.recentlyReplayTitle[i] = result.recentlyReplayTitle[i][0];
					result.recentlyReplay[i].title = result.recentlyReplayTitle[i].title;
					result.recentlyReplay[i].time =  util.dateFormat(result.recentlyReplayTitle[i].time);
				}
			}

			result.artical[0].time = util.dateFormat(result.artical[0].time);

			result.artical[0].count = result.commentCount[0].count;

			delete result.recentlyReplayTitle;

			delete result.commentCount;

			delete result.artical[0].com_p;

			for (var i = 0; i < result.comment.length; i++) {
				
				result.comment[i].time = util.dateFormat(result.comment[i].time);

				// 保存子评论
				result.comment[i].rep = [];

				for (var j = 0; j < result.comment.length; j++) {
					if (result.comment[i].id == result.comment[j].replay_p) {
						result.comment[i].rep.push(result.comment.slice(j, j + 1));
						result.comment[j].flag = -1;
					}
				}
			}

			for (var i = 0; i < result.pubArtical.length; i++) {
				result.pubArtical[i].time = util.dateFormat(result.pubArtical[i].time);
			}

			console.log(result)

			res.render('artical', {
				data: result
			});
		});
	}
}

var articalPost = function (req, res) {

	//console.log('!!!' + req.session.replayId)

	//当服务器重启丢失session
	//if (!req.session.replayId) return res.redirect(req.path);

	console.log(req.path) 

	var infoUrl = util.urlparse(req.path);
	async.waterfall([
		function (cb) {
			dataObj.selJudgeArticalObj.condition.title = infoUrl.articalName;
			db.getData(dataObj.selJudgeArticalObj, cb);
		},
		function (data, cb) {
			if (data[0]) {
				//回复评论的ID
				if (req.session.replayId) {
					dataObj.insertReplayObj.replay_p = req.session.replayId;
				}
				dataObj.insertReplayObj.foreign_p = req.session.com_p;
				dataObj.insertReplayObj.author = req.body.author;
				dataObj.insertReplayObj.content = req.body.content;
				dataObj.insertReplayObj.email = req.body.email;
				db.insert(dataObj.insertReplayObj, cb);
			} else {
				//插入失败
				//日志记录
			}
		}
	], function (err, result) {
		if (err) throw err;

		res.redirect(302 ,req.originalUrl);
	});
}

module.exports.articalGet = articalGet;

module.exports.articalPost = articalPost;