var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; 
var cookieParser = require('cookie-parser'); 
var session = require('express-session'); 

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(session({secret: 'this is the secret',saveUninitialized: true,
    resave: true}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//code for the login page 

var users = 
	[
	 {username:'nidhi', password:'nidhik', firstname:'Nidhi', lastname:'Kurup',roles:['student','professor']},
	 {username:'roshni', password:'roshnik', firstname:'Roshni', lastname:'Kundu',roles:['admin']},
	 {username:'sneha', password:'snehav', firstname:'Sneha', lastname:'Vankireddy',roles:['ta','student']}
	 ];

passport.use(new LocalStrategy(
		function(username,password,done){
//			for(var u in users)
//				{
//				if(username == users[u].username && password == users[u].password){
//					return done(null, users[u]);
//				}
//				}
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
	res.send(200);
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


//var alice = new UserModel({
//	username: 'alice', password: 'alice', first:'Alice',
//	last:'wonderland', email:'alice@wonderland', roles:['admin','student']
//});
//
//alice.save();


var DeveloperSchema = new mongoose.Schema({
    firstName: String,
    lastName:String
}, { collection: "Developer" });

var DeveloperModel = mongoose.model("Developer", DeveloperSchema);

var developers = [{ firstName: 'Alice', lastName: 'Wonderland'},
{ firstName: 'Nidhi', lastName: 'Kurup'},
{ firstName: 'Roshni', lastName: 'Kundu' },
{ firstName: 'Mike', lastName: 'Tyson' },
{ firstName: 'K k', lastName: 'Menon' },
{ firstName: 'Jakie', lastName: 'Chan' },
{ firstName: 'Leo', lastName: 'Vinci' }];

app.get("/developers", function (req, res) {
    DeveloperModel.find(function (err, data) {
        res.json(data);
    });  
});

app.get("/developers/:id", function (req, res) {
    DeveloperModel.findById(req.params.id, function (err, doc) {
        res.json(doc);      
    });
    
});

app.post("/developers", function (req, res) {
    var developer1 = new DeveloperModel(req.body);
    developer1.save(function (err, doc) {
        DeveloperModel.find(function (err, data) {
            res.json(data);
        });
    });       
});

app.delete("/developers/:id", function (req, res) {
    DeveloperModel.findById(req.params.id, function (err, doc) {
        doc.remove();
        DeveloperModel.find(function (err, data) {
            res.json(data);
        });        
    });
   
});

//app.get('/process', function (req, res) {
//    res.json(process.env);
//});

app.put("/developers/:id", function (req, res) {
     
    var developer = req.body;

    DeveloperModel.update({ _id: req.params.id }, { firstName: developer.firstName, lastName: developer.lastName }, function (err, doc) {
        DeveloperModel.find(function (err, data) {
            res.json(data);
        });
    });   

    //developers[index] = developer;
    //res.json(developers);
});

//app.get('/', function (req, res) {
//    res.send('hello world');
//});

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

//app.listen(port, ip);
app.use(express.static(__dirname + '/public'));
app.listen(port, ip);
