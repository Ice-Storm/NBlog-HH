var indexCon = require('../control/index.c.js');

var artical = require('../control/artical.c.js');

var whoAmI = require('../control/whoAmI.c.js');

var adminMan = require('../control/admin.man.js');

var adminSta = require('../control/admin.sta.js');

var adminArt = require('../control/admin.art.js');

var adminAddArt = require('../control/admin.addArt.js');

var adminEls = require('../control/admin.els.js');

var adminElsTwo = require('../control/admin.elsTwo.js');

var adminElsThree = require('../control/admin.elsThree.js');

var adminElsFour = require('../control/admin.elsFour.js');

var adminWords = require('../control/admin.words.js');

var adminTellMeWords = require('../control/admin.tellMeWords.js');

var tellMe = require('../control/tellMe.js');

var login = require('../control/login.js');

var email = require('../control/email.js');

var indexSort = require('../control/indexSort.js');

var articalRegExp = /artical\/(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)\/.+/i

module.exports = function (router) {
	router.get(/^\/[1-9]\d?$|^\/$/, indexCon.index);

	router.get('/whoAmI', whoAmI.dealGet);

	router.get('/tellMe', tellMe.dealGet);

	router.post('/tellMe', tellMe.dealPost);

	router.get(articalRegExp, artical.articalGet);

	router.post(articalRegExp, artical.articalPost)

	router.get('/admin/adminindex', function (req, res) {
		res.render("adminindex.ejs", {
			adminBase: 'adminBase',
			css: 'adminAdmin'
		})
	});

	router.get(/admin\/adminIndex\/dealRightMenuList\/man\/\w+/, adminMan.dealGet);

	router.post(/admin\/adminIndex\/dealRightMenuList\/man\/\w+/, adminMan.dealPost);

	router.get('/admin/adminIndex/dealRightMenuList/status', adminSta.dealGet);

	router.get(/admin\/adminIndex\/dealRightMenuList\/art\/\w+/, adminArt.dealGet);

	router.post(/admin\/adminIndex\/dealRightMenuList\/art\/\w+/, adminArt.dealPost);

	router.get('/admin/adminIndex/content/addArtical', adminAddArt.dealGet);

	router.post('/admin/adminIndex/content/addArtical', adminAddArt.dealPost);
	
	router.get('/admin/adminIndex/dealRightMenuList/else', adminEls.dealGet);

	router.post('/admin/adminIndex/dealRightMenuList/else', adminEls.dealPost);

	router.get('/admin/adminIndex/dealRightMenuList/else2', adminElsTwo.dealGet);

	router.post('/admin/adminIndex/dealRightMenuList/else2', adminElsTwo.dealPost);

	router.get('/admin/adminIndex/dealRightMenuList/else3', adminElsThree.dealGet);

	router.post('/admin/adminIndex/dealRightMenuList/else3', adminElsThree.dealPost);

	router.get('/admin/adminIndex/dealRightMenuList/else4', adminElsFour.dealGet);

	router.post('/admin/adminIndex/dealRightMenuList/else4', adminElsFour.dealPost);

	router.get(/admin\/adminArtical\/deal\/words\/\d+/, adminWords.dealGet);

	router.get(/admin\/adminArtical\/deal\/tellMeWords\/\d+/, adminTellMeWords.dealGet);

	router.get('/login', login.dealGet);

	router.post('/login', login.dealPost);

	router.get('/email/:id/:hash', email.dealGet);

	router.post('/email/:id/:hash', email.dealPost);

	router.get('/sort/:sort/:page', indexSort.dealGet);
}
