/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2017, Joyent, Inc.
 */

var mod_assert = require('assert-plus');
var mod_jsprim = require('jsprim');

var kstat_common = require('../lib/kstat-common');

var ZONE_VFS_KSTATS = [
    {
        kstat_key: 'nread',
        key: 'vfs_bytes_read_count',
        type: 'counter',
        help: 'VFS number of bytes read'
    },
    {
        kstat_key: 'nwritten',
        key: 'vfs_bytes_written_count',
        type: 'counter',
        help: 'VFS number of bytes written'
    },
    {
        kstat_key: 'reads',
        key: 'vfs_read_operation_count',
        type: 'counter',
        help: 'VFS number of read operations'
    },
    {
        kstat_key: 'writes',
        key: 'vfs_write_operation_count',
        type: 'counter',
        help: 'VFS number of write operations'
    },
    {
        kstat_key: 'wtime',
        key: 'vfs_wait_time_count',
        type: 'counter',
        help: 'VFS cumulative wait (pre-service) time'
    },
    {
        kstat_key: 'wlentime',
        key: 'vfs_wait_length_time_count',
        type: 'counter',
        help: 'VFS cumulative wait length*time product'
    },
    {
        kstat_key: 'rtime',
        key: 'vfs_run_time_count',
        type: 'counter',
        help: 'VFS cumulative run (pre-service) time'
    },
    {
        kstat_key: 'wlentime',
        key: 'vfs_run_length_time_count',
        type: 'counter',
        help: 'VFS cumulative run length*time product'
    },
    {
        kstat_key: 'wcnt',
        key: 'vfs_elements_wait_state',
        type: 'gauge',
        help: 'VFS number of elements in wait state'
    },
    {
        kstat_key: 'rcnt',
        key: 'vfs_elements_run_state',
        type: 'gauge',
        help: 'VFS number of elements in run state'
    }
];
var ZONE_VFS_READ_OPTS = {
    'class': 'zone_vfs',
    module: 'zone_vfs',
    // we'll add instance below
};


function ZoneVfsMetricCollector(opts) {
    var self = this;

    mod_assert.object(opts, 'opts');
    mod_assert.object(opts.kstatReader, 'opts.kstatReader');

    self.kstatReader = opts.kstatReader;
}

ZoneVfsMetricCollector.prototype.getMetrics = function getMetrics(opts, callback) {
    var self = this;

    mod_assert.object(opts, 'opts');
    mod_assert.uuid(opts.vm_uuid, 'opts.vm_uuid');
    mod_assert.number(opts.vm_instance, 'opts.instance');
    mod_assert.func(callback, 'callback');

    var zoneVfsReadOpts = mod_jsprim.deepCopy(ZONE_VFS_READ_OPTS);

    zoneVfsReadOpts.instance = opts.vm_instance;

    kstat_common.kstatsToMetrics({
        kstatMap: ZONE_VFS_KSTATS,
        kstatReader: self.kstatReader,
        kstatReadOpts: zoneVfsReadOpts
    }, callback);
};

ZoneVfsMetricCollector.prototype.cacheTTL = function cacheTTL() {
    return (kstat_common.METRIC_TTL);
};

module.exports = ZoneVfsMetricCollector;
