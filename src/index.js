const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const route = require('./routes');
const db = require('./config/db');
const socket = require('./service/socketService');
const redisClient = require('./service/redisService');
const { loadHighways } = require('./modules/loadingHighWay');
var bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connect DB
const connectDB = async () => {
    try {
        await db.connect();
        // await initializeDB();
        // await loadHighways();
    } catch (error) {
        console.error('Error during initialization', error);
        process.exit(1);
    }
};

const server = http.createServer(app);

// Connect socket
// socket.initialize(server);

// Connect to redis
// redisClient.connect();

// Connect DB and load highways, then start server
connectDB().then(() => {
    route(app);

    server.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
