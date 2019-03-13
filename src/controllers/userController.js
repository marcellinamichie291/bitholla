const userQueries = require('../db/queries.user.js');
const pricesQueries = require('../db/queries.prices.js');
const passport = require('passport');
const Prices = require('../db/models').Prices;
const Json2csvParser = require('json2csv').Parser;
const fields = ['exchange', 'UTC time', 'price', 'timestamp'];

module.exports = {
    create(req, res, next) {

        // parse new user information
        let newUser = {
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        }

        // create new user and sign in
        userQueries.createUser(newUser, (err, user) => {
            if (err) {
                req.flash('error', err);
                res.redirect('/');
            } else {
                passport.authenticate('local')(req, res, () => {
                    pricesQueries.connect(req.user);
                    req.flash('notice', 'You\'ve successfully signed in!');
                    res.redirect('/');
                })
            }
        })
    },

    signin(req, res, next) {

        // look for user info and sign in if found and authenticated
        passport.authenticate('local')(req, res, function() {
            if(!req.user) {
                req.flash('notice', 'Sign in failed. Please try again.');
                res.redirect('/');
            } else {
                pricesQueries.connect(req.user);
                req.flash('notice', 'You\'ve successfully signed in!');
                res.redirect('/');
            }
        })
    },

    signout(req, res, next) {

        // disconnect all websockets
        pricesQueries.disconnect();

        // clear database of prices that were recorded when user was signed in
        Prices.destroy({
            where: {
                userId: req.user.id
            }
        })
        .then(() => {

            // logout user
            req.logout();
            req.flash('notice', 'You\'ve successfully signed out!');
            res.redirect('/');
        })
    },

    download(req, res, next) {

        // find prices where userId is the current user's id
        Prices.findAll({
            where: {
                userId: req.user.id
            }
        })
        .then((prices) => {

            // create new csv file with appropriate fields
            const json2csvParser = new Json2csvParser({ fields });
            let priceData = [];

            // iterate through prices from database and push to priceData array
            prices.forEach((price) => {
                priceData.push({
                    'exchange': price.exchange,
                    'UTC time': price.utc,
                    'price': price.price,
                    'timestamp': price.timestamp
                })
            })

            // parse priceData to csv file and send as price.csv for download
            const csv = json2csvParser.parse(priceData);
            res.setHeader('Content-disposition', 'attachment; filename=price.csv');
            res.set('Content-Type', 'text/csv');
            res.status(200).send(csv);
        })
    },

    downloadBinance(req, res, next) {

        // find prices where userId is the current user's id and exchange is binance
        Prices.findAll({
            where: {
                userId: req.user.id,
                exchange: 'Binance'
            }
        })
        .then((prices) => {

            // create new csv file with appropriate fields
            const json2csvParser = new Json2csvParser({ fields });
            let priceData = [];

            // iterate through prices from database and push to priceData array
            prices.forEach((price) => {
                priceData.push({
                    'exchange': price.exchange,
                    'UTC time': price.utc,
                    'price': price.price,
                    'timestamp': price.timestamp
                })
            })

            // parse priceData to csv file and send as binance-price.csv for download
            const csv = json2csvParser.parse(priceData);
            res.setHeader('Content-disposition', 'attachment; filename=binance-price.csv');
            res.set('Content-Type', 'text/csv');
            res.status(200).send(csv);
        })
    },

    downloadBitmex(req, res, next) {

        // find prices where userId is the current user's id and exchange is bitMEX
        Prices.findAll({
            where: {
                userId: req.user.id,
                exchange: 'BitMEX'
            }
        })
        .then((prices) => {

            // create new csv file with appropriate fields
            const json2csvParser = new Json2csvParser({ fields });
            let priceData = [];

            // iterate through prices from database and push to priceData array
            prices.forEach((price) => {
                priceData.push({
                    'exchange': price.exchange,
                    'UTC time': price.utc,
                    'price': price.price,
                    'timestamp': price.timestamp
                })
            })

            // parse priceData to csv file and send as bitmex-price.csv for download
            const csv = json2csvParser.parse(priceData);
            res.setHeader('Content-disposition', 'attachment; filename=bitmex-price.csv');
            res.set('Content-Type', 'text/csv');
            res.status(200).send(csv);
        })
    },

    downloadBitstamp(req, res, next) {

        // find prices where userId is the current user's id and exchange is bitstamp
        Prices.findAll({
            where: {
                userId: req.user.id,
                exchange: 'Bitstamp'
            }
        })
        .then((prices) => {

            // create new csv file with appropriate fields
            const json2csvParser = new Json2csvParser({ fields });
            let priceData = [];

            // iterate through prices from database and push to priceData array
            prices.forEach((price) => {
                priceData.push({
                    'exchange': price.exchange,
                    'UTC time': price.utc,
                    'price': price.price,
                    'timestamp': price.timestamp
                })
            })

            // parse priceData to csv file and send as bitstamp-price.csv for download
            const csv = json2csvParser.parse(priceData);
            res.setHeader('Content-disposition', 'attachment; filename=bitstamp-price.csv');
            res.set('Content-Type', 'text/csv');
            res.status(200).send(csv);
        })
    }
}