app.controller("LoginCtrl", function ($scope, $rootScope, $http, $location, $rootScope, LoginService, $modalInstance) {
	$scope.login = true;	
	$scope.error = "";
	$scope.login = function(user){
		console.log(user);
		LoginService.login(user,callback);
	};
	
	$scope.viewRegister = function(){
		$scope.login = false;
	};
	
	function callback(res, message) {
	    if (res == false) {
	        $scope.error = message;
	    } else {
	        LoginService.sharedList();        
	        // console.log(items);
	       // showSharedItems();
	        $modalInstance.dismiss('cancel');	       
	        $location.url("/home");
	    }
	}	    
	    $scope.showError = false;
		$scope.passwordNotMatch = false;
		
		$scope.registerUser = function (user) {
		    LoginService.register(user, callback);
		};

		
		
});

