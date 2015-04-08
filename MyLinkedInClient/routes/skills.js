var skills = require('express').Router(),
	mysql = require('./mysql');


/**
 * Get list of all skillSet
 */
skills.get('/',function(req,res){
	mysql.query("SELECT * FROM skillset",function(err,response){
		if(err){
			res.status(500).json({status:500,message : "Error while retrieving data"});
		}else{
			res.status(200).json({status:200,data : response});
		}
	});
});


module.exports = (function(){
	return skills;
})();