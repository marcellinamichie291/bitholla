const sequelize = require('../../src/db/models/index').sequelize;
const User = require('../../src/db/models').User;
const Prices = require('../../src/db/models').Prices;

describe('Prices', () => {
    beforeEach((done) => {
        this.user;
        sequelize.sync({force: true})
        .then(() => {
            User.create({
                email: 'user@example.com',
                password: 'password'
            })
            .then((user) => {
                this.user = user;
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

    describe('#create()', () => {
        it('should create a price model with exchange, utc time, price, and timestamp', (done) => {
            Prices.create({
                exchange: 'binance',
                utc: 'March 8 2019 11:00 pm',
                price: '3000.00',
                timestamp: '123456',
                userId: this.user.id
            })
            .then((price) => {
                expect(price).not.toBeNull();
                expect(price.exchange).toBe('binance');
                expect(price.utc).toBe('March 8 2019 11:00 pm');
                expect(price.price).toBe('3000.00');
                expect(price.timestamp).toBe('123456');
                expect(price.userId).toBe(this.user.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            })
        })

        it('should not create a price model with a missing attribute', (done) => {
            Prices.create({
                exchange: 'binance'
            })
            .then((price) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain('utc cannot be null');
                expect(err.message).toContain('price cannot be null');
                expect(err.message).toContain('timestamp cannot be null');
                done();
            })
        })
    })
})