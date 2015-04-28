app.factory("LoginService", function ($http, $rootScope, $location) {
    var currentUser = null;

    var login = function (user, callback) {
        $http.post("/login", user)
            .success(function (response) {
                if (response == null) {
                    console.log("error login");
                    callback(false, "Error login");
                } else {
                    $rootScope.currentUser = response;
                    callback(true, "");
                }
            })
        .error(function (response) {
            callback(false, "User does not exist");
        });
    }

    var orglogin = function (org, callback) {
       // org.type = "organisation";
        console.log("calling organisation login service");
        console.log(org);
        $http.post("/orglogin", org)
            .success(function (response) {
                if (response == null) {
                    callback(false, "Error login organisation");
                } else {
                    $rootScope.currentOrganisation = response;
                    callback(true, "");
                }
            }).error(function (response) {
                callback(false, "Organisation does not exist");
            });
    }

    var orgregister = function (org, callback) {
        console.log("calling organisation register service");
        console.log(org);
        var error = validOrg(org);
        if (error == "") {
            $http.post("/orgregister", org)
                .success(function (response) {
                    if (response != null) {                        
                        $rootScope.currentOrganisation = response;
                        console.log($rootScope.currentOrganisation);
                        callback(true, "");
                    }
                    else
                        callback(false, "Username Exists");
                });
        } else
            callback(false, error);
    }

    var saveorg = function (user, callback) {
        user.password2 = user.password;
        var error = validOrg(user);
        if (error == "") {
            console.log(user);
            $http.post("/saveorg", user)
            .success(function (response) {
                console.log("Save" + response);
                if (response == null)
                { callback(false, "Error updating record"); }
                else {
                    $rootScope.currentOrganisation = response;
                    console.log("Saved successfully" + $rootScope.currentOrganisation);
                    callback(true, "");
                }
            });
        }
        else {
            callback(false, error);
        }
    }


    var register = function (user, callback) {
        var error = validUser(user);
        if (error == "") {
            $http.post("/register", user)
                .success(function (response) {
                    if (response != null) {
                        $rootScope.currentUser = response;
                        callback(true, "");
                    }
                    else
                        callback(false, "Username Exists");
                });
        } else
            callback(false, error);
    }

    var validOrg = function (user) {
        console.log("valid user");
        console.log(user.password + ":" + user.password2);
        var error = "";
        var emailregex = /^[^@]+@[^@.]+\.[^@]*\w\w$/;
        var badChars = /[\(\)\<\>\,\;\:\\\"\[\]]/;
        var numbers = /123456789/;
        console.log("Inside valid user function");
        if (user == null) {
            error = "Enter data";
        }
        if (user.name == null || user.name == "") {
            error = "Please enter a organisation name";
        }
        if (user.cause == null || user.cause == "") {
            error = "Enter valid cause";
        }        
        if (user.password != user.password2) {
            error = "Password does not match";
        }        
        if (user.email == null || user.email == "" || !emailregex.test(user.email) || user.email.match(badChars)) {
            error = "Invalid Email";
        }
        if (user.contact == null) {           
            error = "Enter valid contact";
        }
        console.log(error);
        return error;
    }


    var save = function (user, callback) {
        user.password2 = user.password;
        var error = validUser(user);
        if (error == "") {
            $http.post("/save", user)
            .success(function (response) {
                console.log("Save" + response);
                if (response == null)
                { callback(false, "Error updating record"); }
                else {
                    $rootScope.currentUser = response;
                    console.log("Saved successfully" + $rootScope.currentUser);
                    console.log($rootScope.currentUser);
                    callback(true, "");
                }
            });
        }
        else {
            callback(false, error);
        }
    }


    var validUser = function (user) {
        console.log("valid user");
        console.log(user.password + ":" + user.password2);
        var error = "";
        var emailregex = /^[^@]+@[^@.]+\.[^@]*\w\w$/;
        var badChars = /[\(\)\<\>\,\;\:\\\"\[\]]/;
        var numbers = /123456789/;
        console.log("Inside valid user function");
        if (user == null) {
            error = "Enter data";
        }
        if (user.first == null || user.first == "") {
            error = "Enter valid username";
        }
        if (user.last == null || user.last == "") {
            error = "Enter valid last name";
        }
        if (user.password != user.password2) {
            error = "Password does not match";
        }
        if (user.username == null || user.username == "") {
            error = "Please enter a user name";
        }
        if (user.email == null || user.email == "" || !emailregex.test(user.email) || user.email.match(badChars)) {
            error = "Invalid Email";
        }
        if (user.contact == null) {
            error = "Enter  valid contact";
        }
        console.log(error);
        return error;
    }

    var logout = function () {
        currentUser = null;
        
    }
    var sharedList = function () {
        $http.get("/sharedItems").success(function (res) {          
            $rootScope.sharedItems = res;        
            showSharedItems(res);
        });
    }
    function showSharedItems() {
        var messages = [];
        var users = $rootScope.sharedItems;
        for (var u = 0; u < users.length; u++) {
            var user = users[u];
            var shared = user.shared;
            for (var s = 0; s < shared.length; s++) {
                messages[s] = { message: user.username + " shared " + shared[s].category + " with " + shared[s].organisation + "!!" };
              //  console.log(messages[s]);
            }
        }
        $rootScope.messages = messages;
    }

    return {
        login: login,
        logout: logout,
        validUser: validUser,
        register: register,
        save: save,
        sharedList: sharedList,
        orglogin: orglogin,
        orgregister: orgregister,
        saveorg: saveorg
    }
});

