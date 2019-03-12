const WebSocket = require('ws');
const moment = require('moment');
const Prices = require('../db/models').Prices;

let binanceWs;
let bitmexWs;

// initalize pusher websocket
const Pusher = require('pusher-js/node');
const pusher = new Pusher('de504dc5763aeef9ff52');

module.exports = {
    connect(user) {
        // binance websocket connected and listening to trades
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

        // bitmex websocket connected and listening to trades
        bitmexWs = new WebSocket('wss://www.bitmex.com/realtime?subscribe=trade:XBTUSD');
        bitmexWs.on('open', function open() {
            console.log('bitmex websocket connected');
        })
        bitmexWs.on('message', (data) => {
            data = JSON.parse(data);
            if (data.data) {
                Prices.create({
                    exchange: 'BitMEX',
                    utc: moment(data.data[0].timestamp).format('MMM Do, h:mm:ss a'),
                    price: data.data[0].price.toFixed(2),
                    timestamp: moment(data.data[0].timestamp).valueOf(),
                    userId: user.id
                })
                .then((price) => {
                    console.log('bitmex trade recorded');
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        })

        // listen to bistamp websocket for trade events
        const channel = pusher.subscribe('live_trades');
        channel.bind('trade', (data) => {
            Prices.create({
                exchange: 'Bitstamp',
                utc: moment.utc(data.timestamp * 1000).format('MMM Do, h:mm:ss a'),
                price: parseFloat(data.price_str).toFixed(2),
                timestamp: data.timestamp,
                userId: user.id
            })
            .then((price) => {
                console.log('bitstamp trade recorded');
            })
            .catch((err) => {
                console.log(err);
            })
        })
    },

    disconnect() {
        binanceWs.close();
        binanceWs.on('close', function close() {
            console.log('binance websocket closed');
        })

        bitmexWs.close();
        bitmexWs.on('close', function close() {
            console.log('bitmex websocket closed');
        })

        pusher.unsubscribe('live_trades');
    }
}