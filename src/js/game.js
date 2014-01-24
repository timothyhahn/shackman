(function () {
  'use strict';

  var shackman = window.shackman || (window.shackman = {});

  shackman.Game = function () {
    this.player = null;
  };

  shackman.Game.prototype = {
    
    create: function () {
      var map = this.add.tilemap('tilemap');
      var tileset = this.add.tileset('tileset');
      var layer = this.add.tilemapLayer(0, 0, 640, 640, tileset, map, 0);
      layer.fixedToCamera = true;
      this.cursors = this.input.keyboard.createCursorKeys();

      var levelArray = JSON.parse(this.cache.getText('level')).layers[0].data;
      var size = 20;
      shackman.level = [];
      while(levelArray.length > 0){
        shackman.level.push(levelArray.splice(0, size));
      }

      this.world = new CES.World();
      this.player = new CES.Entity();
      this.player.addComponent(new shackman.components.Position(32, 32));
      this.player.addComponent(new shackman.components.Velocity(0, 0));
      this.player.addComponent(new shackman.components.Bounds(32, 32));
      this.player.addComponent(new shackman.components.Sprite(this.add.sprite(32, 32, 'player')));
      this.player.addComponent(new shackman.components.Walker());
      this.world.addEntity(this.player);
      var xOff = 0;
      var yOff = 0;

      for(var i = 0; i < shackman.level.length; i++){
        for(var j = 0; j < shackman.level[i].length; j++){
          var wall = new CES.Entity();
          wall.addComponent(new shackman.components.Position(xOff, yOff));
          wall.addComponent(new shackman.components.Velocity(0, 0));
          wall.addComponent(new shackman.components.Bounds(16, 16));
          wall.addComponent(new shackman.components.Terrain(false));
          this.world.addEntity(wall);
          xOff += 32;
        }
        xOff = 0;
        yOff += 32;
      }

      this.world.addSystem(new shackman.systems.MovementSystem());
      this.world.addSystem(new shackman.systems.RenderSystem());

    },

    update: function () {
   
      var MoveAction = shackman.actions.MoveAction;
      if(this.cursors.left.isDown || this.cursors.right.isDown){
        if(this.cursors.left.isDown) {
          shackman.movequeue.push(new MoveAction(this.player, MoveAction.LEFT));
        } else{
          shackman.movequeue.push(new MoveAction(this.player, MoveAction.RIGHT));
        }
      } else if(this.cursors.up.isDown || this.cursors.down.isDown){
          if(this.cursors.up.isDown){
            shackman.movequeue.push(new MoveAction(this.player, MoveAction.UP));
          } else {
            shackman.movequeue.push(new MoveAction(this.player, MoveAction.DOWN));
          }
      }

      this.world.update(1);
    },
  };

}(this));


