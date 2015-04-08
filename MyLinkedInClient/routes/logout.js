var mysql = require('./mysql'),
	mq_client = require('../rpc/client');

module.exports = function(req,res){

	if(!req.body.email){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		
		var msg_payload = {
				operation : "signout",
				message : {
					email : req.body.email
				}
		};
		
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			if(err){
				console.log("Error : " + err);
				res.status(err.status).json(err);
			}
			else 
			{
				req.session.destroy();
				res.status(results.status).json(results);
			}  
		});
	}
};