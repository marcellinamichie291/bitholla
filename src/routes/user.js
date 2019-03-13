const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validation = require('./validation');
const auth = require('../auth/helpers')

router.post('/users', validation.validateUsers, userController.create);
router.post('/users/signin', userController.signin);
router.get('/users/signout', auth.ensureAuthenticated ,userController.signout);
router.get('/users/download', auth.ensureAuthenticated, userController.download);
router.get('/users/download/binance', auth.ensureAuthenticated, userController.downloadBinance);
router.get('/users/download/bitmex', auth.ensureAuthenticated, userController.downloadBitmex);
router.get('/users/download/bitstamp', auth.ensureAuthenticated , userController.downloadBitstamp);

module.exports = router;