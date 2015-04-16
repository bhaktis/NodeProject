app.controller("FoodCtrl", function ($scope, $http, $location, $rootScope) {

    $scope.food = [{ name: "item1", date: "date1" },
        { name: "item2", date: "date2" },
        { name: "item3", date: "date3" },
        { name: "item4", date: "date4" }
    ];

});