/**
 * Database Configurations
 */
exports.db = {
		"host" : "localhost",
		"port" : 3306,
		"user" : "root",
		"password" : "aakash",
		"database" : "mylinkedin",
		"connectionLimit" : 100
	};

/**
 * Encryption Configurations
 */
exports.encrypt = {
	"lengthOfKey" : 128,
	"numberOfIterations" : 500,
	"digest" : 'sha256'
};

/**
 * Database Pooling Configurations
 */
exports.dbPool = {
		"maxSize" : 50
}