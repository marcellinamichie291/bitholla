const userQueries = require('../db/queries.user.js');
const pricesQueries = require('../db/queries.prices.js');
const passport = require('passport');
const Prices = require('../db/models').Prices;
const Json2csvParser = require('json2csv').Parser;
const fields = ['exchange', 'UTC time', 'price', 'timestamp'];

module.exports = {
    create(req, res, next) {
        let newUser = {
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        }

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
        pricesQueries.disconnect();
        req.logout();
        req.flash('notice', 'You\'ve successfully signed out!');
        res.redirect('/');
    },

    download(req, res, next) {
        Prices.findAll({
            where: {
                userId: req.user.id
            }
        })
        .then((prices) => {
            const json2csvParser = new Json2csvParser({ fields });
            let priceData = [];
            prices.forEach((price) => {
                priceData.push({
                    'exchange': price.exchange,
                    'UTC time': price.utc,
                    'price': price.price,
                    'timestamp': price.timestamp
                })
            })

            const csv = json2csvParser.parse(priceData);
            res.setHeader('Content-disposition', 'attachment; filename=price.csv');
            res.set('Content-Type', 'text/csv');
            res.status(200).send(csv);
        })
    },

    downloadBinance(req, res, next) {
        Prices.findAll({
            where: {
                userId: req.user.id,
                exchange: 'Binance'
            }
        })
        .then((prices) => {
            const json2csvParser = new Json2csvParser({ fields });
            let priceData = [];
            prices.forEach((price) => {
                priceData.push({
                    'exchange': price.exchange,
                    'UTC time': price.utc,
                    'price': price.price,
                    'timestamp': price.timestamp
                })
            })

            const csv = json2csvParser.parse(priceData);
            res.setHeader('Content-disposition', 'attachment; filename=price.csv');
            res.set('Content-Type', 'text/csv');
            res.status(200).send(csv);
        })
    },

    downloadBitmex(req, res, next) {
        Prices.findAll({
            where: {
                userId: req.user.id,
                exchange: 'BitMEX'
            }
        })
        .then((prices) => {
            const json2csvParser = new Json2csvParser({ fields });
            let priceData = [];
            prices.forEach((price) => {
                priceData.push({
                    'exchange': price.exchange,
                    'UTC time': price.utc,
                    'price': price.price,
                    'timestamp': price.timestamp
                })
            })

            const csv = json2csvParser.parse(priceData);
            res.setHeader('Content-disposition', 'attachment; filename=price.csv');
            res.set('Content-Type', 'text/csv');
            res.status(200).send(csv);
        })
    },

    downloadBitstamp(req, res, next) {
        Prices.findAll({
            where: {
                userId: req.user.id,
                exchange: 'Bitstamp'
            }
        })
        .then((prices) => {
            const json2csvParser = new Json2csvParser({ fields });
            let priceData = [];
            prices.forEach((price) => {
                priceData.push({
                    'exchange': price.exchange,
                    'UTC time': price.utc,
                    'price': price.price,
                    'timestamp': price.timestamp
                })
            })

            const csv = json2csvParser.parse(priceData);
            res.setHeader('Content-disposition', 'attachment; filename=price.csv');
            res.set('Content-Type', 'text/csv');
            res.status(200).send(csv);
        })
    }
}