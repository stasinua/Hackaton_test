angular.module('userApp', [
  'ngAnimate',
  'app.routes',
  'authService',
  'mainCtrl',
  'productCtrl',
  'productService'
])
.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptor');
});
