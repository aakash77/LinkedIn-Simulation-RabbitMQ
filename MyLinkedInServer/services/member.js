'use strict';

var mysql = require('../helper/mysql'), encryption = require('../helper/encryption');

/**
 * execute request handling
 */
exports.execute_request = function(req,callback){
	var operation = req.operation;
	var message = req.message;
	
	switch(operation){
		
		case "search_member" :
				searchMember(message,callback);
				break;
		
		case "send_invitation" : 
			sendInvitation(message,callback);
			break;
			
		case "accept_invitation" :
			acceptInvitation(message,callback);
			break;
			
		case "reject_invitation" :
			rejectInvitation(message,callback);
			break;
			
		case "show_connections" :
			showConnections(message,callback);
			break;
		
		default : 
			callback({status : 400,message : "Bad Request"});
	}
};


/**
 * Search Member
 */
function searchMember(msg,callback){
	mysql.query("SELECT CONCAT_WS(' ',firstName,lastName) as name,email from users",
			function(err, response) {
		if (err) {
			console.log("Error while fetching list of all the users !!!");
			callback({
				status : 500,
				message : "Please try again later"
			});
		} else {
			callback({
				status : 200,
				data : response
			});
		}
	});
}

/**
 * Send Invitation
 */
function sendInvitation(msg,callback){

	var queryParam = {
			firstUser : msg.firstUser,
			secondUser : msg.secondUser,
			status : "pending"
	};

	mysql.query("INSERT INTO ?? SET ?",['connections',queryParam],function(err,response){
		if(err){
			console.log("error while adding new connection");
			console.log(err);
			callback({
				status : 500,
				message : "Please try again later"
			});
		}else{
			callback({status : 200,message : "Successfull"});
		}
	});
}

/**
 * Accept Invitation
 */
function acceptInvitation(msg,callback){

	var firstUser = msg.firstUser,
	secondUser = msg.secondUser;

	mysql.query("UPDATE ?? SET ?? = ? WHERE ?? = ? AND ?? = ?",['connections','status','active','firstUser',firstUser,'secondUser',secondUser],function(err,response){
		if(err){
			console.log("Error while accepting connection request");
			console.log(err);
			callback({status : 500,message:"Error while accepting connection request"});
		}else{
			callback({status : 200,message : "Successfull"});
		}
	});
}

function rejectInvitation(msg,callback){
	
	var firstUser = msg.firstUser,
	secondUser = msg.secondUser;
	
	mysql.query("UPDATE ?? SET ?? = ? WHERE ?? = ? AND ?? = ?",['connections','status','inactive','firstUser',firstUser,'secondUser',secondUser],function(err,response){
		if(err){
			console.log("Error while rejecting connection request");
			console.log(err);
			callback({status : 500,message:"Error while rejecting connection request"});
		}else{
			callback({status : 200,message : "Successfull"});
		}
	});
}

/**
 * Show Connections
 */
function showConnections(msg,callback){

	var email = msg.email;

	mysql.query("SELECT * FROM ?? WHERE ?? = ? AND ?? = ? OR ?? = ?",['connections','status','active','firstUser',email,'secondUser',email],function(err,response){

		if(err){
			console.log("Error while retrieving user connections !!!");
			callback({
				status : 500,
				message : "Error while retrieving user connections"
			});
		}else{
			if(response.length!==0){
				var array = [];
				response.forEach(function(connection){
					if(connection.firstUser===email){
						array.push(connection.secondUser);
					}else{
						array.push(connection.firstUser);
					}
				});

				mysql.query("SELECT CONCAT_WS(' ',firstName,lastName) as name,email FROM ?? WHERE ?? IN (?)",['users','email',array],function(err,rows){
					if(err){
						console.log("Error while retrieving user connections !!!");
						callback({
							status : 500,
							message : "Error while retrieving user connections"
						});
					}else{
						callback({
							status : 200,
							data : rows
						});
					}
				});
			}else{
				callback({
					status : 200,
					message : "No Connections"
				});
			}
		}
	});
}