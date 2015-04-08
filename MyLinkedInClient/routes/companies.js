var companies = require('express').Router(),
	mysql = require('./mysql');


/**
 * Get All Companies
 */
companies.get('/',function(req,res){
	mysql.query("SELECT * FROM companies",function(err,response){
		if(err){
			res.status(500).json({status:500,message : "Error while retrieving data"});
		}else{
			res.status(200).json({status:200,data : response});
		}
	});
});

module.exports = (function(){
	return companies;
})();