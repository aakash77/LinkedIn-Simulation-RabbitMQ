'use strict';

var mysql = require('../helper/mysql'), encryption = require('../helper/encryption');

/**
 * execute request handling
 */
exports.execute_request = function(req,callback){
	var operation = req.operation;
	var message = req.message;
	
	switch(operation){
		
		case "update_profile" :
				updateProfile(message,callback);
				break;
		
		case "add_experience" : 
			addExperience(message,callback);
			break;
			
		case "update_experience" :
			updateExperience(message,callback);
			break;
			
		case "delete_experience" :
			deleteExperience(message,callback);
			break;
			
		case "add_education" :
			addEducation(message,callback);
			break;
			
		case "update_education" :
			updateEducation(message,callback);
			break;
			
		case "delete_education" :
			deleteEducation(message,callback);
			break;
			
		case "add_skills" :
			addSkills(message,callback);
			break;
			
		default : 
			callback({status : 400,message : "Bad Request"});
	}
};



/**
 * Update Profile
 */
function updateProfile(msg,callback){
	var email = msg.email;
	var queryParams = {
			firstName : msg.firstName,
			lastName : msg.lastName,
			gender : msg.gender,
			dob : msg.dob,
			summary : msg.summary
	};

	mysql.query("UPDATE ?? SET ? WHERE ?? = ?",['users',queryParams,'email',email],function(err,response){
		if (err) {
			callback({status : 500,message : "Error while updating user profile"});
		} else {
			callback({status : 200,message : "Successfull"});
		}
	});
}

/**
 * Add Experience
 */
function addExperience(msg,callback){
	var queryParam = {
			emailId : msg.emailId,
			from : msg.from,
			to : msg.to,
			company : msg.company,
			designation : msg.designation
	};

	mysql.query("INSERT INTO ?? SET ?",['employment',queryParam], function(err,
			response) {
		if (err) {
			console.log("Error while perfoming query !!!");
			callback({status : 500,message : "Please try again later"});
		} else {
			callback({status : 200,message : "Experience has been added Succesfully"});
		}
	});
}

/**
 * Update Experience
 */
function updateExperience(msg,callback){

	var old = msg.old, update = msg.update;

	var newParam ={
			from : update.from,
			to : update.to,
			company : update.company,
			designation : update.designation
	};
	mysql.query("UPDATE employment SET ? WHERE ?? = ? and ?? = ? and ?? = ? and ?? = ? and ?? = ?", [newParam,'emailId',old.emailId,'from',old.from,'to',old.to,'company',old.company,'designation',old.designation], function(err,
			response) {
		if (err) {
			console.log("Error while perfoming query !!!");
			console.log(err);
			callback({
				status : 500,
				message : "Please try again later"
			});
		} else {
			callback({
				status : 200,
				message : "Experience has been updated Succesfully"
			});
		}
	});
}

/**
 * Delete Experience
 */
function deleteExperience(msg,callback){

	var email = msg.email,
	company = msg.company,
	from = msg.from,
	to = msg.to,
	designation = msg.designation

	mysql.query('DELETE FROM ?? WHERE ?? = ? AND ??=? AND ?? = ? AND ?? = ? AND ?? = ?',['employment','emailId',email,'company',company,'from',from,'to',to,'designation',designation],function(err,response){
		if (err) {
			console.log("Error while deleting employment !!!");
			console.log(err);
			callback({
				status : 500,
				message : "Error while deleting employment !!!"
			});
		} else {
			callback({
				status : 200,
				message : "Employment has been deleted Succesfully"
			});
		}
	});
}

/**
 * Add Education
 */
function addEducation(msg,callback){
	
	var queryParam = {
			emailId : msg.emailId,
			from : msg.from,
			to : msg.to,
			institution : msg.institution,
			degree : msg.degree
	}

	mysql.query("INSERT INTO education SET ?", queryParam, function(err,
			response) {
		if (err) {
			console.log("Error while perfoming query !!!");
			callback({
				status : 500,
				message : "Please try again later"
			});
		} else {
			callback({
				status : 200,
				message : "Education has been added Succesfully"
			});
		}
	});
}

/**
 * Update Education
 */
function updateEducation(msg,callback){
	
	var old = msg.old, update = msg.update;

	var newParam ={
			from : update.from,
			to : update.to,
			institution : update.institution,
			degree : update.degree
	};
	
	mysql.query("UPDATE education SET ? WHERE ?? = ? and ?? = ? and ?? = ? and ?? = ? and ?? = ?", [newParam,'emailId',old.emailId,'from',old.from,'to',old.to,'institution',old.institution,'degree',old.degree], function(err,
			response) {
		if (err) {
			console.log("Error while perfoming query !!!");
			console.log(err);
			callback({
				status : 500,
				message : "Please try again later"
			});
		} else {
			callback({
				status : 200,
				message : "Education has been updated Succesfully"
			});
		}
	});
}

/**
 * Delete Education
 */
function deleteEducation(msg,callback){

	var email = msg.email,
	institution = msg.institution,
	from = msg.from,
	to = msg.to,
	degree = msg.degree;

	mysql.query('DELETE FROM ?? WHERE ?? = ? AND ??=? AND ?? = ? AND ?? = ? AND ?? = ?',['education','emailId',email,'institution',institution,'from',from,'to',to,'degree',degree],function(err,response){
		if (err) {
			console.log("Error while deleting education !!!");
			console.log(err);
			callback({
				status : 500,
				message : "Error while deleting education !!!"
			});
		} else {
			callback({
				status : 200,
				message : "Education has been deleted Succesfully"
			});
		}
	});
}

/**
 * Add Skills
 */
function addSkills(msg,callback){
	
	var queryParam = {
			emailId : msg.emailId,
			name : msg.name
	};

	mysql.query("INSERT INTO skills SET ?", queryParam,
			function(err, response) {
		if (err) {
			console.log("Error while perfoming query !!!");
			callback({
				status : 500,
				message : "Please try again later"
			});
		} else {
			callback({
				status : 200,
				message : "Skills has been added Succesfully"
			});
		}
	});
}