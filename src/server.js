const app = require('./app');
const http = require('http');
const server = http.createServer(app);

server.listen(3000);

app.use('/', (req, res, next) => {
    res.send('Welcome to bitHolla');
})

server.on('listening', () => {
    console.log('server is listening for requests on port 3000');
})