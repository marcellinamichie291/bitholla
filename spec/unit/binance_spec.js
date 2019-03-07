const fs = require('fs');
const parse = require('csv-parse');
const moment = require('moment');
const binance = require('node-binance-api')();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

describe('binance websocket', () => {
    let csvWriter;

    beforeEach((done) => {
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

    it('should connect to binance websocket and listen for new trade events and then record data to price.csv', (done) => {
        binance.websockets.trades('BTCUSDT', (data) => {
            let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = data;
            csvWriter
                .writeRecords([
                    {'exchange': 'Binance', 'utc': moment.utc(data.E * 1000).format('MMM Do, h:mm:ss a'), 'price': parseFloat(data.p), 'timestamp': data.E}
                ])
                .then(() => {
                    expect(typeof data).toBe('object');
                    expect(JSON.stringify(data)).toContain('E');
                    expect(JSON.stringify(data)).toContain('p');
                    fs.readFile('./price.csv', function(err, fileData) {
                        parse(fileData, {columns: false, trim: true}, function(err, rows) {
                            expect(rows[0]).toEqual(['EXCHANGE', 'UTC TIME', 'PRICE', 'TIMESTAMP']);
                            expect(rows[1]).toContain(moment.utc(data.E * 1000).format('MMM Do, h:mm:ss a').toString());
                            expect(rows[1]).toContain(parseFloat(data.p).toString());
                            expect(rows[1]).toContain(data.E.toString());
                            done();
                        });
                    });
                })
        })
    });
});