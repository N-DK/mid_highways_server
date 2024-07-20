const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const { initializeDB } = require('./config/db');
const { initialize } = require('./service/socketService');
const route = require('./routes');
const { loadHighways } = require('./modules/loadingHighWay');

// Connect DB and load highways
const connectDBAndLoadHighways = async () => {
    try {
        await initializeDB();
        await loadHighways();
    } catch (error) {
        console.error('Error during initialization', error);
        process.exit(1);
    }
};

// Connect socket
const server = http.createServer(app);
initialize(server);

// Connect DB and load highways, then start server
connectDBAndLoadHighways().then(() => {
    route(app);

    server.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
