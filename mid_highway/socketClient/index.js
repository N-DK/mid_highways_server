const { io } = require('socket.io-client');
const publicTopic = require('../publicTopic');
const constant = require('../constant');

const initializeSocketClient = () => {
    console.log('>> socket.io connecting to server');
    const socket = io(constant?.domain, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        randomizationFactor: 0.5,
    });

    socket.on('connect', () => {
        console.log('>> connected to server nodejs');
    });

    socket.on('warning', (data) => {
        publicTopic('warning', data);
    });

    socket.on('disconnect', () => {
        console.log('>> client disconnected from server');
    });

    return socket;
};

module.exports = { initializeSocketClient };
