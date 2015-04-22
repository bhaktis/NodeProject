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
var util = require('util');
var http = require('http');
var aws = require("aws-lib"); //amazon
var Client = require('node-rest-client').Client;
client = new Client();


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(session({
    secret: 'this is the secret', saveUninitialized: true,
    resave: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//app.get('/', function(req, res){
//  res.send('hello world');
//});


var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/cs5610';

var db = mongoose.connect(connectionString);

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    first: String,
    last: String,
    email: String,
    contact: String,
    address: String,
    shared: [{ category: String, organisation: String, description: String, quantity: String, price: String, source: String }]
});

var UserModel = mongoose.model("UserModel", UserSchema);

var organisations = [{ name: "kids welfare", location: "boston" },
    { name: "animal welfare", location: "Citiview" },
    { name: "educate all", location: "Northeastern University" }];


app.get("/orgs", function (req, res) {
    res.json(organisations);
});


passport.use(new LocalStrategy(
		function (username, password, done) {

		    UserModel.findOne({ username: username, password: password }, function (err, user) {
		        if (user) {
		            return done(null, user);
		        }
		        return done(null, false, { message: 'Unable to login' });
		    });
		}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.post("/login", passport.authenticate('local'), function (req, res) {
    var user = req.user;
    res.json(user);
});

app.post("/logout", function (req, res) {
    req.logout();
    res.sendStatus(200);
});

app.post("/userexists", function (req, res) {
    console.log(req.body);
    UserModel.findOne({ username: req.body.username }, function (err, data) {
        res.send(true);
    });
});

app.get("/loggedin", function (req, res) {
   res.send(req.isAuthenticated() ? req.user : '0');
});

app.post("/register", function (req, res) {
    console.log(req.user);
    var newUser = new UserModel(req.body);
    console.log(newUser);
    UserModel.findOne({ username: newUser.username }, function (err, data) {
        if (data != null) {
            console.log("duplicate");
            res.json(null);
        }else {
            newUser.save(function (err, user) {
                req.login(user, function (err) {
                    if (err) { return next(err); }
                    res.json(user);
                });
            });
        }
    });
    
});

app.post("/save", function (req, res) {
    console.log(req.body);
    var newUser = new UserModel(req.body);
    console.log(newUser);
    UserModel.update({ _id: newUser._id }, { $set: { password: newUser.password, email: newUser.email, contact: newUser.contact, address: newUser.address } }, function (err, doc) {
        console.log(err);
        console.log(doc);
        UserModel.findOne({ _id: newUser._id },function (err, data) {
            console.log(data);
            console.log("session");
            console.log(req.session.passport.user);
            req.session.passport.user = data;
            passport.serializeUser(function (user, done) {
                done(null, user);
            });
            console.log("new session");
            console.log(req.session.passport.user);
        });
    });    
});

app.put("/donated/:id", function (req, res) {
    console.log("in donated >>");
    var items = req.body;
    console.log("item" + items);
    UserModel.findOne({ _id: req.params.id }, function (err, data) {
        var shared = data.shared;
        for (var i = 0; i < items.length; i++) {
            shared.push(items[i]);
        }        
        console.log("Updated shared items list >>" + shared);
        data.shared = shared;
        console.log("saved data>>" + data);
        data.save(function (err, user) {
            req.login(user, function (err) {
                if (err) { return next(err); }
                res.json(user);
            });
        });       
    });

});

app.get("/sharedItems", function (req, res) {
    var list = null;
    UserModel.find({ shared: { $exists: true, $ne: [] } }, { _id: 1, username: 1, shared: 1,items:1 }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.json(data);
        }

    })

});


var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.send(401);
    else {
        var user = req.user;
        console.log("Auth >>" + user.username + ":" + user.shared.length);
        next();
    }

};

app.get('/rest/user', auth, function (req, res) {
    res.json(users);
});

//code for login page ends here



ec2 = aws.createEC2Client("AKIAIPJMAQNDYSJYRVUA", "oItVCSoe5LqKTKQBfysUij/LonsXF+BkRFEIyRGX");
var prodAdv = aws.createProdAdvClient("AKIAIPJMAQNDYSJYRVUA", "oItVCSoe5LqKTKQBfysUij/LonsXF+BkRFEIyRGX", "cs5-20");

app.post('/books', function (req, res) {
    var search = req.body;
    console.log(search.category + ":" + search.keyword);

    var options = { SearchIndex: search.category, Keywords: search.keyword, ResponseGroup: "ItemAttributes,Offers,Images" };

    prodAdv.call("ItemSearch", options, function (err, result) {
        console.log(result);
        res.json(result);
    });
});

app.post('/ebay', function (req, res) {

    var search = req.body;
    console.log(search.category + ":" + search.keyword);

    var url = "http://svcs.ebay.com/services/search/FindingService/v1";
    url += "?OPERATION-NAME=findItemsByKeywords";
    url += "&SERVICE-VERSION=1.0.0";
    url += "&SECURITY-APPNAME=Studentb5-e548-490a-85d5-417ae4289c1";
    url += "&GLOBAL-ID=EBAY-US";
    url += "&RESPONSE-DATA-FORMAT=JSON";
    url += "&REST-PAYLOAD";
    url += "&keywords=" + search.category + "%20" + search.keyword;
    url += "&paginationInput.entriesPerPage=10";
    console.log("Inside ebay cient");
    client.get(url, function (data) {
        console.log(data);
        res.send(data);
    });
});



app.post('/walmart', function (req, res) {
    var search = req.body;
    console.log(search.category + ":" + search.keyword);
    console.log("inside wlamrt api");
    var walmartURL = "http://api.walmartlabs.com/v1";
    walmartURL += "/search?query=" + search.category + "%20" + search.keyword + "&format=json&facet=on&apiKey=cb9u828stayvspr4jq85ywjz";
    client.get(walmartURL, function (data) {
        console.log("The data is" + data);
        res.send(data);
    });
});

//app.listen(3000);

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

//app.listen(port, ip);
app.use(express.static(path.join(__dirname, '/public')));
app.listen(port, ip);