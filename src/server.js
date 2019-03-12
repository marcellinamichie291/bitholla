const app = require('./app');
const http = require('http');
const server = http.createServer(app);
const moment = require('moment');

// initialize binance websocket
const binance = require('node-binance-api')();

// initialize bitmex websocket
const BitMEXClient = require('bitmex-realtime-api');

// initalize pusher websocket
const Pusher = require('pusher-js/node');
const pusher = new Pusher('de504dc5763aeef9ff52');

server.listen(3000);

// connect to socket.io and listen on every price change
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    console.log('SOCKET.IO CONNECTED');

    // listen to binance websocket for trade events
    binance.websockets.trades('BTCUSDT', (data) => {
        let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = data;
        socket.emit('binance_change', parseFloat(data.p).toFixed(2));
    })

    // listen to bitmex websocket for trade events
    const client = new BitMEXClient();
    client.addStream('XBTUSD', 'trade', (data) => {
        socket.emit('bitmex_change', data[data.length - 1].price.toFixed(2));
    })

    // listen to bistamp websocket for trade events
    const channel = pusher.subscribe('live_trades');
    channel.bind('trade', (data) => {
        socket.emit('bitstamp_change', parseFloat(data.price_str).toFixed(2));
    })
})

server.on('listening', () => {
    console.log('server is listening for requests on port 3000');
})