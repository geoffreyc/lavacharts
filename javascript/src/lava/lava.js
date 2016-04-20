/* jshint undef: true, unused: true */
/* globals window, document, console, google, module, require */

/**
 * Lava module
 *
 * @module    lava/Lava
 * @author    Kevin Hill <kevinkhill@gmail.com>
 * @copyright (c) 2015, KHill Designs
 * @license   MIT
 */
module.exports = (function() {
    "use strict";

    var Q = require('q');
    var _ = require('lodash');
    var util = require('util');
    var EventEmitter = require('events');

    function Lava() {
        /**
         * Defining the Chart class within the module.
         *
         * @type {Chart}
         */
        this.Chart = require('./Chart.js');

        /**
         * Defining the Dashboard class within the module.
         *
         * @type {Dashboard}
         */
        this.Dashboard = require('./Dashboard.js');

        /**
         * Setting the debug flag
         *
         * @type {boolean}
         */
        this._debug = false;

        /**
         * Urls to Google's resources
         *
         * @type {{jsapi: string, gstatic: string}}
         */
        this.urls = {
            jsapi:   '//www.google.com/jsapi',
            gstatic: '//www.gstatic.com/charts/loader.js'
        };

        /**
         * Array of charts stored in the module.
         *
         * @type {Array.<Chart>}
         * @private
         */
        this._charts = [];

        /**
         * Array of dashboards stored in the module.
         *
         * @type {Array.<Dashboard>}
         * @private
         */
        this._dashboards = [];

        /**
         * Ready callback to be called when the module is finished running.
         *
         * @type {function}
         * @private
         */
        this._readyCallback = _.noop();

        /**
         * Error definitions for the module.
         */
        this._errors = require('./Errors.js');

        /**
         * Conditional debug logging method.
         *
         * @param {string} Message to log.
         */
        this._log = function (msg) {
            if (lava._debug) {
                console.log(msg);
            }
        };

        this._defer = function() {
            return Q.defer();
        };

        EventEmitter.call(this);
    }

    util.inherits(Lava, EventEmitter);

    /**
     * Create a new Chart.
     *
     * @param  {string} type Type of chart to create
     * @param  {string} type Label for the chart
     * @return {Chart}
     */
    Lava.prototype.createChart = function (type, label) {
        return new this.Chart(type, label);
    };

    /**
     * Create a new Dashboard.
     *
     * @param  {string} type Label for the chart
     * @return {Dashboard}
     */
    Lava.prototype.createDashboard = function () {
        return new this.Dashboard(label);
    };

    /**
     * Assigns a callback for when the charts are ready to be interacted with.
     *
     * This is used to wrap calls to lava.loadData() or lava.loadOptions()
     * to protect against accessing charts that aren't loaded yet
     *
     * @param {function} callback
     */
    Lava.prototype.ready = function (callback) {
        if (typeof callback !== 'function') {
            throw new this._errors.InvalidCallback(callback);
        }

        this._readyCallback = callback;
    };

    /**
     * Event wrapper for chart events.
     *
     *
     * Used internally when events are applied so the user event function has
     * access to the chart within the event callback.
     *
     * @param {object} event
     * @param {object} chart
     * @param {function} callback
     * @return {function}
     */
    Lava.prototype.event = function (event, chart, callback) {
        if (typeof callback !== 'function') {
            throw new this._errors.InvalidCallback(callback);
        }

        return callback(event, chart);
    };

    /**
     * Loads new data into the chart and redraws.
     *
     *
     * Used with an AJAX call to a PHP method returning DataTable->toJson(),
     * a chart can be dynamically update in page, without reloads.
     *
     * @param {string} label
     * @param {string} json
     * @param {function} callback
     */
    Lava.prototype.loadData = function (label, json, callback) {
        var callback = typeof callback !== 'undefined' ? callback : _.noop();

        if (typeof callback !== 'function') {
            throw new this._errors.InvalidCallback(callback);
        }

        this.getChart(label, function (chart) {
            if (typeof json.data != 'undefined') {
                chart.setData(json.data);
            } else {
                chart.setData(json);
            }

            if (typeof json.formats != 'undefined') {
                chart.applyFormats(json.formats);
            }

            chart.redraw();

            callback(chart);
        });
    };

    /**
     * Loads new options into a chart and redraws.
     *
     *
     * Used with an AJAX call, or javascript events, to load a new array of options into a chart.
     * This can be used to update a chart dynamically, without reloads.
     *
     * @param {string} label
     * @param {string} json
     * @param {function} callback
     */
    Lava.prototype.loadOptions = function (label, json, callback) {
        var callback = typeof callback !== 'undefined' ? callback : _.noop();

        if (typeof callback !== 'function') {
            throw new this._errors.InvalidCallback(callback);
        }

        this.getChart(label, function (chart) {
            chart.setOptions(json);

            chart.redraw();

            callback(chart);
        });
    };

    /**
     * Redraws all of the registered charts on screen.
     *
     * This method is attached to the window resize event with a 300ms debounce
     * to make the charts responsive to the browser resizing.
     */
    Lava.prototype.redrawCharts = function () {
        _.debounce(function () {
            _.forEach(this._charts, function (chart) {
                chart.redraw();
            });
        }.bind(this), 300);
    };

    /**
     * Stores a chart within the module.
     *
     * @param {Chart} chart
     */
    Lava.prototype.storeChart = function (chart) {
        this._charts.push(chart);
    };

    /**
     * Returns the LavaChart javascript objects
     *
     *
     * The LavaChart object holds all the user defined properties such as data, options, formats,
     * the GoogleChart object, and relative methods for internal use.
     *
     * The GoogleChart object is available as ".chart" from the returned LavaChart.
     * It can be used to access any of the available methods such as
     * getImageURI() or getChartLayoutInterface().
     * See https://google-developers.appspot.com/chart/interactive/docs/gallery/linechart#methods
     * for some examples relative to LineCharts.
     *
     * @param  {string}   label
     * @param  {function} callback
     * @throws InvalidLabel
     * @throws InvalidCallback
     * @throws ChartNotFound
     */
    Lava.prototype.getChart = function (label, callback) {
        if (typeof label != 'string') {
            throw new this._errors.InvalidLabel(label);
        }

        if (typeof callback != 'function') {
            throw new this._errors.InvalidCallback(callback);
        }

        var chart = _.find(this._charts, {label: label});

        if (!chart) {
            throw new this._errors.ChartNotFound(label);
        }

        callback(chart);
    };

    /**
     * Stores a dashboard within the module.
     *
     * @param {Dashboard} dash
     */
    Lava.prototype.storeDashboard = function (dash) {
        this._dashboards.push(dash);
    };

    /**
     * Retrieve a Dashboard from Lava.js
     *
     * @param  {string}   label    Dashboard label.
     * @param  {Function} callback Callback function
     * @throws InvalidLabel
     * @throws InvalidCallback
     * @throws DashboardNotFound
     */
    Lava.prototype.getDashboard = function (label, callback) {
        if (typeof label != 'string') {
            throw new this._errors.InvalidLabel(label);
        }

        if (typeof callback !== 'function') {
            throw new this._errors.InvalidCallback(callback);
        }

        var dash = _.find(this._dashboards, {label: label});

        if (dash instanceof lava.Dashboard === false) {
            throw new this._errors.DashboardNotFound(label);
        }

        callback(dash);
    };

    /**
     * Load Google's jsapi and fire an event when ready.
     */
    Lava.prototype.loadGoogle = function () {
        var s = document.createElement('script');
        var deferred = this._defer();

        s.type = 'text/javascript';
        s.async = true;
        s.src = this.urls.gstatic;
        s.onload = s.onreadystatechange = _.bind(function (event) {
            event = event || window.event;

            if (event.type === "load" || (/loaded|complete/.test(this.readyState))) {
                this.onload = this.onreadystatechange = null;

                lava._log('google loaded');

                google.charts.load('current', {
                    packages: _.uniq(_.map(this._charts, 'package'))
                });

                google.charts.setOnLoadCallback(deferred.resolve);
            }
        }, this);

        document.head.appendChild(s);

        return deferred.promise;
    };

    /**
     * Initialize the Lava.js module
     */
    Lava.prototype.init = function () {
        this._log('lava.js initializing');

        /**
         * Listen for the charts to initialize
         * then begin loading google
         */
        var readyCount = 0;
        this.on('chart:ready', function () {
            readyCount++;

            if (readyCount == this._charts.length) {
                lava._log('loading google');

                this.loadGoogle()
                    .then(_.bind(function() {
                        _.forEach(this._charts, function (chart) {
                            lava._log('configuring '+chart.type+'::'+chart.label);

                            chart.configure(google);
                        });
                    }, this));
            }
        });

        /**
         * Listen for the charts to finish rendering
         * then fire the ready event
         */
        var renderCount = 0;
        this.on('chart:rendered', function (chart) {
            lava._log('rendered '+chart.type+'::'+chart.label);

            renderCount++;

            if (renderCount == this._charts.length) {
                lava._log('running ready callback');

                this._readyCallback();
            }
        });

        /**
         * Initialize the charts
         */
        _.forEach(this._charts, function (chart) {
            lava._log('initializing '+chart.type+'::'+chart.label);

            chart.init();
        });
    };

    return new Lava();
})();
