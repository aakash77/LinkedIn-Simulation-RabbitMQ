'use strict';
var mysql = require('../helper/mysql'), encryption = require('../helper/encryption');


/**
 * execute request handling
 */
exports.execute_request = function(req,callback){
	var operation = req.operation;
	var message = req.message;
	
	switch(operation){
		
		case "signup" :
				signup(message,callback);
				break;
		
		case "signin" : 
			signin(message,callback);
			break;
			
		case "signout" :
			signout(message,callback);
			break;
			
		case "last_login" :
			last_login(message,callback);
			break;
			
		default : 
			callback({status : 400,message : "Bad Request"});
	}
};

/**
 * Add user
 */
function signup(msg,callback) {
	if(!msg.email || !msg.firstName || !msg.lastName ||!msg.password){
		callback({status : 400,message : "Bad Request"});
	}
	else{
		encryption.encryptPass(msg.password,function(err, salt, hash) {
			if (err) {
				console.log("Error while encryption");
				callback({status : 500,message : "Please try again later"});
			} else {
				/**
				 * Converting hash and salt to
				 * base64 in order to keep them in
				 * DB*
				 */
				var email = msg.email, 
				userName = msg.firstName + " " + msg.lastName,
				lastLogin = new Date();
				lastLogin = lastLogin.toDateString() + " " + lastLogin.toLocaleTimeString();
				var queryParam = {
						email : email,
						firstName : msg.firstName,
						lastName : msg.lastName,
						password : hash.toString("base64"),
						salt : salt.toString('base64'),
						lastLogin : lastLogin
				};

				/**
				 * First check whether user already
				 * exist*
				 */
				mysql.query("SELECT * FROM users where email = ?",[ email ],function(err,response) {
					if (err) {
						console.log("Error while perfoming query !!!");
						callback({status : 500,message : "Please try again later"});

					} else if (response.length > 0) {
						callback({status : 400,message : "User already exist"});
					} else {
						/**
						 * No user found with the email id, create new user
						 */
						mysql.query("INSERT INTO users SET ?",queryParam,function(err,response) {
							if (err) {
								console.log("Error while perfoming query !!!");
								callback({status : 500,message : "Please try again later"});
							} else {
								callback({
									status : 200,
									email : email,
									name : userName,
									lastLogin : lastLogin
								});
							}
						});
					}
				});
			}
		});
	}
}

/**
 * Signin
 */
function signin(msg,callback){
	if(!msg.email || !msg.password){
		callback({status : 400,message : "Bad Request"});
	}else{
		var data = mysql.query("select * from users where email = ?",[msg.email],function(err,response){
			if(err){
				console.log(err);
				callback({status : 500,message : "Please try again later"});
			}else{
				if(response.length==0){
					callback({status : 401,message : "Invalid Credentials"});
				}else{
					var inputPassword = msg.password,
					email = response[0].email,
					password = response[0].password,
					salt = response[0].salt,
					saltBuf = new Buffer(salt,'base64'),
					userName = response[0].firstName + " " + response[0].lastName,
					lastLogin = response[0].lastLogin;

					/**
					 * In order to compare input and db password salt has to be
					 * converted back into binary since hash was created using that
					 * binary only*
					 */
					encryption.encryptPass(inputPassword,saltBuf,function(err,hash){
						/**
						 * Calculated binary hash has to be converted into base64
						 * since the password stored in the vault is in base64
						 * format*
						 */
						if(hash.toString("base64") === password){
							callback({status : 200, email : email,name : userName,lastLogin : lastLogin});
						}else{
							callback({status:401,message : "Invalid Credentials"});
						}
					});
				}
			}
		});
	}
}

/**
 * Signout
 */
function signout(msg,callback){
	var email = msg.email;
	var date = new Date();
	date = date.toDateString() + " " + date.toLocaleTimeString();
	var queryParam = {
			lastLogin : date
	};
	mysql.query('UPDATE users SET ? WHERE ?? = ?',[queryParam,'email',email],function(err,response){
		if(err){
			console.log("Error while updating last login in db");
			callback({status:500,message : "Please try again"});
		}else{
			callback({status:200,message : "Session deleted"});
		}
	});
}

/**
 * Last Login
 */
function last_login(msg,callback){
	var email = msg.email;
	mysql.query('SELECT ??,?? FROM ?? WHERE ?? = ?',['email','lastLogin','users','email',email],function(err,response){
		if(err){
			console.log("Error while fetching last login");
			callback({status:500,message : "Please try again"});
		}else{
			callback({status:200,email : response[0].email,lastLogin : response[0].lastLogin});
		}
	});
}