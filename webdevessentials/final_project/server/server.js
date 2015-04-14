var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; 
var cookieParser = require('cookie-parser'); 
var session = require('express-session'); 
var path = require("path");
var mongoose = require('mongoose');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(session({secret: 'this is the secret',saveUninitialized: true,
    resave: true}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//app.get('/', function(req, res){
//  res.send('hello world');
//});


passport.use(new LocalStrategy(
		function(username,password,done){

			UserModel.findOne({username: username, password: password}, function(err,user){
				if(user)
					{
					return done(null, user);
					}
				return done(null, false, {message: 'Unable to login'});
			});			
		}));

passport.serializeUser(function(user,done){
	done(null,user);
});

passport.deserializeUser(function(user,done){
	done(null,user);
});

app.post("/login",passport.authenticate('local'), function(req, res){
	var user = req.user;
	console.log("User at server:" + user);
	res.json(user);
	});

app.post("/logout", function(req, res){
	req.logout();
	res.sendStatus(200);
	});

app.get("/loggedin",function(req,res){
	res.send(req.isAuthenticated() ? req.user : '0');
});

app.post("/register", function(req, res){
	var newUser = new UserModel(req.body);
	newUser.roles = ['student'];	
	newUser.save(function(err,user){
	
	req.login(user, function(err){
	if(err)	{return next(err);}
	res.json(user);
	});	
	
	});
});


var auth = function(req, res, next){
	if(!req.isAuthenticated())
		res.send(401);
	else
		next();
};

app.get('/rest/user',auth, function(req, res){
     res.json(users);		 
});

//code for login page ends here

var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/cs5610';

mongoose.connect(connectionString);

var UserSchema =  new mongoose.Schema({
username: String,
password: String, 
first: String, 
last: String,
email: String,
roles: [String]
});

var UserModel = mongoose.model("UserModel", UserSchema);


//app.listen(3000);

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

//app.listen(port, ip);
app.use(express.static(path.join(__dirname, '../', 'client')));
app.listen(port, ip);