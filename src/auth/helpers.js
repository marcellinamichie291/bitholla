const bcrypt = require('bcryptjs');

module.exports = {
    ensureAuthenticated(req, res, next) {
        if (!req.user) {
            req.flash('notice', 'You must be signed in to do that.');
            return res.redirect('/');
        } else {
            next();
        }
    },

    comparePass(userPassword, databasePassword) {
        return bcrypt.compareSync(userPassword, databasePassword);
    }
}