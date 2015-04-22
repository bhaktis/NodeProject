app.controller("RegisterCtrl",function($scope,$http,$location,$rootScope,$modalInstance){
	$scope.showError = false;
	$scope.passwordNotMatch = false;
	$scope.register = function(user){
		console.log(user);
		if(user.password == user.password2){
			$http.post("/register",user)
			.success(function(response){
				console.log(response);
				$rootScope.currentUser = response;
				$location.url("/profile");
			});
		}		
	};
	
	$scope.validateUserCredentials = function(user){
	    var invalidate = false;		
		if(user.password != user.password2){
			$scope.passwordNotMatch = true;			
		}
		//check user exists over here
	}
});

