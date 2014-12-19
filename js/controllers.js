var prefalyticsApp = angular.module('prefalyticsApp', ['facebook']);

prefalyticsApp.config(function(FacebookProvider){
  FacebookProvider.init('518343048306713')
});

prefalyticsApp.controller('HomeCtrl', function($scope, Facebook){
  $scope.user = {first_name: "from Prefi"};

  var getStatus = function(){
    Facebook.getLoginStatus(function(response){
      if(response.status === 'connected'){
        $scope.loggedIn = true;
      } else {
        $scope.loggedIn = false;
      }
    });
  }
  getStatus();

  $scope.me = function(){
    Facebook.api('/me', function(response){
      console.log(response)
      $scope.user = response;
    });
  }

  $scope.login = function(){
    if($scope.loggedIn) return;
    Facebook.login(function(response){
      console.log("logged in")
      console.log(response);
      getStatus();
      $scope.me();
    });
  }

  $scope.Logout = function(){
    Facebook.logout(function(response){
      $scope.loggedIn = false;
    });
  }

  $scope.IntentLogin = function(){
    if(!$scope.loggedIn){
      $scope.login();
    }
  }
});