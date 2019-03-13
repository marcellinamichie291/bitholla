const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validation = require('./validation');

router.post('/users', validation.validateUsers, userController.create);
router.post('/users/signin', userController.signin);
router.get('/users/signout', userController.signout);
router.get('/users/download', userController.download);
router.get('/users/download/binance', userController.downloadBinance);
router.get('/users/download/bitmex', userController.downloadBitmex);
router.get('/users/download/bitstamp', userController.downloadBitstamp);

module.exports = router;