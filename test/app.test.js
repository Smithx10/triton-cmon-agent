/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2017, Joyent, Inc.
 */

/* Test the Metric Agent app */
'use strict';

var test = require('tape').test;

var mod_bunyan = require('bunyan');
var mod_restify = require('restify');

var lib_app = require('../lib/app');

var log = mod_bunyan.createLogger({
    name: 'cmon-agent',
    serializers: mod_restify.bunyan.serializers
});

var DEFAULT_CONFIG = {
    logLevel: 'debug',
    port: 9090 /* 9090 chosen to not conflict with a running cmon-agent */
};

var DEFAULT_OPTS = { config: DEFAULT_CONFIG, log: log, ip: '127.0.0.1' };

test('create app succeeds', function _test(t) {
    var app;

    t.plan(10);

    t.doesNotThrow(function _createApp() {
        app = new lib_app(DEFAULT_OPTS);
    }, 'app created without error');
    t.ok(app, 'app');

    t.ok(app.config, 'app.config');
    t.deepEqual(app.config, DEFAULT_CONFIG, 'config matches');

    t.ok(app.ip, 'app.ip');
    t.deepEqual(app.ip, DEFAULT_OPTS.ip, 'ip matches');

    t.ok(app.log, 'app.log');
    t.deepEqual(app.log, log, 'log matches');

    t.ok(app.collector, 'app.collector');

    t.ok(app.server, 'app.server');

    t.end();
});

test('create app fails with bad or no opts', function _test(t) {
    var app;

    t.plan(11);

    t.throws(function _noOpts() {
        app = new lib_app();
    }, 'opts');
    t.throws(function _emptyOpts() {
        app = new lib_app({});
    }, 'opts.config');
    t.throws(function _noLogLevel() {
        app = new lib_app({ config: {} });
    }, 'opts.config.logLevel');
    t.throws(function _badLogLevel() {
        app = new lib_app({ config: { logLevel: 1 } });
    }, 'opts.config.logLevel');
    t.throws(function _noPort() {
        app = new lib_app({ config: { logLevel: 'DEBUG' } });
    }, 'opts.config.port');
    t.throws(function _badPort() {
        app = new lib_app({ config: { logLevel: 'DEBUG', port: 'abc' } });
    }, 'opts.config.port');
    t.throws(function _noLog() {
        app = new lib_app({ config: DEFAULT_CONFIG });
    }, 'opts.log');
    t.throws(function _badLog() {
        app = new lib_app({ config: DEFAULT_CONFIG, log: 'log' });
    }, 'opts.log');
    t.throws(function _noIp() {
        app = new lib_app({ config: DEFAULT_CONFIG, log: log });
    }, 'opts.ip');
    t.throws(function _badIp() {
        app = new lib_app({ config: DEFAULT_CONFIG, log: log, ip: 12345 });
    }, 'opts.ip');
    t.notOk(app, 'app was not created');

    t.end();
});

test('start and close app succeeds', function _test(t) {
    var app;

    t.plan(5);

    t.doesNotThrow(function _createApp() {
        app = new lib_app(DEFAULT_OPTS);
    }, 'app created without error');
    t.ok(app, 'app');

    t.doesNotThrow(function _startAndCloseApp() {
        app.start(function _start() {
            t.pass('start function called cb');
            app.close(function _close() {
                t.pass('close function called cb');
                t.end();
            });
        });

    }, 'app start and close called without error');
});
