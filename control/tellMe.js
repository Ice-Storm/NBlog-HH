var async = require('async');
var util = require('../common/util');
var db = require('../models/db.js');

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
		field: ['title'],
		condition: {
			// foreign_p
		},
		close: 'true'
	},

	selPubArticalObj: {
		table: 'nblog_artical',
		field: ['title', 'time'],
		condition: {
			1:1,
			skip: 1,
			limit: 7,
			order: 'desc',
			orderField: 'id'
		},
		close: 'true'	
	},

	selWords: {
		table: 'nblog_words',
		field: ['content'],
		condition: {
			id: 2
		},
		close: 'true'	
	},

	selWordsComment: {
		table: 'nblog_words_comment',
		field: ['author', 'time', 'content'],
		close: 'true'	
	},

	insWordsComment: {
		table: 'nblog_words_comment',
		close: 'true'
	}
}


var dealGet = function (req, res) {
	async.auto({
		config: function (cb) {
			db.getData(dataObj.selConfigObj, cb);
		},
		menu: function (cb) {
			db.getData(dataObj.selMenuObj, cb);
		},
		recentlyReplay: function (cb) {
			db.getData(dataObj.selRecentlyReplay, cb);
		},
		recentlyReplayTitle: ['recentlyReplay', function (cb, result) {
			async.map(result.recentlyReplay, function (item, callback) {
				dataObj.selRecentlyRepTit.condition.com_p = item.foreign_p;
				delete item.foreign_p;
				db.getData(dataObj.selRecentlyRepTit, callback)
			}, function (err, data) {
				cb (err, data);
			})
		}],
		pubArtical: function (cb) {
			db.getData(dataObj.selPubArticalObj, cb);	
		},
		wordsComment: function (cb) {
			db.getData(dataObj.selWordsComment, cb);
		},
		words: function (cb) {
			db.getData(dataObj.selWords, cb);
		}
	}, function (err, result) {
		
		for (var i = 0; i < result.recentlyReplayTitle.length; i++) {
			if (result.recentlyReplayTitle[i][0]) {
				result.recentlyReplayTitle[i] = result.recentlyReplayTitle[i][0];
				result.recentlyReplay[i].title = result.recentlyReplayTitle[i].title;
				result.recentlyReplay[i].time =  util.dateFormat(result.recentlyReplayTitle[i].time);
			}
		}

		for (var i = 0; i < result.pubArtical.length; i++) {
			if (result.pubArtical[i]) {
				result.pubArtical[i].time =  util.dateFormat(result.pubArtical[i].time);
			}
		}

		for (var i = 0; i < result.wordsComment.length; i++) {
			result.wordsComment[i].time =  util.dateFormat(result.wordsComment[i].time);
		}

		delete result.recentlyReplayTitle;

		console.log(result)
		res.render('tellMe', {
			data: result
		});
	})
}

var dealPost = function (req, res) {

	//同一IP提交没加时间限制

	dataObj.insWordsComment.author = req.body.author;
	dataObj.insWordsComment.content = req.body.content;
	dataObj.insWordsComment.email = req.body.email;
	db.insert(dataObj.insWordsComment, function (err) {
		res.redirect('/tellMe');
	});
}


module.exports.dealGet= dealGet;

module.exports.dealPost= dealPost;