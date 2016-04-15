/* jshint undef: true */
/* globals document, google, require, module */

 (function() {
    "use strict";

    /**
     * Dashboard.js
     *
     * @constructor
     */
    var Dashboard = function (label) {
        this.label     = label;
        this.element   = null;
        this.render    = null;
        this.data      = null;
        this.bindings  = [];
        this.dashboard = null;
        this._errors   = require('./Errors.js');
    };

    Dashboard.prototype.setData = function (data) {
        this.data = new google.visualization.DataTable(data);
    };

    Dashboard.prototype.setElement = function (elemId) {
        this.element = document.getElementById(elemId);

        if (! this.element) {
            throw this._errors.ELEMENT_ID_NOT_FOUND(elemId);
        }
    };

     module.exports = Dashboard;
})();
