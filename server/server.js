// =================================================================
// get the packages we need ========================================
// =================================================================
var init 		= require('./config/init')(),
	express 	= require('express'),
	http 			= require('http'),
	https 		= require('https'),
	mongoose 	= require('mongoose'),
	chalk 		= require('chalk'),
	path 			= require('path'),
	config 		= require('./config/config'); // get our config file

// Bootstrap db connection
var db = mongoose.connect(config.db.uri, config.db.options, function (err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

mongoose.connection.on('error', function (err) {
	console.error(chalk.red('MongoDB connection error: ' + err));
	process.exit(-1);
});

// Init the express application
var app = require('./config/express')(db);

// Init the express sub application
var admin = require('./config/admin')();

// mount the sub app
app.use(['/adm*n'], admin);

// Bootstrap passport config
require('./config/passport')();

// =================================================================
// routes ==========================================================
// =================================================================

// basic route main app
app.get('/', function (req, res) {
	res.json({
		api: 'http://localhost:5000/api',
		type: 'json',
		info: 'apidoc'
	});
});

// basic route admin sub app
admin.get('/', function (req, res) {
	res.json({
		admin: 'http://localhost:5000/adm*n',
		type: 'json'
	});
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router();

// ---------------------------------------------------------
// api authentication middleware ---------------------------
// ---------------------------------------------------------
require('./config/auth')(apiRoutes);

app.use('/api', apiRoutes);

// Globbing routing files 
config.getGlobbedFiles('./app/routes/**/*.js').forEach(function (routePath) {
	require(path.resolve(routePath))(apiRoutes);
});

// ---------------------------------------------------------
// get an instance of the router for admin routes
// ---------------------------------------------------------
var adminRoutes = express.Router();

app.use('/admin', adminRoutes);

// =================================================================
// create the server ===============================================
// =================================================================
var server = http.createServer(app);

// =================================================================
// create the websocket ============================================
// =================================================================
var io = require('socket.io')(server);

// =================================================================
// websocket connection initialization =============================
// =================================================================

/* socket.io client cdn: https://cdn.socket.io/socket.io-1.3.5.js */
io.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
});

// Expose app
exports = module.exports = app;

// =================================================================
// start the server ================================================
// =================================================================
server.listen(config.port);
console.log('Magic happens at http://localhost:' + config.port);

// Logging initialization
console.log('------------------------------------------------------------');
console.log(chalk.green(config.app.title + ' application started'));
console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
console.log(chalk.green('Port:\t\t\t\t' + config.port));
console.log(chalk.green('Database:\t\t\t' + config.db.uri));
if (process.env.NODE_ENV === 'secure') {
	console.log(chalk.green('HTTPs:\t\t\t\ton'));
}
console.log('------------------------------------------------------------');
