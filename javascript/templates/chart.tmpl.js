/* jshint undef: true, unused: true */
/* globals lava */

(function(){
    "use strict";

    lava.registerPackage('<chartPackage>');

    var chart = new lava.Chart('<chartType>', '<chartLabel>');

    chart.init = function() {
        console.log('initializing: <chartLabel>');

        //lava.on('google:ready', function (google) {
        chart.configure = function (google) {
            console.log('caught google:ready');
            lava.getChart('<chartLabel>', function (chart) {
                chart.setElement('<elemId>');
                chart.setPngOutput(<pngOutput>);

                chart.render = function (data) {
                    this.setData(<chartData>);

                    this.options = <chartOptions>;

                    this.chart = new <chartClass>(this.element);

                    <formats>
                    <events>

                    this.chart.draw(this.data, this.options);

                    if (this.pngOutput === true) {
                        this.drawPng();
                    }

                    lava.emit('chart:rendered');
                }.apply(chart);

                google.charts.setOnLoadCallback(chart.render);
            });
        };

        lava.emit('chart:ready');
    };

    lava.storeChart(chart);
})();
