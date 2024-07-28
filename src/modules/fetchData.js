const { default: axios } = require('axios');
const turf = require('@turf/turf');
const vietnameseRegex =
    /[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯăâêôơưÁÉÍÓÚÝ]/;

const fetchData = async (type) => {
    try {
        console.log('LOADING...');
        const res = await axios.get(type);
        console.log('LOADED');
        const highwayData = res?.data?.elements.map((way) => ({
            id: way.id,
            highway_name: way.tags.name,
            ref: way.tags.ref,
            nodes: way.geometry.map((node) => [node.lat, node.lon]),
            bounds: [
                [way.bounds.minlat, way.bounds.minlon],
                [way.bounds.maxlat, way.bounds.maxlon],
            ],
            maxSpeed: way.tags?.maxspeed,
            minSpeed: way.tags?.minspeed,
            lanes: way.tags?.lanes,
        }));

        const vietNameHighways = highwayData.filter((highway) =>
            vietnameseRegex.test(highway.highway_name),
        );
        const groupedHighwayData = vietNameHighways.reduce((acc, way) => {
            const {
                ref,
                highway_name,
                nodes,
                bounds,
                maxSpeed,
                minSpeed,
                lanes,
            } = way;

            if (!ref || !highway_name) {
                return acc;
            }

            if (!acc[ref]) {
                acc[ref] = {
                    ref: ref,
                    highways: {},
                };
            }

            if (!acc[ref].highways[highway_name]) {
                acc[ref].highways[highway_name] = [];
            }

            const line = turf.lineString(
                nodes.map((node) => [node[1], node[0]]),
            );
            const bufferedLine = turf.buffer(line, 15, { units: 'meters' });
            const bufferedLineCoords =
                bufferedLine?.geometry.coordinates[0].map((coord) => [
                    coord[1],
                    coord[0],
                ]);

            acc[ref].highways[highway_name].push({
                id: way.id,
                nodes: nodes,
                bounds: bounds,
                maxSpeed: maxSpeed,
                minSpeed: minSpeed,
                lanes: lanes,
                buffer_geometry: bufferedLineCoords,
            });

            return acc;
        }, {});

        let uniqueId = 0;

        const groupedHighwaysArray = Object.values(groupedHighwayData).map(
            (group) => ({
                ref: group.ref,
                highways: Object.entries(group.highways).map(
                    ([highway_name, highways]) => ({
                        id: uniqueId++,
                        highway_name,
                        ways: highways.map((highway) => ({
                            ...highway,
                            id: uniqueId++,
                        })),
                    }),
                ),
            }),
        );
        return groupedHighwaysArray;
    } catch (error) {
        console.log(error);
    }
};

module.exports = fetchData;
