const { query } = require('../../config/db');

const highway = {
    getHighway: (callback) => {
        return query('highway', {}, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
};

module.exports = highway;
