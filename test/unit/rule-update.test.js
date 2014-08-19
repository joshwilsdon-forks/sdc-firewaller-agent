/*
 * Copyright (c) 2014, Joyent, Inc. All rights reserved.
 *
 * update-rule task unit tests
 */

var h = require('./helpers');
var mod_rule = require('../lib/rule');
var mod_uuid = require('node-uuid');
var mod_vm = require('../lib/vm');
var util = require('util');



// --- Globals



var agent;



// --- Setup



exports.setup = function (t) {
    h.createAgent(t, true, function (err, a) {
        agent = a;
        return t.done();
    });
};



// --- Tests



exports['vmadm list error'] = function (t) {
    var errMsg = 'ENOENT: something';
    mod_vm.setListError(new Error(errMsg));
    var rule = h.rule({
        owner_uuid: mod_uuid.v4(),
        rule: 'FROM any TO all vms ALLOW udp PORT 5432'
    });

    mod_rule.update(t, rule, function (err) {
        t.ok(err, 'error returned');
        if (err) {
            t.equal(err.message, errMsg, 'error message');
        }

        return t.done();
    });
};



// --- Teardown



exports.teardown = function (t) {
    h.teardown(t);
};
