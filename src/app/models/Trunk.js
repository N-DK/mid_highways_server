const { default: mongoose } = require('mongoose');
const Default = require('./DefaultSchema');

module.exports = mongoose.model('Trunk', Default);
