const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const waysSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
        },
        nodes: { type: Array, default: [] },
        bounds: { type: Array, default: [] },
        maxSpeed: { type: String, default: '' },
        minSpeed: { type: String, default: '' },
        lanes: { type: String, default: 0 },
        buffer_geometry: { type: Array, default: [] },
    },
    { _id: false },
);

const highwaySchema = new mongoose.Schema(
    {
        id: {
            type: Number,
        },
        highway_name: { type: String },
        ways: { type: [waysSchema], default: [] },
    },
    { _id: false },
);

const Default = new Schema(
    {
        ref: { type: String, default: '' },
        highways: { type: [highwaySchema], default: [] },
    },
    {
        timestamps: true,
    },
);

module.exports = Default;
