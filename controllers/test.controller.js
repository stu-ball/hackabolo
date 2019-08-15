require('dotenv').config();
var express = require('express');
var _ = require('lodash');
var userService = require('../services/user.service');

var router = express.Router();

router.post('/createUsers', createUsers);
router.delete('/rmUsers', deleteUsers);

module.exports = router;



function deleteUsers(req, res) {
    userService.deleteUsers()
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

function createUsers(req,res) {
    userService.createAdminUser() 
        .then(result => {
            res.sendStatus(201)
        })
        .catch(err => {
            res.status(400).json({
                'error': err,
                'status': 400
            });
        })
}