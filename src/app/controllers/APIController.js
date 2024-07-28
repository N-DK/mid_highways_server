const { VN_REGION, VN_REGION_TRUNK } = require('../../constant');
const fetchData = require('../../modules/fetchData');
const { loadHighways } = require('../../modules/loadingHighWay');
const { isPointInHighway } = require('../../utils');
const Highway = require('../models/Highway');
const Trunk = require('../models/Trunk');
const turf = require('@turf/turf');

const insertData = async (req, res, Model) => {
    try {
        const data = req.body;
        if (!data) {
            return res.status(400).json({ message: 'Missing data' });
        }

        const nodes = data.highways[0].ways[0].nodes;
        let maxLat = -Infinity,
            minLat = Infinity,
            maxLng = -Infinity,
            minLng = Infinity;

        nodes.forEach(([lng, lat]) => {
            if (lat > maxLat) maxLat = lat;
            if (lat < minLat) minLat = lat;
            if (lng > maxLng) maxLng = lng;
            if (lng < minLng) minLng = lng;
        });

        data.highways[0].ways[0].bounds = [
            [minLat, minLng],
            [maxLat, maxLng],
        ];

        const line = turf.lineString(nodes.map(([lng, lat]) => [lat, lng]));
        const bufferedLine = turf.buffer(line, 15, { units: 'meters' });
        const bufferedLineCoords = bufferedLine.geometry.coordinates[0].map(
            ([lat, lng]) => [lng, lat],
        );
        data.highways[0].ways[0].buffer_geometry = bufferedLineCoords;

        const existingRef = await Model.findOne({ ref: data.ref });

        if (existingRef) {
            // Check if the highway already exists
            const highwayIndex = existingRef.highways.findIndex(
                (item) => item.highway_name === data.highways[0].highway_name,
            );

            if (highwayIndex >= 0) {
                // Add way to existing highway
                const existingWays = existingRef.highways[highwayIndex].ways;
                data.highways[0].ways[0].id =
                    existingWays[existingWays.length - 1].id + 1;
                existingRef.highways[highwayIndex].ways.push(
                    data.highways[0].ways[0],
                );
            } else {
                // Add new highway to existing ref
                data.highways[0].id =
                    existingRef.highways[existingRef.highways.length - 1].id +
                    1;
                data.highways[0].ways[0].id = 1;
                existingRef.highways.push(data.highways[0]);
            }

            await existingRef.save();
            return res.json(existingRef);
        } else {
            // Create new ref
            data.highways[0].id = 1;
            data.highways[0].ways[0].id = 1;
            const result = await Model.create(data);
            return res.json(result);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const pullData = async (res, Model, type) => {
    try {
        const data = await fetchData(type);
        if (data.length > 0) {
            await Model.deleteMany({}).exec();
            await Model.insertMany(data);
            return res.json({ message: 'Success' });
        } else {
            return res.json({ message: 'No data' });
        }
    } catch (error) {
        console.error(error);
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

    // [GET] /api/v1/highways/pull
    async pullHighways(req, res, next) {
        pullData(res, Highway, VN_REGION);
    }

    // [GET] /api/v1/trunks/pull
    async pullTrunks(req, res, next) {
        pullData(res, Trunk, VN_REGION_TRUNK);
    }

    // [GET] /api/v1/highways/get-all
    async getAllHighways(req, res, next) {
        try {
            const highways = await Highway.find({}).exec();
            return res.json(highways);
        } catch (error) {
            // console.error(error);
        }
    }

    // [GET] /api/v1/trunk/get-all
    async getAllTrunks(req, res, next) {
        try {
            const trunks = await Trunk.find({}).exec();
            return res.json(trunks);
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
