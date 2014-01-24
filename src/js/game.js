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

      // Create Player
      this.player = new CES.Entity();
      this.player.addComponent(new shackman.components.Position(32, 32));
      this.player.addComponent(new shackman.components.Velocity(0, 0));
      this.player.addComponent(new shackman.components.Bounds(32, 32));
      this.player.addComponent(new shackman.components.Sprite(this.add.sprite(32, 32, 'player')));
      this.player.addComponent(new shackman.components.Walker());
      this.player.addComponent(new shackman.components.Player());
      this.world.addEntity(this.player);

      for(var i = 0; i < shackman.level.length; i++){
        for(var j = 0; j < shackman.level[i].length; j++) {
          if(shackman.level[i][j] === 2){

            var pickup = new CES.Entity();
            pickup.addComponent(new shackman.components.Position(32 * j, 32 * i));
            pickup.addComponent(new shackman.components.Velocity(0, 0));
            pickup.addComponent(new shackman.components.Bounds(32, 32));
            if ((Math.floor((Math.random() * 100)) + 1) > 3){
              pickup.addComponent(new shackman.components.Sprite(this.add.sprite(32, 32, 'humanoid')));
              pickup.addComponent(new shackman.components.Pickup(false));
            } else {
              pickup.addComponent(new shackman.components.Sprite(this.add.sprite(32, 32, 'funding')));
              pickup.addComponent(new shackman.components.Pickup(true));
            }
            this.world.addEntity(pickup);
          }
        }
      }

      this.world.addSystem(new shackman.systems.CollisionSystem());
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


