var app = angular.module("HomeApp", ['ngRoute']);

app.controller("UserLogin", function ($scope, UserService) {
    $scope.currentUser = null;
    $scope.hello = "Hello to my home page";
    $scope.login = function () {
        var username = $scope.username;
        var password = $scope.password;
        //alert(username + password);    
        $scope.currentUser = UserService.login(username, password);
        // alert($scope.currentUser);        
    };
    $scope.logout = function () {
        $scope.username = null;
        $scope.password = null;
        $scope.currentUser = null;
        UserService.logout();
    };
});

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/home', {
            templateUrl: 'embed/home.html',
            controller:'HomeController'
        }).
        when('/profile/:username', {
            templateUrl: 'embed/profile.html',
            controller:'ProfileController'
        }).
    otherwise({
        redirectTo: 'embed/home.html'
    });
}]);

app.factory("UserService", function () {
    var currentUser = null;
    var dummyUsers = [
        { username: 'renu', password: "renu", email: 'pri@gmail.com' },
    { username: 'pri', password: 'pri', email:'pri@gmail.com' },
    { username: 'nids', password: 'nids', email: 'pri@gmail.com' },
    { username: 'neha', password: 'neha', email: 'pri@gmail.com' }];

    var login = function (username, password) {
        for (var i in dummyUsers) {
            if(dummyUsers[i].username == username && dummyUsers[i].password == password)
            {
                currentUser = dummyUsers[i];
                return dummyUsers[i];
            }
        }
        return null;
    }

    var getCurrentUser = function () {
        return currentUser;
    }

    var logout = function () {
        currentUser = null;
    }

    var userDetail = function(username){
        for (var i in dummyUsers) {
            if (dummyUsers[i].username == username) {
                return dummyUsers[i];
            }
        }

    }
    var updateUser = function (user) {
        for (var i in dummyUsers) {
            if (dummyUsers[i].username == user.username) {
                dummyUsers[i].password = user.password;
                dummyUsers[i].email = user.email;
                alert(dummyUsers[i].username);
            }
        }
    }
    return {
        login: login,
        getCurrentUser: getCurrentUser,
        logout: logout,
        userDetail: userDetail,
        updateUser: updateUser
    }   
});

app.controller("ProfileController", function ($scope, UserService, $routeParams) {
   
    var username = $routeParams.username;
    $scope.username = username;  
    $scope.user = UserService.userDetail(username);
    $scope.save = function () {
        alert("hello "+ $scope.user.username + $scope.user.password+ $scope.user.email);

        UserService.updateUser($scope.user);
    }
});

app.controller("HomeController", function ($scope, UserService) {
  
});