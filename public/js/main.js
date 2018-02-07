document.querySelectorAll('img').forEach((img) => {
  var loaded = false;
  img.addEventListener('load', () => {
    img.style.opacity = '1';
    loaded = true;
  });

  // Can we gauruntee that the load event will fire? It doesn't seem like it.
  // So this is a backup to make sure the images appear.
  setTimeout(() => {
    if (! loaded) {
      img.style.opacity = '1';
    } else {
    }
  }, 5000);
});

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
