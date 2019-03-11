## csvHolla

csvHolla is a Node application that listens to trades completed on Binance, BitMEX, and Bitstamp. When detected, csvHolla collects the UTC time of completion, timestamp, and price of the trade and records this data to a file called price.csv. csvHolla starts listening to the exchanges as soon as its server starts and stops listening when the server closes.

## Links

* [Github](https://github.com/brandonkimmmm/bitholla)

## Built With

* Node.js
* Express
* EJS
* Moment.js
* Pusher
* Pusher-js
* Bitmex-realtime-api
* Node-binance-api
* Socket.io
* Csv-writer

## Background