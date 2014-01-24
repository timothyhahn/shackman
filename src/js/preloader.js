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
      this.load.image('player', 'assets/house.png');
      this.load.image('mansion', 'assets/mansion.png');
      this.load.image('humanoid', 'assets/humanoid.png');
      this.load.image('fate', 'assets/fate.png');
      this.load.image('clown', 'assets/clown.png');
      this.load.image('fire', 'assets/fire.png');
      this.load.image('winter', 'assets/winter.png');
      this.load.image('funding', 'assets/funding.png');

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
