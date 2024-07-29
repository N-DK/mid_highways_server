const redisClient = require('../service/redisService');
const { cacheData } = require('./cacheData');
const fetchHighways = require('./fetchData');
const Highway = require('../app/models/Highway');
const Trunk = require('../app/models/Trunk');
const TollBoth = require('../app/models/TollBoth');

let cachedResults = null;

async function getResultHighwayAndTrunk() {
    try {
        const highways = Highway.find({}).exec();
        const trunks = Trunk.find({}).exec();
        const tollBoth = TollBoth.find({}).exec();

        // Wait for both promises to resolve
        const [highwayResults, trunkResults, tollBothResults] =
            await Promise.all([highways, trunks, tollBoth]);

        // Combine the results
        return [...highwayResults, ...trunkResults, ...tollBothResults];
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
