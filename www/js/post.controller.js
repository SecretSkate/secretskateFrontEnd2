(function() {
  'use strict';

  angular.module('starter.controllers', ['ngCordova'])
  .controller('PostCtrl', function($scope, $ionicLoading, $timeout, $state, $location) {

  console.log("this means the code is hooked up");
  (() => {
    document.getElementById("file-input").onchange = () => {
      const files = document.getElementById('file-input').files;
      const file = files[0];
      if (file == null) {
        return alert('No file selected.');
      }
      getSignedRequest(file);
    };
  })();

  function getSignedRequest(file) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/upload/sign-s3?file-name=${file.name}&file-type=${file.type}`);
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
          $.post('upload/videos', {
            skater_id: 1,
            location: 'Denver',
            video_url: `https://s3-us-west-2.amazonaws.com/secretskatevids/${file.name}`},
            function(data){
              console.log('DID STUFF', data);
            })
          } else {
            alert('Could not upload file.');
          }
        }
      };
      xhr.send(file);
    }
  })

}());
