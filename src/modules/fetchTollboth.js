const { default: axios } = require('axios');
const turf = require('@turf/turf');
const { VN_REGION_TOLL_BOTH } = require('../constant');

const fetchTollBoth = async () => {
    console.log('LOADING...');
    const res = await axios.get(VN_REGION_TOLL_BOTH);
    console.log('LOADED');
    // const vietNameTollBoth = res?.data?.elements.filter((node) =>
    //     vietnameseRegex.test(node?.tags?.name),
    // );
    const tollBoth = res?.data?.elements.map((node) => {
        const point = turf.point([Number(node.lon), Number(node.lat)]);
        const bufferedPoint = turf.buffer(point, 20, { units: 'meters' });
        const bufferedLineCoords = bufferedPoint.geometry.coordinates[0].map(
            (coord) => [coord[1], coord[0]], // Đảo lại để trả về [lat, lon]
        );

        return {
            ref: 'Trạm thu phí',
            highways: [
                {
                    highway_name: node?.tags?.name,
                    ways: [
                        {
                            buffer_geometry: bufferedLineCoords,
                        },
                    ],
                },
            ],
        };
    });
    return tollBoth;
};

module.exports = { fetchTollBoth };
