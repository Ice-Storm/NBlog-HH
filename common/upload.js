var formidable = require('formidable');
var config = require('../config.default.js');
var deepmerge = require('deepmerge');
var path = require('path');
var fs = require('fs');

/*
	
	params req, obj, cb

	{

		keepExtensions = true,
		maxFieldsSize = 2 * 1024 * 1024,
		uploadPath
		fileName
		uploadFormName
	}

*/
var uploadImg = function (req, paramsObj, cb) {

	var form = new formidable.IncomingForm();

	// 默认

	var defaultParam = {

		keepExtensions: true,

		maxFieldsSize: 2 * 1024 * 1024, 

		fileName: new Date().getTime(),

		uploadFormName: 'imgFile',

		uploadPath: path.join(__dirname, '../public' + config.uploadFile)

	}

	// 合并

	var params = deepmerge(defaultParam, paramsObj);

	form.uploadDir = params.uploadPath;

	form.parse(req, function(err, fields, files) {

		var fileName = params.fileName;
		var extname = '';
		if (files[params.uploadFormName]) {

			files.uploadFile = files[params.uploadFormName];

			switch (files.uploadFile.type) {
				case 'image/jpeg':
					extname = 'jpg';
					break;
				case 'image/png':
					extname = 'png';
					break;
				case 'application/octet-stream':
					extname = files.uploadFile.name.split('.')[1];
					break;
			}

			var fileNameExt = fileName + '.' + extname;

			params.fileName = fileNameExt;

			fs.rename(files.uploadFile.path, params.uploadPath + fileNameExt, function (err) {
				if (err) throw err;
				if (cb) cb(null, params);
			});
		}
	});
}

module.exports.uploadImg = uploadImg;
