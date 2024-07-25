const redisClient = require('../service/redisService');

function cacheData(data, expirationInSeconds = 3600) {
    if (redisClient.isReady) {
        redisClient.setEx(
            'highways',
            expirationInSeconds,
            JSON.stringify(data),
        );
    }
}

module.exports = { cacheData };
