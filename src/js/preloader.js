(function () {
  'use strict';

  var shackman = window.shackman || (window.shackman = {});

  shackman.Preloader = function () {
    this.asset = null;
    this.ready = false;
  };

  shackman.Preloader.prototype = {
    
    preload: function () {
      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.image('player', 'assets/humanoid2.png');
      this.load.bitmapFont('minecraftia', 'assets/minecraftia.png', 'assets/minecraftia.xml');
      this.load.tilemap('tilemap', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.tileset('tileset', 'assets/tileset.png', 32, 32);
      this.load.text('level', 'assets/level.json');
    },

    create: function () {
    },

    update: function () {
      if (!!this.ready) {
        this.game.state.start('game');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

}(this));
