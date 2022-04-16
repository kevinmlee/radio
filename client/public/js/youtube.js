var tag = document.createElement("script");
tag.id = "iframe-demo";
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("ytplayer", {
    events: {
      onReady: onPlayerStateChange,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerStateChange() {
  player.unMute();
  player.setVolume(80);
  player.playVideo();
}

$("#play").on("click", function() {
  player.playVideo();
});

$("#pause").on("click", function() {
  player.pauseVideo();
});

$("#volume").mousemove(function() {
  player.setVolume($(this).val());
});
