var amqp = require('amqp'),
	mysql = require('./helper/mysql'),
	login = require('./services/login'),
	profile = require('./services/profile'),
	member = require('./services/member');

/** Initialing DB Connection Pool* */
mysql.createConnectionPool();

var cnn = amqp.createConnection({host:'localhost'});

cnn.on('ready', function(){
	console.log("listening on queues");
	
	/**Login Service**/
	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("Message: "+JSON.stringify(message));
			login.execute_request(message, function(res){
				publishQueue(cnn,m,res);
			});
		});
	});
	
	/**Profile Service**/
	cnn.queue('profile_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("Message: "+JSON.stringify(message));
			profile.execute_request(message, function(res){
				publishQueue(cnn,m,res);
			});
		});
	});
	
	/**Member Service**/
	cnn.queue('member_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("Message: "+JSON.stringify(message));
			member.execute_request(message, function(res){
				publishQueue(cnn,m,res);
			});
		});
	});
});

function publishQueue(conn,m,response){
	conn.publish(m.replyTo, response, {
		contentType:'application/json',
		contentEncoding:'utf-8',
		correlationId:m.correlationId
	});
}