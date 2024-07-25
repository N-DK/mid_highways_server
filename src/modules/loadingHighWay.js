const highway = require('../app/models/Highway');
const redisClient = require('../service/redisService');
const { cacheData } = require('./cacheData');

async function loadHighways() {
    const key = 'highways';
    if (!redisClient.isReady) {
        return;
    }
    try {
        const data = await redisClient.get(key);
        if (data !== null) {
            return data;
        } else {
            cachedResults = await new Promise((resolve, reject) => {
                highway.getHighway((err, results) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
            cacheData(cachedResults, 1296000);
            return cachedResults;
        }
    } catch (error) {
        console.log('Redis cache error:', error);
        next();
    }
}

module.exports = {
    loadHighways,
};
