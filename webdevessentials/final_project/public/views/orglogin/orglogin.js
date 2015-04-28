app.controller("OrgLoginCtrl", function ($scope, $rootScope, $http, $location, $rootScope, LoginService, $modalInstance) {
    $scope.login = true;
    $scope.error = "";
    $scope.login = function (org) {
        console.log(org);
        LoginService.orglogin(org, callback);
    };

    $scope.register = function (org) {
        console.log("Inside register");
        LoginService.orgregister(org, callback);
    };

    function callback(res, message) {
        if (res == false) {
            $scope.error = message;
        } else {            
            $modalInstance.dismiss('cancel');
            $location.url("/home");
        }
    }
   
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        $location.url("/home");
    }


});

