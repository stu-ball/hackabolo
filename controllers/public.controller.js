require('dotenv').config();
var express = require('express');
var router = express.Router();

router.get('/health', healthCheck);

module.exports = router;

function healthCheck(req, res) {

    res.status(200).json({
        'ServerTime': Date(),
        'UpTime': process.uptime()
    });

}