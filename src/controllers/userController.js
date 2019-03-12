const userQueries = require('../db/queries.user.js');
const pricesQueries = require('../db/queries.prices.js');
const passport = require('passport');

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
    }
}