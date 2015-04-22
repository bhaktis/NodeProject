app.controller('ShareCtrl', function ($scope, $modal, $http, $rootScope) {

    $scope.AmazonPage = false;
    $scope.ebay = false;
    $scope.mycollection = false;
    $scope.ShoppingPage = false;
    $scope.shoppingCart = null;
    $scope.error = null;
    $scope.pageCount = 0;

    $scope.share = function (org) {
        console.log("Donating >>" + org);
        if (org == null || $scope.cartItems == null) {
            console.log("error");
            $scope.error = "Please enter all fields !!";
        }
        else {
            $scope.error = "";
            //var donation = { organisation: org.name, items: [$scope.cartItems] };
            var items = $scope.cartItems;
            console.log(items);  //{ "category":category,"source": source, "description": desc, "price": price, "quantity": quant};
            var donation = [];
            //   var donation = { organisation: org.name, category: item.category, description: item.description,quantity: item.quantity, source: item.source, price: item.price };
            console.log("donation>>");
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                donation[i] = { organisation: org.name, category: item.category, description: item.description, quantity: item.quantity, source: item.source, price: item.price };
            }
            console.log(donation);
            $http.put("/donated/" + $rootScope.currentUser._id, donation).success(function (response) {
                console.log(response);
                $rootScope.currentUser = response;
                $scope.cartItems = null;
                var modalInstance = $modal.open({
                    templateUrl: '/views/success/success.html'
                });
            });
        }
    }

    $scope.cartItems;

    $scope.showmycoll = function () {
        $scope.ShoppingPage = false;
    }
    $scope.shop = function () {
        console.log("inside shopping page >>");
        $scope.ShoppingPage = true;
    }
    $scope.submit = function (item, org, service) {

        console.log("donating myself >>");
        if (org == null || item == null || item.category == null || item.quantity == null || service == null || (item.quantity == 0)) {
            console.log("error");
            $scope.error = "Please enter all fields !!";
        }
        else {
            $scope.error = "";
            var donation = { organisation: org.name, category: item.category, description: item.description, quantity: item.quantity };
            console.log("donation>>");
            console.log(donation);
            $http.put("/donated/" + $rootScope.currentUser._id, donation).success(function (response) {
                console.log(response);
                $rootScope.currentUser = response;
                console.log("CurrentUser after donating>>");
                console.log($rootScope.currentUser);
                var modalInstance = $modal.open({
                    templateUrl: '/views/success/success.html'
                });
            });
        }
    }
    $scope.searchItems = function (search) {
        console.log("Inside search Items page" + search);
        var searchQuery = { category: search.category, keyword: search.type };

        console.log(searchQuery.category + " and " + searchQuery.keyword);

        if (search.source == "amazon") {//amazon code
            console.log("show amazon page");
            $scope.AmazonPage = true;
            $scope.ebay = false;

            $http.post("/books", searchQuery).success(function (response) {
                var ItemsList = response['Items'];
                console.log(ItemsList['Item']);
                $scope.shoppingCart = ItemsList['Item'];
            });
            //amazon code end
        }
        else if (search.source == "ebay") {
            console.log("sjhow ebay page");
            $http.post("/ebay", searchQuery).success(function (response) {
                console.log(response);
                var items = response.findItemsByKeywordsResponse[0].searchResult[0].item || [];
                console.log(items);
                $scope.shoppingCart = items;
                // console.log(items);
            });
            $scope.AmazonPage = false;
            $scope.ebay = true;
        }
        else if (search.source == "walmart") {
            console.log("inside walmart api");
            $http.post("/walmart", searchQuery).success(function (response) {
                console.log(response.items);
                $scope.walmart = true;
                $scope.shoppingCart = response.items;
            });
        }

    }

    $scope.addtocart = function (category, source, desc, price, quant) {
        console.log(category + source + desc + price + quant);
        //if (quant == "0") {
        //    $scope.error = "Please enter a quantity for the item";
        //}
        //else {
        var item = { "category": category, "source": source, "description": desc, "price": price, "quantity": quant };
        if ($scope.cartItems != null)
            $scope.cartItems.push(item);
        else
            $scope.cartItems = [item];
        console.log($scope.cartItems);
        console.log($scope.cartItems.length);
       // }
    }

    $scope.userChoice = function (choice) {
        console.log(choice);
    }
    $scope.showShoppingPage = function () {
        $rootScope.currentUser = false;
        $scope.ShoppingPage = true;
    }


    $scope.hello = "Hello client!!";

    $scope.previousPage = function (search) {
        console.log("Previous page >>");
        console.log(search);

        $scope.pageCount = $scope.pageCount - 1;
        // searchItems(search);
    }

    $scope.nextPage = function (search) {
        console.log("Next Page >>");
        console.log(search);
        $scope.nextPage = $scope.nextPage + 1;
        //searchItems(search);
    }

    //ebay code 
    function _cb_findItemsByKeywords(root) {
        var items = root.findItemsByKeywordsResponse[0].searchResult[0].item || [];
        var html = [];
        html.push('<table width="100%" border="0" cellspacing="0" cellpadding="3"><tbody>');
        for (var i = 0; i < items.length; ++i) {
            var item = items[i];
            var title = item.title;
            var pic = item.galleryURL;
            var viewitem = item.viewItemURL;
            if (null != title && null != viewitem) {
                html.push('<tr><td>' + '<img src="' + pic + '" border="0">' + '</td>' +
                '<td><a href="' + viewitem + '" target="_blank">' + title + '</a></td></tr>');
            }
            html.push('</tbody></table>');
            document.getElementById("results").innerHTML = html.join("");
        }
    }
    //ebay code end

});


