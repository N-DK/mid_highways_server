const { query, deleteMany, insertMany } = require('../../config/db');

const highway = {
    getHighway: (callback) => {
        return query('highway', {}, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    saveHighway: (data, callback) => {
        deleteMany('highway', {}, (err, results) => {
            if (err) return callback(err);
            else {
                return insertMany('highway', data, (err, results) => {
                    if (err) return callback(err);
                    callback(null, results);
                });
            }
        });
    },
};

module.exports = highway;
