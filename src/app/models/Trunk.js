const { query } = require('../../config/db');

const trunk = {
    getTrunk: (callback) => {
        return query('trunk', {}, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
};

module.exports = trunk;
