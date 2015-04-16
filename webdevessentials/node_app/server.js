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

var util = require('util');
var aws = require("aws-lib");

ec2 = aws.createEC2Client("AKIAIPJMAQNDYSJYRVUA", "oItVCSoe5LqKTKQBfysUij/LonsXF+BkRFEIyRGX");
var prodAdv = aws.createProdAdvClient("AKIAIPJMAQNDYSJYRVUA", "oItVCSoe5LqKTKQBfysUij/LonsXF+BkRFEIyRGX", "cs5-20");

var options = {SearchIndex: "Books", Keywords: "Javascript", ResponseGroup: "ItemAttributes,Offers,Images"};

app.get('/books', function(req, res){
prodAdv.call("ItemSearch", options, function(err, result) {
  console.log(result);
  
//  var image = {ItemId: "1118907442", ResponseGroup:"Images"};
//  prodAdv.call("ItemLookup", image, function(err, res) {
//	  console.log(res);
//  });
  res.json(result);
});
});

// using ebay and http
var http = require('http');

//Construct the request
//Replace MyAppID with your Production AppID
var url = "http://svcs.ebay.com/services/search/FindingService/v1";
 url += "?OPERATION-NAME=findItemsByKeywords";
 url += "&SERVICE-VERSION=1.0.0";
 url += "&SECURITY-APPNAME=Studentb5-e548-490a-85d5-417ae4289c1";
 url += "&GLOBAL-ID=EBAY-US";
 url += "&RESPONSE-DATA-FORMAT=JSON";
// url += "&callback=_cb_findItemsByKeywords";
 url += "&REST-PAYLOAD";
 url += "&keywords=harry%20potter";
 url += "&paginationInput.entriesPerPage=3";
 
 var Client = require('node-rest-client').Client;
 
 client = new Client();
  
 app.get('/ebay', function(req, res){
 // direct way 
 client.get(url, function(data){
             // parsed response body as js object 
             console.log(data);
             // raw response 
           //  console.log(response);
            res.send(data); 
         });
 });
//using ebay and http end


var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

//app.listen(port, ip);
app.use(express.static(__dirname + '/public'));
app.listen(port, ip);
