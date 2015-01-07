animationDelay = 100;
minSearchTime = 100;

window.requestAnimationFrame(function () {
  var manager = new GameManager(4, KeyboardInputManager, HTMLActuator);
});
