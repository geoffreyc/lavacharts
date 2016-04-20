/* jshint undef: true, unused: true */
/* globals sinon, jasmine, describe, it, expect, beforeEach */

function mock (name) {
    return jasmine.createSpy(name);
}

function nope() {
    return 'nope';
}

function getTestChart() {
    return new lava.Chart('LineChart', 'TestChart');
}

describe('lava#EventEmitter', function () {
    it('Should emit and listen to events', function () {
        lava.on('test', function (val) {
            expect(val).toBe('taco');
        });

        lava.emit('test', 'taco');
    })
});

describe('lava#ready()', function () {
    it('Should accept a function to use as a callback.', function () {
        lava.ready(nope);

        expect(lava._readyCallback()).toBe('nope');
    });

    it('Should throw an "InvalidCallback" error if passed a non-function.', function () {
        expect(function () {
            lava.ready('marbles')
        }).toThrowError(lava._errors.InvalidCallback);
    });
});

describe('lava#event()', function () {
    var Event, Chart;

    beforeEach(function () {
        Event = mock('Event');
        Chart = mock('Chart');
    });

    it('Should accept an event, chart and callback and return said callback with event and chart as args.', function () {
        function callback (event, chart) {
            expect(event.and.identity()).toEqual('Event');
            expect(chart.and.identity()).toEqual('Chart');
        };

        var lavaEvent = function () {
            return lava.event(Event, Chart, callback);
        };

        lavaEvent(Event, Chart);
    });

    it('Should throw an "InvalidCallback" error if passed a non-function for the last param.', function () {
        expect(function () {
            lava.event('marbles');
        }).toThrowError(lava._errors.InvalidCallback);
    });
});

describe('lava#storeChart()', function () {
    beforeEach(function () {
        lava._charts = [];
    });

    it('Should store a chart in the "lava._charts" array.', function () {
        lava.storeChart(getTestChart());

        expect(lava._charts[0] instanceof lava.Chart).toBe(true);
    })
});

describe('lava#getChart()', function () {
    beforeEach(function () {
        lava._charts = [];
        lava._charts.push(getTestChart());
    });

    describe('When given a valid chart label.', function () {
        it('Should return a valid chart to the callback.', function () {
            lava.getChart('TestChart', function (chart) {
                expect(chart instanceof lava.Chart).toBe(true);
            });
        });
    });

    it('Should throw a "ChartNotFound" error if the chart is not found.', function () {
        expect(function () {
            lava.getChart('Bee Population', nope);
        }).toThrowError(lava._errors.ChartNotFound);
    });

    it('Should throw an "InvalidLabel" error if a string chart label is not given.', function () {
        expect(function () {
            lava.getChart(1234, nope);
        }).toThrowError(lava._errors.InvalidLabel);
    });

    it('Should throw an "InvalidCallback" error if a function callback is not given.', function () {
        expect(function () {
            lava.getChart('TestChart', {});
        }).toThrowError(lava._errors.InvalidCallback);
    });
});

describe('lava#loadData()', function () {
    var Chart;
    var data = {d1:100,d2:200};

    beforeEach(function () {
        Chart = getTestChart();
        stub = sinon.stub(Chart, 'setData').withArgs(data);

        lava._charts = [];
        lava._charts.push(Chart);
    });

    it('Should load the json data into the chart.', function () {
        lava.loadData('TestChart', {d1:100,d2:200}, function (chart) {
            Chart.setData.verify();
            //expect(chart.data.d1).toEqual(100);
            //expect(chart.data.d2).toEqual(200);
        });
    });
});
