window.onload = function () {
  'use strict';

  var game = new Phaser.Game(640, 640, Phaser.AUTO, 'Shackman');
  game.state.add('boot', shackman.Boot);
  game.state.add('preloader', shackman.Preloader);
  game.state.add('game', shackman.Game);
  game.state.start('boot');
};
