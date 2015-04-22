app.factory("LoginService", function ($http, $rootScope, $location) {
    var currentUser = null;
    
    var login = function (user, callback) {
        $http.post("/login", user)
            .success(function (response) {                
                if (response == null) {
                    callback(false, "Error login");
                } else {
                    $rootScope.currentUser = response;
                    callback(true, "");
                }
            });
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

    var save = function (user,callback) {
            
        var error = validUser(user);
        if (error == "") {          
            $http.post("/save", user)
            .success(function (response) {
                if (response == null)
                { callback(false, "Error updating record"); }
                else {
                    $rootScope.currentUser = response;
                    callback(true, "");
                }
            });
        }
        else {
            callback(false,error);
        }
    }

   
    var validUser = function (user) {

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
        if (user.contact != null || user.contact != "") {
          //  if(!user.email.match(numbers))
          //  error = "enter a valid contact";
        }
        console.log(error);
        return error;
    }

    var logout = function () {
        currentUser = null;
    }
    var sharedList = function () {
        $http.get("/sharedItems").success(function (res) {
            console.log("data received:");
            $rootScope.sharedItems = res;
            console.log($rootScope.sharedItems);
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
                messages[s] = user.username + " shared " + shared[s].category + " with " + shared[s].organisation + "!!";
                console.log(messages[s]);
            }
        }
        $rootScope.messages = messages;
    }

    //function showSharedItems(items) {
    //    console.log(items);
    //    var length = items.length;
    //    console.log(length)
    //    for (var i = 0; i < length ; i++) {
    //        var item = items[i];
    //        console.log("-------------------------");
    //        console.log(item.username);
    //        var data = item.shared;
    //        console.log(data[0]);

    //       // console.log(data[0].items);
    //    }
    //}
    return {
        login: login,
        logout: logout,
        validUser: validUser,
        register: register,
        save: save,
        sharedList: sharedList
    }
});

