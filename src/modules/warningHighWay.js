const {
    isPointInBounds,
    isPointInCircle,
    isPointInHighway,
} = require('../utils');

const warningHighWay = (cars, io, highways, message) => {
    try {
        const data = JSON.parse(message.toString());
        const point = data[0]?.gps?.split(',').map(Number);

        // Đi vào các cao tốc với tên cụ thể
        // highways.forEach((ref) => {
        //     ref.highways.forEach((highway) => {
        //         const dataVid = data[0]?.vid;
        //         const dataId = data[0]?.id;

        //         const carIndex = cars.findIndex((car) => {
        //             return car.vid === dataVid && car.highway_id === highway.id;
        //         });

        //         const inBounds = highway.ways.some((way) =>
        //             isPointInBounds(point, way.buffer_geometry),
        //         );
        //         if (carIndex === -1) {
        //             cars.push({
        //                 highway_name: highway.highway_name,
        //                 highway_id: highway.id,
        //                 vid: dataVid,
        //                 dev_id: dataId,
        //                 state: inBounds,
        //                 ref: ref.ref,
        //             });
        //         } else {
        //             const car = cars[carIndex];
        //             if (car.highway_id === highway.id) {
        //                 const isInWarning = !car.state && inBounds;
        //                 const isOutWarning = car.state && !inBounds;

        //                 const payload = {
        //                     vid: car.vid,
        //                     highway_name: highway.highway_name,
        //                     ref: ref.ref,
        //                 };

        //                 if (isInWarning) {
        //                     io.emit('warning', {
        //                         ...payload,
        //                         message: `Xe ${car.vid} đi vào ${highway.highway_name}`,
        //                         type: 1,
        //                         in_time: Date.now(),
        //                     });
        //                     console.log(
        //                         `Xe ${car.vid} đi vào ${highway.highway_name}`,
        //                     );
        //                 } else if (isOutWarning) {
        //                     io.emit('warning', {
        //                         ...payload,
        //                         message: `Xe ${car.vid} đi ra ${highway.highway_name}`,
        //                         type: 0,
        //                         out_time: Date.now(),
        //                     });
        //                     console.log(
        //                         `Xe ${car.vid} đi ra ${highway.highway_name}`,
        //                     );
        //                 }
        //                 car.state = inBounds;
        //             }
        //         }
        //         // console.log(cars);
        //     });
        // });

        // Đi vào các đường cao tốc CT.01, CT.01;CT.29...
        highways?.forEach((ref) => {
            const carIndex = cars.findIndex(
                (car) => car.vid === data[0]?.vid && car.ref_id.equals(ref._id),
            );

            const inBounds = ref.highways.some((highway) =>
                highway.ways.some((way) =>
                    isPointInBounds(point, way.buffer_geometry),
                ),
            );

            if (cars.length === 0 || carIndex === -1) {
                cars.push({
                    ref_id: ref._id,
                    vid: data[0]?.vid,
                    dev_id: data[0]?.id,
                    state: inBounds,
                });
            } else {
                const car = cars[carIndex];
                if (car.ref_id.equals(ref._id)) {
                    const isInWarning = !car.state && inBounds;
                    const isOutWarning = car.state && !inBounds;
                    const payload = {
                        vid: car.vid,
                        ref: ref.ref,
                    };

                    if (isInWarning) {
                        io.emit('warning', {
                            ...payload,
                            message: `Xe ${car.vid} đi vào ${ref.ref}`,
                            type: 1,
                            in_time: Date.now(),
                        });
                        console.log(`Xe ${car.vid} đi vào ${ref.ref}`);
                    } else if (isOutWarning) {
                        io.emit('warning', {
                            ...payload,
                            message: `Xe ${car.vid} đi ra ${ref.ref}`,
                            type: 0,
                            out_time: Date.now(),
                        });
                        console.log(`Xe ${car.vid} đi ra ${ref.ref}`);
                    }
                    car.state = inBounds;
                }
            }
            // console.log(cars.length);
        });
    } catch (error) {
        // console.log(error);
    }
};

module.exports = { warningHighWay };
