app.controller("ProfileCtrl", function ($scope, $rootScope, $http, $location, LoginService) {

    $scope.login = true;
    $scope.error = "";
    $scope.updatesuccess = false;
    $scope.save = function () {
        $scope.error = false;
        console.log("Inside save >>");
        console.log($rootScope.currentUser);
        LoginService.save($rootScope.currentUser, callback);
       // console.log("data after saving"$rootScope.currentUser);        
    };

    $scope.viewRegister = function () {
        $scope.login = false;
    };

    function callback(res,message) {
        console.log(message);
        if (res == false) {           
            $scope.error = message;
        } else {
            $scope.updatesuccess;
        }
    };
    $scope.showError = false;
    $scope.passwordNotMatch = false;  
});

