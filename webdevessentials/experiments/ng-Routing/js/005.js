var app = angular.module("MultipleApp", ['ngRoute']);

app.controller("MultipleController", function ($scope) {
    $scope.hello = "Hello to my home page";
});

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'multiple.html',
            controller: 'RouteCtrl'
        }).       
    otherwise({
        redirectTo: 'view/Books/book.html'
    });
}]);

app.controller('RouteCtrl', function ($scope) {

    $scope.template = {

        "books": "views/books/book.html",
        "food": "views/food/food.html"
    }

    $scope.message = {
        "books": " Here is the list of books",
        "food": "List of food items"
    }

    $scope.books = [{ name: "book1", publisher: "publisher1" },
        { name: "book2", publisher: "publisher2" },
        { name: "book3", publisher: "publisher3" },
        { name: "book4", publisher: "publisher4" }
    ];

    $scope.food = [{ name: "item1", date: "date1" },
        { name: "item2", date: "date2" },
        { name: "item3", date: "date3" },
        { name: "item4", date: "date4" }
    ];
});