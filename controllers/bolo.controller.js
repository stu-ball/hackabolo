require('dotenv').config();
var express = require('express');
var _ = require('lodash');
var BoloService = require('../services/bolo.service');
var authenticationController = require('./authentication.controller');

var router = express.Router();

router.patch('*', authenticationController.decodeAuthToken);
router.post('*', authenticationController.decodeAuthToken);
router.delete('*', authenticationController.decodeAuthToken);

router.post('/', createBolo);
router.get('/', listBolos);
router.patch('/:id/update', updateBolo);
router.patch('/:id/approve', approveBolo);
router.get('/:id', readBolo);
router.delete('/:id/delete', deleteBolo);
router.delete('/:id/disable', disableBolo);

module.exports = router;

function createBolo(req, res) {
    var form_data = req.body;
    form_data.creator = req.userId;
    form_data.updatedBy = req.userId;

    if (req.isBoloCreator || req.isBoloApprover || req.isAdmin) {

        BoloService.create(form_data)
            .then(function (results) {
                console.log('Bolo added');
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


function listBolos(req, res) {

    if (Object.keys(req.query).length > 0) {
        BoloService.search(req.query)
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
        BoloService.list()
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

function readBolo(req, res) {
    var id = req.params.id;

    BoloService.read(id)
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

function updateBolo(req, res) {
    var form_data = req.body;
    form_data.updatedBy = req.userId;
    var id = req.params.id;

    if (req.isBoloCreator || req.isBoloApprover || req.isAdmin) {
        BoloService.update(id, form_data)
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

function approveBolo(req, res) {
    var id = req.params.id;
    if (req.isBoloApprover || req.isAdmin) {
        BoloService.approve(id, req.userId)
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

function deleteBolo(req, res) {
    var id = req.params.id;

    if (req.isAdmin) {
        BoloService.delete(id)
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

function disableBolo(req, res) {
    var id = req.params.id;

    if (req.isBoloApprover || req.isAdmin) {
        BoloService.disable(id, req.userId)
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
