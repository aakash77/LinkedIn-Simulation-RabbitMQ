var crypto = require('crypto'), config = require('./config');

var encryptProp = config.encrypt;


exports.encryptPass = function(password, salt, callback) {
	
	var lengthOfKey = encryptProp.lengthOfKey, 
		noOfIterations = encryptProp.numberOfIterations, 
		digest = encryptProp.digest;
	
	/**
	 * Generate hash on the basis of given salt and passowrd for checking user credentials
	 */
	if (arguments.length == 3) {
		crypto.pbkdf2(password, salt, noOfIterations, lengthOfKey, digest,
				callback);
	} else {
		/**
		 * Generate salt and password for the new user for storing in database
		 */
		callback = salt;
		crypto.randomBytes(lengthOfKey, function(err, salt) {
			if (err) {
				return callback(err);
			}
			salt.toString('base64');
			crypto.pbkdf2(password, salt, noOfIterations, lengthOfKey, digest,
					function(err, hash) {
						if (err) {
							return callback(err);
						}
						callback(null, salt, hash);
					});
		});
	}
};