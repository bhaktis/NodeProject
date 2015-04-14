var app = angular.module("PassportApp", ["ngRoute", "ui.bootstrap"]);

app.config(function($routeProvider) {
	  $routeProvider
	   .when('/home', {
	      templateUrl: 'views/home/home.html'	   
	  })
	   .when('/profile', {
	      templateUrl: 'views/profile/profile.html',
	      resolve : {
	    	  loggedin : checkLoggedin
	      }
	   })
	   .when('/login', {
	      templateUrl: 'views/login/login.html'	,
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
	      controller:'ShareCtrl'
	  });
});

var checkLoggedin  = function($q, $timeout, $http, $location, $rootScope)
{
	var deferred = $q.defer();
	$http.get('/loggedin').success(function(user){
		$rootScope.errorMessage = null;
		//User is authenticated
		if(user !== '0')
			{
			$rootScope.currentUser = user;
			deferred.resolve();
			}
		// User is not authenticated 
		else
			{
			$rootScope.errorMessage = 'You need to log in.';
			deferred.reject();
			$location.url('/login');
			}
	});
	return deferred.promise;
	};
	
	

app.controller("NavCtrl",function($scope,$http,$location,$rootScope){
	$scope.logout = function(){
		$http.post("/logout")
		.success(function(){
			$location.url("/home");
		});
	};
	
	$scope.login = function(user){
		console.log(user);
		$http.post("/login",user)
		.success(function(response){
			console.log(response);
			$rootScope.currentUser = response;
			$location.url("/profile");
		});
	};
	
	
	
});