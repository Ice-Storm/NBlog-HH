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
			id: 1
		},
		close: 'true'	
	},

	selPersonInfo: {
		table: 'nblog_admin',
		field: ['email', 'qq'],
		condition: {
			id: 1
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
		field: ['title'],
		condition: {
			// foreign_p
		},
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
		pubArtical: function (cb) {
			db.getData(dataObj.selPubArticalObj, cb);	
		},
		words: function (cb) {
			db.getData(dataObj.selWords, cb);
		},
		personInfo: function (cb) {
			db.getData(dataObj.selPersonInfo, cb);
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
	}, function (err, result) {

		for (var i = 0; i < result.recentlyReplayTitle.length; i++) {
			if (result.recentlyReplayTitle[i][0]) {
				result.recentlyReplayTitle[i] = result.recentlyReplayTitle[i][0];
				result.recentlyReplay[i].title = result.recentlyReplayTitle[i].title;
				result.recentlyReplay[i].time =  util.dateFormat(result.recentlyReplayTitle[i].time);
			}
		}
		
		for (var i = 0; i < result.pubArtical.length; i++) {
			result.pubArtical[i].time = util.dateFormat(result.pubArtical[i].time);
		}

		res.render('whoAmI', {
			data: result
		});
	})
}


module.exports.dealGet= dealGet;