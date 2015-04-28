var app = angular.module("PassportApp", ["ngRoute", "ui.bootstrap","ngCookies"]);

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
    .when('/orglogin', {
        templateUrl: 'views/orglogin/orglogin.html',
        controller: 'OrgLoginCtrl'
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
        .when('/browse', {
            templateUrl: 'views/browse/browse.html',
            controller: 'BrowseCtrl'
        })
    .when('/share', {
        templateUrl: 'views/share/share.html',
        resolve: {
            loggedin: checkLoggedin
        },
        controller: 'ShareCtrl'
    }).when('/manage', {
        templateUrl: 'views/manage/manage.html',
        resolve: {
            loggedin: checkLoggedin
        },
        controller: 'ManageCtrl'
    }).when('/donorchoice', {
        templateUrl: 'views/donorschoose/donerschoose.html',        
        controller: 'DonorCtrl'
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
            if (user.name)
                $rootScope.currentOrganisation = user;
            else
                $rootScope.currentUser = user;

            deferred.resolve();
        }
            // User is not authenticated 
        else {
            $rootScope.errorMessage = 'You need to log in.';
            deferred.reject();
            $location.url('/home');
        }
    });
    return deferred.promise;
};



app.controller("NavCtrl", function ($scope, $http, $location, $rootScope, $modal, LoginService, $cookieStore, $cookies) {

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
        console.log("Inside logout");
        $http.post("/logout")
		.success(function () {
		    $rootScope.currentOrganisation = null;
		    $rootScope.currentUser = null;
		    angular.forEach($cookies, function (value, key) {
		        $cookieStore.remove(key);
		    });
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
    $scope.orglogin = function () {
        console.log("organisation login");
        if ($rootScope.currentOrganisation == null) {
            var modalInstance = $modal.open({
                templateUrl: '/views/orglogin/orglogin.html',
                controller: 'OrgLoginCtrl'
            });
        }
    }
});



app.controller('refresh_control', function ($scope, $interval, $rootScope, LoginService) {
    var c = 0;
    var t = 0;
    $scope.message = "";
    $interval(function () {
        if ($rootScope.messages != null) {
            // console.log("hello");
            $scope.message = $rootScope.messages[c];
            $rootScope.messages.length;
            if (c == $rootScope.messages.length - 1) {
                c = 0;
            } else {
                c++;
            }
        }
        if (t == 5) {
            // console.log("refreshing");
            LoginService.sharedList();
            t = 0;
        }
        t++
    }, 1000);
});

