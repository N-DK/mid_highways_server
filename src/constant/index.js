const VN_REGION =
    'http://overpass-api.de/api/interpreter?data=[out:json];way[%22highway%22=%22motorway%22](9.0,102.0,24.0,110.0);out%20geom;';
const VN_REGION_TRUNK =
    'http://overpass-api.de/api/interpreter?data=[out:json];way[%22highway%22=%22trunk%22](9.0,102.0,24.0,110.0);out%20geom;';
const VN_REGION_TOLL_BOTH =
    'https://overpass-api.de/api/interpreter?data=[out:json];node[%22barrier%22=%22toll_booth%22](9.0,102.0,24.0,110.0);out%20geom;';
module.exports = { VN_REGION, VN_REGION_TRUNK, VN_REGION_TOLL_BOTH };
