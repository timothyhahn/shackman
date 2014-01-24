(function () {
  'use strict';

  var shackman = window.shackman || (window.shackman = {});
  shackman.actions = {};
  shackman.actions.MoveAction = function(entity, direction){
    this.entity = entity;
    this.direction = direction;
  };
  shackman.actions.MoveAction.LEFT = 0;
  shackman.actions.MoveAction.RIGHT = 1;
  shackman.actions.MoveAction.UP = 2;
  shackman.actions.MoveAction.DOWN = 3;

  

}(this));
