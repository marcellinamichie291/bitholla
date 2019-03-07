const app = require('./app');
const http = require('http');
const server = http.createServer(app);
const Pusher = require('pusher-js/node');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const moment = require('moment');
const csvWriter = createCsvWriter({
    path: './price.csv',
    header: [
        {id: 'utc', title: 'UTC TIME'},
        {id: 'price', title: 'PRICE'},
        {id: 'timestamp', title: 'TIMESTAMP'}
    ]
});

let pusher = new Pusher('de504dc5763aeef9ff52');

let channel = pusher.subscribe('live_trades');
channel.bind('trade', (data) => {
    console.log(typeof data.timestamp)
    csvWriter
        .writeRecords([
            {'utc': moment.utc(data.timestamp * 1000).format('MMM Do, h:mm:ss a'), 'price': data.price_str, 'timestamp': data.timestamp}
        ])
        .then(() => {
            console.log('csv file was written');
        })
})

server.listen(3000);

app.use('/', (req, res, next) => {
    res.render('static/index');
})

server.on('listening', () => {
    console.log('server is listening for requests on port 3000');
})