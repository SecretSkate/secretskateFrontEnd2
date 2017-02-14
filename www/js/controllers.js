angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope, $ionicLoading, $timeout, $ionicTabsDelegate) {

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.doRefresh = function() {

    console.log('Refreshing!');
    $timeout( function() {
      //simulate async response
      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');

    }, 1000);

  };

  $scope.checkTab = function(){
    var active = $ionicTabsDelegate.selectedIndex();
    if (active === 0){
      $scope.doRefresh();
    }
    else{
      $ionicTabsDelegate.select(2, true);
    }
  }

  $scope.refresh = function() {
    console.log("refresh");
  }

  google.maps.event.addDomListener(window, 'load', function() {
    console.log("google");
     var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

     var mapOptions = {
         center: myLatlng,
         zoom: 16,
         mapTypeId: google.maps.MapTypeId.ROADMAP
     };

     var map = new google.maps.Map(document.getElementById("map"), mapOptions);
     navigator.geolocation.getCurrentPosition(function(pos) {
       console.log(pos);
         map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
         var myLocation = new google.maps.Marker({
             position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
             map: map,
             title: "My Location"
         });
     });
     $scope.map = map;
 });
})

.controller('tabs', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('VideoCtrl', function($scope, $cordovaCapture, $http) {

  const vm = this;

  vm.testPost = function() {
    console.log("hi");
  }

  function testPost() {
    console.log("hi");
  }

  // const vm = this;
  // console.log($cordovaCapture);
  //
  // $scope.captureVideo = function() {
  //   var options = { limit: 3, duration: 10 };
  //
  //   $cordovaCapture.captureVideo(options).then(function(videoData) {

  //   }, function(err) {
  //     // An error occurred. Show a message to the user
  //   });
  // }

  document.addEventListener("deviceready", init, false);
function init() {

	document.querySelector("#takeVideo").addEventListener("touchend", function() {
		console.log("Take video");
		navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1});
	}, false);

}

function captureError(e) {
	console.log("capture error: "+JSON.stringify(e));
}

function captureSuccess(s) {
  console.log(s[0].fullpath);
  var postObj = {
    video: s[0].fullpath
  }
  $http.post('https://localhost:3000/', postObj)

	var v = "<video controls='controls'>";
	v += "<source src='" + s[0].fullPath + "' type='video/mp4'>";
	v += "</video>";
	document.querySelector("#videoArea").innerHTML = v;
}



})
