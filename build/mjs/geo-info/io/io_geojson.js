import proj4 from 'proj4';
import { multMatrix, rotateMatrix } from '../../geom/matrix';
import { vecAng2, vecDot } from '../../geom/vectors';
import { getArrDepth } from '../../util/arrs';
import { EEntType, LONGLAT } from '../common';
import { getObjSets } from './common';
var EGeojsoFeatureType;
(function (EGeojsoFeatureType) {
    EGeojsoFeatureType["POINT"] = "Point";
    EGeojsoFeatureType["LINESTRING"] = "LineString";
    EGeojsoFeatureType["POLYGON"] = "Polygon";
    EGeojsoFeatureType["MULTIPOINT"] = "MultiPoint";
    EGeojsoFeatureType["MULTILINESTRING"] = "MultiLineString";
    EGeojsoFeatureType["MULTIPOLYGON"] = "MultiPolygon";
})(EGeojsoFeatureType || (EGeojsoFeatureType = {}));
export function exportGeojson(model, entities, flatten, ssid) {
    // create the projection object
    const proj_obj = _createProjection(model);
    // calculate angle of rotation
    let rot_matrix = null;
    if (model.modeldata.attribs.query.hasModelAttrib('north')) {
        const north = model.modeldata.attribs.get.getModelAttribVal('north');
        if (Array.isArray(north)) {
            const rot_ang = vecAng2([0, 1, 0], [north[0], north[1], 0], [0, 0, 1]);
            rot_matrix = rotateMatrix([[0, 0, 0], [0, 0, 1]], -rot_ang);
        }
    }
    // create features from pgons, plines, points
    const features = [];
    const obj_sets = getObjSets(model, entities, ssid);
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
    const wires_i = model.modeldata.geom.nav.navAnyToWire(EEntType.PGON, pgon_i);
    for (let i = 0; i < wires_i.length; i++) {
        const coords = [];
        const posis_i = model.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wires_i[i]);
        for (const posi_i of posis_i) {
            const xyz = model.modeldata.attribs.posis.getPosiCoords(posi_i);
            const lat_long = _xformFromXYZToLongLat(xyz, proj_obj, rot_matrix, flatten);
            coords.push(lat_long);
        }
        all_coords.push(coords);
    }
    const all_props = {};
    for (const name of model.modeldata.attribs.getAttribNames(EEntType.PGON)) {
        if (!name.startsWith('_')) {
            all_props[name] = model.modeldata.attribs.get.getEntAttribVal(EEntType.PGON, pgon_i, name);
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
    const posis_i = model.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
    for (const posi_i of posis_i) {
        const xyz = model.modeldata.attribs.posis.getPosiCoords(posi_i);
        const lat_long = _xformFromXYZToLongLat(xyz, proj_obj, rot_matrix, flatten);
        coords.push(lat_long);
    }
    if (model.modeldata.geom.query.isWireClosed(wire_i)) {
        coords.push(coords[0]);
    }
    const all_props = {};
    for (const name of model.modeldata.attribs.getAttribNames(EEntType.PLINE)) {
        if (!name.startsWith('_')) {
            all_props[name] = model.modeldata.attribs.get.getEntAttribVal(EEntType.PLINE, pline_i, name);
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
export function importGeojson(model, geojson_str, elevation) {
    // parse the json data str
    const geojson_obj = JSON.parse(geojson_str);
    const proj_obj = _createProjection(model);
    // calculate angle of rotation
    let rot_matrix = null;
    if (model.modeldata.attribs.query.hasModelAttrib('north')) {
        const north = model.modeldata.attribs.get.getModelAttribVal('north');
        if (Array.isArray(north)) {
            const rot_ang = vecAng2([0, 1, 0], [north[0], north[1], 0], [0, 0, 1]);
            rot_matrix = rotateMatrix([[0, 0, 0], [0, 0, 1]], rot_ang);
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
    let longitude = LONGLAT[0];
    let latitude = LONGLAT[1];
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
    const proj_obj = proj4(proj_from_str, proj_to_str);
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
        xyz = multMatrix(xyz, rot_matrix);
    }
    // create the posi
    const posi_i = model.modeldata.geom.add.addPosi();
    model.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
    // create the point
    const point_i = model.modeldata.geom.add.addPoint(posi_i);
    // add attribs
    _addAttribsToModel(model, EEntType.POINT, point_i, point);
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
            xyzs[i] = multMatrix(xyzs[i], rot_matrix);
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
    _addAttribsToModel(model, EEntType.PLINE, pline_i, linestring);
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
                xyzs[i] = multMatrix(xyzs[i], rot_matrix);
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
    if (vecDot(normal, [0, 0, 1]) < 0) {
        model.modeldata.geom.edit_topo.reverse(model.modeldata.geom.nav.navPgonToWire(pgon_i)[0]);
    }
    // add attribs
    _addAttribsToModel(model, EEntType.PGON, pgon_i, polygon);
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
    _addAttribsToModel(model, EEntType.COLL, coll_i, multipoint);
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
    _addAttribsToModel(model, EEntType.COLL, coll_i, multilinestring);
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
    _addAttribsToModel(model, EEntType.COLL, coll_i, multipolygon);
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
    if (getArrDepth(long_lat_arr) === 1) {
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
    if (getArrDepth(xyz) === 1) {
        xyz = xyz;
        // rotate to north
        if (rot_matrix !== null) {
            xyz = multMatrix(xyz, rot_matrix);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9fZ2VvanNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vaW8vaW9fZ2VvanNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFHMUIsT0FBTyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsUUFBUSxFQUFZLE9BQU8sRUFBNEMsTUFBTSxXQUFXLENBQUM7QUFFbEcsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUd0QyxJQUFLLGtCQU9KO0FBUEQsV0FBSyxrQkFBa0I7SUFDbkIscUNBQWUsQ0FBQTtJQUNmLCtDQUF5QixDQUFBO0lBQ3pCLHlDQUFtQixDQUFBO0lBQ25CLCtDQUF5QixDQUFBO0lBQ3pCLHlEQUFtQyxDQUFBO0lBQ25DLG1EQUE2QixDQUFBO0FBQ2pDLENBQUMsRUFQSSxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBT3RCO0FBQ0QsTUFBTSxVQUFVLGFBQWEsQ0FBQyxLQUFjLEVBQUUsUUFBdUIsRUFBRSxPQUFnQixFQUFFLElBQVk7SUFDakcsK0JBQStCO0lBQy9CLE1BQU0sUUFBUSxHQUFvQixpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzRCw4QkFBOEI7SUFDOUIsSUFBSSxVQUFVLEdBQVksSUFBSSxDQUFDO0lBQy9CLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUN2RCxNQUFNLEtBQUssR0FBUSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENB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