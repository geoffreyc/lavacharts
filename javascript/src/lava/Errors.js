/* jshint undef: true */
/* globals module, require */

/**
 * Errors.js
 *
 * Author:  Kevin Hill
 * Email:   kevinkhill@gmail.com
 * Github:  https://github.com/kevinkhill/lavacharts
 * License: MIT
 */
module.exports = (function() {
    "use strict";

    var ce = require('node-custom-errors');

    var LavachartsError = ce.create('LavachartsError');

    var errors = {
        InvalidCallback: ce.create({
            name: "InvalidCallback",
            parent: LavachartsError,
            construct: function (callback) {
                this.message = '[Lavacharts] ' + typeof callback + ' is not a valid callback.';
            }
        }),
        InvalidLabel: ce.create({
            name: "InvalidLabel",
            parent: LavachartsError,
            construct: function (label) {
                this.message = '[Lavacharts] ' + typeof label + ' is not a valid label.';
            }
        }),
        ElementIdNotFound: ce.create({
            name: "ElementIdNotFound",
            parent: LavachartsError,
            construct: function (elemId) {
                this.message = '[Lavacharts] DOM node #' + elemId + ' was not found.';
            }
        }),
        ChartNotFound: ce.create({
            name: "ChartNotFound",
            parent: LavachartsError,
            construct: function (label) {
                this.message = '[Lavacharts] Chart with label "' + label + '" was not found.';
            }
        }),
        DashboardNotFound: ce.create({
            name: "DashboardNotFound",
            parent: LavachartsError,
            construct: function (label) {
                this.message = '[Lavacharts] Dashboard with label "' + label + '" was not found.';
            }
        })
    };
    
    return errors;
})();
