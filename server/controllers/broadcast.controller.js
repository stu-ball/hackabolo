require('dotenv').config();
var express = require('express');
var _ = require('lodash');
var broadcastService = require('../services/broadcast.service');
var authenticationController = require('./authentication.controller');

var router = express.Router();

router.patch('*', authenticationController.decodeAuthToken);
router.post('*', authenticationController.decodeAuthToken);
router.delete('*', authenticationController.decodeAuthToken);

router.post('/', createBroadcast);
router.get('/', listBroadcasts);
router.patch('/:id/update', updateBroadcast);
router.patch('/:id/approve', approveBroadcast);
router.get('/:id', readBroadcast);
router.delete('/:id/delete', deleteBroadcast);
router.delete('/:id/disable', disableBroadcast);

module.exports = router;

function createBroadcast(req, res) {
    var form_data = req.body;
    form_data.creator = req.userId;
    form_data.updatedBy = req.userId;

    if (req.isBroadcastCreator || req.isBroadcastApprover || req.isAdmin) {
        broadcastService.create(form_data)
            .then(function (results) {
                console.log('Broadcast added');
                res.status(201).json(results);
            })
            .catch(function (err) {
                console.log(err.name + ': ' + err.message);
                res.status(400).json({
                    'error': err,
                    'status': 400
                });
            });
    } else {
        res.status(403).json({
            'error': 'insufficient privileges',
            'status': 403
        });
    }

}


function listBroadcasts(req, res) {

    if (Object.keys(req.query).length > 0) {
        broadcastService.search(req.query)
            .then(function (results) {
                if (Object.keys(results).length > 0) {
                    res.status(200).json(results);
                } else {
                    res.status(200).json(results);
                }
            })
            .catch(function (err) {
                console.log(err.name + ': ' + err.message);
                res.status(400).json({
                    'error': err,
                    'status': 400
                });
            });
    } else {
        broadcastService.list()
            .then(function (results) {
                if (Object.keys(results).length > 0) {
                    res.status(200).json(results);
                } else {
                    res.status(200).json(results);
                }
            })
            .catch(function (err) {
                console.log(err.name + ': ' + err.message);
                res.status(400).json({
                    'error': err,
                    'status': 400
                });
            });
    }

}

function readBroadcast(req, res) {
    var id = req.params.id;

    broadcastService.read(id)
        .then(function (results) {
            if (results) {
                res.status(200).json(results);
            } else {
                res.sendStatus(204);
            }
        })
        .catch(function (err) {
            console.log(err.name + ': ' + err.message);
            res.status(400).json({
                'error': err,
                'status': 400
            });
        });
}

function updateBroadcast(req, res) {
    var form_data = req.body;
    form_data.updatedBy = req.userId;
    var id = req.params.id;

    if (req.isBroadcastCreator || req.isBroadcastApprover || req.isAdmin) {
        broadcastService.update(id, form_data)
            .then(function (results) {
                res.status(200).json(results);
            })
            .catch(function (err) {
                console.log(err.name + ': ' + err.message);
                res.status(400).json({
                    'error': err,
                    'status': 400
                });
            });
    } else {
        res.status(403).json({
            'error': 'insufficient privileges',
            'status': 403
        });
    }

}

function approveBroadcast(req, res) {
    var id = req.params.id;
    if (req.isBroadcastApprover || req.isAdmin) {
        broadcastService.approve(id, req.userId)
            .then(function (results) {
                res.status(200).json(results);
            })
            .catch(function (err) {
                console.log(err.name + ': ' + err.message);
                res.status(400).json({
                    'error': err,
                    'status': 400
                });
            });
    } else {
        res.status(403).json({
            'error': 'insufficient privileges',
            'status': 403
        });
    }

}

function deleteBroadcast(req, res) {
    var id = req.params.id;

    if (req.isAdmin) {
        broadcastService.delete(id)
            .then(function (results) {
                res.status(204).json(results);
            })
            .catch(function (err) {
                console.log(err.name + ': ' + err.message);
                res.status(400).json({
                    'error': err,
                    'status': 400
                });
            });
    } else {
        res.status(403).json({
            'error': 'insufficient privileges',
            'status': 403
        });
    }

}

function disableBroadcast(req, res) {
    var id = req.params.id;

    if (req.isBroadcastApprover || req.isAdmin) {
        broadcastService.disable(id, req.userId)
            .then(function (results) {
                res.status(200).json(results);
            })
            .catch(function (err) {
                console.log(err.name + ': ' + err.message);
                res.status(400).json({
                    'error': err,
                    'status': 400
                });
            });
    } else {
        res.status(403).json({
            'error': 'insufficient privileges',
            'status': 403
        });
    }

}
