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

app.put("/addmyshare/:id", function (req, res) {
    
	console.log("in the server>>");
  var item = req.body;
  console.log("item"+item);
//
    UserModel.update({ _id: req.params.id }, { shared: item }, function (err, doc) {
    	UserModel.find(function (err, data) {
            res.json(data);
        });
    });   
    //developers[index] = developer;
    //res.json(developers);
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
roles: [String],
shared: [{category: String, organisation: String, quantity: String}]
});

var UserModel = mongoose.model("UserModel", UserSchema);


//amazon start
var util = require('util');
var aws = require("aws-lib");

ec2 = aws.createEC2Client("AKIAIPJMAQNDYSJYRVUA", "oItVCSoe5LqKTKQBfysUij/LonsXF+BkRFEIyRGX");
var prodAdv = aws.createProdAdvClient("AKIAIPJMAQNDYSJYRVUA", "oItVCSoe5LqKTKQBfysUij/LonsXF+BkRFEIyRGX", "cs5-20");

var options = {SearchIndex: "Books", Keywords: "Javascript", ResponseGroup: "ItemAttributes,Offers,Images"};

app.get('/books', function (req, res) {
    console.log(req);
prodAdv.call("ItemSearch", options, function(err, result) {
  console.log(result);
 
  res.json(result);
});
});
//amazon end

//ebay start
var http = require('http');

//Construct the request
//Replace MyAppID with your Production AppID
var url = "http://svcs.ebay.com/services/search/FindingService/v1";
url += "?OPERATION-NAME=findItemsByKeywords";
url += "&SERVICE-VERSION=1.0.0";
url += "&SECURITY-APPNAME=Studentb5-e548-490a-85d5-417ae4289c1";
url += "&GLOBAL-ID=EBAY-US";
url += "&RESPONSE-DATA-FORMAT=JSON";
//url += "&callback=_cb_findItemsByKeywords";
url += "&REST-PAYLOAD";
url += "&keywords=harry%20potter";
url += "&paginationInput.entriesPerPage=3";

var Client = require('node-rest-client').Client;

client = new Client();

app.get('/ebay', function(req, res){
	console.log("Inside ebay cient");
// direct way 
client.get(url, function(data){
           // parsed response body as js object 
           console.log(data);
           // raw response 
         //  console.log(response);
          res.send(data); 
       });
});

//ebay end

//wallmart start
//var options = {
//    host: 'http://api.walmartlabs.com',
//    port: '80',
//    path: '/v1/search?query=grocery+rice&format=json&facet=on&apiKey=cb9u828stayvspr4jq85ywjz',
//    method: 'GET',
//    headers: {
//        'Content-Type': 'application/json; charset=utf-8',
//        'Content-Length': data.length
//    }
//};


app.get('/walmart', function (req,res) {
    console.log("inside wlamrt api");
    var walmartURL = "http://api.walmartlabs.com/v1";
        walmartURL+= "/search?query=grocery+rice&format=json&facet=on&apiKey=cb9u828stayvspr4jq85ywjz";
    client.get(walmartURL, function (data) {
        console.log("The data is" + data);
        res.send(data);
    });
});
//walmart end


//app.listen(3000);

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

//app.listen(port, ip);
app.use(express.static(path.join(__dirname, '../', 'client')));
app.listen(port, ip);