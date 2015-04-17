var crypto =  require('crypto');

var cryptoInfo = function (cryType, outType, info) {
	var hash = crypto.createHash(cryType);

	hash.update(info);

	return hash.digest(outType);
}

module.exports.cryptoInfo = cryptoInfo;