var mysql = require('mysql');
var config = require('./config.default.js');
var db = require('./db/createTable.js');

var conn = mysql.createConnection({
	host: config.mysql.host,
	port: config.mysql.port,
	user: config.mysql.user,
	password: config.mysql.password
});

conn.connect();

//var createDatabase = 'CREATE DATABASE IF NOT EXISTS ' + config.mysql.database; 
var createDatabase = 'CREATE DATABASE IF NOT EXISTS asdf'; 

conn.query(createDatabase, function (err, info) {
	if (err) throw '创建数据库失败';
		console.log('创建数据库成功');
		conn.query('use asdf', function (err) {
			if (err) throw(err)
			conn.query(db.artical, function (err) {
				if (err) throw(err)
				console.log('db.artical 创建成功');
				/*conn.end();*/
			});

		conn.query(db.comment, function (err) {
			if (err) throw(err)
			console.log('db.comment 创建成功');
			/*conn.end();*/
		});

		conn.query(db.admin, function (err) {
			if (err) throw(err)
			console.log('db.admin 创建成功');
			/*conn.end();*/
		});

		conn.query(db.img, function (err) {
			if (err) throw(err)
			console.log('db.img 创建成功');
			/*conn.end();*/
		});

		conn.query(db.tag, function (err) {
			if (err) throw(err)
			console.log('db.tag 创建成功');
			/*conn.end();*/
		});

		conn.query(db.config, function (err) {
			if (err) throw(err)
			console.log('db.config 创建成功');
			/*conn.end();*/
		});

		conn.query(db.menu, function (err) {
			if (err) throw(err)
			console.log('db.menu 创建成功');
			/*conn.end();*/
		});

		conn.query(db.words, function (err) {
			if (err) throw(err)
			console.log('db.words  创建成功');
			/*conn.end();*/
		});

		conn.query(db.wordsComment, function (err) {
			if (err) throw(err)
			console.log('db.wordsComment 创建成功');
			/*conn.end();*/
		});

		conn.query(db.fun, function (err) {
			if (err) throw(err)
			console.log('db.fun  创建成功');
			/*conn.end();*/
		});
		conn.end();
	})
	/*conn.end();*/
})