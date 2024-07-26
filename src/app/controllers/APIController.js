const fetchHighways = require('../../modules/fetchHighwaysData');
const { loadHighways } = require('../../modules/loadingHighWay');
const { isPointInHighway } = require('../../utils');
const Highway = require('../models/Highway');
const Trunk = require('../models/Trunk');
const turf = require('@turf/turf');

const insertData = async (req, res, Model) => {
    const data = req.body;
    if (!data) {
        return res.status(400).json({ message: 'Missing data' });
    }

    const line = turf.lineString(
        data.highways[0].ways[0].nodes.map((node) => [node[1], node[0]]),
    );
    const bufferedLine = turf.buffer(line, 15, { units: 'meters' });
    const bufferedLineCoords = bufferedLine?.geometry.coordinates[0].map(
        (coord) => [coord[1], coord[0]],
    );
    data.highways[0].ways[0].buffer_geometry = bufferedLineCoords;

    try {
        const existingRef = await Model.findOne({ ref: data.ref });
        data.highways[0].id =
            existingRef.highways[existingRef.highways.length - 1].id + 1;
        const existingWays =
            existingRef.highways[existingRef.highways.length - 1].ways;
        data.highways[0].ways[0].id =
            existingWays[existingWays.length - 1].id + 1;
        if (existingRef) {
            // Add new highway into existing ref
            if (
                existingRef.highways.some(
                    (item) =>
                        item.highway_name === data.highways[0].highway_name,
                )
            ) {
                const index = existingRef.highways.findIndex(
                    (item) =>
                        item.highway_name === data.highways[0].highway_name,
                );
                existingRef.highways[index].ways.push(data.highways[0].ways[0]);
                await existingRef.save();
                return res.json(existingRef);
            } else {
                existingRef.highways.push(data.highways[0]);
                await existingRef.save();
                return res.json(existingRef);
            }
        } else {
            // Create new ref
            const result = await Model.create(data);
            return res.json(result);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

class APIController {
    async index(req, res, next) {
        res.json({ message: 'Hello World' });
    }
    // [GET] /api/v1/highways?lat=10.762622&lng=106.660172
    async getHighways(req, res, next) {
        if (!req.query.lat || !req.query.lng) {
            return res.json({ message: 'Missing lat or lng' });
        }

        try {
            const results = await loadHighways();
            const promises = results.map(async (ref) => {
                const point = [req.query.lat, req.query.lng];
                const inBounds = isPointInHighway(point, ref.highways);
                if (inBounds.isInBounds) {
                    return res.json({
                        _id: ref._id,
                        ref: ref.ref,
                        highway_name: inBounds.highway_name,
                        max_speed: inBounds.max_speed ?? null,
                        min_speed: inBounds.min_speed ?? null,
                        is_in_bounds: inBounds.isInBounds,
                    });
                }
            });
            const result = (await Promise.all(promises)).filter(Boolean);
            if (result.length === 0) return res.json({ is_in_bounds: false });
        } catch (error) {
            console.error(error);
        }
    }

    // [GET] /api/v1/highways/get-all
    async getAllHighways(req, res, next) {
        try {
            const results = await fetchHighways();
            highway.saveHighway(results, (err, results) => {
                if (err) return res.json({ message: err });
                res.json(results);
            });
        } catch (error) {
            // console.error(error);
        }
    }

    // [POST] /api/v1/highways
    async insertHighway(req, res, next) {
        await insertData(req, res, Highway);
    }

    // [POST] /api/v1/trunk
    async insertTrunk(req, res, next) {
        await insertData(req, res, Trunk);
    }
}

module.exports = new APIController();
