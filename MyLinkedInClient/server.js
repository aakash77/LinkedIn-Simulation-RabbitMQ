var express = require('express'), 
	bodyParser = require('body-parser'), 
	session = require('express-session'), 
	multer = require('multer'), 
	login = require('./routes/login'),
	logout = require('./routes/logout'),
	companies = require('./routes/companies'),
	institutions = require('./routes/institutions'),
	skills = require('./routes/skills'),
	connection = require('./routes/connection'),
	mysql = require('./routes/mysql'), 
	user = require('./routes/user');

var server = express();
/**Router for handling view objects**/
var renderGUI = express.Router();
/**Router for handling API**/
var	api = express.Router();

/** Sessions* */
server.use(session({
	secret : '12345',
	resave : false,
	saveUninitialized : false,
	cookie:{maxAge : 600000,rolling : true}
}));
/** Parsing url* */
server.use(bodyParser.urlencoded({
	extended : true
}));
/** Parsing JSON* */
server.use(bodyParser.json());
/** Parsing multi-form* */
server.use(multer());

server.set('views', __dirname + '/views');
server.set('view engine', 'ejs');
server.use(express.static(__dirname + '/public'));
server.use('/', renderGUI);
server.use('/api', api);

/** Initialing DB Connection Pool* */
mysql.createConnectionPool();

/** Render GUI Middleware* */
renderGUI.use(function(req, res, next) {
	console.log("Request For : ", req.url);
	next();
});

/** API Middleware* */
api.use(function(req, res, next) {
	console.log("API hit : ", req.url);
	/*if(req.session.email){
		next();
	}
	else{
		res.status(401).json({message : "Unauthorized access !!"});
	}*/
	next();
});


renderGUI.get(['/','/home','/logout'], function(req,res){
	res.render("index");
});

renderGUI.get('/templates/:file', function(req,res){
	var file = req.params.file;
	res.render('templates/'+file);	
});


server.post('/logout', logout);
server.post('/login', login);

/**Delegating API calls**/
api.use('/user', user);
api.use('/companies', companies);
api.use('/institutions', institutions);
api.use('/skills', skills);
api.use('/connection', connection);

server.listen(3000, function() {
	console.log("Server Started ... ");
});