(function() {

angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope, $ionicLoading, $timeout, $ionicTabsDelegate, $state, $location) {

  $scope.spots =
 [
  {
   spot_id: 1,
   name: "school four stair",
   lat: 41.7576824,
   lng: -105.00713929999999
  },
  {
   spot_id: 2,
   name: "short rail",
   lat: 39.7576761,
   lng: -107.00713929999999
  },
  {
   spot_id: 3,
   name: "gap",
   lat: 39.7576761,
   lng: -103.00713929999999
  }
 ]


// knex.select("lat", "lng")
//   .from("video")
//   .then(function() {
//     latLng.push(data)
//     console.log(latLng);
//   })

  google.maps.event.addDomListener(window, 'load', function() {
     var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

     var mapOptions = {
         center: myLatlng,
         zoom: 5,
         mapTypeId: google.maps.MapTypeId.ROADMAP
     };

     var map = new google.maps.Map(document.getElementById("map"), mapOptions);
     navigator.geolocation.getCurrentPosition(function(pos) {
         map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude))

         var localSpots = []

         for (var i = 0; i < $scope.spots.length; i++) {
           localSpots[i] = new Location($scope.spots[i]);
         }

         function Location(object) {
           this.id = object.spot_id;
           this.name = object.name;
           this.lat = object.lat;
           this.lng = object.lng;
         }

         for (var i = 0; i < localSpots.length; i++) {
           createMarker(localSpots[i])
         }

         function createMarker(spot) {
           var marker = new google.maps.Marker({
            map: map,
            position: spot,
        });
        marker.addListener('click', function() {
          $state.go('video', {id: spot.id})
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

.controller('VideoAllCtrl', function($scope, skateService, $stateParams){
  console.log($stateParams.id);
  // console.log(skateService.name); this is the service i have connected
  $scope.videos = []

  $scope.allVideos = [{
   spot_id: 3,
   name: "Pretty Hate Machine",
   skater: "Nine Inch Nails",
   videoUrl: "",
   points: 0,
 },
 {
   spot_id: 3,
   name: "shred nasty",
   skater: "Phil Bear",
   videoUrl: "",
   points: 0,
 },
 {
   spot_id: 3,
   name: "epic bail",
   skater: "Lanky Luke",
   videoUrl: "",
   points: 0,
 }
 ]

 $scope.videos = $scope.allVideos.filter(function(video){
   return video.spot_id == $stateParams.id;
  })
  console.log($scope.videos);

// $scope.videos.push($scope.allVideos[1])
//
// spotById($scope.allVideos, $scope.)
//  function spotById(videosArray) {
//    for (var i = 0; i < videosArray.length; i++) {
//      if(videosArray.id === $stateParams.id) {
//        $scope.vidoes.push(videosArray[i])
//      }
//    }
//  }


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
