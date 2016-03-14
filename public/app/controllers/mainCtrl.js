angular.module('mainCtrl', ['productService'])

.controller('mainController', function($rootScope, $location, $window, $http, $q, Auth, Product){
  var vm = this;

  //Languge section
  //vm.rusDescription = false;
  $http.get('/assets/lang/english.json').success(function(data){
    vm.language = data;
  });

  vm.getRussian = function(){
    $http.get('/assets/lang/russian.json').success(function(data){
      vm.language = data;
    });
  };
  vm.getEnglish = function(){
    $http.get('/assets/lang/english.json').success(function(data){
      vm.language = data;
    });
  };

  //get info if user is logged login
  vm.loggedIn = Auth.isLoggedIn();

  //check is user is logged in on every request
  $rootScope.$on('$routeChangeStart', function(){
    vm.loggedIn = Auth.isLoggedIn();
    Auth.getUser()
    .then(function(data){
      vm.user = data.data;
    });
  });

  //register new user
  vm.doRegister = function(){
    vm.processing = true;
    vm.error = '';
    Auth.register(vm.registerData.name, vm.registerData.username, vm.registerData.password)
    .success(function(data){
      vm.processing = false;
      if (data.success) {
        $location.path('/login');
      }
      else {
        vm.error = data.message;
      }
    });
  };

  //function to handle login form
  vm.doLogin = function(){
    vm.processing = true;
    vm.error = '';
    Auth.login(vm.loginData.username, vm.loginData.password)
    .success(function(data){
      vm.processing = false;
      if (data.success) {
        $location.path('/newproduct');
      }
      else {
        vm.error = data.message;
      }
    });
  };

  //function to handle logout
  vm.doLogout = function(){
    Auth.logout();
    vm.user = ' ';
    $location.path('/');
  };

  //Cart section
  vm.totalSum = 0;
  vm.cartIsActive = false;
  vm.openCart = function(){
    var storageCartProducts = $window.localStorage.getItem('cartProducts');
    if (storageCartProducts === null) {
      vm.cartProducts = "no products in cart";
    } else {
      vm.cartProducts = JSON.parse(storageCartProducts);
      vm.totalSum = Object.keys(vm.cartProducts).map(function(k){
        var foo = parseInt(vm.cartProducts[k].price);
        return +foo;
      }).reduce(function(a,b){ return a + b; },0);
    }
  };

  vm.removeFromCart = function(index){
    Product.removeFromCart(index);
  };

  vm.submitCart = function(){
    Product.submitCart(vm.cartProducts, vm.totalSum, vm.user);
    vm.cartIsActive = false;
    $window.localStorage.removeItem('cartProducts');
    vm.cartProducts = [];
  };

  vm.rejectCart = function(){
    Product.rejectCart();
    vm.totalSum = 0;
    vm.cartIsActive = false;
    $window.localStorage.removeItem('cartProducts');
    vm.cartProducts = [];
  };


});
