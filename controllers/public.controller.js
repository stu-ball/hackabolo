require('dotenv').config();
var express = require('express');
var router = express.Router();
var broadcastService = require('../services/broadcast.service');

router.get('/health', healthCheck);
router.get('/broadcasts', listBroadcasts);
router.get('/broadcasts/:id', readBroadcast);

module.exports = router;

function healthCheck(req, res) {

    res.status(200).json({
        'ServerTime': Date(),
        'UpTime': process.uptime(),
        'Message': 'This is a restricted access computer system'
    });

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
        broadcastService.listApproved()
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

    broadcastService.readApproved(id)
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