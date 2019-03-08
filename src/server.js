const app = require('./app');
const http = require('http');
const server = http.createServer(app);
const moment = require('moment');

// initialize binance websocket
const binance = require('node-binance-api')();

// initialize bitmex websocket
const BitMEXClient = require('bitmex-realtime-api');

// initialize csv-writer and create headers
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: './price.csv',
    header: [
        {id: 'exchange', title: 'EXCHANGE'},
        {id: 'utc', title: 'UTC TIME'},
        {id: 'price', title: 'PRICE'},
        {id: 'timestamp', title: 'TIMESTAMP'}
    ]
});

// // initalize pusher and subscribe to bitstamp websocket
// const Pusher = require('pusher-js/node');
// const pusher = new Pusher('de504dc5763aeef9ff52');
// const channel = pusher.subscribe('live_trades');

// // listen to bistamp websocket for trade events
// channel.bind('trade', (data) => {
//     csvWriter
//         // record UTC time, price, and timestamp to price.csv
//         .writeRecords([
//             {'exchange': 'Bitstamp', 'utc': moment.utc(data.timestamp * 1000).format('MMM Do, h:mm:ss a'), 'price': data.price_str, 'timestamp': data.timestamp}
//         ])
//         .then(() => {
//             console.log('Bitstamp data recorded');
//         })
// })

server.listen(3000);

// connect to socket.io and listen on every price change
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    console.log('SOCKET.IO CONNECTED');

    // listen to binance websocket for trade events
    binance.websockets.trades('BTCUSDT', (data) => {
        let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = data;
        csvWriter
            // record UTC time, price, and timestamp to price.csv
            .writeRecords([
                {'exchange': 'Binance', 'utc': moment.utc(data.E * 1000).format('MMM Do, h:mm:ss a'), 'price': parseFloat(data.p).toFixed(2), 'timestamp': data.E}
            ])
            .then(() => {
                socket.emit('binance_change', parseFloat(data.p).toFixed(2));
                console.log('Binance data recorded');
            })
    })

    // listen to bitmex websocket for trade events
    const client = new BitMEXClient();
    client.addStream('XBTUSD', 'trade', (data) => {
        csvWriter
            // record UTC time, price, and timestamp to price.csv
            .writeRecords([
                {'exchange': 'Bitmex', 'utc': moment(data[data.length - 1].timestamp).format('MMM Do, h:mm:ss a'), 'price': data[data.length - 1].price.toFixed(2), 'timestamp': moment(data[data.length - 1].timestamp).valueOf()}
            ])
            .then(() => {
                socket.emit('bitmex_change', data[data.length - 1].price.toFixed(2));
                console.log('Bitmex data recorded');
            })
    })

})

app.use('/', (req, res, next) => {
    res.render('static/index');
})

server.on('listening', () => {
    console.log('server is listening for requests on port 3000');
})