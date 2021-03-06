/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2014, Joyent, Inc.
 */

/*
 * Endpoints for inspecting rules
 */

'use strict';

var fw = require('../fw');
var restify = require('restify');



/**
 * GET /rules/:uuid
 */
function getRule(req, res, next) {
    var opts = {
        log: req.log,
        payload: {
            uuid: req.params.uuid
        }
    };

    fw.get(opts, function (err, rule) {
        if (err) {
            if (err.code === 'ENOENT') {
                return next(new restify.ResourceNotFoundError(
                    'rule not found'));
            }

            return next(err);
        }

        res.send(200, rule);
        return next();
    });
}


/**
 * PUT /rules/:uuid
 */
function putRule(req, res, next) {
    var opts = {
        req_id: req.getId(),
        value: req.params
    };

    req.app.updateRule(opts, function (err, rule) {
        if (err) {
            return next(err);
        }

        res.send(200, rule);
        return next();
    });
}


/**
 * Register all endpoints with the restify server
 */
function register(http, before) {
    http.get(
        { path: '/rules/:uuid', name: 'getRule' }, before, getRule);

    http.put(
        { path: '/rules/:uuid', name: 'putRule' }, before, putRule);
}



module.exports = {
    register: register
};
