app.controller("ManageCtrl", function ($scope, $rootScope, $http, $location, LoginService) {

    $scope.pickup = true;
   // $scope.requests = null;
    //$scope.pickups = function () {
        console.log("pickup");
        console.log($rootScope.currentOrganisation);
        $http.post("/pickup", $rootScope.currentOrganisation)
                .success(function (response) {
                    if (response != null) {
                        $scope.requests = response;
                        console.log($scope.requests);
                    }
                    else {
                        $scope.message = "No pick up requests";
                    }
                    
                });
   // }
});

