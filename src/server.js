const app = require('./app');
const http = require('http');
const server = http.createServer(app);

const WebSocket = require('ws');

// initalize pusher websocket
const Pusher = require('pusher-js/node');
const pusher = new Pusher('de504dc5763aeef9ff52');

// initialize csv writer and create a new file called price.csv
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const moment = require('moment');
const csvWriter = createCsvWriter({
    path: './price.csv',
    header: [
        {id: 'exchange', title: 'exchange'},
        {id: 'utc', title: 'UTC time'},
        {id: 'price', title: 'price'},
        {id: 'timestamp', title: 'timestamp'}
    ]
});

server.listen(3000);

// connect to socket.io and listen on every price change
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    console.log('SOCKET.IO CONNECTED');
    console.log('recording to price.csv....');

    // listen to binance websocket for trade events
    const binanceWs = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@aggTrade');
    binanceWs.on('open', function open() {
        console.log('binance websocket connected');
    })
    binanceWs.on('message', (data) => {
        // parse out json data
        data = JSON.parse(data);

        // emit to socket.io to change view price
        socket.emit('binance_change', parseFloat(data['p']).toFixed(2));

        // write data to price.csv
        csvWriter
            .writeRecords([
                {'exchange': 'Binance', 'utc': moment.utc(data.E).format('MMM Do, h:mm:ss a'), 'price': parseFloat(data['p']).toFixed(2), 'timestamp': data['E']}
            ])
    })

    // bitmex websocket connected and listening to trades
    const bitmexWs = new WebSocket('wss://www.bitmex.com/realtime?subscribe=trade:XBTUSD');
    bitmexWs.on('open', function open() {
        console.log('bitmex websocket connected');
    })
    bitmexWs.on('message', (data) => {
        // parse json data
        data = JSON.parse(data);
        if (data.data) {

            // emit to socket.io to change view price
            socket.emit('bitmex_change', data.data[0].price.toFixed(2));

            // write data to price.csv
            csvWriter
                .writeRecords([
                    {'exchange': 'BitMEX', 'utc': moment.utc(data.data[0].timestamp).format('MMM Do, h:mm:ss a'), 'price': data.data[0].price.toFixed(2), 'timestamp': moment(data.data[0].timestamp).valueOf()}
                ])
        }
    })

    // listen to bistamp websocket for trade events
    const channel = pusher.subscribe('live_trades');
    channel.bind('pusher:subscription_succeeded', function() {
        console.log('bitstamp websocket connected');
    });
    channel.bind('trade', (data) => {
        // emit to socket.io to change view price
        socket.emit('bitstamp_change', parseFloat(data.price_str).toFixed(2));

        // write data to price.csv
        csvWriter
            .writeRecords([
                {'exchange': 'Bitstamp', 'utc': moment.utc(data.timestamp * 1000).format('MMM Do, h:mm:ss a'), 'price': parseFloat(data.price_str).toFixed(2), 'timestamp': data.timestamp}
            ])
    })
})

server.on('listening', () => {
    console.log('server is listening for requests on port 3000');
})