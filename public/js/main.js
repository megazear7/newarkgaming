import TnngCard from "/js/tngg-card.js";

var backgroundImage = new Image()
var backgroundImageUrl = '/images/gaming/playing1.jpg';

backgroundImage.onload = () => {
  var html = document.querySelector('html');
  var overlayColor = document.querySelector('.overlay-color');
  var container = document.querySelector('.container');
  html.style.background = 'url('+backgroundImageUrl+') no-repeat center center fixed';
  html.style.backgroundSize = 'cover';
  overlayColor.style.zIndex = '-1';
  overlayColor.style.backgroundColor = '#4ABDACAA';
  container.style.opacity = '1';
}

backgroundImage.src = backgroundImageUrl;
