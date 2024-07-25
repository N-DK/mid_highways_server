const { get } = require('http');
const highway = require('../app/models/Highway');
const redisClient = require('../service/redisService');
const { cacheData } = require('./cacheData');

let cachedResults = null;

function getResultHighway() {
    return new Promise((resolve, reject) => {
        highway.getHighway((err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function loadHighways() {
    const key = 'highways';
    // Handle case when redis is not ready
    if (!redisClient.isReady && !cachedResults) {
        cachedResults = await getResultHighway();
        return cachedResults;
    } else if (!redisClient.isReady && cachedResults) {
        return cachedResults;
    }
    // Handle case when redis is ready
    try {
        const data = await redisClient.get(key);
        if (data !== null) {
            return JSON.parse(data);
        } else {
            cachedResults = await getResultHighway();
            // cache data for 15 days
            cacheData(cachedResults, 1296000);
            return cachedResults;
        }
    } catch (error) {
        console.log('Redis cache error:', error);
    }
}

module.exports = {
    loadHighways,
};
