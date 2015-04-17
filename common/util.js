var moment = require('moment');

var URL = require('url');

moment.locale('zh-cn'); // 使用中文

var dateFormat = function (date, type) {

	date = moment(date);

	if(type) {
		return date.format(type);
	} else {
		return date.format('YYYY-MM-DD');
	}
}

var urlparse = function (path) {
	var results = {};

	var urlArr = path.split('/');

	switch (urlArr[1].toLowerCase()) {
		case 'artical':
			results.sort = urlArr[1];
			results.date = urlArr[2];
			results.articalName = decodeURI(urlArr[3]);
			break;
		case 'admin':
			results.sort = urlArr[1];
			results.page = urlArr[2];
			if (urlArr[3] && !urlArr[4]) {
				results.action = urlArr[3];
				break;
			} else if (urlArr[3] && urlArr[4]) {
				results.action = urlArr[3];
				results.target = decodeURI(urlArr[4].split('?')[0]);
				results.page = urlArr[5];
				break;
			} 
			break;
		default:
			results.err = '404';
	}

	

	return results;
} 

module.exports.urlparse = urlparse;

module.exports.dateFormat = dateFormat;