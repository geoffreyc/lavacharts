(function(){
  "use strict"

  var Q = require('q');
  this.lava = require('./lava.js');

  /**
   * Adding the resize event listener for redrawing charts.
   */
  this.addEventListener('resize', this.lava.redrawCharts);

  /**
   * Let's go!
   */
  Q(this.lava.init()).then(this.lava.run);

}).apply(window);
