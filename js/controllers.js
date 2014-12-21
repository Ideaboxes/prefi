var prefalyticsApp = angular.module('prefalyticsApp', ['facebook']);

prefalyticsApp.config(function(FacebookProvider){
  FacebookProvider.init('518343048306713')
});

prefalyticsApp.controller('HomeCtrl', function($scope, Facebook){
  $scope.user = {first_name: "there."};
  $scope.users = {};
  $scope.books = {};

  
  var setStatus = function(response){
    if(response.status === 'connected'){
      $scope.loggedIn = true;
      setUser();
    } else {
      $scope.loggedIn = false;
    }
  };

  Facebook.getLoginStatus(function(response){
    setStatus(response)
    console.log($scope.loggedIn)
  });

  var setUser = function(){
    Facebook.api('/me', function(response){
      $scope.user = response;
    });
  }

  var login = function(){
    if($scope.loggedIn) return;
    Facebook.login(function(response){
      console.log(response.authResponse.grantedScopes);
      setStatus(response);
    }, {scope:"user_likes,user_actions.books,user_friends", return_scopes:true});
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

  var countBookLikes = function(graph_response){
    graph_response.data.forEach(function(book){
      title = book.name
      if(typeof $scope.books[title] === "undefined")
        $scope.books[title] = 1;
      else $scope.books[title] += 1;
    });
  }

  var countBookReads = function(graph_response){
    graph_response.data.forEach(function(action){
      title = action.data.book.title
      if(typeof $scope.books[title] === "undefined")
        $scope.books[title] = 1;
      else $scope.books[title] += 1;
    });
  }

  $scope.GetBooks = function(user){
    if(!$scope.loggedIn){
      console.log("Not logged in");
      return;
    }
    
    u = typeof user === 'undefined' ? "me" : user;
    Facebook.api("/" + u + "/books", function(response){
      countBookLikes(response)
    })
    Facebook.api("/" + u + "/books.reads", function(response){
      countBookReads(response)
    })
  }
});