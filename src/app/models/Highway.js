const { query, deleteMany, insertMany } = require('../../config/db');

const highway = {
    getHighway: (callback) => {
        return query('highway', {}, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    saveHighway: (data, callback) => {
        query('highway', {}, (err, results) => {
            if (err) return callback(err);
            const _ids = results.map((result) => result._id);
            insertMany('highway', data, (err, insertResults) => {
                if (err) return callback(err);
                if (insertResults.acknowledged) {
                    deleteMany(
                        'highway',
                        { _id: { $in: _ids } },
                        (err, deleteResults) => {
                            if (err) return callback(err);
                            callback(null, deleteResults);
                        },
                    );
                }
            });
        });
    },
};

module.exports = highway;
