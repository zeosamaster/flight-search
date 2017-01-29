'use strict';

var express = require('express');
var controller = require('./airport.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.post('/reseed', auth.hasRole('admin'), controller.reseed);

module.exports = router;
