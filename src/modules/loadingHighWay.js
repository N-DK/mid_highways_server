const { get } = require('http');
const highway = require('../app/models/Highway');
const redisClient = require('../service/redisService');
const { cacheData } = require('./cacheData');
const fetchHighways = require('./fetchHighwaysData');
const trunk = require('../app/models/Trunk');

let cachedResults = null;

async function getResultHighwayAndTrunk() {
    try {
        const highways = new Promise((resolve, reject) => {
            highway.getHighway((err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const trunks = new Promise((resolve, reject) => {
            trunk.getTrunk((err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        // Wait for both promises to resolve
        const [highwayResults, trunkResults] = await Promise.all([
            highways,
            trunks,
        ]);

        // Combine the results
        return [...highwayResults, ...trunkResults];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function loadHighways() {
    const key = 'highways';
    if (!redisClient.isReady && !cachedResults) {
        cachedResults = await getResultHighwayAndTrunk();
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
            cachedResults = await fetchHighways();
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
