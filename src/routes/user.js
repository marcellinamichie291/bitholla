const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validation = require('./validation');

router.post('/users', validation.validateUsers, userController.create);
router.post('/users/signin', userController.signin);
router.get('/users/signout', userController.signout);

module.exports = router;