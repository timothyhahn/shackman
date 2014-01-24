(function () {
  'use strict';

  var shackman = window.shackman || (window.shackman = {});
  shackman.systems = {};

  shackman.movequeue = [];

  shackman.systems.MovementSystem = CES.System.extend({
      process: function(queue) {
        for(var i = 0; i < queue.length; i++){
          var move = queue[i];
          var entity = move.entity;
          var direction = move.direction;
          var MoveAction = shackman.actions.MoveAction;
          var position = entity.getComponent('position');
          var velocity = entity.getComponent('velocity');
          var walker = entity.getComponent('walker');

          // If steps is zero
          if(walker.steps === 0){
            // If direction is clear
            var gridToCheck = shackman.helpers.positionToGrid(position.x, position.y);
            switch(direction){
              case MoveAction.LEFT:
                gridToCheck[0] -= 1;
                break;
              case MoveAction.RIGHT:
                gridToCheck[0] += 1;
                break;
              case MoveAction.UP:
                gridToCheck[1] -= 1;
                break;
              case MoveAction.DOWN:
                gridToCheck[1] += 1;
                break;
            }
            if(shackman.level[gridToCheck[1]][gridToCheck[0]] === 2) {
              // Set steps to number
              walker.steps = 8;
              // Set velocity
              switch(direction){
                case MoveAction.LEFT:
                  velocity.x = -4;
                  break;
                case MoveAction.RIGHT:
                  velocity.x = 4;
                  break;
                case MoveAction.UP:
                  velocity.y = -4;
                  break;
                case MoveAction.DOWN:
                  velocity.y = 4;
                  break;
              }
 
            }
          }
        }
      },
      update: function(dt) {
        var walkers;
        walkers = this.world.getEntities('position', 'velocity', 'bounds', 'walker');

        this.process(shackman.movequeue);
        while(shackman.movequeue.length > 0){
          shackman.movequeue.pop();
        }

        for(var i = 0; i < walkers.length; i++) {
          var walker = walkers[i];
          var wPosition, wVelocity, wBounds, wWalker;
          wPosition = walker.getComponent('position');
          wVelocity = walker.getComponent('velocity');
          wBounds = walker.getComponent('bounds');
          wWalker = walker.getComponent('walker');

          // If velocity isn't zero
          if((wVelocity.x !== 0 || wVelocity.y !== 0) && wWalker.steps > 0){
            if(wVelocity.x !== 0) {
              wPosition.x += wVelocity.x;
            } else if(wVelocity.y !== 0) {
              wPosition.y += wVelocity.y;
            }
              wWalker.steps--;
              if(wWalker.steps === 0) {
                wVelocity.x = 0;
                wVelocity.y = 0;
              }
          }
        }
    }
  });

  shackman.systems.PowerupSystem = CES.System.extend({
      update: function(dt) {
        var player;
        player = this.world.getEntities('player', 'sprite')[0];

        var specialTimer = player.getComponent('player').specialTimer;
        if(specialTimer === 0) {
          var oldSprite = player.getComponent('sprite').sprite;
          var game = oldSprite.game;
          var x = oldSprite.x;
          var y = oldSprite.y;
          var playerSprite = game.add.sprite(x, y, 'player');
          player.getComponent('sprite').sprite = playerSprite;
          oldSprite.kill();
        } else {
          player.getComponent('player').specialTimer--;
        }
      }

  });

  shackman.systems.AISystem = CES.System.extend({
    update: function(dt) {
      var enemies;
      enemies = this.world.getEntities('position', 'enemy', 'bounds');

      for(var i = 0; i < enemies.length; i++){
        var enemy = enemies[i];

        var position = enemy.getComponent('position');
        var MoveAction = shackman.actions.MoveAction;
        var possibleMoves = [];
        var gridPosition = shackman.helpers.positionToGrid(position.x, position.y);
        var j = gridPosition[1];
        var k = gridPosition[0];

        if(shackman.level[j][k - 1] === 2) {
          possibleMoves.push(MoveAction.LEFT);
        }
        if(shackman.level[j][k + 1] === 2){
          possibleMoves.push(MoveAction.RIGHT);
        }
        if(shackman.level[j - 1][k] === 2){
          possibleMoves.push(MoveAction.UP);
        }
        if(shackman.level[j + 1][k] === 2){
          possibleMoves.push(MoveAction.DOWN);
        }
        

        shackman.movequeue.push(new MoveAction(enemy, possibleMoves[Math.floor(Math.random() * possibleMoves.length)]));
      }
    }
  });

  shackman.systems.CollisionSystem = CES.System.extend({
      valueInRange: function(value, min, max) {
        return (value >= min) && (value <= max);
      },
      doesCollide: function(entityA, entityB) {
        var positionA = entityA.getComponent('position');
        var boundsA = entityA.getComponent('bounds');
        var positionB = entityB.getComponent('position');
        var boundsB = entityB.getComponent('bounds');
        var xOverlap = this.valueInRange(positionA.x, positionB.x, positionB.x + boundsB.x - 5) ||
        this.valueInRange(positionB.x, positionA.x, positionA.x + boundsA.x - 5);

        var yOverlap = this.valueInRange(positionA.y, positionB.y, positionB.y + boundsB.y - 5) ||
        this.valueInRange(positionB.y, positionA.y, positionA.y + boundsA.y - 5);
        return xOverlap && yOverlap;
      },
      update: function(dt) {
        var player, pickups, enemies;
        player = this.world.getEntities('position', 'player', 'bounds')[0];
        pickups = this.world.getEntities('position', 'pickup', 'bounds');
        enemies = this.world.getEntities('position', 'enemy', 'bounds');

        if(pickups.length === 0) {
          shackman.game.state.start('game');
        }
        for(var i = 0; i < pickups.length; i++){
          var pickup = pickups[i];
          if(this.doesCollide(player, pickup)) {
            if(pickup.getComponent('pickup').special){
              var oldSprite = player.getComponent('sprite').sprite;
              var game = oldSprite.game;
              var x = oldSprite.x;
              var y = oldSprite.y;
              var specialSprite = game.add.sprite(x, y, 'mansion');
              player.getComponent('sprite').sprite = specialSprite;
              player.getComponent('player').specialTimer = 200;
              oldSprite.kill();
            }
            pickup.exists = false;
            pickup.getComponent('sprite').sprite.kill();
            this.world.removeEntity(pickup);
          }
        }
        for(var i = 0; i < enemies.length; i++){
          var enemy = enemies[i];
          if(this.doesCollide(player, enemy)){
            if(player.getComponent('player').specialTimer > 0) {
              enemy.getComponent('sprite').sprite.kill();
              this.world.removeEntity(enemy);
            } else {
              player.getComponent('sprite').sprite.kill();
              this.world.removeEntity(player);
              document.write('<body style="background-color: black;"><iframe style="height: 100%; width: 100%;" width="640" height="360" src="//www.youtube.com/embed/M5QGkOGZubQ?autoplay=1" frameborder="0" allowfullscreen></iframe></body>');
            }
          }
        }
      }
  });

  shackman.systems.RenderSystem = CES.System.extend({
      update: function(dt) {
        var entities, position, sprite;
        entities = this.world.getEntities('position', 'sprite');

        entities.forEach(function (entity){
          position = entity.getComponent('position');
          sprite = entity.getComponent('sprite').sprite;
          sprite.reset(position.x, position.y);
        });
      }

  });

}(this));
