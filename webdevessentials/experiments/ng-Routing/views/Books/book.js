app.controller("BookCtrl", function ($scope, $http, $location, $rootScope) {
    $scope.books = [{ name: "book1", publisher: "publisher1" },
        { name: "book2", publisher: "publisher2" },
        { name: "book3", publisher: "publisher3" },
        { name: "book4", publisher: "publisher4" }
        ];
    
});