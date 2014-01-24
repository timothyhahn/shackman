(function () {
  'use strict';


  var shackman = window.shackman || (window.shackman = {});
  shackman.components = {};

  shackman.components.Position = CES.Component.extend({
    name: 'position', // position on the tilemap grid
    init: function(x, y) {
      this.x = x;
      this.y = y;
    }
  });

  shackman.components.Velocity = CES.Component.extend({
    name: 'velocity',
    init: function(x, y){
      this.x = x;
      this.y = y;
    }
  });

  shackman.components.Bounds = CES.Component.extend({
      name: 'bounds',
      init: function(x, y){
        this.x = x;
        this.y = y;
      }
  });
  shackman.components.Walker = CES.Component.extend({
      name: 'walker',
      steps: 0,
      init: function(){

      }
  });

  shackman.components.Terrain = CES.Component.extend({
      name: 'terrain',
      init: function(walkable){
        this.walkable = walkable;
      }
  });

  shackman.components.Sprite = CES.Component.extend({
      name: 'sprite',
      init: function(sprite){
        this.sprite = sprite;
      }
  });

}(this));


