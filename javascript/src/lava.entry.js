/* jshint undef: true, unused: true */
/* globals window, require, console */

/**
 * Lava.js entry point for Browserify
 */
(function(){
    "use strict";
    
    var DEBUG = true;
    var ready = require('document-ready');
    var lava = this.lava = require('./lava/Lava.js');

    ready(function() {
        /**
         * Adding the resize event listener for redrawing charts.
         */
        window.addEventListener('resize', lava.redrawCharts);

        /**
         * Let's go!
         */
        lava.init();
    });
}.apply(window));
