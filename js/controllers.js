var prefalyticsApp = angular.module('prefalyticsApp', ['facebook']);

prefalyticsApp.config(function(FacebookProvider){
  FacebookProvider.init('518343048306713')
});

prefalyticsApp.controller('HomeCtrl', function($scope, Facebook){
  $scope.user = {first_name: "there."};
  $scope.friends = [];
  $scope.objects = [];
  $scope.actions = [];
  
  Facebook.getLoginStatus(function(response){
    setStatus(response)
  });

  $scope.Logout = function(){
    Facebook.logout(function(response){
      $scope.loggedIn = false;
    });
  }

  $scope.Login = function(){
    if($scope.loggedIn) return;
    Facebook.login(
      function(response){
        console.log(response.authResponse.grantedScopes);
        setStatus(response);
      }, 
      {scope:"user_likes,user_actions.books,user_friends", return_scopes:true}
    );
  }

  $scope.GetBooks = function(user, friendIndex){
    if(!$scope.loggedIn){
      console.log("Not logged in");
      return;
    }
    
    u = typeof user === 'undefined' ? "me" : user;
    fi = typeof friendIndex === 'undefined' ? 0 : friendIndex;
    Facebook.api("/" + u + "/books", function(response){
      countBooks(fi, "likes", response);
    })
    Facebook.api("/" + u + "/books.reads", function(response){
      countBooks(fi, "reads", response);
    })
  }


  /********Utils***********/

  var setStatus = function(response){
    if(response.status === 'connected'){
      $scope.loggedIn = true;
      setUser();
    } else {
      $scope.loggedIn = false;
    }
  };

  var setUser = function(){
    Facebook.api('/me', function(response){
      $scope.user = response;
      //You are your own friend too:
      $scope.friends.push({
        id: response.id,
        name: response.name,
        gender: response.gender,
      }) 
    });
  }

  //push if object doesn't exist, and return the index of the object
  var pushIfNew = function(arr, obj){
    for(var i=0; i<arr.length; i++){
      if(arr[i].id == obj.id) return i;
    }
    arr.push(obj);
    return arr.length - 1;
  }

  var countBooks = function(friendIndex, type, graph_response){
    graph_response.data.forEach(function(node){
      title = type=="likes"? node.name : node.data.book.title;
      id = type=="likes"? node.id : node.data.book.id;

      bookIndex = pushIfNew($scope.objects, 
        {
          id: id,
          name: title,
          type: "book"
        }
      );
      $scope.actions.push({
        source: friendIndex,
        target: bookIndex,
        type: "book"
      })
    });
  }


});
