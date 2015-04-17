var async = require('async');
var db = require('./db');
var c = require('./createTable');


// async.waterfall([
	/*function (cb) {
		console.log('first');
		cb(null, {
			table: 'nblogtest',
			id: 1,
			name: 'hh',
			close: true
		})
	},
	function (n, cb) {
		db.insert(n, cb)
	},
	function (n, cb) {
		cb(null, {
			table: 'nblogtest',
			field: ['id', 'name'],
			condition: {
				id: 1,
				name: 'hh',
				limit: 1,
				orderField: 'id'
			},
			close: true
		})
	},
	function (n, cb) {
		console.log(n);
		db.getData(n, cb);
	},
	function (n, cb) {
		cb(null, {
			table: 'nblogtest',
			condition : {
				id: 1,
				name: 'hh'
			},
			close: true
		})
	},
	function (n, cb) {
		db.del(n, cb);
	},*/
/*	function (n, cb) {

	}
	
	//function (n, cb) {console.log(n); cb(null, n)}
], function (err, r){
	console.log(err);
	console.log('result ---->  ' + r);
})*/

db.selectAuto(c.admin);