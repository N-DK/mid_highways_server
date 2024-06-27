const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const { initializeDB } = require('./config/db');
const { initialize } = require('./service/socketService');

// Connect DB
const connectDB = async () => {
    try {
        await initializeDB();
    } catch (error) {}
};
connectDB();

// Connect socket
const server = http.createServer(app);
initialize(server);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
