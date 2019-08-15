require('dotenv').config();
var express = require('express');
var _ = require('lodash');
var userService = require('../services/user.service');

var router = express.Router();

router.post('/', createUser);
router.delete('/:id', deleteUser);

module.exports = router;


function createUser(req, res, ) {
    var formData = {};
    try {
        formData = JSON.parse(req.body);
    } catch (ex) {
        formData = req.body;
    }

    var userCredentials = _.pick(formData, [
        'username',
        'password',
        'verifyPassword',
        'email',
        'mobile',
        'firstName',
        'lastName',
        'roles'
    ]);

    if (userCredentials.password != userCredentials.verifyPassword) {
        res.status(400).json({
            'error': 'Passwords do not match',
            'status': 400
        });
        return;
    }

    userService.localSignup(userCredentials)
        .then(results => {
            res.status(201).json(results);
        })
        .catch(err => {
            res.status(400).json({
                'error': err,
                'status': 400
            });
        });
}

function deleteUser(req, res) {
    userService.deleteUser(req.params.id)
        .then(result => {
            res.sendStatus(204)
        })
        .catch(err => {
            res.status(400).json({
                'error': err,
                'status': 400
            });
        })
}