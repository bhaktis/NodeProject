app.controller("DonorCtrl", function ($scope, $http, $location, $rootScope,$modal) {

    $scope.hello = "Welcome to page";
    $scope.seeingWishList = false;
    $scope.error = "";
    $scope.warning = "";
    $scope.success = "";

   

    $scope.getprojects = function () {
        console.log("Get projects >>");

        $http.get("/projects").success(function (response) {
            console.log("inside projects");
            console.log(response);
        });

    }

    $scope.submit = function (search) {
        $scope.results = null;
        $scope.seeingWishList = false;
        if (search == undefined)
        {
            search = null;
        } else {
            search.page = $scope.pageCount;
        }
      
        console.log("Get nearby projects >>>" + search);
        console.log(search);
        $http.post("/nearbyprojects", search)
          .success(function (response) {
              console.log("inside nearby projects");             
              var res = [response];
              var obj = JSON.parse(response);
              var results = obj.proposals;
              console.log(results.length);
              if (results.length == 0) {
                  console.log("response null for search");
                  $scope.warning = "No records found";
              }else{               
                  $scope.results = results;
                  console.log($scope.results);
              }
          }).error(function (response) {
              console.log("response null for search");
              $scope.error = "Error retrieving projects";
          });

    }
    $scope.addtowishlist = function (wish) {
        if ($rootScope.currentUser == null) {
            var modalInstance = $modal.open({
                templateUrl: '/views/login/login.html',
                controller: 'LoginCtrl'
            });
        } else {
            console.log(wish);
            console.log($rootScope.currentUser);
            var wishlist = { id: wish.id,title:wish.title, description: wish.description, imageURL: wish.imageURL, costToComplete: wish.costToComplete, totalPrice: wish.totalPrice, expirationDate: wish.expirationDate, fundingStatus: wish.fundingStatus, schoolName: wish.schoolName, fulfillmentTrailer: wish.fulfillmentTrailer, schoolUrl: wish.schoolUrl };
            console.log(wishlist);
            $http.put("/addtowishlist/" + $rootScope.currentUser._id, wish).success(function (response) {
                console.log(response);
                if (response == null) {
                    $scope.warning = "Project already added to the wishlist";
                } else {
                    $rootScope.currentUser = response;
                    $scope.success = "Added project to wishlist";
                }

            });
        }
    }


    $scope.donate = function (res) {
        $rootScope.orgSelected = {name:res.title};
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

    $scope.pageCount = 0;
    $scope.previousPage = function (search) {
        console.log("Previous page >>");
        console.log(search);
        $scope.pageCount = $scope.pageCount - 1;        
        console.log("previous page");      
        $scope.submit(search);
    }

    $scope.nextPage = function (search) {
        console.log("Next Page >>");
        console.log(search);
        $scope.pageCount = $scope.pageCount + 1;       
        console.log("next page");    
        $scope.submit(search);
    }

    $scope.getWishList = function () {
        $scope.results = $rootScope.currentUser.wishlist;
        $scope.seeingWishList = true;
    }

    $scope.removewish = function (res) {
        console.log(res);
        $http.put("/removewish/" + $rootScope.currentUser._id, res).success(function (response) {
            console.log(response);
            $rootScope.currentUser = response;
            $scope.results = $scope.currentUser.wishlist;
            $scope.success = "Removed wish";
        });
    }  

});