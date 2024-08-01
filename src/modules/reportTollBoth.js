const { con } = require('../config/db');
const { isPointInHighway } = require('../utils');

const reportTollBoth = (cars, highways, message) => {
    try {
        const data = JSON.parse(message.toString());
        const point = [Number(data[0]?.mlat), Number(data[0]?.mlng)];
        highways?.forEach((ref) => {
            const carIndex = cars.findIndex(
                (car) => car.vid === data[0]?.vid && car.ref_id === ref.id,
            );

            const inBounds = isPointInHighway(point, ref.highways);

            if (cars.length === 0 || carIndex === -1) {
                cars.push({
                    ref_id: ref.id,
                    vid: data[0]?.vid,
                    dev_id: data[0]?.id,
                    state: inBounds.isInBounds,
                    highway_name: inBounds.highway_name,
                });
            } else {
                const car = cars[carIndex];
                if (car.ref_id === ref.id) {
                    const isInWarning = !car.state && inBounds.isInBounds;
                    const isOutWarning = car.state && !inBounds.isInBounds;

                    if (isInWarning) {
                        console.log(
                            `Xe ${car.vid} đi vào ${
                                inBounds.highway_name
                            } ${Date.now()}`,
                        );
                        // insert to db
                        // con.query(
                        //     'INSERT INTO report_tollboths (imei, start_idx, end_idx, start_time, end_time, tollboth_name, create_at, update_at)
                        //     VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        //     [car.dev_id, ref.id, null, Date.now(), null, inBounds.highway_name, Date.now(), Date.now()],
                        //     (err, result) => {
                        //         if (err) {
                        //             console.log(err);
                        //         } else {
                        //             car.record_id = result.insertId;
                        //         }
                        //     },
                        // );
                        car.highway_name = inBounds.highway_name;
                    } else if (isOutWarning) {
                        console.log(
                            `Xe ${car.vid} đi ra ${
                                car.highway_name
                            } ${Date.now()}`,
                        );
                        // update to db
                        // if(car.record_id) update record_id and set car.record_id = null
                        // con.query(
                        //     'UPDATE report_tollboths SET end_time = ?, end_idx = ?, update_at = ? WHERE id = ?',
                        //     [Date.now(), null, Date.now(), car.record_id],
                        //     (err) => {
                        //         if (err) {
                        //             console.log(err);
                        //         } else {
                        //             car.record_id = null;
                        //         }
                        //     },
                        // );
                    }
                    car.state = inBounds.isInBounds;
                }
            }
        });
    } catch (error) {
        // console.log(error);
    }
};

module.exports = { reportTollBoth };
