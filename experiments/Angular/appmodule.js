var mainApp = angular.module("mainApp", []);

mainApp.controller("studentController", function ($scope) {
    $scope.student = {
        firstname: "Nidhi",
        lastname: "Kurup",        
        fullname: function () {
            var studentObject;
            studentObject = $scope.student;
            return studentObject.firstname + " " + studentObject.lastname;
        },
        reset: function () {
            $scope.student.firstname = "Mahesh";
            $scope.student.lastname = "Parashar";
        }   
    };
});