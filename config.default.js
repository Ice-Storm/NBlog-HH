var config = {

	listenerPort: 3000,
	sessionSecret: 'test',
	urlSecret: 'test',

	//mysql default config
	mysql: {
		host: 'localhost',
		port: 3306,
		database: 'NBlog',
		user: 'root',
		password: '',
		//mysql poll config
		waitForConnections: true,
		connectionLimit: 50,
		queryLimit: 50,
		multipleStatements: false
	},

	uploadFile: '/uploadImg/',

	// log config

	log4js: {
		appenders: [
			{type: 'console'},
			{
				type: 'file',
				filename: './logs/N-blog.log',
				maxLogSize: 204800,
				backups: 3,
				category: 'normal'
			}
		]
	},

	log4jsLeave: 'INFO',

	// email config

	email: {
		host: 'smtp.163.com',
		/*
			secureConnection: 'true', // SSL
			port: 465,
		*/ 
		auth: {
			user: 'wcwz020140@163.com',
			pass: 'bai3863114yu'
		}
	},

	postInterval:  15 * 1000

}


module.exports = config;