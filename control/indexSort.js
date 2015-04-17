var async = require('async');

var db = require('../models/db.js');

var util = require('../common/util');

var pageChange = require('../common/pageChange');

var URL = require('url');

//首页查询数据

var dataObj = {

	selConfigObj: {
		table: 'nblog_config',
		condition: {
			all: '*'
		},
		close: 'true'
	},

	selTagObj: {
		table: 'nblog_tag',
		field: ['tag_name'],
		close: 'true'
	},

	selMenuObj: {
		table: 'nblog_menu',
		field: ['menu_name'],
		close: 'true'
	},

	selArticalObj: {
		table: 'nblog_artical',
		field: ['title', 'author', 'time', 'content', 'img_p', 'com_p'],
		fun: {
			unix_timestamp: 'time'
			//from_unixtime: 'time'
		},
		condition: {
			limit: 4,
			order: 'desc',
			orderField: 'id'
		},
		close: 'true'
	},

	selArticalImgObj: {
		table: 'nblog_img',
		field: ['img_name'],
		condition: {
			//foreign_p: item.img_p, 函数动态生成
		},
		close: 'true'
	},

	selCountComment: {
		table: 'nblog_comment',
		rename: 'count',
		condition: {
			//foreign_p: com_p[item]
		},
		close: 'true'
	},

	selCountArtical: {
		table: 'nblog_artical',
		rename: 'count',
		condition: {
			1:1
		},
		close: 'true'
	},
	
	regExp: /\<img\s+src.+\/\>/i, //文章截取处不出现图片,

	maxArtical: 4,

	selSort: 'SELECT sort, COUNT(*) AS count FROM nblog_artical GROUP BY sort'

}


var dealGet = function (req, res) {

	var curPage = req.params.page;

	if (!curPage) {
		curPage = 1;
	}

	async.auto({
		config: function (cb) {
			db.getData(dataObj.selConfigObj, cb);
		},
		tag: function (cb) {
			db.getData(dataObj.selTagObj, cb);
		},
		menu: function (cb) {
			db.getData(dataObj.selMenuObj, cb);
		},
		sort: function (cb) {
			db.selectAuto(dataObj.selSort, cb);
		},
		artical: function (cb) {
			dataObj.selArticalObj.condition.sort = req.params.sort;
			db.getData(dataObj.selArticalObj, cb);
		},
		countArtical: function (cb) {
			dataObj.selCountArtical.condition.sort = req.params.sort;
			db.getResultCount(dataObj.selCountArtical, cb);
		},
		articalImg: ['artical', function (cb, result) {
			if (result == 0) {
				cb(null, []);
			}
			async.map(result.artical, function (item, callback) {

				dataObj.selArticalImgObj.condition.foreign_p = item.img_p;

				db.getData(dataObj.selArticalImgObj, callback);

			}, function (err, result) {

				cb(null, result);
			})
		}],
		commCount: ['artical', function (cb, result) {
	
			var com_p = [];

			if (result.artical != 0) {
				for (var i = 0; i < result.artical.length; i++) {
					com_p.push(result.artical[i].com_p);
				}
			}

			async.map(com_p, function (item, callback) {
				dataObj.selCountComment.condition.foreign_p = item;

				db.getResultCount(dataObj.selCountComment, callback);

			}, function (err, result) {
				cb(null, result);
			});
		}]
	}, function (err, result) {

		console.log(result)
		console.log(result.commCount[0])

		//分页
		var count = result.countArtical[0].count;

		var pageObj = pageChange.pageChange(count, curPage, 4);

		pageObj.curPage = curPage;

		//合并 文章和图片 artical   articalImg 对象 
		//截取文章前一部分
		//把评论数挂在artical上
		//去除截取部分图片

		for (var i = 0; i < result.artical.length; i++) {
			
			if (result.articalImg[i][0]) {
				result.artical[i].img = result.articalImg[i][0].img_name;
			} else {
				result.artical[i].img = '';
			}

			delete result.artical[i].img_p;

			delete result.artical[i].com_p;

			result.artical[i].content = result.artical[i].content.split('\n', 15).join('');

			
			if (dataObj.regExp.exec(result.artical[i].content)) {
				result.artical[i].content = result.artical[i].content.replace(dataObj.regExp, '');
			}

			result.artical[i].comCount = result.commCount[i][0].count;

			//格式化时间

			if (result.artical[i].time.toString().length == 10) {
				result.artical[i].time = util.dateFormat(result.artical[i].time * 1000);
			} else {
				result.artical[i].time = util.dateFormat(result.artical[i].time);
			}

		}

		delete result.commCount;

		res.render('index', {
			data: result,
			page: pageObj
		});
	})
} 

module.exports.dealGet = dealGet;