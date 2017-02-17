(function() {

  angular.module('starter.controllers', ['ngCordova'])

    .controller('DashCtrl', function($scope, $ionicLoading, $timeout, $ionicTabsDelegate, $state, $location, $http) {
      console.log('I work');

      var url = 'https://secretskate-backend.herokuapp.com'
      var localUrl = 'http://localhost:3000'

      $http.get(`https://secretskate-backend.herokuapp.com/skate-spot`)
        .then(function(data) {
          $scope.spots = data.data;
        }).catch(function(response) {
          console.log(response);
        });


      $scope.spots = []

      // google.maps.event.addDomListener(window, 'load', function() {
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
          this.id = object.id;
          this.name = object.name;
          this.lat = Number(object.lat);
          this.lng = Number(object.lng);
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
            $state.go('video', {
              id: spot.id
            })
          });
        }
      });
      $scope.map = map;
      // });
    })
    .controller('VideoAllCtrl', function($scope, skateService, $stateParams, $http, $state) {
      // console.log(skateService.name); this is the service i have connected

      $http.get(`https://secretskate-backend.herokuapp.com/skate-spot/video`)
        .then(function(data) {
          $scope.videos = data.data;
        }).catch(function(response) {
          console.log(response);
        });

      $scope.videos = []

      $scope.upVote = function(currentVideo) {

        currentVideo.points += 1;

        if (currentVideo.points < 0) {
          currentVideo.points = 0;
        }
      }

      $scope.watch = function(video) {
        $state.go('watch', {
          id: video.video_id
        })
      }

      // $scope.videos = $scope.allVideos.filter(function(video) {
      //   return video.spot_id == $stateParams.id;
      // })
    })

    //this is important
    .controller('MyCtrl', function($scope, $ionicHistory) {
      $scope.myGoBack = function() {
        $ionicHistory.goBack();
      };
    })

    .controller('Watch', function($scope, $stateParams, $state, $http, $sce) {
      $scope.videos = []

      $http.get(`https://secretskate-backend.herokuapp.com/skate-spot/video`)
        .then(function(data) {
          $scope.videos.push(data.data[$stateParams.id - 4])
        }).catch(function(response) {
          console.log(response);
        });
    })

    .controller('VideoCtrl', function($scope, $cordovaCapture, $http) {

      document.addEventListener("deviceready", init, false);

      function init() {

        document.querySelector("#takeVideo").addEventListener("touchend", function() {
          console.log("Take video");
          navigator.device.capture.captureVideo(captureSuccess, captureError, {
            limit: 1
          });
        }, false);
      }

      function captureError(e) {
        console.log("capture error: " + JSON.stringify(e));
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
