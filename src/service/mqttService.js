const mqtt = require('mqtt');
const { warningHighWay } = require('../modules/warningHighWay');
const { loadHighways } = require('../modules/loadingHighWay');
const { default: axios } = require('axios');

require('dotenv').config();

class MQTTService {
    constructor(host, messageCallback, io) {
        this.mqttClient = null;
        this.host = host;
        this.messageCallback = messageCallback;
        this.io = io;
        this.cars = [];
    }

    async initialize() {
        try {
            const results = await loadHighways();
            this.highways = results;
        } catch (error) {
            console.error(error);
        }
    }

    connect() {
        this.mqttClient = mqtt.connect(this.host, {
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASS,
        });

        // MQTT Callback for 'error' event
        this.mqttClient.on('error', (err) => {
            console.log(err);
            this.mqttClient.end();
        });

        // MQTT Callback for 'connect' event
        this.mqttClient.on('connect', () => {
            console.log(`MQTT client connected`);
        });

        // Call the message callback function when message arrived
        this.mqttClient.on('message', (topic, message) => {
            // route to check point
            const data = JSON.parse(message.toString());
            const fetch = async () => {
                const res = await axios.get(
                    `http://localhost:3000/api/v1/highways?lat=${Number(
                        data[0]?.mlat,
                    )}&lng=${Number(data[0]?.mlng)}`,
                );
                console.log(res.data);
            };
            fetch();

            // warning high way
            // warningHighWay(this.cars, this.io, this.highways, message);
            if (this.messageCallback) this.messageCallback(topic, message);
        });

        this.mqttClient.on('close', () => {
            console.log(`MQTT client disconnected`);
        });
    }

    // Subscribe to MQTT Message
    subscribe(topic, options) {
        this.mqttClient.subscribe(topic, options);
    }
}

module.exports = MQTTService;
