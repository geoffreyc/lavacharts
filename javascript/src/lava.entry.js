/* jshint undef: true, unused: true */
/* globals window, require, console */

/**
 * Lava.js entry point for Browserify
 */
(function(){
    "use strict";

    var ready = require('document-ready');

    this.lava = require('./lava/Lava.js');
/*
    var s = document.createElement('script');

    s.type = 'text/javascript';
    s.innerHTML = 'lava.init();';

    document.body.appendChild(s);
*/

    ready(function() {
        console.log(lava._charts);
    });

}).apply(window);

/**
 * Adding the resize event listener for redrawing charts.
 */
//this.addEventListener('resize', this.lava.redrawCharts);

/**
 * Let's go!
 */
//this.lava.init();
//().then(this.lava.run);
