var amqp = require('amqp');

var connection = amqp.createConnection({host:'localhost'});
var rpc = new (require('./amqprpc'))(connection);


function make_request(queue_name, msg_payload, callback){
	
	rpc.makeRequest(queue_name, msg_payload, function(response){
		if(response.status==200){
			callback(null, response);
		}else{
			callback(response);
		}
		/*connection.end();*/
	});
}

exports.make_request = make_request;