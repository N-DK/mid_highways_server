const { isPointInHighway } = require('../utils');

const warningHighWay = (cars, io, highways, message) => {
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
                    max_speed: inBounds.max_speed,
                    min_speed: inBounds.min_speed,
                });
            } else {
                const car = cars[carIndex];
                if (car.ref_id === ref.id) {
                    const isInWarning = !car.state && inBounds.isInBounds;
                    const isOutWarning = car.state && !inBounds.isInBounds;
                    const payload = {
                        vid: car.vid,
                        ref: ref.ref,
                    };

                    if (isInWarning) {
                        io.emit('warning', {
                            ...payload,
                            message: `Xe ${car.vid} đi vào ${inBounds.highway_name}`,
                            type: 1,
                            in_time: Date.now(),
                            highway_name: inBounds.highway_name,
                            max_speed: inBounds.max_speed,
                            min_speed: inBounds.min_speed,
                        });
                        console.log(
                            `Xe ${car.vid} đi vào ${inBounds.highway_name}`,
                        );
                        car.highway_name = inBounds.highway_name;
                        car.max_speed = inBounds.max_speed;
                        car.min_speed = inBounds.min_speed;
                    } else if (isOutWarning) {
                        io.emit('warning', {
                            ...payload,
                            message: `Xe ${car.vid} đi ra ${car.highway_name}`,
                            type: 0,
                            out_time: Date.now(),
                            highway_name: car.highway_name,
                            max_speed: car.max_speed,
                            min_speed: car.min_speed,
                        });
                        console.log(`Xe ${car.vid} đi ra ${car.highway_name}`);
                    }
                    car.state = inBounds.isInBounds;
                }
            }
        });
    } catch (error) {
        // console.log(error);
    }
};

module.exports = { warningHighWay };
