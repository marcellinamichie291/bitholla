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

    describe('price.csv', () => {
        beforeEach((done) => {
            this.user;
            this.binancePrices;
            this.bitmexPrices;
            this.bitstampPrices;
            User.create({
                email: 'user@example.com',
                password: 'password'
            })
            .then((user) => {
                this.user = user;
                Prices.bulkCreate([
                    {
                        exchange: 'Binance',
                        utc: 'March 1',
                        timestamp: '123',
                        price: '3000',
                        userId: user.id
                    },
                    {
                        exchange: 'BitMEX',
                        utc: 'March 1',
                        timestamp: '123',
                        price: '3000',
                        userId: user.id
                    },
                    {
                        exchange: 'Bitstamp',
                        utc: 'March 1',
                        timestamp: '123',
                        price: '3000',
                        userId: user.id
                    }
                ])
                .then((prices) => {
                    this.binancePrices = prices[0];
                    this.bitmexPrices = prices[1];
                    this.bitstampPrices = prices[2];
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

        it('should parse out prices recorded as a price.csv file', (done) => {
            Prices.findAll({
                where: {
                    userId: this.user.id
                }
            })
            .then((prices) => {
                const Json2csvParser = require('json2csv').Parser;
                const fields = ['exchange', 'UTC time', 'price', 'timestamp'];
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
                expect(csv).toContain('"exchange","UTC time","price","timestamp"');
                expect(csv).toContain(`"${this.binancePrices.exchange}","${this.binancePrices.utc}","${this.binancePrices.price}","${this.binancePrices.timestamp}"`);
                expect(csv).toContain(`"${this.bitmexPrices.exchange}","${this.bitmexPrices.utc}","${this.bitmexPrices.price}","${this.bitmexPrices.timestamp}"`);
                expect(csv).toContain(`"${this.bitstampPrices.exchange}","${this.bitstampPrices.utc}","${this.bitstampPrices.price}","${this.bitstampPrices.timestamp}"`);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            })
        })

        it('should parse out binance prices recorded as binance.price.csv file', (done) => {
            Prices.findAll({
                where: {
                    userId: this.user.id,
                    exchange: 'Binance'
                }
            })
            .then((prices) => {
                const Json2csvParser = require('json2csv').Parser;
                const fields = ['exchange', 'UTC time', 'price', 'timestamp'];
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
                expect(csv).toContain('"exchange","UTC time","price","timestamp"');
                expect(csv).toContain(`"${this.binancePrices.exchange}","${this.binancePrices.utc}","${this.binancePrices.price}","${this.binancePrices.timestamp}"`);
                expect(csv).not.toContain(`"${this.bitmexPrices.exchange}","${this.bitmexPrices.utc}","${this.bitmexPrices.price}","${this.bitmexPrices.timestamp}"`);
                expect(csv).not.toContain(`"${this.bitstampPrices.exchange}","${this.bitstampPrices.utc}","${this.bitstampPrices.price}","${this.bitstampPrices.timestamp}"`);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            })
        })

        it('should parse out bitmex prices recorded as bitmex.price.csv file', (done) => {
            Prices.findAll({
                where: {
                    userId: this.user.id,
                    exchange: 'BitMEX'
                }
            })
            .then((prices) => {
                const Json2csvParser = require('json2csv').Parser;
                const fields = ['exchange', 'UTC time', 'price', 'timestamp'];
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
                expect(csv).toContain('"exchange","UTC time","price","timestamp"');
                expect(csv).not.toContain(`"${this.binancePrices.exchange}","${this.binancePrices.utc}","${this.binancePrices.price}","${this.binancePrices.timestamp}"`);
                expect(csv).toContain(`"${this.bitmexPrices.exchange}","${this.bitmexPrices.utc}","${this.bitmexPrices.price}","${this.bitmexPrices.timestamp}"`);
                expect(csv).not.toContain(`"${this.bitstampPrices.exchange}","${this.bitstampPrices.utc}","${this.bitstampPrices.price}","${this.bitstampPrices.timestamp}"`);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            })
        })

        it('should parse out bitstamp prices recorded as bitstamp.price.csv file', (done) => {
            Prices.findAll({
                where: {
                    userId: this.user.id,
                    exchange: 'Bitstamp'
                }
            })
            .then((prices) => {
                const Json2csvParser = require('json2csv').Parser;
                const fields = ['exchange', 'UTC time', 'price', 'timestamp'];
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
                expect(csv).toContain('"exchange","UTC time","price","timestamp"');
                expect(csv).not.toContain(`"${this.binancePrices.exchange}","${this.binancePrices.utc}","${this.binancePrices.price}","${this.binancePrices.timestamp}"`);
                expect(csv).not.toContain(`"${this.bitmexPrices.exchange}","${this.bitmexPrices.utc}","${this.bitmexPrices.price}","${this.bitmexPrices.timestamp}"`);
                expect(csv).toContain(`"${this.bitstampPrices.exchange}","${this.bitstampPrices.utc}","${this.bitstampPrices.price}","${this.bitstampPrices.timestamp}"`);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            })
        })
    })
})