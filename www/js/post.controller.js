(function() {
  'use strict';
  angular.module('starter.controllers')
  .controller('PostCtrl', function($scope, $ionicLoading, $timeout, $state, $location) {

    var file = null;

    $scope.submitVideo = function() {
      console.log("submitted");
      getSignedRequest(file);
    }

    document.getElementById("file-input").onchange = function() {
      const files = document.getElementById('file-input').files;
      file = files[0];
      if (file == null) {
        return alert('No file selected.');
      }
      console.log(file);
    };
  })

}());

  function getSignedRequest(file) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://secretskate-backend.herokuapp.com/upload/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
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
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          document.getElementById('preview').src = url;
          document.getElementById('video-url').value = url;
          $.post('https://secretskate-backend.herokuapp.com/upload/videos', {
            skater_id: 1,
            video_url: `https://s3-us-west-2.amazonaws.com/secretskatevids/${file.name}`,
            date: '2017-01-08'},
            function(data){
              console.log(file.name);
            })
          } else {
            alert('Could not upload file.');
          }
        }
      };
      xhr.send(file);
    }
