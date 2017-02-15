(function() {


angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope, $ionicLoading, $timeout, $ionicTabsDelegate, $state) {

  google.maps.event.addDomListener(window, 'load', function() {
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

// .controller('unused', function($scope, video) {
//   $scope.video = video.all();
//   $scope.remove = function(video) {
//     Video.remove(video);
//   };
// })

.controller('VideoAllCtrl', function($scope){
  $scope.videos = [{
    name: "Pretty Hate Machine",
    skater: "Nine Inch Nails",
    videoUrl: "",
    points: 0
  },
  {
    name: "shred nasty",
    skater: "Phil Bear",
    videoUrl: "",
    points: 0
  },
  {
    name: "epic bail",
    skater: "Lanky Luke",
    videoUrl: "",
    points: 0
  }
]


$scope.upVote = function(currentVideo) {

  currentVideo.points +=1;

  if (currentVideo.points < 0) {
    currentVideo.points = 0;
  }
}
})



//this is important
.controller('MyCtrl', function($scope, $ionicHistory){
  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
})



.controller('VideoCtrl', function($scope, $cordovaCapture, $http) {

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
})();
