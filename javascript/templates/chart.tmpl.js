/* jshint undef: true, unused: true */
/* globals lava, google */

(function(){
    "use strict";

    var chart = new lava.Chart('<chartType>', '<chartLabel>');

    chart.init = function() {
        chart.package = '<chartPackage>';
        chart.setElement('<elemId>');
        chart.setPngOutput(<pngOutput>);

        chart.configure = function (google) {
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

                lava.emit('chart:rendered', this);
            }.apply(chart);

            google.charts.setOnLoadCallback(chart.render);
        };

        lava.emit('chart:ready');
    };

    lava.storeChart(chart);
})();
