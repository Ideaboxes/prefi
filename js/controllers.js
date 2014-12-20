var prefalyticsApp = angular.module('prefalyticsApp', ['facebook']);

prefalyticsApp.config(function(FacebookProvider){
  FacebookProvider.init('518343048306713')
});

prefalyticsApp.controller('HomeCtrl', function($scope, Facebook){
  $scope.user = {first_name: "from Prefi"};

  var setStatus = function(){
    Facebook.getLoginStatus(function(response){
      if(response.status === 'connected'){
        $scope.loggedIn = true;
        setUser();
      } else {
        $scope.loggedIn = false;
      }
    });
  }
  setStatus();

  var setUser = function(){
    Facebook.api('/me', function(response){
      $scope.user = response;
    });
  }

  var login = function(){
    if($scope.loggedIn) return;
    Facebook.login(function(response){
      console.log("logged in")
      console.log(response);
      setStatus();
    });
  }

  $scope.Logout = function(){
    Facebook.logout(function(response){
      $scope.loggedIn = false;
    });
  }

  $scope.IntentLogin = function(){
    if(!$scope.loggedIn){
      login();
    }
  }
});