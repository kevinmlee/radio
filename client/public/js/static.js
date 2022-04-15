var canvas = document.getElementById("static"),
  context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var static = context.createImageData(canvas.width, canvas.height);

window.setInterval(function() {
  for (var i = 0; i < static.data.length; i = i + 4) {
    static.data[i + 3] = getRandomInt(0, 255);
  }
  context.putImageData(static, 0, 0);
}, 50);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
