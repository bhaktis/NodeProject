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

var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/cs5610';

var db = mongoose.connect(connectionString);

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    first: String,
    last: String,
    email: String,
    contact: Number,
    address: String,
    shared: [{ category: String, organisation: String, description: String, quantity: String, price: String, source: String }],
    wishlist: [{ id: String, title: String, description: String, fulfillmentTrailer: String, imageURL: String, costToComplete: String, totalPrice: String, expirationDate: String, fundingStatus: String, schoolName: String, schoolUrl: String }]
});

var UserModel = mongoose.model("UserModel", UserSchema);
var OrganisationSchema = new mongoose.Schema({
    name: String,
    password: String,
    cause: String,
    contact: Number,
    location: String,
    email: String,
    requirement: [{ category: String, quantity: String }]
});

var organisationModel = mongoose.model('organisations', OrganisationSchema);

var ReviewSchema = new mongoose.Schema({
    orgname: String,
    reviews: [{ text: String, user: String, comments: [{ text: String, user: String }] }]
});

var reviewsModel = mongoose.model('Reviews', ReviewSchema);




app.get("/orgs", function (req, res) {
    var orgCollection = mongoose.model('organisations');
    orgCollection.find({}, function (err, data) {
        res.json(data);

    });
});


passport.use(new LocalStrategy(
		function (username, password, done) {
		    console.log("Sign in type");
		    console.log(username + ":" + password);
		    UserModel.findOne({ username: username, password: password }, function (err, user) {
		        if (user) {
		            return done(null, user);
		        }
		        return done(null, false, { message: 'Unable to login' });
		    });
		}));

passport.use("OrgLogin", new LocalStrategy(
		function (username, password, done) {
		    console.log("Sign in type from organisation");
		    console.log(username + ":" + password);
		    var orgCollection = mongoose.model('organisations');
		    orgCollection.findOne({ name: username, password: password }, function (err, org) {
		        if (org) {
		            return done(null, org);
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

app.post("/orglogin", passport.authenticate('OrgLogin'), function (req, res) {
    console.log("Inside User Login");
    var user = req.user;
    res.json(user);
});

app.post("/orgregister", function (req, res) {
    console.log("Inside register");
    console.log(req.user);
    var orgCollection = mongoose.model('organisations');
    var newOrganisation = new orgCollection(req.body);
    console.log(newOrganisation);
    orgCollection.findOne({ name: newOrganisation.name }, function (err, data) {
        if (data != null) {
            console.log("duplicate");
            res.json(null);
        } else {
            console.log("NO duplicate");
            newOrganisation.save(function (err, org) {
                req.login(org, function (err) {
                    if (err) { return next(err); }
                    res.json(org);
                });
            });
        }
    });
});

app.post("/saveorg", function (req, res) {
    console.log("Inside save");
    console.log(req.user);
    var orgCollection = mongoose.model('organisations');
    console.log(req.body);
    var newUser = new orgCollection(req.body);
    console.log(newUser);
    orgCollection.findOne({ _id: newUser._id }, function (err, data) {
        console.log(data);
        if (data !== null) {
            data.cause = newUser.cause;
            data.email = newUser.email;
            data.contact = newUser.contact;
            data.location = newUser.location;
            data.requirement = newUser.requirement;
            data.save(function (err, user) {
                req.login(user, function (err) {
                    if (err) { return next(err); }
                    res.json(user);
                });
            });
        }
    });
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
        } else {
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

    UserModel.findOne({ _id: newUser._id }, function (err, data) {
        if (data !== null) {
            data.password = newUser.password;
            data.email = newUser.email;
            data.contact = newUser.contact;
            data.address = newUser.address;
            data.save(function (err, user) {
                req.login(user, function (err) {
                    if (err) { return next(err); }
                    res.json(user);
                });
            });
        }
    });

});

app.post("/pickup", function (req, res) {
    console.log("Inside pickup");
    var org = req.body;
    console.log(org);
    UserModel.find({ "shared.organisation": org.name }, { username: 1, email: 1, shared: 1 }, function (err, data) {
        res.json(data);
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
    UserModel.find({ shared: { $exists: true, $ne: [] } }, { _id: 1, username: 1, shared: 1, items: 1 }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.json(data);
        }

    })

});


var auth = function (req, res, next) {
    console.log("in aithenticate");
    if (!req.isAuthenticated())
        res.send(401);
    else {
        var user = req.user;
        //console.log("Auth >>" + user.username + ":" + user.shared.length);
        next();
    }

};

app.get('/rest/user', auth, function (req, res) {
    res.json(users);
});

//code for login page ends here

//shopping code

ec2 = aws.createEC2Client("AKIAIPJMAQNDYSJYRVUA", "oItVCSoe5LqKTKQBfysUij/LonsXF+BkRFEIyRGX");
var prodAdv = aws.createProdAdvClient("AKIAIPJMAQNDYSJYRVUA", "oItVCSoe5LqKTKQBfysUij/LonsXF+BkRFEIyRGX", "cs5-20");

app.post('/amazon', function (req, res) {
    var search = req.body;
    console.log(search.category + ":" + search.keyword + ":" + search.page);

    var options = { SearchIndex: search.category, Keywords: search.keyword, ResponseGroup: "ItemAttributes,Offers,Images", ItemPage: search.page };

    prodAdv.call("ItemSearch", options, function (err, result) {
        console.log(result);
        res.json(result);
    });
});


app.post('/ebay', function (req, res) {

    var search = req.body;
    console.log(search.category + ":" + search.keyword + ":" + search.page);

    var url = "http://svcs.ebay.com/services/search/FindingService/v1";
    url += "?OPERATION-NAME=findItemsByKeywords";
    url += "&SERVICE-VERSION=1.0.0";
    url += "&SECURITY-APPNAME=Studentb5-e548-490a-85d5-417ae4289c1";
    url += "&GLOBAL-ID=EBAY-US";
    url += "&RESPONSE-DATA-FORMAT=JSON";
    url += "&REST-PAYLOAD";
    url += "&keywords=" + search.category + "%20" + search.keyword;
    url += "&paginationInput.pageNumber=" + search.page + "&paginationInput.entriesPerPage=10";
    console.log("Inside ebay cient");
    client.get(url, function (data) {
        console.log(data);
        res.send(data);
    });
});



app.post('/walmart', function (req, res) {
    var search = req.body;
    console.log(search.category + ":" + search.keyword + ":" + search.page);
    var itemNumber = (search.page - 1) * 10 + 1;
    console.log("item number" + itemNumber)
    console.log("inside wlamrt api");
    var walmartURL = "http://api.walmartlabs.com/v1";
    walmartURL += "/search?query=" + search.category + "%20" + search.keyword + "&format=json&start=" + itemNumber + "&facet=on&apiKey=cb9u828stayvspr4jq85ywjz";
    client.get(walmartURL, function (data) {
        //  console.log("The data is" + data);
        res.send(data);
    });
});

//shopping end

//organisation code begins

app.post('/organisations', function (req, res) {
    var search = req.body;
    console.log(search);
    var orgCollection = mongoose.model('organisations');
    if (search.cause == "") {
        console.log("all");
        orgCollection.find(function (err, data) {
            console.log(err, data, data.length);
            res.json(data);
        });
    } else {
        console.log("specific");
        orgCollection.find({ cause: { $regex: ".*"+search.cause+".*" } }, function (err, data) {
            console.log(err, data, data.length);
            res.json(data);
        });
    }
});

//organisation code ends

// donors choice API access



app.post('/nearbyprojects', function (req, response) {
    var search = req.body;
    //ttp://www.donorschoose.org/donors/search.html?keywords=02120
    console.log("Inside nearby projects");
    console.log(search);
    var path = "/common/json_feed.html?sortBy=" + search.type + "&keywords=" + search.zipcode + "&index=" + search.page + "&APIKey=DONORSCHOOSE";
    console.log(path);
    var options = {
        host: 'api.donorschoose.org',
        path: path,
        method: 'GET'
    };
    var req = http.request(options, function (res) {
        res.setEncoding('utf-8');
        var result = '';

        res.on('data', function (data) {
            result += data;
        });

        res.on('end', function () {
            //  console.log(result);
            var responseObject = JSON.parse(result);
            console.log("final data");
            //  console.log(responseObject);
            response.json(result);
        });
    });

    console.log("reached end");
    req.end();
});

app.put("/addtowishlist/:id", function (req, res) {

    var wish = req.body;
    console.log("in wishlist >>");
    console.log("item" + wish);
    console.log(wish);
    UserModel.findOne({ _id: req.params.id }, function (err, data) {
        console.log(data);
        var wishlist = data.wishlist;
        console.log(wishlist);
        var index = null;
        for (var i = 0; i < wishlist.length; i++) {
            if (wishlist[i].title == wish.title) {
                index = i;
            }
        }
        if (index == null) {
            wishlist.push(wish);
            console.log("Updated shared items list >>" + wishlist);
            data.wishlist = wishlist;
            console.log("saved data>>" + data);
            data.save(function (err, user) {
                req.login(user, function (err) {
                    if (err) { return next(err); }
                    res.json(user);
                });
            });
        } else {
            res.json(null);
        }
    });
});

app.put("/removewish/:id", function (req, res) {
    var wish = req.body;
    console.log("in remove wish >>");
    console.log("item" + wish);
    console.log(wish);
    UserModel.findOne({ _id: req.params.id }, function (err, data) {
        console.log(data);
        var wishlist = data.wishlist;
        console.log(wishlist);
        var index = null;
        for (var i = 0; i < wishlist.length; i++) {
            if (wishlist[i].title == wish.title) {
                index = i;
            }
        }
        if (index != null)
            wishlist.splice(index, 1);
        console.log("Updated shared items list >>" + wishlist);
        data.wishlist = wishlist;
        console.log("saved data>>" + data);
        data.save(function (err, user) {
            req.login(user, function (err) {
                if (err) { return next(err); }
                res.json(user);
            });
        });
    });
});

app.get('/projects', function (req, res) {
    console.log("inside projects");

    var options = {
        host: 'api.donorschoose.org',
        path: '/common/json_feed.html?subject1=-1&APIKey=DONORSCHOOSE',
        method: 'GET'
    };
    http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    }).end();
});

// donors choice API access end

//reviews code 
app.post("/reviews", function (req, res) {
    console.log("Inside reviews");
    var org = req.body;
    console.log(org);
    reviewsModel.findOne({ orgname: org.name }, function (err, data) {
        console.log(data);
        res.json(data);
    });
});

app.put("/deletereview/:id", function (req, res) {
    console.log("Inside delete reviews");
    var review = req.body;
    console.log(review);
    reviewsModel.findOne({ orgname: req.params.id, "reviews.user": review.user }, function (err, data) {
        console.log(data);
        var reviews = data.reviews;
        var index = null;
        for (var i = 0; i < reviews.length; i++) {
            if (reviews[i].user == review.user) {
                index = i;
                break;
            }
        }
        if (index != null) {
            reviews.splice(index, 1);
        }
        data.reviews = reviews;
        data.save(function (err, data) {
            console.log(data);
            res.json(data);
        });
    });
});

app.post("/addreview", function (req, res) {
    console.log("Inside add reviews");
    var review = req.body;
    console.log(review);
    reviewsModel.findOne({ orgname: review.orgname }, function (err, data) {
        console.log(data);
        if (data !== null) {
            console.log("organsation exists");
            var reviews = data.reviews;
            console.log(reviews);
            var i = null;
            for (i = 0; i < reviews.length; i++) {
                if (reviews[i].user == review.user) {
                    console.log("user exists");
                    reviews[i].text = review.text;
                    console.log(reviews[i]);
                    break;
                }
            }
            console.log(i);
            if (i == reviews.length) {
                console.log("new user review");
                reviews.push({ user: review.user, text: review.text });
            }
            data.reviews = reviews;
            data.save(function (err, data) {
                console.log(data);
                res.json(data);
            });
        } else {
            var reviewModel = new reviewsModel({ orgname: review.orgname, reviews: [{ user: review.user, text: review.text }] });
            console.log(reviewModel);
            reviewModel.save(function (err, data) {
                console.log(data);
                res.json(data);
            });
        }
    });
});

app.post("/addcomment", function (req, res) {
    console.log("Inside reviews");
    var commentsList = req.body;
    console.log(commentsList);
    reviewsModel.findOne({ orgname: commentsList.org }, function (err, data) {
        console.log("found organisatoin");
        console.log(data);
        if (data != null) {
            var reviews = data.reviews;
            if (reviews != null) {               
                for (var i = 0; i < reviews.length; i++) {
                    if (reviews[i].user == commentsList.user) {
                        console.log("found review");
                        var comments = reviews[i].comments;
                       
                        if (comments !== undefined) {
                            console.log("comments not undefined");                           
                            comments.push({ "text": commentsList.comment, "user": commentsList.currentuser });
                            console.log(comments);
                            reviews[i].comments = comments;                           
                        }
                        else {
                            console.log("comments undefined");
                            reviews[i].comments = [{ "text": commentsList.comment, "user": commentsList.currentuser }];
                            console.log(reviews[i]);
                        }
                    }
                }
                var result = new reviewsModel({ orgname: commentsList.org, reviews: reviews });
                console.log(result);
                console.log(data);

                console.log("remoing data");
                data.remove(function (err, doc) {
                    console.log(err);
                    console.log(doc);

                    result.save(function (err, data) {

                        console.log(err); console.log(data);
                        res.json(data);
                    });
                });
            }
        }

    });
});
// reviews code end1


//app.listen(3000);

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

//app.listen(port, ip);
app.use(express.static(path.join(__dirname, '/public')));
app.listen(port, ip);