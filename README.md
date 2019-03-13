## csvHolla

csvHolla is a Node application that listens to trades completed on Binance, BitMEX, and Bitstamp. When detected, csvHolla collects the exchange name, UTC time of completion, timestamp, and price of the trade and records this data in a database under the 'Prices' table. Users are able to download the data collected as a .csv file. The app also records price data locally in a file called price.csv.

## Links

* [Github](https://github.com/brandonkimmmm/bitholla)

## Built With

* [Bcryptjs](https://www.npmjs.com/package/bcryptjs)
* [Body-parser](https://www.npmjs.com/package/body-parser)
* [Csv-writer](https://www.npmjs.com/package/csv-writer)
* [Dotenv](https://www.npmjs.com/package/dotenv)
* [EJS](https://www.npmjs.com/package/ejs)
* [Express](https://www.npmjs.com/package/express)
* [Express-flash](https://www.npmjs.com/package/express-flash)
* [Express-session](https://www.npmjs.com/package/express-session)
* [Express-validator](https://www.npmjs.com/package/express-validator)
* [Json2Csv](https://www.npmjs.com/package/json2csv)
* [Moment](https://www.npmjs.com/package/moment)
* [Passport](https://www.npmjs.com/package/passport)
* [Passport-local](https://www.npmjs.com/package/passport-local)
* [Postgres](https://www.npmjs.com/package/pg)
* [Pg-hstore](https://www.npmjs.com/package/pg-hstore)
* [Pusher](https://www.npmjs.com/package/pusher)
* [Pusher-js](https://www.npmjs.com/package/pusher-js)
* [Request](https://www.npmjs.com/package/request)
* [Sequelize](https://www.npmjs.com/package/sequelize)
* [Socket.io](https://www.npmjs.com/package/socket.io)
* [Ws](https://www.npmjs.com/package/ws)

## Getting Started

* Your computer must have [Node.js](https://nodejs.org/en/download/) installed
* Clone the github repository or download the zip file and go to local directory of app
* Run `npm install` to install all dependencies
* Run `npm start`
* Open **http://localhost:3000/** in browser
* **To end app**: press `cmd + c` on mac or `ctrl + c` on windows

## Running Tests

* Run `npm test` in directory
* To run specific tests, run `npm test spec/<TEST LOCATION>`

## Using Application

* The app records data locally in **price.csv** as soon as it starts running, regardless of there being a user
* **price.csv** is written over everytime the app is restarted
* The app records data to a database that can be downloaded via link only when a user is signed in
* To sign up for the app, click on the **Sign up** button in the navbar
* After being signed in, the app will start recording data onto the database and associate them to the currently signed in user
* To download price changes of all exchanges (Binance, BitMEX, Bitstamp), click on the **Download File** button located in the main jumbotron
* To download price changes of specific exchanges, click on the **Download File** button located on the bottom of the specific exchange's card
* A user signing out will stop the app from recording price changes
* A user signing out will delete all the price change data that was recorded while the user was signed in

## Problems Along The Way

###___Listening to price changes___
I had to figure out a way to record price changes in realtime from three different exchanges (Binance, BitMEX, Bitstamp). I decided that connecting to each exchange's websocket was the best way to continuously record the realtime changes. For Binance and BitMEX, I used the ws npm package which allowed me to connect to their websocket servers. I then listened to completed trades for each exchange. The most recent price that the trades were completed in determined the current price of Bitcoin for each exchange. Bitstamp uses Pusher.js as a websocket connection. I also listened to trades completed for Bitstamp and recorded the price of each trade to find the realtime price of Bitcoin in the exchange.

###___Recording data for individual users___
At first, I created a **price.csv** file within the actual app and recorded price changes directly to the file using the csv-writer library. While this worked, I realized that I would run into problems if two different users were to use the application. The data was not being associated to a user. Therefore, a user wouldn't be able to get the price data from his or her own session but instead get the data that started being recorded whenever the first user opened up the application. To get around this, I recorded the data in a PostgreSQL database so each data instance can have a userId value that associated it with a certain user. This way, multiple users can be using the app and obtain price change data that started recording only when he or she signed in. PostgreSQL also allows me to then extract the data that is relevant to the user that is downloading the .csv file. 

* App still records data to a local file called price.csv regardless of there being a user or not
* It continuously records until app is closed
* Local price.csv is rewritten for every reset of app

###___Multiple users using the app at once___
Currently, the app can only allow one user to use the app at a time. This is because the websocket connections are terminated after a user signs out. If userA was using the app while userB signs out, the app would disconnect from the websockets for both userA and userB, even though userA is still signed in. I think I can get around this if I was to have the app constantly connected to the websockets and only record the incoming data if a req.user exists. I tried to do this but was unable to stop recording even after a user logged out because req.user did not change.

## Things I Would Compelete With More Time

###___Tests___
While I wrote unit and integration tests for database models and **GET** urls, I was not able to find a way to test **POST** links that downloaded .csv files. If given more time, I would find out a way to test these links and make sure that the downloaded .csv file returns expected values. 

###___Show users how long their session has been going on___
In the view, I would create a timer that starts whenever the user signs in to show the user how long the app has been recording prices changes. This way, the user can see the exact amount of time the app has been recording data and can download the .csv file with more information.

###___Allow reset of recording data___
Currently the app only allows the user to empty their price change data table by signing out and signing back in. I would allow the user to click a button that resets the database. This way, the user does not have to sign out and sign back in for every reset.

###___Allow users to download .csv file for a given timeframe___
Currently, the app only allows users to obtain the data that was recorded throughout his or her session. I would allow users to download data that was recorded within the last hour, last 30 minutes, last 5 minutes, etc.

###___Improve UI___
At this point, the app's ui is very simple and does not show much information. I would like to include a graph that shows the price changes of their current session. I would also like to give instructions on how to use the app within the ui. Also, the prices in the UI start at 0 until a change is recorded. I would initially show the price by using an API call. 

###___Refactoring Code___
Right now, I am using two separate websocket connections (one for the price change ticker in the view and one for recording price changes). I would like to refactor the code so only one connection is being made in the app. I would also move the websocket code to a separate file. 