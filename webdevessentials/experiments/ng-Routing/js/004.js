var app = angular.module("DataApp", ['ngRoute']);

app.controller("DataController", function ($scope) {
    $scope.hello = "Hello to my home page";
});

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/books', {
            templateUrl: 'views/Books/book.html',
            controller: 'BookCtrl'
        }).
        when('/food', {
            templateUrl: 'views/Food/food.html',
            controller:'FoodCtrl'
        }).
    otherwise({
        redirectTo: 'view/books.html'
    });
}]);