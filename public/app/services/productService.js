angular.module('productService', [])

.factory('Product', function($rootScope, $http, $window, $location, $q){
  var productFactory = {};

  // //get all products
  productFactory.all = function(userData){
    return $http.get('api/products');
  };

  productFactory.addProduct = function(title,description,imgsrc,price){
    return $http.post('api/products', {
      title: title,
      description: description,
      imgsrc: imgsrc,
      price: price
    })
    .success(function(data){
      $location.path('/products');
      return data;
    });
  };

  //Cart section
  productFactory.cartProducts = [];
  
  //Add product
  productFactory.addToCart = function(title,imgsrc,price){
    console.log("service normal");
    var alreadyInCart = $window.localStorage.getItem('cartProducts');
    if (alreadyInCart === null) {
      productFactory.cartProducts.push({title: title, imgsrc: imgsrc, price: price});
      var cartProducts = JSON.stringify(productFactory.cartProducts);
      $window.localStorage.setItem('cartProducts', cartProducts);
    } else {
      var prepareArray = JSON.parse(alreadyInCart);

      prepareArray.push({title: title, imgsrc: imgsrc, price: price});

      var getCartProducts = JSON.stringify(prepareArray);

      $window.localStorage.setItem('cartProducts', getCartProducts);
    }
  };

  //Remove product
  productFactory.removeFromCart = function(index){
    var alreadyInCart = $window.localStorage.getItem('cartProducts');
    var prepareArray = JSON.parse(alreadyInCart);
    if (index > -1) {
      prepareArray.splice(index, 1);
      var cartProducts = JSON.stringify(prepareArray);
      $window.localStorage.setItem('cartProducts', cartProducts);
    } else {
      console.log("Error to delete");
    }
  };

  //Submit cart
  productFactory.submitCart = function(cartProducts, totalSum, user){
    console.log(cartProducts);
    console.log(totalSum);
    console.log(user);

    $http.post('api/orders', {
      orderedProducts: cartProducts,
      totalSum: totalSum,
      user: user
    });
    $window.localStorage.removeItem('cartProducts');
  };
  //rejectCart
  productFactory.rejectCart = function(){
    $window.localStorage.removeItem('cartProducts');
  };


  return productFactory;
});
