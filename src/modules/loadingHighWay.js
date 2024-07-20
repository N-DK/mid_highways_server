const highway = require('../app/models/Highway');

let cachedResults = null;

async function loadHighways() {
    if (cachedResults) {
        return cachedResults;
    }

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

    return cachedResults;
}

module.exports = {
    loadHighways,
};
