const fs = require('fs');
const parse = require('csv-parse');
const moment = require('moment');
const Pusher = require('pusher-js/node');
const pusher = new Pusher('de504dc5763aeef9ff52');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

describe('bitstamp websocket', () => {
    var originalTimeout;
    let csvWriter;

    beforeEach((done) => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 500000;
        csvWriter = createCsvWriter({
            path: './price.csv',
            header: [
                {id: 'exchange', title: 'EXCHANGE'},
                {id: 'utc', title: 'UTC TIME'},
                {id: 'price', title: 'PRICE'},
                {id: 'timestamp', title: 'TIMESTAMP'}
            ]
        });
        done();
    });

    it('should connect to bitstamp websocket and listen for new trade events and then record data to price.csv', (done) => {
        const channel = pusher.subscribe('live_trades');
        channel.bind('trade', (data) => {
            csvWriter
                .writeRecords([
                    {'exchange': 'Bitstamp', 'utc': moment.utc(data.timestamp * 1000).format('MMM Do, h:mm:ss a'), 'price': data.price_str, 'timestamp': data.timestamp}
                ])
                .then(() => {
                    expect(typeof data).toBe('object');
                    expect(JSON.stringify(data)).toContain('price_str');
                    expect(JSON.stringify(data)).toContain('timestamp');
                    fs.readFile('./price.csv', function(err, fileData) {
                        parse(fileData, {columns: false, trim: true}, function(err, rows) {
                            expect(rows[0]).toEqual(['EXCHANGE', 'UTC TIME', 'PRICE', 'TIMESTAMP']);
                            expect(rows[1]).toContain(moment.utc(data.timestamp * 1000).format('MMM Do, h:mm:ss a'));
                            expect(rows[1]).toContain(data.price_str);
                            expect(rows[1]).toContain(data.timestamp);
                            done();
                        });
                    });
                })
        });
    });
});