angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope) {})

.controller('unused', function($scope, Chats) {
  console.log("boo");
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.video = video.all();
  $scope.remove = function(video) {
    Video.remove(video);
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
