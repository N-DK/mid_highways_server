const mongoose = require('mongoose');
const Default = require('./DefaultSchema');
const Schema = mongoose.Schema;

const waysSchema = new mongoose.Schema({
    buffer_geometry: { type: Array, default: [] },
});

const highwaySchema = new mongoose.Schema({
    highway_name: { type: String, default: '' },
    ways: { type: [waysSchema], default: [] },
});

const TollBoth = new Schema(
    {
        ref: { type: String, default: '' },
        highways: { type: [highwaySchema], default: [] },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('TollBoth', TollBoth);
