(function() {

  angular.module('starter.controllers', ['ngCordova'])

    .controller('DashCtrl', function($scope, $ionicLoading, $timeout, $ionicTabsDelegate, $state, $location, $http) {
      console.log('I work');

      var url = 'https://secretskate-backend.herokuapp.com'
      var localUrl = 'http://localhost:3000'

      $http.get('https://secretskate-backend.herokuapp.com/skate-spot')
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
            $state.go('videos')
          });
        }
      });
      $scope.map = map;
      // });
    })
    .controller('VideoAllCtrl', function($scope, skateService, $stateParams, $http, $state) {
      // console.log(skateService.name); this is the service i have connected

      $http.get('https://secretskate-backend.herokuapp.com/skate-spot/video')
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

    .controller('Watch', function($scope, $stateParams, $state, $http) {
      $scope.video = {}

      $http.get('https://secretskate-backend.herokuapp.com/skate-spot/video')
        .then(function(data) {
          console.log(data.data);
          var video = data.data.filter(function(video) {
            return video.video_id == $stateParams.id
          })[0]
          $scope.video = video
          var vidElement = $("video")[0];
          vidElement.src = video.video_url;
          vidElement.load();
        }).catch(function(response) {
          console.log(response);
        });
    })

    .controller('VideoCtrl', function($scope, $cordovaCapture, $http, $cordovaFileTransfer, $state) {

        document.querySelector("#takeVideo").addEventListener("touchend", function() {
          console.log("Take video");
          navigator.device.capture.captureVideo(captureSuccess, captureError, {
            limit: 1
          });
        }, false);

      function captureError(e) {
        console.log("capture error: " + JSON.stringify(e));
      }
      function captureSuccess(s) {
        getSignedRequest(s[0]);

        function getSignedRequest(file) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', 'https://secretskate-backend.herokuapp.com/upload/sign-s3?file-name=' + file.name + '&file-type=' + file.type);
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                uploadFile(file, response.signedRequest, response.url);
              } else {
                alert('Could not get signed URL.');
              }
            }
          };
          xhr.send();
        }

        function uploadFile(file, signedRequest, url) {
          var options = new FileUploadOptions();
          options.chunkedMode = false;
          options.fileName = file.name;
          options.mimeType = file.type;
          options.httpMethod = "PUT";
          options.encodeURI = false;
          options.headers = {
            "Content-Type": file.type,
            "X-Amz-Acl": "public-read"
          };

          console.log(options);
          $cordovaFileTransfer.upload(signedRequest, file.fullPath, options).then(function(result){
            console.log(result);
            $.post('https://secretskate-backend.herokuapp.com/upload/videos', {
              skater_id: 1,
              title: "Gnarly",
              video_url: 'https://s3-us-west-2.amazonaws.com/secretskatevids/' + file.name,
              date: '2017-01-08'},
              function(data){
                console.log(data);
                //get coordinates and create new spot here! 
                $.post('https://secretskate-backend.herokuapp.com/upload/spots', {
                  video_id: data.id,
                  lat: 39.757648,
                  lng: -105.007168,
                  name: "school four stair"
                }).then(function(){
                  $state.go("watch", {id: data.id})
                })
              })
          }).catch(function(error){
            console.log(error);
          })


          }
      }
    })
})();
