/* jshint undef: true */
/* globals document, google, require, module */

/**
 * Chart module
 *
 * @class     Chart
 * @module    lava/Chart
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2015, KHill Designs
 * @license   MIT
 */
module.exports = (function() {
    "use strict";

    /**
     * Chart Class
     *
     * @constructor
     */
    function Chart (type, label) {
        this.type      = type;
        this.label     = label;
        this.element   = null;
        this.chart     = null;
        this.package   = null;
        this.data      = {};
        this.options   = {};
        this.formats   = [];
        this.draw      = function(){};
        this.init      = function(){};
        this.configure = function(){};
        this.render    = function(){};
        this.pngOutput = false;
        this._errors   = require('./Errors.js');
    }

    /**
     * Sets the data for the chart by creating a new DataTable
     *
     * @external "google.visualization.DataTable"
     * @see   {@link https://developers.google.com/chart/interactive/docs/reference#DataTable|DataTable Class}
     * @param {object}        data      Json representation of a DataTable
     * @param {Array.<Array>} data.cols Array of column definitions
     * @param {Array.<Array>} data.rows Array of row definitions
     */
    Chart.prototype.setData = function (data) {
        this.data = new google.visualization.DataTable(data);
    };

    /**
     * Sets the options for the chart.
     *
     * @param {object} options
     */
    Chart.prototype.setOptions = function (options) {
        this.options = options;
    };

    /**
     * Sets whether the chart is to be rendered as PNG or SVG
     *
     * @param {string|int} png
     */
    Chart.prototype.setPngOutput = function (png) {
        this.pngOutput = Boolean(typeof png == 'undefined' ? false : png);
    };

    /**
     * Set the ID of the output element for the Dashboard.
     *
     * @public
     * @param  {string} elemId
     * @throws ElementIdNotFound
     */
    Chart.prototype.setElement = function (elemId) {
        this.element = document.getElementById(elemId);

        if (! this.element) {
            throw new this._errors.ElementIdNotFound(elemId);
        }
    };

    /**
     * Redraws the chart.
     */
    Chart.prototype.redraw = function() {
        this.chart.draw(this.data, this.options);
    };

    /**
     * Draws the chart as a PNG instead of the standard SVG
     *
     * @external "chart.getImageURI"
     * @see   {@link https://developers.google.com/chart/interactive/docs/printing|Printing PNG Charts}
     */
    Chart.prototype.drawPng = function() {
        var img = document.createElement('img');
            img.src = this.chart.getImageURI();

        this.element.innerHTML = '';
        this.element.appendChild(img);
    };

    /**
     * Formats columns of the DataTable.
     *
     * @param {Array.<Object>} formatArr Array of format definitions
     */
    Chart.prototype.applyFormats = function (formatArr) {
        for(var a=0; a < formatArr.length; a++) {
            var formatJson = formatArr[a];
            var formatter = new google.visualization[formatJson.type](formatJson.config);

            formatter.format(this.data, formatJson.index);
        }
    };

    return Chart;
})();
