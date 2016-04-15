/* jshint undef: true, unused: true */
/* globals lava */

(function(){
    "use strict";
    
    var chart = new lava.Chart('<chartType>', '<chartLabel>');
    chart.package = '<chartPackage>';

    lava.storeChart(chart);

    lava.on('init', function() {
        //lava.registerPackage('<chartPackage>');
    console.log('init:<chartLabel>')

        lava.on('google:ready', function (google) {
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

                    lava.emit('rendered');
                }.apply(chart);

                //lava.storeChart(chart);

                var deferred = Q.defer();

                deferred.resolve(function() {
                    window.google.charts.setOnLoadCallback(chart.render);
                });

                lava.emit('chart:ready', deferred.promise);
            });
        });
    });
})();
