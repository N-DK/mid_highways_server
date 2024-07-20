const { loadHighways } = require('../../modules/loadingHighWay');
const { isPointInHighway } = require('../../utils');

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
            results.forEach((ref) => {
                const point = [req.query.lat, req.query.lng];
                const inBounds = isPointInHighway(point, ref.highways);
                if (inBounds.isInBounds) {
                    res.json({
                        _id: ref._id,
                        ref: ref.ref,
                        highway_name: inBounds.highway_name,
                        max_speed: inBounds.max_speed ?? null,
                        min_speed: inBounds.min_speed ?? null,
                        isInBounds: inBounds.isInBounds,
                    });
                }
            });
            res.json({ isInBounds: false });
        } catch (error) {
            // console.error(error);
        }
    }
}

module.exports = new APIController();