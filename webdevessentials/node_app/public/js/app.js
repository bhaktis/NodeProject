var app = angular.module("DeveloperApp", ['ngRoute']);

app.controller("DeveloperController", function ($scope, $http) {

    $scope.hello = "Hello client!!";
    $http.get("/developers").success(function (response) {
        $scope.developers = response;
    });

    $scope.selectedIndex = null;
    $scope.select = function (id) {
        console.log(id);
        console.log($scope.developers);
        $http.get("/developers/" + id).success(function (response) {
            $scope.developer = response;
        });

        $scope.selectedIndex = id;        
    };

    $scope.add = function (developer) {
        console.log(developer);
        $http.post("/developers", developer).
        success(function (response) {
            $scope.developers = response;
        });
    };

    $scope.save = function (developer) {
        console.log(developer);
        console.log($scope.selectedIndex);
        $http.put("/developers/" + $scope.selectedIndex, developer).success(function (response) {
            $scope.developers = response;
        });
    };

    $scope.remove = function (id) {
        
        $http.delete("/developers/" + id).
        success(function (response) {
            $scope.developers = response;
        });

    };
});



