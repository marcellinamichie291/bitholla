const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000/users/';
const User = require('../../src/db/models').User;
const Prices = require('../../src/db/models').Prices;
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

    describe('GET /users/signout', () => {
        beforeEach((done) => {
            this.user;
            User.create({
                email: 'user@example.com',
                password: 'password'
            })
            .then((user) => {
                this.user = user
                Prices.create({
                    exchange: 'binance',
                    utc: 'march 1',
                    price: '23.24',
                    timestamp: '123',
                    userId: this.user.id
                })
                .then((prices) => {
                    this.prices = prices;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                })
            })
            .catch((err) => {
                console.log(err);
                done();
            })
        })

        // it('should destroy all prices associated to user when user signs out', (done) => {
        //     const options = {
        //         url: `${base}signout`,
        //         req: {
        //             user: this.user
        //         }
        //     }

        //     Prices.findAll({
        //         where: {
        //             userId: this.user.id
        //         }
        //     })
        //     .then((prices) => {
        //         // expect(prices).not.toBeNull();
        //         // expect(prices.exchange).toBe(this.prices.exchange);
        //         // expect(prices.utc).toBe(this.prices.utc);
        //         // expect(prices.price).toBe(this.prices.price);
        //         // expect(prices.timestamp).toBe(this.prices.timestamp);
        //         // expect(prices.userId).toBe(this.user.id);

        //         request.get(options,
        //             (err, res, body) => {
        //                 Prices.findAll({
        //                     where: {
        //                         userId: this.user.id
        //                     }
        //                 })
        //                 .then((prices) => {
        //                     expect(prices).toBeNull();
        //                     done();
        //                 })
        //                 .catch((err) => {
        //                     console.log(err);
        //                     done();
        //                 })
        //             }
        //         )
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         done();
        //     })
        // })
    })

})