const mongoose = require('mongoose');
require('dotenv').config();

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Tăng thời gian chờ kết nối
            serverSelectionTimeoutMS: 30000,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Connect failure' + error.message);
    }
}

module.exports = { connect };
