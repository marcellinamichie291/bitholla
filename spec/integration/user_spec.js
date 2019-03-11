const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000/users/';
const User = require('../../src/db/models').User;
const sequelize = require('../../src/db/models/index').sequelize;

describe('routes : users', () => {
    beforeEach((done) => {
        sequelize.sync({force: true})
        .then(() => {
            done();
        })
        .catch((err) => {
            console.log(err);
            done();
        })
    })

    describe('POST /users', () => {
        it('should create a new user with valid values and redirect', (done) => {
            const options = {
                url: base,
                form: {
                    email: 'csv@holla.com',
                    password: 'password',
                    passwordConfirmation: 'password'
                }
            }

            request.post(options,
                (err, res, body) => {
                    User.findOne({where: {email: 'csv@holla.com'}})
                    .then((user) => {
                        expect(user).not.toBeNull();
                        expect(user.email).toBe('csv@holla.com');
                        expect(user.id).toBe(1);
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    })
                }
            )
        })

        it('should not create a new user with invalid attributes and redirect', (done) => {
            request.post(
                {
                    url: base,
                    form: {
                        email: 'no',
                        password: 'password',
                        passwordConfirmation: 'password'
                    }
                },
                (err, res, body) => {
                    User.findOne({where: {email: 'no'}})
                    .then((user) => {
                        expect(user).toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    })
                }
            )
        })

        it('should not create a new user with invalid password confirmation', (done) => {
            request.post(
                {
                    url: base,
                    form: {
                        email: 'hello@example.com',
                        password: 'password',
                        passwordConfirmation: 'no'
                    }
                },
                (err, res, body) => {
                    User.findOne({where: {email: 'hello@example.com'}})
                    .then((user) => {
                        expect(user).toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    })
                }
            )
        })
    })
})