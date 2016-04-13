lava.on('init', function() {
    lava.registerPackage('<chartPackage>');
});

lava.on('google:ready', function (google) {
    var chart = new lava.Chart('<chartType>', '<chartLabel>');

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

    lava.storeChart(chart);

    var deferred = Q.defer();

    deferred.resolve(function() {
        window.google.charts.setOnLoadCallback(chart.render);
    });

    lava.emit('chart:ready', deferred.promise);
});
