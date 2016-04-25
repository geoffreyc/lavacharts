/* jshint undef: true, unused: true */
/* globals lava, google */

(function(){
    "use strict";

    var $chart = lava.createChart('<chartType>', '<chartLabel>');

    $chart.init = function() {
        $chart.package = '<chartPackage>';
        $chart.setElement('<elemId>');
        $chart.setPngOutput(<pngOutput>);

        $chart.configure = function () {

            $chart.render = function (data) {
                $chart.setData(<chartData>);

                $chart.options = <chartOptions>;

                $chart.chart = new <chartClass>($chart.element);

                <formats>
                <events>

                $chart.chart.draw($chart.data, $chart.options);

                if ($chart.pngOutput === true) {
                    $chart.drawPng();
                }

                lava.emit('rendered', $chart);
            };

            $chart.deferred.resolve();
            
            return $chart.deferred.promise;
            //google.charts.setOnLoadCallback($chart.render);
        };

        lava.emit('ready', $chart);
    };

    lava.store($chart);
})();
