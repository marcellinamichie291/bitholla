const fs = require('fs');
const parse = require('csv-parse');
const moment = require('moment');
const BitMEXClient = require('bitmex-realtime-api');
const client = new BitMEXClient();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

describe('bitmex websocket', () => {
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

    it('should connect to bitmex websocket and listen for new trade events and then record data to price.csv', (done) => {
        client.addStream('XBTUSD', 'trade', (data) => {
            csvWriter
                .writeRecords([
                    {'exchange': 'Bitmex', 'utc': moment(data[data.length - 1].timestamp).format('MMM Do, h:mm:ss a'), 'price': data[data.length - 1].price, 'timestamp': moment(data[data.length - 1].timestamp).valueOf()}
                ])
                .then(() => {
                    expect(typeof data).toBe('object');
                    expect(JSON.stringify(data)).toContain('price');
                    expect(JSON.stringify(data)).toContain('timestamp');
                    fs.readFile('./price.csv', function(err, fileData) {
                        parse(fileData, {columns: false, trim: true}, function(err, rows) {
                            expect(rows[0]).toEqual(['EXCHANGE', 'UTC TIME', 'PRICE', 'TIMESTAMP']);
                            expect(rows[1]).toContain(moment(data[data.length - 1].timestamp).format('MMM Do, h:mm:ss a').toString());
                            expect(rows[1]).toContain(data[data.length - 1].price.toString());
                            expect(rows[1]).toContain(moment(data[data.length - 1].timestamp).valueOf().toString());
                            done();
                        });
                    });
                })
        })
    });
});