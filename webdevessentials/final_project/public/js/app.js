var app = angular.module("PassportApp", ["ngRoute", "ui.bootstrap"]);

app.config(function ($routeProvider) {
    $routeProvider
     .when('/home', {
         templateUrl: 'views/home/home.html'
     })
     .when('/profile', {
         templateUrl: 'views/profile/profile.html',
         resolve: {
             loggedin: checkLoggedin
         },
         controller: 'ProfileCtrl'
     })
     .when('/login', {
         templateUrl: 'views/login/login.html',
         controller: 'LoginCtrl'
     })
     .when('/logout', {
         templateUrl: 'views/logout/logout.html'
     })
    .when('/register', {
        templateUrl: 'views/register/register.html',
        controller: 'RegisterCtrl'
    })
    .when('/about', {
        templateUrl: 'views/about/about.html'
    })
    .when('/share', {
        templateUrl: 'views/share/share.html',
        resolve: {
            loggedin: checkLoggedin
        },
        controller: 'ShareCtrl'
    }).
 otherwise({
     redirectTo: '/home'
 });
});

var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();
    console.log("inside checl log in for profile page>>");    
    $http.get('/loggedin').success(function (user) {
        $rootScope.errorMessage = null;
        //User is authenticated
        if (user !== '0') {
            console.log("user after validation");
            console.log(user);
            $rootScope.currentUser = user;
            deferred.resolve();
        }
            // User is not authenticated 
        else {
            $rootScope.errorMessage = 'You need to log in.';
            deferred.reject();
            $location.url('/login');
        }
    });
    return deferred.promise;
};



app.controller("NavCtrl", function ($scope, $http, $location, $rootScope, $modal, LoginService) {

    $http({
        method: 'GET',
        url: '/orgs',
        data: { applicationId: 3 }
    }).success(function (result) {
        console.log("called >>");
        console.log(result);
        $rootScope.organisations = result;
    });

    $scope.logout = function () {
        $http.post("/logout")
		.success(function () {
		    $location.url("/home");
		});
    };

    $scope.login = function () {
        if ($rootScope.currentUser == null) {
            var modalInstance = $modal.open({
                templateUrl: '/views/login/login.html',
                controller: 'LoginCtrl'
            });
        }
    }

    $scope.logout = function () {
        $rootScope.currentUser = null;
        $location.url("/home");
    }

    //var init = function () {
    //    console.log("inside init");
    //    LoginService.sharedList();
    //};
});



app.controller('refresh_control', function ($scope, $interval, $rootScope, LoginService) {
    var c = 0;
    var t = 0;
    $scope.message = "";
    $interval(function () {        
        if ($rootScope.messages != null) {
            console.log("hello");
            $scope.message =  $rootScope.messages[c];
            $rootScope.messages.length;
            if (c == $rootScope.messages.length - 1) {
                c = 0;
            } else {
                c++;
            }
        }
        if (t == 5)
        {
            console.log("refreshing");
            LoginService.sharedList();
            t = 0;
        }
        t++
    }, 1000);
});

