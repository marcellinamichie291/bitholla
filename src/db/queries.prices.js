const WebSocket = require('ws');
const moment = require('moment');
const Prices = require('../db/models').Prices;

// // initialize binance websocket
// const binance = require('node-binance-api')();
let binanceWs;

// // initialize bitmex websocket
// const BitMEXClient = require('bitmex-realtime-api');
// const client = new BitMEXClient();

// initalize pusher websocket
const Pusher = require('pusher-js/node');
const pusher = new Pusher('de504dc5763aeef9ff52');

module.exports = {
    connect(user) {
        // // listen to binance websocket for trade events
        // binance.websockets.trades('BTCUSDT', (data) => {
        //     let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = data;
        //     Prices.create({
        //         exchange: 'Binance',
        //         utc: moment.utc(data.E * 1000).format('MMM Do, h:mm:ss a'),
        //         price: parseFloat(data.p).toFixed(2),
        //         timestamp: data.E,
        //         userId: user.id
        //     })
        //     .then((price) => {
        //         console.log('binance trade recorded');
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     })
        // })

        binanceWs = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@aggTrade');

        binanceWs.on('open', function open() {
            console.log('binance websocket connected');
        })

        binanceWs.on('message', (data) => {
            data = JSON.parse(data);
            Prices.create({
                exchange: 'Binance',
                utc: moment.utc(data.E * 1000).format('MMM Do, h:mm:ss a'),
                price: parseFloat(data['p']).toFixed(2),
                timestamp: data['E'],
                userId: user.id
            })
            .then((price) => {
                console.log('binance trade recorded');
            })
            .catch((err) => {
                console.log(err);
            })
        })

        // // listen to bitmex websocket for trade events
        // client.addStream('XBTUSD', 'trade', (data) => {
        //     Prices.create({
        //         exchange: 'BitMEX',
        //         utc: moment(data[data.length - 1].timestamp).format('MMM Do, h:mm:ss a'),
        //         price: data[data.length - 1].price.toFixed(2),
        //         timestamp: moment(data[data.length - 1].timestamp).valueOf(),
        //         userId: user.id
        //     })
        //     .then((price) => {
        //         console.log('bitmex trade recorded');
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     })
        // })

        // // listen to bistamp websocket for trade events
        // const channel = pusher.subscribe('live_trades');
        // channel.bind('trade', (data) => {
        //     Prices.create({
        //         exchange: 'Bitstamp',
        //         utc: moment.utc(data.timestamp * 1000).format('MMM Do, h:mm:ss a'),
        //         price: parseFloat(data.price_str).toFixed(2),
        //         timestamp: data.timestamp,
        //         userId: user.id
        //     })
        //     .then((price) => {
        //         console.log('bitstamp trade recorded');
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     })
        // })
    },

    disconnect() {
        binanceWs.close();
    }
}