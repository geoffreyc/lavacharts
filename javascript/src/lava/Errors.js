/* jshint undef: true */
/* globals module, require */
"use strict";

var ce = require('node-custom-errors');
var LavachartsError = ce.create('LavachartsError');

/**
 * Errors module
 *
 * @module    lava/Errors
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2015, KHill Designs
 * @license   MIT
 */
module.exports.InvalidCallback = ce.create({
    name: "InvalidCallback",
    parent: LavachartsError,
    construct: function (callback) {
        this.message = '[Lavacharts] ' + typeof callback + ' is not a valid callback.';
    }
});

module.exports.InvalidLabel = ce.create({
    name: "InvalidLabel",
    parent: LavachartsError,
    construct: function (label) {
        this.message = '[Lavacharts] ' + typeof label + ' is not a valid label.';
    }
});

module.exports.ElementIdNotFound = ce.create({
    name: "ElementIdNotFound",
    parent: LavachartsError,
    construct: function (elemId) {
        this.message = '[Lavacharts] DOM node #' + elemId + ' was not found.';
    }
});

module.exports.ChartNotFound = ce.create({
    name: "ChartNotFound",
    parent: LavachartsError,
    construct: function (label) {
        this.message = '[Lavacharts] Chart with label "' + label + '" was not found.';
    }
});

module.exports.DashboardNotFound = ce.create({
    name: "DashboardNotFound",
    parent: LavachartsError,
    construct: function (label) {
        this.message = '[Lavacharts] Dashboard with label "' + label + '" was not found.';
    }
});
