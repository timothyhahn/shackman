(function () {
  'use strict';

  var shackman = window.shackman || (window.shackman = {});
  shackman.helpers = {};
  shackman.helpers.positionToGrid = function(x, y) {
    return [Math.floor(x / 32), Math.floor(y / 32)];
  };
  shackman.helpers.gridToPosition = function(x, y){
    return [32 * x, 32 * y];
  };

}(this));
