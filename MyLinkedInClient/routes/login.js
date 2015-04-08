var	mysql	= require('./mysql'),
	encryption = require('./encryption'),
	mq_client = require('../rpc/client');

module.exports = function(req,res){
	
	if(!req.body.email || !req.body.password){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var email = req.body.email;
		var msg_payload = {
			operation : "signin",
			message : {
				email : email,
				password : req.body.password
			}
		};
		
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			if(err){
				console.log("Error : " + err);
				res.status(err.status).json(err);
			}
			else 
			{
				req.session.email = email;
				res.status(results.status).json(results);
			}  
		});
	}
};