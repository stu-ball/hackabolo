require('dotenv').config();
var express = require('express');
var _ = require('lodash');
var userService = require('../services/user.service');
var router = express.Router();

router.get('*', decodeAuthToken);
router.patch('*', decodeAuthToken);
router.delete('*', decodeAuthToken);

router.post('/login', login);
router.post('/signup', signup);

router.decodeAuthToken = decodeAuthToken;

module.exports = router;

/**
 * 
 * This function decodes the id_token and sets user permissions
 * 
 */
async function decodeAuthToken(req, res, next) {
    var userObject = {};
    req.userGroups = [];
    req.managerGroups = [];

    try {
        userObject = await userService.decodeToken(req.headers['authorization']);
        req.userId = userObject.id;
        req.userObject = userObject;
        if (userObject.isAdmin) req.isAdmin = true;
        if (userObject.isBroadcastCreator) req.isBroadcastCreator = true;
        if (userObject.isBoloApprover) req.isBoloApprover = true;
        if (userObject.isBroadcastApprover) req.isBroadcastApprover = true;
    } catch (err) {
        res.status(400).json({
            'error': err,
            'status': 400
        });
        return;
    }

    next();
}

async function login(req, res) {
    var formData = {};

    try {
        formData = JSON.parse(req.body);
    } catch (ex) {
        formData = req.body;
    }

    var userCredentials = _.pick(formData, ['username', 'password']);
    if (userCredentials.username == '' || userCredentials.password == '') {
        res.status(401).json({
            'error': 'invalid username or password',
            'status': 401
        });
    }

    userService.localLogin(userCredentials)
        .then(async function (results) {
            if (typeof results.roles == 'undefined' || results.roles.length == 0) results.roles.push('user');
            //const token = jwt.sign(payload, process.env.OAUTH_CLIENT_SECRET);
            const tokenResults = await userService.createUserToken(results);
            const authResponse = {
                id_token: tokenResults.token,
                expires_in: tokenResults.expiresIn,
                token_type: 'Bearer',
                user: tokenResults.payload
            };
            res.status(200).json(authResponse);
        })
        .catch(function (err) {
            res.status(401).json({
                'error': err,
                'status': 401
            });
        });

}