const fetchHighways = require('../../modules/fetchHighwaysData');
const { loadHighways } = require('../../modules/loadingHighWay');
const { isPointInHighway } = require('../../utils');
const highway = require('../models/Highway');

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
            let found = false;
            const promises = results.map(async (ref) => {
                if (found) return;
                const point = [req.query.lat, req.query.lng];
                const inBounds = isPointInHighway(point, ref.highways);
                if (inBounds.isInBounds && !found) {
                    found = true;
                    res.json({
                        _id: ref._id,
                        ref: ref.ref,
                        highway_name: inBounds.highway_name,
                        max_speed: inBounds.max_speed ?? null,
                        min_speed: inBounds.min_speed ?? null,
                        is_in_bounds: inBounds.isInBounds,
                    });
                }
            });

            await Promise.all(promises);
            if (!found) {
                return res.json({ is_in_bounds: false });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
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
}

module.exports = new APIController();
