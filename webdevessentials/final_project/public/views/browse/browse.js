app.controller('BrowseCtrl', function ($scope, $modal, $http, $rootScope,$location) {   
    $scope.hello = "Hello client!!";
    $scope.currentReview = "";
    $scope.selectedOrg = null;
    $scope.reviews;
    $scope.myreview = null;
    $scope.edit = false;
    $scope.selected = null;
    $scope.comment = false;
    $scope.mycomment = "";
    //$scop

    $scope.submit = function (search) {
        console.log(search);
        if (search != undefined) {           
                console.log("organizations with cause");
                $http.post("/organisations", search).success(function (response) {
                    console.log(response);
                    $scope.organisations = response;
                });           
        } else {
            console.log("all organisations");
            $http.get("/orgs").success(function (response) {
                console.log(response);
                $scope.organisations = response;
            });
        }
    }

    $scope.donateto = function (org) {
        $rootScope.orgSelected = org;
        console.log(org);
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

    $scope.getreviews = function (org) {
       
        console.log("inside load reviews");
        console.log(org);
        $scope.selectedOrg = org;
        $scope.selected = org.name;
        $http.post("/reviews", { name: org.name }).success(function (response) {
            console.log(response);           
            if (response == null) {
                $scope.warning = "No reviews found. Be the first one to add review";
            } else {                
                loadreviews(response);               
            }
            
        });
    }
    function loadreviews(orgreviews) {
        $scope.reviews = "";
        $scope.currentReview = "";
        $scope.myreview = "";
        console.log("inside load review");
        console.log($scope.currentUser);
        var reviews = orgreviews.reviews;
        console.log(reviews);
        for (var i = 0; i < reviews.length; i++) {
            
            if (reviews[i].user == $scope.currentUser.username) {
                $scope.myreview = reviews[i];
                console.log("my review");
                console.log($scope.myreview);
                reviews.splice(i, 1);
                break;
            }
        }
        $scope.reviews = reviews;
        console.log("after splicing");
        console.log($scope.reviews);
    }

    $scope.addreview = function () {
        console.log("Inside add review");
        console.log($scope.selectedOrg);
        console.log($scope.currentReview);
       
        if ($scope.currentReview == "") {
            if ($scope.myreview == null) {
                $scope.error = "Enter a review to save it";
            }
            else {
                console.log("Inside edit review");
                console.log($scope.myreview);
                var review = { orgname: $scope.selectedOrg.name, user: $rootScope.currentUser.username, text: $scope.myreview.text };
                console.log(review);
                $http.post("/addreview", review).success(function (response) {
                    console.log(response);
                    if (response == null) {
                        $scope.error = "error adding review";
                    } else {
                        $scope.edit = false;
                        loadreviews(response);                       
                    }
                });
            }
        } else {           
            var review = { orgname: $scope.selectedOrg.name, user: $rootScope.currentUser.username, text: $scope.currentReview };
            console.log(review);
            $http.post("/addreview", review).success(function (response) {
                console.log(response);
                if (response == null) {
                    $scope.error = "error adding review";
                } else {
                    loadreviews(response);
                }
            });
        }
    }

    $scope.deletereview = function () {
        console.log("inside delete review");
        console.log($scope.myreview);
        console.log($scope.selectedOrg);
        $http.put("/deletereview/"+$scope.selectedOrg.name, $scope.myreview).success(function (response) {
            console.log(response);
            if (response == null) {
                $scope.error = "error adding review";
            } else {
                loadreviews(response);
            }
        });
    }

    $scope.savecomment = function (user,mycomment) {

        console.log("Inside save comment");
        console.log(user);
        //console.log($scope.currentUser);
        console.log($scope.selectedOrg);
        console.log(mycomment);

        var comment = { user: user, org: $scope.selectedOrg.name, comment: mycomment,currentuser:$scope.currentUser.username };
        console.log(comment);
        $http.post("/addcomment", comment).success(function (response) {
            console.log("result");
            console.log(response);
            if (response == null) {
                $scope.error = "error adding comment";
            } else {
              loadreviews(response);
            }
        });
    }

});




