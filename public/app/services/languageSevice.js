angular.module('authService', [])
.factory('Language', function($http, $location, $window){
  var languageFactory = {};

  languageFactory.getEnglish = function(){
    return http.get();
  };

  return languageFactory;
});
