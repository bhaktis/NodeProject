app.controller("LoginCtrl", function ($scope, $rootScope, $http, $location, $rootScope, LoginService, $modalInstance) {
    $scope.login = true;
    $scope.error = "";
    $scope.login = function (user) {
        console.log(user);
        LoginService.login(user, callback);
    };

    $scope.viewRegister = function () {
        $scope.login = false;
    };

    function callback(res) {
        console.log("callback for login");
        if (res == false) {
            $scope.fail = true;
            $scope.fail_msg = "Username already exists";
        } else {

            $modalInstance.dismiss('cancel');
            $location.url("/share");
        }

    };

    $scope.showError = false;
    $scope.passwordNotMatch = false;

    $scope.registerUser = function (user) {
        $scope.error = LoginService.validUser(user);
        console.log($scope.error);
        if ($scope.error == "") {
            LoginService.register(user, callback);
        }

    };

});

app.factory("LoginService", function ($http, $rootScope, $location) {
    var currentUser = null;

    var login = function (user, callback) {
        $http.post("/login", user)
      .success(function (response) {
          console.log(response);
          $rootScope.currentUser = response;
          console.log("Root Scope" + $rootScope.currentUser);
          //$modal.close();
          callback(true);

      });
    }

    var register = function (user, callback) {
        console.log(user);
        if (user.password == user.password2) {
            $http.post("/register", user)
            .success(function (response) {
                console.log(response);
                $rootScope.currentUser = response;
                callback(true);
            });
        }
    }

    var validUser = function (user) {
        // add proper validations
        console.log("Inside valid user function");
        if (user == null) {
            return "Enter data";
        }
        if (user.password != user.password2) {
            return "Password does not match";
        }
        return "";

    }
    var logout = function () {
        currentUser = null;
    }
    return {
        login: login,
        logout: logout,
        validUser: validUser,
        register: register

    }
});