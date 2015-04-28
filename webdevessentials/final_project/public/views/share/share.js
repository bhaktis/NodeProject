app.controller('ShareCtrl', function ($scope, $modal, $http, $rootScope, $cookieStore) {

    $scope.mycollection = false;
    $scope.ShoppingPage = false;
    $scope.shoppingCart = null;
    $scope.error = null;
    $scope.pageCount = 1;
    $scope.source = "";
    $scope.warning = "";

    $scope.share = function (org) {
        console.log("Donating >>" + org);
        if ((org == null && $rootScope.orgSelected == null) || $scope.cartItems == null) {
            console.log("error");
            $scope.error = "Please enter all fields !!";
        }
        else {
            $scope.error = null;
            var organisation;
            if ($rootScope.orgSelected != null)
                organisation = $rootScope.orgSelected;
            else
                organisation = org;
            console.log(organisation);
            $rootScope.orgSelected = null;
            var items = $scope.cartItems;
            console.log(items);
            var donation = [];
            console.log("donation>>");
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                donation[i] = { organisation: organisation.name, category: item.category, description: item.description, quantity: item.quantity, source: item.source, price: item.price };
            }
            console.log(donation);
            $http.put("/donated/" + $rootScope.currentUser._id, donation).success(function (response) {
                console.log(response);
                $rootScope.currentUser = response;
                $scope.cartItems = null;
                $cookieStore.put('cartItem', $scope.cartItems); //added new
                var modalInstance = $modal.open({
                    templateUrl: '/views/success/success.html',
                    windowClass: 'success',
                });
            });
        }
    }

    $scope.cartItems = $cookieStore.get("cartItems");

    $scope.showmycoll = function () {
        $scope.ShoppingPage = false;
    }
    $scope.shop = function () {
        console.log("inside shopping page >>");
        $scope.ShoppingPage = true;
    }
    $scope.submit = function (item, org, service) {
        if (item == null || service == null) {
            console.log("error");
            $scope.error = "Please enter all fields !!";
        }
        else {

            console.log("donating  >>");
            console.log(org);
            console.log($rootScope.orgSelected);
            if ((org == null && $rootScope.orgSelected == null) || item == null || item.category == null || item.quantity == null || service == null || (item.quantity == 0)) {

                console.log("error");
                $scope.error = "Please enter all fields !!";
            }
            else {
                $scope.error = null;
                var organisation;
                if ($rootScope.orgSelected != null)
                    organisation = $rootScope.orgSelected;
                else
                    organisation = org;
                console.log(organisation);
                $rootScope.orgSelected = null;
                var donation = [{ organisation: organisation.name, category: item.category, description: item.description, quantity: item.quantity }];
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
    }
    $scope.searchItems = function (search) {
        console.log("Inside search Items page" + search);
        if (search != undefined) {
            search.page = $scope.pageCount;
            console.log("Page number" + search.page);
            var searchQuery = { category: search.category, keyword: search.type, page: search.page };

            console.log(searchQuery.category + " and " + searchQuery.keyword);

            if (search.source == "amazon") {//amazon code
                console.log("show amazon page");

                $http.post("/amazon", searchQuery).success(function (response) {
                    var ItemsList = response['Items'];
                    var items = ItemsList['Item'];
                    $scope.shoppingCart = ItemsList['Item'] || null;
                    if ($scope.shoppingCart == null) {
                        $scope.warning = "No records found";
                        console.log($scope.shoppingCart);
                    } else {
                        $scope.source = "amazon";
                        console.log("Shopping cart" + $scope.shoppingCart);
                        console.log("source" + $scope.source);
                    }
                });
                //amazon code end
            }
            else if (search.source == "ebay") {
                $http.post("/ebay", searchQuery).success(function (response) {
                    console.log(response);
                    var items = response.findItemsByKeywordsResponse[0].searchResult[0].item || null;
                    console.log(items);
                    $scope.shoppingCart = items;
                    if ($scope.shoppingCart == null) {
                        $scope.warning = "No records found";
                        console.log($scope.shoppingCart);
                    } else {
                        //var items = response.findItemsByKeywordsResponse[0].searchResult[0].item || [];     
                        $scope.source = "ebay";
                        console.log("Shopping cart" + $scope.shoppingCart);
                        console.log("source" + $scope.source);
                    }

                });
            }
            else if (search.source == "walmart") {
                console.log("inside walmart api");
                $http.post("/walmart", searchQuery).success(function (response) {
                    console.log(response.items);
                    $scope.shoppingCart = response.items || null;
                    if ($scope.shoppingCart == null) {
                        $scope.warning = "No records found";
                        console.log($scope.shoppingCart);
                    } else {
                        $scope.source = "walmart";
                        console.log("Shopping cart" + $scope.shoppingCart);
                        console.log("source" + $scope.source);
                    }
                });
            }
            else {
                $scope.warning = "select search criteria";
            }
        } else {
            $scope.warning = "Select search criteria";
        }


    }

    $scope.addtocart = function (category, source, desc, price, quant) {
        console.log(category + source + desc + price + quant);
        if (quant != undefined) {
            var item = { "category": category, "source": source, "description": desc, "price": price, "quantity": quant };
            if ($scope.cartItems != null) {

                console.log("psuh new item 1");
                var i = null;
                for (i = 0; i < $scope.cartItems.length; i++) {
                    console.log("psuh new item2");
                    if ($scope.cartItems[i].description == item.description) {
                        console.log("psuh new item3");
                        var quantity = parseInt($scope.cartItems[i].quantity);
                        $scope.cartItems[i].quantity = quantity + parseInt(item.quantity);
                        $cookieStore.put('cartItems', $scope.cartItems);
                        $scope.success = "Product already present. Updated quantity."
                        break;
                    }
                }
                if (i == $scope.cartItems.length) {
                    console.log("psuh new item");
                    $scope.cartItems.push(item);
                    $cookieStore.put('cartItems', $scope.cartItems);
                }
            }
            else {
                $scope.cartItems = [item];
                $cookieStore.put('cartItems', $scope.cartItems);
            }
            console.log($scope.cartItems);
            console.log($scope.cartItems.length);
        } else {
            $scope.error = "Quantity cannot be blank";
        }

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
        $scope.searchItems(search);
    }

    $scope.nextPage = function (search) {
        console.log("Next Page >>");
        console.log(search);
        $scope.pageCount = $scope.pageCount + 1;
        $scope.searchItems(search);
    }

    $scope.remove = function (cartItem) {
        console.log("in remove cart item");
        console.log(cartItem);
        var cart = $scope.cartItems;
        console.log(cart);
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].description == cartItem.description) {
                console.log("removing" + i);
                cart.splice(i, 1);
                $scope.cartItems = cart;
                $cookieStore.put('cartItems', $scope.cartItems);
                break;
            }
        }
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


