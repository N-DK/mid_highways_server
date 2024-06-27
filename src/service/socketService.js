const socketIo = require('socket.io');
const MQTTService = require('./mqttService');
require('dotenv').config();

let io = null;

function initialize(server) {
    io = socketIo(server, {
        pingTimeout: 60000,
        pingInterval: 25000,
        cors: {
            origin: ['http://localhost:5173'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', async (socket) => {
        // Connect MQTT
        const mqttService = new MQTTService(process.env.MQTT_HOST, null, io);
        await mqttService.initialize();
        mqttService.connect();
        mqttService.subscribe('live/status');

        socket.on('disconnect', () => {
            // console.log('Client disconnected:', socket.id);
        });
    });
}

function getIo() {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }

    return io;
}

module.exports = {
    initialize,
    getIo,
};
