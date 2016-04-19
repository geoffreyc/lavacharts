/* jshint undef: true, unused: true */
/* globals describe, it, expect, beforeEach */

function Nope() {
    return 'Nope';
}

function getTestChart() {
    return new lava.Chart('LineChart', 'TestChart');
}

describe('lava.js core functions', function () {

    describe('lava events', function () {
        it('Should emit and listen to events', function () {
            lava.on('test', function (val) {
                expect(val).toBe('taco');
            });

            lava.emit('test', 'taco');
        })
    });

    describe('lava.ready()', function () {
        it('Should accept a function to use as a callback', function () {
            lava.ready(Nope);

            expect(lava._readyCallback()).toBe('Nope');
        });

        it('Should throw an "InvalidCallback" error if not a function', function () {
            expect(function () {
                lava.ready('marbles')
            }).toThrowError(lava._errors.InvalidCallback);
        });
    });

    describe('lava.storeChart()', function () {
        beforeEach(function () {
            lava._charts = [];
        });

        it('Should store a chart in the "lava._charts" array', function () {
            lava.storeChart(getTestChart());

            expect(lava._charts[0] instanceof lava.Chart).toBe(true);
        })
    });

    describe('lava.getChart()', function () {

        beforeEach(function () {
            lava._charts = [];
            lava._charts.push(getTestChart());
        });

        it('Should return a valid chart to the callback.', function () {
            lava.getChart('TestChart', function (chart) {
                expect(chart instanceof lava.Chart).toBe(true);
            });
        });

        it('Should throw a "ChartNotFound" error if the chart is not found.', function () {
            expect(function () {
                lava.getChart('Bee Population', Nope);
            }).toThrowError(lava._errors.ChartNotFound);
        });

        it('Should throw an "InvalidLabel" error if a string chart label is not given.', function () {
            expect(function () {
                lava.getChart(1234, Nope);
            }).toThrowError(lava._errors.InvalidLabel);
        });

        it('Should throw an "InvalidCallback" error if a function callback is not given.', function () {
            expect(function () {
                lava.getChart('TestChart', {});
            }).toThrowError(lava._errors.InvalidCallback);
        });

    }); //lava.getChart()

    /*
     describe('lava.loadData()', function () {

     beforeEach(function () {
     lava.charts = {
     "LineChart" : {
     "TestChart" : new lava.Chart()
     }
     };
     });

     it('Should load the json data into the chart.', function () {
     lava.loadData('TestChart', {d1:100,d2:200}, function (chart) {
     expect(chart.data.d1).toEqual(100);
     expect(chart.data.d2).toEqual(200);
     });
     });

     }); //lava.loadData()
     */
}); //lava.js core
