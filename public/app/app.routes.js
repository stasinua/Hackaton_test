angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){
  $routeProvider
  .when('/', {
    templateUrl: '/app/views/pages/home.html'
  })
  .when('/register', {
    templateUrl: '/app/views/pages/register.html',
    controller: 'mainController',
    controllerAs: 'register'
  })
  .when('/login', {
    templateUrl: '/app/views/pages/login.html',
    controller: 'mainController',
    controllerAs: 'login'
  })
  .when('/newproduct', {
    templateUrl: '/app/views/pages/products/new.html',
    controller: 'productController',
    controllerAs: 'product'
  })
  .when('/products', {
    templateUrl: '/app/views/pages/products/all.html',
    controller: 'productController',
    controllerAs: 'products'
  })
  .when('/about', {
    templateUrl: '/app/views/pages/about.html',
    controller: 'productController',
    controllerAs: 'about'
  })
  .when('/users/create', {
    templateUrl: 'app/views/pages/users/single.html',
    controller: 'userCreateController',
    controllerAs: 'user'
  })
  .when('/users/:user_id', {
    templateUrl: 'app/views/pages/users/single.html',
    controller: 'userEditController',
    controllerAs: 'user'
  });
  $locationProvider.html5Mode(true);
});
