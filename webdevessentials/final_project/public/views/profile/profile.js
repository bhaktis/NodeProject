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

    $scope.saveorg = function () {
        $scope.error = false;
        console.log("Inside save >>");
        console.log($rootScope.currentOrganisation);
        LoginService.saveorg($rootScope.currentOrganisation, callback);
        // console.log("data after saving"$rootScope.currentUser);        
    };

    $scope.viewRegister = function () {
        $scope.login = false;
    };
    $scope.addreq = function (item) {
        var req = $rootScope.currentOrganisation.requirement;
        console.log(req);
        if (req == undefined) {
            req = [{category:item , quantity: null}];
        }
        else
            req.push({ category: item,quantity:null});
        console.log(req);
        $rootScope.currentOrganisation.requirement = req;       
    }

    function callback(res,message) {
        console.log(message);
        if (res == false) {           
            $scope.error = message;
        } else {
            $scope.updatesuccess;
        }
    };

    $scope.donate = function (res) {
        $rootScope.orgSelected = { name: res.title };
        console.log($rootScope.orgSelected);
        if ($scope.currentUser == null) {
            var modalInstance = $modal.open({
                templateUrl: '/views/login/login.html',
                controller: 'LoginCtrl'
            });
        }
        else {
            $location.url("/share")
        }
        console.log("back to the calling function");
    }
    $scope.showError = false;
    $scope.passwordNotMatch = false;  
});

