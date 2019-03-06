const express = require('express');
const app = express();
const appConfig = require('./config/main-config.js');

appConfig.init();

module.exports = app;