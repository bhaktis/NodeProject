app.controller("LoginCtrl", function ($scope, $location, LoginService, $modalInstance) {
    $scope.login = true;
    $scope.error = "";

    $scope.login = function (user) {
        console.log(user);
        LoginService.login(user, callback);
    };

    $scope.registerUser = function (user) {
        LoginService.register(user, callback);
    };

    function callback(res, message) {
        if (res == false) {
            $scope.error = message;
        } else {
            $modalInstance.dismiss('cancel');
            //$location.url("/home");
        }
    }    

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        $location.url("/home");
    }

});

