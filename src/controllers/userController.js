const userQueries = require('../db/queries.user.js');
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
                    req.flash('notice', 'You\'ve successfully signed in!');
                    res.redirect('/');
                })
            }
        })
    }
}