module.exports = function (config) {
    config.set({
        basePath: 'javascript',
        frameworks: ['jasmine','sinon'],
        files: [
            'dist/lava.js',
            'tests/lava.spec.js'
        ],
        singleRun: false,
        reporters: ['dots'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_ERROR,
        autoWatch: false,
        browsers: [(process.env.TRAVIS ? 'PhantomJS' : 'Chrome')]
    });
};
