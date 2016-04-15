/* jshint undef: true */
/* globals document, google, require, module */

(function() {
    "use strict";

    /**
     * Chart.js
     *
     * @constructor
     */
    var Chart = function (type, label) {
        this.type      = type;
        this.label     = label;
        this.package   = null;
        this.element   = null;
        this.data      = null;
        this.chart     = null;
        this.options   = null;
        this.formats   = [];
        this.draw      = null;
        this.render    = null;
        this.pngOutput = false;
        this._errors   = require('./Errors.js');
    };

    Chart.prototype.setData = function (data) {
        this.data = new google.visualization.DataTable(data);
    };

    Chart.prototype.setOptions = function (options) {
        this.options = options;
    };

    Chart.prototype.setPngOutput = function (png) {
        this.pngOutput = Boolean(typeof png == 'undefined' ? false : png);
    };

    Chart.prototype.setElement = function (elemId) {
        this.element = document.getElementById(elemId);

        if (! this.element) {
            throw this._errors.ELEMENT_ID_NOT_FOUND(elemId);
        }
    };

    Chart.prototype.redraw = function() {
        this.chart.draw(this.data, this.options);
    };

    Chart.prototype.drawPng = function() {
        var img = document.createElement('img');
            img.src = this.chart.getImageURI();

        this.element.innerHTML = '';
        this.element.appendChild(img);
    };

    Chart.prototype.applyFormats = function (formatArr) {
        for(var a=0; a < formatArr.length; a++) {
            var formatJson = formatArr[a];
            var formatter = new google.visualization[formatJson.type](formatJson.config);

            formatter.format(this.data, formatJson.index);
        }
    };

    module.exports = Chart;
})();
