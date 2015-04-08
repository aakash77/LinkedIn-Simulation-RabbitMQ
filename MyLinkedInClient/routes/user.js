var mysql = require('./mysql'), encryption = require('./encryption');

var user = require('express').Router();
var mq_client = require('../rpc/client');


/**********************User**********************/
/**
 * Get All users
 */
user.get('/', function(req, res) {

	var msg_payload = {
			operation : "search_member",
			message : ""
	};

	mq_client.make_request('member_queue',msg_payload,function(err,results){
		if(err){
			res.status(err.status).json(err);
		}else{
			res.status(results.status).json(results);
		}
	});
});

/**
 * Get user details
 */
user.get('/:email',function(req,res){

	if(!req.params.email){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var email = req.params.email;
		mysql.query("SELECT ??,??,??,??,?? FROM ?? WHERE ?? = ?",['firstName','lastName','gender','dob','summary','users','email',email],function(err,response){
			if(err){
				console.log("Error while retrieving user details !!!");
				res.status(500).json({
					status : 500,
					message : "Error while retrieving user details"
				});
			}else{
				res.status(200).json({
					status : 200,
					data : response
				});
			}
		});
	}
});

/**
 * Add user
 */
user.post('/',function(req, res) {

	if(!req.body.email || !req.body.firstName || !req.body.lastName ||!req.body.password){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var email = req.body.email, 
		firstName = req.body.firstName,
		lastName = req.body.lastName,
		password = req.body.password,
		lastLogin = new Date();

		var userName = firstName + " " + lastName,
		lastLogin = lastLogin.toDateString() + " " + lastLogin.toLocaleTimeString();

		var msg_payload = {
				operation : "signup",
				message : {
					"email" : email,
					"firstName" : firstName,
					"lastName" : lastName,
					"password" : password
				}
		}; 

		mq_client.make_request('login_queue',msg_payload, function(err,results){
			if(err){
				res.status(err.status).json(err);
			}
			else 
			{
				req.session.email = req.body.email;
				res.status(results.status).json(results);
			}  
		});
	}
});


/**
 * Update User
 */
user.put('/',function(req,res){

	if(!req.body.email || !req.body.lastName || !req.body.gender || !req.body.dob || !req.body.summary){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{

		var msg_payload = {
				operation : "update_profile",
				message : {
					email : req.body.email,
					firstName : req.body.firstName,
					lastName : req.body.lastName,
					gender : req.body.gender,
					dob : req.body.dob,
					summary : req.body.summary
				}
		};

		mq_client.make_request('profile_queue',msg_payload,function(err,results){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(results.status).json(results);
			}
		});
	}
});

/**********************User**********************/
/**********************Experience**********************/
/**
 * Get user experience
 */
user.get('/experience/:email', function(req, res) {

	if(!req.params.email){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var queryParam = {
				emailId : req.params.email
		}
		mysql.query("SELECT * from employment where ?", queryParam, function(err,
				response) {
			if (err) {
				res.status(500).json({
					status : 500,
					message : "Error while retrieving data"
				});
			} else {
				res.status(200).json({
					status : 200,
					data : response
				});
			}
		});
	}
});

/**
 * Add user experience
 */
user.post('/experience', function(req, res) {

	if(!req.body.emailId || !req.body.from || !req.body.to || !req.body.company || !req.body.designation){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var msg_payload = {
				operation : "add_experience",
				message : {
					emailId : req.body.emailId,
					from : req.body.from,
					to : req.body.to,
					company : req.body.company,
					designation : req.body.designation
				}
		};

		mq_client.make_request('profile_queue',msg_payload,function(err,results){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(results.status).json(results);
			}
		});
	}
});

/**
 * Update user experience
 */
user.put('/experience', function(req, res) {
	if(!req.body.old || !req.body.update){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var msg_payload = {
				operation : "update_experience",
				message : {
					old : req.body.old,
					update : req.body.update
				}
		};

		mq_client.make_request('profile_queue',msg_payload,function(err,results){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(results.status).json(results);
			}
		});
	}
});

/**
 * Delete Experience
 */
user.delete('/experience/:email/:company/:from/:to/:designation',function(req,res){

	if(!req.params.email || !req.params.company || !req.params.from || !req.params.to || !req.params.designation){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var msg_payload = {
				operation : "delete_experience",
				message : {
					email : req.params.email,
					company : req.params.company,
					from : req.params.from,
					to : req.params.to,
					designation : req.params.designation
				}
		};

		mq_client.make_request('profile_queue',msg_payload,function(err,results){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(results.status).json(results);
			}
		});
	}
});
/**********************Experience**********************/
/**********************Education**********************/
/**
 * Get user education
 */
user.get('/education/:email', function(req, res) {

	if(!req.params.email){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var queryParam = {
				emailId : req.params.email
		}
		mysql.query("SELECT * from education where ?", queryParam, function(err,
				response) {
			if (err) {
				res.status(500).json({
					status : 500,
					message : "Error while retrieving data"
				});
			} else {
				res.status(200).json({
					status : 200,
					data : response
				});
			}
		});
	}
});

/**
 * Add user education
 */
user.post('/education', function(req, res) {

	if(!req.body.emailId || !req.body.from || !req.body.to || !req.body.institution || !req.body.degree){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{

		var msg_payload = {
				operation : "add_education",
				message : {
					emailId : req.body.emailId,
					from : req.body.from,
					to : req.body.to,
					institution : req.body.institution,
					degree : req.body.degree
				}
		};

		mq_client('profile_queue',msg_payload,function(err,results){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(results.status).json(results);
			}
		});
	}
});


/**
 * Update user education
 */
user.put('/education', function(req, res) {

	if(!req.body.old || !req.body.update){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{

		var msg_payload = {
				operation : "update_education",
				message : {
					old : req.body.old,
					update : req.body.update
				}
		};

		mq_client.make_request('profile_queue',msg_payload,function(err,results){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(results.status).json(results);
			}
		});
	}
});

/**
 * Delete Education
 */
user.delete('/education/:email/:institution/:from/:to/:degree',function(req,res){

	if(!req.params.email || !req.params.institution || !req.params.from || !req.params.to || !req.params.degree){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var msg_payload = {
				operation : "delete_education",
				message : {
					email : req.params.email,
					institution : req.params.institution,
					from : req.params.from, 
					to : req.params.to, 
					degree : req.params.degree
				}
		};

		mq_client.make_request('profile_queue',msg_payload,function(err,results){

			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(results.status).json(results);
			}
		});
	}
});

/**********************Education**********************/
/**********************Skills**********************/
/**
 * Get user skills
 */
user.get('/skills/:email', function(req, res) {

	var queryParam = {
			emailId : req.params.email
	};
	mysql.query("SELECT * from skills where ?", queryParam, function(err,
			response) {
		if (err) {
			res.status(500).json({
				status : 500,
				message : "Error while retrieving data"
			});
		} else {
			res.status(200).json({
				status : 200,
				data : response
			});
		}
	});

});

/**
 * Add user skills
 */
user.post('/skills', function(req, res) {

	if(!req.body.emailId || !req.body.name){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{

		var msg_payload = {
				operation : "add_skills",
				message : {
					emailId : req.body.emailId,
					name : req.body.name
				}
		};

		mq_client.make_request('profile_queue',msg_payload,function(err,results){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(results.status).json(results);
			}
		});
	}
});
/**********************Skills**********************/

/**********************Connection**********************/

/**
 * Get User Connections
 */
user.get('/connection/:email',function(req,res){

	if(!req.params.email){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{

		var msg_payload = {
				operation : "show_connections",
				message : {
					email : req.params.email
				}
		};

		mq_client.make_request('member_queue',msg_payload,function(err,results){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(results.status).json(results);
			}
		});
	}
});


/**
 * Send Connection Invitation
 */
user.post('/connection',function(req,res){

	if(!req.body.firstUser || !req.body.secondUser){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{

		var msg_payload = {
				operation : "send_invitation",
				message : {
					firstUser : req.body.firstUser,
					secondUser : req.body.secondUser
				}
		};

		mq_client.make_request('member_queue',msg_payload,function(err,results){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(results.status).json(results);
			}
		});
	}
});

/**
 * Get Connection Requests
 */
user.get('/connection/requests/:email',function(req,res){

	mysql.query("SELECT * FROM ?? WHERE ?? = ? AND ?? = ?",['connections','secondUser',req.params.email,'status','pending'],function(err,response){
		if(err){
			console.log("Error while fetching list of pending connection request");
			console.log(err);
			res.status(500).json({status : 500,message:"Error while retrieving the list"});
		}else{
			var array = [];
			response.forEach(function(row){
				array.push(row.firstUser);
			});
			if(array.length==0){
				res.status(200).json({status : 200,data : []});
			}else{
				mysql.query("SELECT CONCAT_WS(' ',firstName,lastName) as name,email FROM ?? WHERE ?? IN (?)",['users','email',array],function(err,rows){
					if(err){
						console.log("Error while fetching list of pending connection request");
						console.log(err);
						res.status(500).json({status : 500,message:"Error while retrieving the list"});
					}else{
						res.status(200).json({status : 200,data : rows});
					}
				});
			}
		}
	});
});


/**
 * Accept Connection Request
 */
user.post('/connection/accept',function(req,res){

	if(!req.body.firstUser || !req.body.secondUser){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{

		var msg_payload = {
				operation : "accept_invitation",
				message : {
					firstUser : req.body.firstUser, 
					secondUser : req.body.secondUser
				}
		};

		mq_client.make_request('member_queue',msg_payload,function(err,results){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(results.status).json(results);
			}
		});
	}
});


/**
 * Reject Connection Request
 */
user.post('/connection/reject',function(req,res){
	
	if(!req.body.firstUser || !req.body.secondUser){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		
		var msg_payload = {
				operation : "reject_invitation",
				message : {
					firstUser : req.body.firstUser, 
					secondUser : req.body.secondUser
				}
		};

		mq_client.make_request('member_queue',msg_payload,function(err,results){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(results.status).json(results);
			}
		});
	}
});

/**********************Connection**********************/

/**
 * Check validity of user
 */
user.post('/valid', function(req, res) {
	if (req.session.email) {
		res.status(200).json({
			status : 200,
			message : "user valid"
		});
	} else {
		res.status(401).json({
			status : 401,
			message : "invalid user"
		});
	}
});

/**
 * Get Last Login
 */
user.post('/lastLogin', function(req, res) {
	if (!req.body.email) {
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	} else {
		var email = req.body.email;
		var msg_payload = {
				operation : "last_login",
				message : {
					email : email
				}
		};
		mq_client.make_request('login_queue',msg_payload,function(err,results){
			if(err){
				res.status(err.status).json(err);
			}else{
				res.status(results.status).json(results);
			}
		});
	}
});


module.exports = (function() {
	return user;
})();