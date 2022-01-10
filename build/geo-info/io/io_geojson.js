"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importGeojson = exports.exportGeojson = void 0;
const common_1 = require("../common");
const arrs_1 = require("@libs/util/arrs");
const proj4_1 = __importDefault(require("proj4"));
const vectors_1 = require("../../geom/vectors");
const matrix_1 = require("../../geom/matrix");
const common_2 = require("./common");
var EGeojsoFeatureType;
(function (EGeojsoFeatureType) {
    EGeojsoFeatureType["POINT"] = "Point";
    EGeojsoFeatureType["LINESTRING"] = "LineString";
    EGeojsoFeatureType["POLYGON"] = "Polygon";
    EGeojsoFeatureType["MULTIPOINT"] = "MultiPoint";
    EGeojsoFeatureType["MULTILINESTRING"] = "MultiLineString";
    EGeojsoFeatureType["MULTIPOLYGON"] = "MultiPolygon";
})(EGeojsoFeatureType || (EGeojsoFeatureType = {}));
function exportGeojson(model, entities, flatten, ssid) {
    // create the projection object
    const proj_obj = _createProjection(model);
    // calculate angle of rotation
    let rot_matrix = null;
    if (model.modeldata.attribs.query.hasModelAttrib('north')) {
        const north = model.modeldata.attribs.get.getModelAttribVal('north');
        if (Array.isArray(north)) {
            const rot_ang = (0, vectors_1.vecAng2)([0, 1, 0], [north[0], north[1], 0], [0, 0, 1]);
            rot_matrix = (0, matrix_1.rotateMatrix)([[0, 0, 0], [0, 0, 1]], -rot_ang);
        }
    }
    // create features from pgons, plines, points
    const features = [];
    const obj_sets = (0, common_2.getObjSets)(model, entities, ssid);
    for (const pgon_i of obj_sets.pg) {
        features.push(_createGeojsonPolygon(model, pgon_i, proj_obj, rot_matrix, flatten));
    }
    for (const pline_i of obj_sets.pl) {
        features.push(_createGeojsonLineString(model, pline_i, proj_obj, rot_matrix, flatten));
    }
    for (const pline_i of obj_sets.pt) {
        //
        //
        // TODO implement points
        //
        //
    }
    const export_json = {
        'type': 'FeatureCollection',
        'features': features
    };
    return JSON.stringify(export_json, null, 2); // pretty
}
exports.exportGeojson = exportGeojson;
function _createGeojsonPolygon(model, pgon_i, proj_obj, rot_matrix, flatten) {
    // {
    //     "type": "Feature",
    //     "geometry": {
    //       "type": "Polygon",
    //       "coordinates": [
    //         [
    //           [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
    //           [100.0, 1.0], [100.0, 0.0]
    //         ]
    //       ]
    //     },
    //     "properties": {
    //       "prop0": "value0",
    //       "prop1": { "this": "that" }
    //     }
    // }
    const all_coords = [];
    const wires_i = model.modeldata.geom.nav.navAnyToWire(common_1.EEntType.PGON, pgon_i);
    for (let i = 0; i < wires_i.length; i++) {
        const coords = [];
        const posis_i = model.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.WIRE, wires_i[i]);
        for (const posi_i of posis_i) {
            const xyz = model.modeldata.attribs.posis.getPosiCoords(posi_i);
            const lat_long = _xformFromXYZToLongLat(xyz, proj_obj, rot_matrix, flatten);
            coords.push(lat_long);
        }
        all_coords.push(coords);
    }
    const all_props = {};
    for (const name of model.modeldata.attribs.getAttribNames(common_1.EEntType.PGON)) {
        if (!name.startsWith('_')) {
            all_props[name] = model.modeldata.attribs.get.getEntAttribVal(common_1.EEntType.PGON, pgon_i, name);
        }
    }
    return {
        'type': 'Feature',
        'geometry': {
            'type': 'Polygon',
            'coordinates': all_coords
        },
        'properties': all_props
    };
}
function _createGeojsonLineString(model, pline_i, proj_obj, rot_matrix, flatten) {
    // {
    //     "type": "Feature",
    //     "geometry": {
    //       "type": "LineString",
    //       "coordinates": [
    //         [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
    //       ]
    //     },
    //     "properties": {
    //       "prop0": "value0",
    //       "prop1": 0.0
    //     }
    // },
    const coords = [];
    const wire_i = model.modeldata.geom.nav.navPlineToWire(pline_i);
    const posis_i = model.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.WIRE, wire_i);
    for (const posi_i of posis_i) {
        const xyz = model.modeldata.attribs.posis.getPosiCoords(posi_i);
        const lat_long = _xformFromXYZToLongLat(xyz, proj_obj, rot_matrix, flatten);
        coords.push(lat_long);
    }
    if (model.modeldata.geom.query.isWireClosed(wire_i)) {
        coords.push(coords[0]);
    }
    const all_props = {};
    for (const name of model.modeldata.attribs.getAttribNames(common_1.EEntType.PLINE)) {
        if (!name.startsWith('_')) {
            all_props[name] = model.modeldata.attribs.get.getEntAttribVal(common_1.EEntType.PLINE, pline_i, name);
        }
    }
    return {
        'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': coords
        },
        'properties': all_props
    };
}
/**
* Import geojson
*/
function importGeojson(model, geojson_str, elevation) {
    // parse the json data str
    const geojson_obj = JSON.parse(geojson_str);
    const proj_obj = _createProjection(model);
    // calculate angle of rotation
    let rot_matrix = null;
    if (model.modeldata.attribs.query.hasModelAttrib('north')) {
        const north = model.modeldata.attribs.get.getModelAttribVal('north');
        if (Array.isArray(north)) {
            const rot_ang = (0, vectors_1.vecAng2)([0, 1, 0], [north[0], north[1], 0], [0, 0, 1]);
            rot_matrix = (0, matrix_1.rotateMatrix)([[0, 0, 0], [0, 0, 1]], rot_ang);
        }
    }
    // arrays for features
    const point_f = [];
    const linestring_f = [];
    const polygon_f = [];
    const multipoint_f = [];
    const multilinestring_f = [];
    const multipolygon_f = [];
    const other_f = [];
    // arrays for objects
    const points_i = new Set();
    const plines_i = new Set();
    const pgons_i = new Set();
    const colls_i = new Set();
    // loop
    for (const feature of geojson_obj.features) {
        // get the features
        switch (feature.geometry.type) {
            case EGeojsoFeatureType.POINT:
                point_f.push(feature);
                const point_i = _addPointToModel(model, feature, proj_obj, rot_matrix, elevation);
                if (point_i !== null) {
                    points_i.add(point_i);
                }
                break;
            case EGeojsoFeatureType.LINESTRING:
                linestring_f.push(feature);
                const pline_i = _addPlineToModel(model, feature, proj_obj, rot_matrix, elevation);
                if (pline_i !== null) {
                    plines_i.add(pline_i);
                }
                break;
            case EGeojsoFeatureType.POLYGON:
                polygon_f.push(feature);
                const pgon_i = _addPgonToModel(model, feature, proj_obj, rot_matrix, elevation);
                if (pgon_i !== null) {
                    pgons_i.add(pgon_i);
                }
                break;
            case EGeojsoFeatureType.MULTIPOINT:
                multipoint_f.push(feature);
                const points_coll_i = _addPointCollToModel(model, feature, proj_obj, rot_matrix, elevation);
                for (const point_coll_i of points_coll_i[0]) {
                    points_i.add(point_coll_i);
                }
                colls_i.add(points_coll_i[1]);
                break;
            case EGeojsoFeatureType.MULTILINESTRING:
                multilinestring_f.push(feature);
                const plines_coll_i = _addPlineCollToModel(model, feature, proj_obj, rot_matrix, elevation);
                for (const pline_coll_i of plines_coll_i[0]) {
                    plines_i.add(pline_coll_i);
                }
                colls_i.add(plines_coll_i[1]);
                break;
            case EGeojsoFeatureType.MULTIPOLYGON:
                multipolygon_f.push(feature);
                const pgons_coll_i = _addPgonCollToModel(model, feature, proj_obj, rot_matrix, elevation);
                for (const pgon_coll_i of pgons_coll_i[0]) {
                    pgons_i.add(pgon_coll_i);
                }
                colls_i.add(pgons_coll_i[1]);
                break;
            default:
                other_f.push(feature);
                break;
        }
    }
    // return sets
    return {
        pt: points_i,
        pl: plines_i,
        pg: pgons_i,
        co: colls_i
    };
}
exports.importGeojson = importGeojson;
/**
 * Get long lat, Detect CRS, create projection function
 * @param model The model.
 * @param point The features to add.
 */
function _createProjection(model) {
    // create the function for transformation
    const proj_str_a = '+proj=tmerc +lat_0=';
    const proj_str_b = ' +lon_0=';
    const proj_str_c = '+k=1 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs';
    let longitude = common_1.LONGLAT[0];
    let latitude = common_1.LONGLAT[1];
    if (model.modeldata.attribs.query.hasModelAttrib('geolocation')) {
        const geolocation = model.modeldata.attribs.get.getModelAttribVal('geolocation');
        const long_value = geolocation['longitude'];
        if (typeof long_value !== 'number') {
            throw new Error('Longitude attribute must be a number.');
        }
        longitude = long_value;
        if (longitude < -180 || longitude > 180) {
            throw new Error('Longitude attribute must be between -180 and 180.');
        }
        const lat_value = geolocation['latitude'];
        if (typeof lat_value !== 'number') {
            throw new Error('Latitude attribute must be a number');
        }
        latitude = lat_value;
        if (latitude < 0 || latitude > 90) {
            throw new Error('Latitude attribute must be between 0 and 90.');
        }
    }
    // try to figure out what the projection is of the source file
    // let proj_from_str = 'WGS84';
    // if (geojson_obj.hasOwnProperty('crs')) {
    //     if (geojson_obj.crs.hasOwnProperty('properties')) {
    //         if (geojson_obj.crs.properties.hasOwnProperty('name')) {
    //             const name: string = geojson_obj.crs.properties.name;
    //             const epsg_index = name.indexOf('EPSG');
    //             if (epsg_index !== -1) {
    //                 let epsg = name.slice(epsg_index);
    //                 epsg = epsg.replace(/\s/g, '+');
    //                 if (epsg === 'EPSG:4326') {
    //                     // do nothing, 'WGS84' is fine
    //                 } else if (['EPSG:4269', 'EPSG:3857', 'EPSG:3785', 'EPSG:900913', 'EPSG:102113'].indexOf(epsg) !== -1) {
    //                     // these are the epsg codes that proj4 knows
    //                     proj_from_str = epsg;
    //                 } else if (epsg === 'EPSG:3414') {
    //                     // singapore
    //                     proj_from_str =
    //                         '+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 ' +
    //                         '+ellps=WGS84 +units=m +no_defs';
    //                 }
    //             }
    //         }
    //     }
    // }
    // console.log('CRS of geojson data', proj_from_str);
    const proj_from_str = 'WGS84';
    const proj_to_str = proj_str_a + latitude + proj_str_b + longitude + proj_str_c;
    const proj_obj = (0, proj4_1.default)(proj_from_str, proj_to_str);
    return proj_obj;
}
/*
    "geometry": {
        "type": "Point",
        "coordinates": [40, 40]
    }
*/
/**
 * Add a point to the model
 * @param model The model.
 * @param point The features to add.
 */
function _addPointToModel(model, point, proj_obj, rot_matrix, elevation) {
    if (point.geometry.coordinates.length === 0) {
        return null;
    }
    // add feature
    let xyz = _xformFromLongLatToXYZ(point.geometry.coordinates, proj_obj, elevation);
    // rotate to north
    if (rot_matrix !== null) {
        xyz = (0, matrix_1.multMatrix)(xyz, rot_matrix);
    }
    // create the posi
    const posi_i = model.modeldata.geom.add.addPosi();
    model.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
    // create the point
    const point_i = model.modeldata.geom.add.addPoint(posi_i);
    // add attribs
    _addAttribsToModel(model, common_1.EEntType.POINT, point_i, point);
    // return the index
    return point_i;
}
/*
    "geometry": {
        "type": "LineString",
        "coordinates": [
            [30, 10], [10, 30], [40, 40]
        ]
    }
*/
/**
 * Add a pline to the model
 * @param model The model
 * @param linestrings The features to add.
 */
function _addPlineToModel(model, linestring, proj_obj, rot_matrix, elevation) {
    // check that the polyline has 2 or more positions
    if (linestring.geometry.coordinates.length < 2) {
        return null;
    }
    // add feature
    let xyzs = _xformFromLongLatToXYZ(linestring.geometry.coordinates, proj_obj, elevation);
    const first_xyz = xyzs[0];
    const last_xyz = xyzs[xyzs.length - 1];
    const close = xyzs.length > 2 && first_xyz[0] === last_xyz[0] && first_xyz[1] === last_xyz[1];
    if (close) {
        xyzs = xyzs.slice(0, xyzs.length - 1);
    }
    // rotate to north
    if (rot_matrix !== null) {
        for (let i = 0; i < xyzs.length; i++) {
            xyzs[i] = (0, matrix_1.multMatrix)(xyzs[i], rot_matrix);
        }
    }
    // create the posis
    const posis_i = [];
    for (const xyz of xyzs) {
        const posi_i = model.modeldata.geom.add.addPosi();
        model.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    // create the pline
    const pline_i = model.modeldata.geom.add.addPline(posis_i, close);
    // add attribs
    _addAttribsToModel(model, common_1.EEntType.PLINE, pline_i, linestring);
    // return the index
    return pline_i;
}
/*
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [[35, 10], [45, 45], [15, 40], [10, 20], [35, 10]],
            [[20, 30], [35, 35], [30, 20], [20, 30]]
        ]
    }
*/
/**
 * Add a pgon to the model
 * @param model The model
 * @param polygons The features to add.
 */
function _addPgonToModel(model, polygon, proj_obj, rot_matrix, elevation) {
    // check that the first ring has 2 or more positions
    if (polygon.geometry.coordinates.length && polygon.geometry.coordinates[0].length < 2) {
        return null;
    }
    // add feature
    const rings = [];
    for (const ring of polygon.geometry.coordinates) {
        const xyzs = _xformFromLongLatToXYZ(ring, proj_obj, elevation);
        // rotate to north
        if (rot_matrix !== null) {
            for (let i = 0; i < xyzs.length; i++) {
                xyzs[i] = (0, matrix_1.multMatrix)(xyzs[i], rot_matrix);
            }
        }
        // create the posis
        const posis_i = [];
        for (const xyz of xyzs) {
            const posi_i = model.modeldata.geom.add.addPosi();
            model.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
            posis_i.push(posi_i);
        }
        rings.push(posis_i);
    }
    // create the pgon
    const pgon_i = model.modeldata.geom.add.addPgon(rings[0], rings.slice(1));
    // check if it needs flipping
    // TODO there may be a faster way to do this
    const normal = model.modeldata.geom.query.getPgonNormal(pgon_i);
    if ((0, vectors_1.vecDot)(normal, [0, 0, 1]) < 0) {
        model.modeldata.geom.edit_topo.reverse(model.modeldata.geom.nav.navPgonToWire(pgon_i)[0]);
    }
    // add attribs
    _addAttribsToModel(model, common_1.EEntType.PGON, pgon_i, polygon);
    // return the index
    return pgon_i;
}
/*
    "geometry": {
        "type": "MultiPoint",
        "coordinates": [
            [10, 10],
            [40, 40]
        ]
    }
*/
/**
 * Adds multipoint to the model
 * @param model The model
 * @param multipoint The features to add.
 */
function _addPointCollToModel(model, multipoint, proj_obj, rot_matrix, elevation) {
    const ssid = model.modeldata.active_ssid;
    // add features
    const points_i = [];
    for (const coordinates of multipoint.geometry.coordinates) {
        const point_i = _addPointToModel(model, { 'geometry': { 'coordinates': coordinates } }, proj_obj, rot_matrix, elevation);
        points_i.push(point_i);
    }
    // create the collection
    const coll_i = model.modeldata.geom.add.addColl();
    model.modeldata.geom.snapshot.addCollPoints(ssid, coll_i, points_i);
    // add attribs
    _addAttribsToModel(model, common_1.EEntType.COLL, coll_i, multipoint);
    // return the indices of the plines and the index of the collection
    return [points_i, coll_i];
}
/*
    "geometry": {
        "type": "MultiLineString",
        "coordinates": [
            [[10, 10], [20, 20], [10, 40]],
            [[40, 40], [30, 30], [40, 20], [30, 10]]
        ]
    }
*/
/**
 * Adds multilinestrings to the model
 * @param multilinestrings The features to add.
 * @param model The model
 */
function _addPlineCollToModel(model, multilinestring, proj_obj, rot_matrix, elevation) {
    const ssid = model.modeldata.active_ssid;
    // add features
    const plines_i = [];
    for (const coordinates of multilinestring.geometry.coordinates) {
        const pline_i = _addPlineToModel(model, { 'geometry': { 'coordinates': coordinates } }, proj_obj, rot_matrix, elevation);
        plines_i.push(pline_i);
    }
    // create the collection
    const coll_i = model.modeldata.geom.add.addColl();
    model.modeldata.geom.snapshot.addCollPlines(ssid, coll_i, plines_i);
    // add attribs
    _addAttribsToModel(model, common_1.EEntType.COLL, coll_i, multilinestring);
    // return the indices of the plines and the index of the collection
    return [plines_i, coll_i];
}
/*
    "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
            [
                [[40, 40], [20, 45], [45, 30], [40, 40]]
            ],
            [
                [[20, 35], [10, 30], [10, 10], [30, 5], [45, 20], [20, 35]],
                [[30, 20], [20, 15], [20, 25], [30, 20]]
            ]
        ]
    }
*/
/**
 * Adds multipolygons to the model
 * @param model The model
 * @param multipolygons The features to add.
 */
function _addPgonCollToModel(model, multipolygon, proj_obj, rot_matrix, elevation) {
    const ssid = model.modeldata.active_ssid;
    // add features
    const pgons_i = [];
    for (const coordinates of multipolygon.geometry.coordinates) {
        const pgon_i = _addPgonToModel(model, { 'geometry': { 'coordinates': coordinates } }, proj_obj, rot_matrix, elevation);
        pgons_i.push(pgon_i);
    }
    // create the collection
    const coll_i = model.modeldata.geom.add.addColl();
    model.modeldata.geom.snapshot.addCollPgons(ssid, coll_i, pgons_i);
    // add attribs
    _addAttribsToModel(model, common_1.EEntType.COLL, coll_i, multipolygon);
    // return the indices of the plines and the index of the collection
    return [pgons_i, coll_i];
}
/**
 * Adds attributes to the model
 * @param model The model
 */
function _addAttribsToModel(model, ent_type, ent_i, feature) {
    // add attribs
    if (!feature.hasOwnProperty('properties')) {
        return;
    }
    for (const name of Object.keys(feature.properties)) {
        let value = feature.properties[name];
        if (value === null) {
            continue;
        }
        const value_type = typeof feature.properties[name];
        if (value_type === 'object') {
            value = JSON.stringify(value);
        }
        model.modeldata.attribs.set.setCreateEntsAttribVal(ent_type, ent_i, name, value);
    }
}
/**
 * Converts geojson long lat to cartesian coords
 * @param long_lat_arr
 * @param elevation
 */
function _xformFromLongLatToXYZ(long_lat_arr, proj_obj, elevation) {
    if ((0, arrs_1.getArrDepth)(long_lat_arr) === 1) {
        const long_lat = long_lat_arr;
        const xy = proj_obj.forward(long_lat);
        return [xy[0], xy[1], elevation];
    }
    else {
        long_lat_arr = long_lat_arr;
        const xyzs_xformed = [];
        for (const long_lat of long_lat_arr) {
            if (long_lat.length >= 2) {
                const xyz = _xformFromLongLatToXYZ(long_lat, proj_obj, elevation);
                xyzs_xformed.push(xyz);
            }
        }
        return xyzs_xformed;
    }
}
/**
 * Converts cartesian coords to geojson long lat
 * @param xyz
 * @param flatten
 */
function _xformFromXYZToLongLat(xyz, proj_obj, rot_matrix, flatten) {
    if ((0, arrs_1.getArrDepth)(xyz) === 1) {
        xyz = xyz;
        // rotate to north
        if (rot_matrix !== null) {
            xyz = (0, matrix_1.multMatrix)(xyz, rot_matrix);
        }
        return proj_obj.inverse([xyz[0], xyz[1]]);
    }
    else {
        xyz = xyz;
        const long_lat_arr = [];
        for (const a_xyz of xyz) {
            const lat_long = _xformFromXYZToLongLat(a_xyz, proj_obj, rot_matrix, flatten);
            long_lat_arr.push(lat_long);
        }
        return long_lat_arr;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9fZ2VvanNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vaW8vaW9fZ2VvanNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxzQ0FBa0c7QUFDbEcsMENBQThDO0FBQzlDLGtEQUEwQjtBQUMxQixnREFBcUQ7QUFDckQsOENBQTZEO0FBRTdELHFDQUFzQztBQUd0QyxJQUFLLGtCQU9KO0FBUEQsV0FBSyxrQkFBa0I7SUFDbkIscUNBQWUsQ0FBQTtJQUNmLCtDQUF5QixDQUFBO0lBQ3pCLHlDQUFtQixDQUFBO0lBQ25CLCtDQUF5QixDQUFBO0lBQ3pCLHlEQUFtQyxDQUFBO0lBQ25DLG1EQUE2QixDQUFBO0FBQ2pDLENBQUMsRUFQSSxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBT3RCO0FBQ0QsU0FBZ0IsYUFBYSxDQUFDLEtBQWMsRUFBRSxRQUF1QixFQUFFLE9BQWdCLEVBQUUsSUFBWTtJQUNqRywrQkFBK0I7SUFDL0IsTUFBTSxRQUFRLEdBQW9CLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNELDhCQUE4QjtJQUM5QixJQUFJLFVBQVUsR0FBWSxJQUFJLENBQUM7SUFDL0IsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3ZELE1BQU0sS0FBSyxHQUFRLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQVEsQ0FBQztRQUNqRixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDdEIsTUFBTSxPQUFPLEdBQVcsSUFBQSxpQkFBTyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUs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