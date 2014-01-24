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
        var walkers, terrains;
        walkers = this.world.getEntities('position', 'velocity', 'bounds', 'walker');
        terrains = this.world.getEntities('position', 'velocity', 'bounds', 'terrain');

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
