app.controller('ShareCtrl',function($scope,$modal){
	
	$scope.login = function(){
		var modalInstance = $modal.open({
            templateUrl: '/views/login/login.html',
            controller: 'LoginCtrl'
        });
	}
});