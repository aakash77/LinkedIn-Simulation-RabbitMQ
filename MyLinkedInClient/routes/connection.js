var mysql = require('./mysql');

var connection = require('express').Router();

/**
 * Check connection validity between two users
 */
connection.get('/valid/:currentUser/:requestedUser',function(req,res){
	var currentUser = req.params.currentUser;
	var requestedUser = req.params.requestedUser;
	
	mysql.query('SELECT * from connections where ?? = ? AND ?? = ? OR ?? = ? AND ?? = ?',['firstUser',currentUser,'secondUser',requestedUser,'firstUser',requestedUser,'secondUser',currentUser],function(err,response){
		if(err){
			console.log("error while fetching connection data");
			console.log(err);
			res.status(500).json({
				status : 500,
				message : "Please try again later"
			});
		}else{
			res.status(200).json({status : 200,data : response});
		}
	})
});


module.exports = (function() {
	return connection;
})();
