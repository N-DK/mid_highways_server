const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Connect failure' + error.message);
    }
}

module.exports = { connect };
