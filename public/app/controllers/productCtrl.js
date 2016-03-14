angular.module('productCtrl', ['productService'])

.controller('productController', function(Product, $scope){
  var vm = this;
  vm.processing = true;

  Product.all()
  .success(function(data){
    vm.processing = false;
    vm.products = data;
  });

  vm.addProduct = function(){
    vm.processing = true;
    Product.addProduct(vm.productData.title, vm.productData.engdescription, vm.productData.rusdescription, vm.productData.imgsrc, vm.productData.price)
    .success(function(data){
      vm.processing = false;
      if (data.success) {
        $location.path('/products');
      }
      else {
        vm.error = data.message;
      }
    });
  };
  vm.addToCart = function(title, imgsrc, price){
    Product.addToCart(title, imgsrc, price);

    console.log("Tranceive data to cart");
  };
});
