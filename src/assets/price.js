$(function() {
    // make connection
    const socket = io.connect('http://localhost:3000/');

    // exhcnage prices
    let binancePrice = $('#binancePrice');
    let bitmexPrice = $('#bitmexPrice');
    let bitstampPrice = $('#bitstampPrice');

    socket.on('binance_change', (data) => {
        binancePrice.text(parseFloat(data));
    })
});