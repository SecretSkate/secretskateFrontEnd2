(function() {


angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope, $ionicLoading, $timeout, $ionicTabsDelegate, $state) {

  $scope.videos = [{
    id: 1,
    title: "Pretty Hate Machine",
    skater_id: 3,
    video_url: "",
    likes: 4,
    comments: "cool!",
    lat: 39.7576824,
    lng: -105.02113929999999
  },
  {
    id: 2,
    title: "grindy grind",
    skater_id: 2,
    video_url: "",
    likes: 5,
    comments: "wicked!",
    lat: 39.7576834,
    lng: -105.02113969999999
  }
  ]

var latLng = []

function Location(object) {
  this.lat = object.lat;
  this.lng = object.lng;
}

for (var i = 0; i < $scope.videos.length; i++) {
  latLng[i] = new Location($scope.videos[i]);
}

  google.maps.event.addDomListener(window, 'load', function() {
     var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

     var mapOptions = {
         center: myLatlng,
         zoom: 12,
         mapTypeId: google.maps.MapTypeId.ROADMAP
     };

     var map = new google.maps.Map(document.getElementById("map"), mapOptions);
     navigator.geolocation.getCurrentPosition(function(pos) {
         map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
         console.log(pos.coords.latitude, pos.coords.longitude);

         for (var i = 0; i < latLng.length; i++) {
           createMarker(latLng[i])
         }

         function createMarker(spot) {
           var marker = new google.maps.Marker({
            map: map,
            position: spot,
        });
         }
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
    points: 0,
    lat: 41.7576824,
    lng: -105.00713929999999
  },
  {
    name: "shred nasty",
    skater: "Phil Bear",
    videoUrl: "",
    points: 0,
    lat: 39.7576761,
    lng: -107.00713929999999
  },
  {
    name: "epic bail",
    skater: "Lanky Luke",
    videoUrl: "",
    points: 0,
    lat: 39.7576761,
    lng: -103.00713929999999
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
