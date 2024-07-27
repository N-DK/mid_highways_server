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
const { importData } = require('./modules/importData');
const Highway = require('./app/models/Highway');
const Trunk = require('./app/models/Trunk');
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connect DB
const connectDB = async () => {
    try {
        await db.connect();
        // await importData(Highway, 'highway.json');
        // await importData(Trunk, 'mobicam_server.trunk.json');
        await loadHighways();
    } catch (error) {
        console.error('Error during initialization', error);
        process.exit(1);
    }
};

const server = http.createServer(app);

// Connect socket
socket.initialize(server);

// Connect to redis
// redisClient.connect();

// Connect DB and load highways, then start server
connectDB().then(() => {
    route(app);

    server.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
