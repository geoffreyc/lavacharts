/* jshint undef: true, unused: true */
/* globals window, document, console, google, module, require */

/**
 * Lava.js
 *
 * Author:  Kevin Hill
 * Email:   kevinkhill@gmail.com
 * Github:  https://github.com/kevinkhill/lavacharts
 * License: MIT
 */
module.exports = (function() {
    "use strict";

    var EventEmitter = require('events');
    var util = require('util');
    var _ = require('underscore');


    var Lava = function() {
        EventEmitter.call(this);

        this.Q = require('q');

        this.urls = {
            jsapi: '//www.google.com/jsapi',
            gstatic: '//www.gstatic.com/charts/loader.js'
        };

        this._charts        = [];
        this._chartRegistry = [];
        this._dashboards    = [];
        this._packages      = [];
        this._readyCallback = _.noop();

        this._errors = require('./Errors.js');
    };

    util.inherits(Lava, EventEmitter);

    /**
     * LavaChart object.
     */
    Lava.prototype.Chart = require('./Chart.js');

    /**
     * Dashboard object.
     */
    Lava.prototype.Dashboard = require('./Dashboard.js');


    Lava.prototype.DataTable = function (data) {
        return new google.visualization.DataTable(data);
    };

    Lava.prototype.ready = function (callback) {
        if (typeof callback !== 'function') {
            throw this._errors.INVALID_CALLBACK(callback);
        } else {
            this._readyCallback = callback;
        }

        this.on('ready', this._readyCallback);
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
        return callback(event, chart);
    };

    /**
     * Adds a visualization package to the array for google to load.
     *
     * @param {string} pkg
     */
    Lava.prototype.registerPackage = function (pkg) {
        this._packages.push(pkg);
    };

    /**
     * Adds a chart init function to the array for lavachart to process.
     *
     * @param {function} initFunc
     */
    Lava.prototype.registerChart = function (initFunc) {
        this._chartRegistry.push(initFunc);
    };

    /**
     * Loads a new DataTable into the chart and redraws.
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

            if (typeof callback == 'function') {
                callback(chart);
            }
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
        this.getChart(label, function (chart) {
            chart.setOptions(json);

            chart.redraw();

            if (typeof callback == 'function') {
                callback(chart);
            }
        });
    };

    /**
     * Stores a chart within Lava.js
     *
     * @param chart Chart
     */
    Lava.prototype.storeChart = function (chart) {
        this._charts.push(chart);
    };

    /**
     * Stores a dashboard within Lava.js
     *
     * @param dashboard Chart
     */
    Lava.prototype.storeDashboard = function (dash) {
        this._dashboards.push(dash);
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
     */
    Lava.prototype.getChart = function (label, callback) {
        if (typeof label != 'string') {
            throw this._errors.INVALID_LABEL(label);
        }

        if (typeof callback != 'function') {
            throw this._errors.INVALID_CALLBACK(callback);
        }

        var chart = _.find(this._charts, _.matches({label: label}), this);

        if (!chart) {
            throw this._errors.CHART_NOT_FOUND(label);
        } else {
            callback(chart);
        }
    };

    /**
     * Get the charts array and pass into the callback
     *
     * @param callback function
     */
    Lava.prototype.getCharts = function (callback) {
        if (typeof callback != 'function') {
            throw this._errors.INVALID_CALLBACK(callback);
        }

        callback(this._charts);
    };

    /**
     * Redraws all of the registered charts on screen.
     *
     * This method is attached to the window resize event with a 300ms debounce
     * to make the charts responsive to the browser resizing.
     */
    Lava.prototype.redrawCharts = function () {
        _.debounce(function () {
            _.each(this._charts, function (chart) {
                chart.redraw();
            });
        }.bind(this), 300);
    };

    /**
     * Retrieve a Dashboard from Lava.js
     *
     * @param  {string}   label    Dashboard label.
     * @param  {Function} callback Callback function
     */
    Lava.prototype.getDashboard = function (label, callback) {
        if (typeof callback !== 'function') {
            throw this._errors.INVALID_CALLBACK(callback);
        }

        var dash = _.find(this._dashboards, _.matches({label: label}), this);

        if (!dash) {
            throw this._errors.DASHBOARD_NOT_FOUND(label);
        } else {
            callback(dash);
        }
    };

    /**
     * Load Google's jsapi and fire an event when ready.
     */
    Lava.prototype.loadGoogle = function() {
        var s = document.createElement('script');

        s.type = 'text/javascript';
        s.async = true;
        s.src = this.urls.gstatic;
        s.onload = s.onreadystatechange = function (event) {
            event = event || window.event;

            if (event.type === "load" || (/loaded|complete/.test(this.readyState))) {
                this.onload = this.onreadystatechange = null;

                this.emit('google:ready', window.google);
            }
        }.bind(this);

        document.head.appendChild(s);
    };

    /**
     * Initialize the Lava.js module
     */
    Lava.prototype.init = function () {
        var deferred = this.Q.defer();

        console.log('preinit:'+this._charts.length);
    /*
        _.each(this._chartRegistry, function (initFunc) {
            console.log('running chartInit');
            initFunc();
        });


    */

        //console.log(require('util').inspect(EventEmitter.listenerCount(this, 'init')));
        console.log(EventEmitter.listenerCount(this, 'init'));
        this.emit('init');
    console.log('postinit:'+this._charts.length);

    /*
        var initializedCount = 0;

        this.on('initialized', function () {
            initializedCount++;

            if (initializedCount == this._charts.length) {
                console.log('postinit:'+this._charts.length);
            }
        });
    */
        var renderedCount = 0;

        this.on('rendered', function () {
            renderedCount++;

            if (renderedCount == this._charts.length) {
                this.emit('ready');

                this._readyCallback();
            }
        });
        
        return deferred.promise;
    };

    /**
     * Run the Lava.js module
     */
    Lava.prototype.run = function () {
        var Q = require('q');

        this.loadGoogle();

        var promises = [];

        this.on('chart:ready', function (promise) {
           promises.push(promise);
        });

        Q.all(promises).then(function() {
            google.charts.load('current', {
                packages: this._packages
            });
        });

        //this.on('google:ready', function (google) {

        //});
    };

    return new Lava();
})();
