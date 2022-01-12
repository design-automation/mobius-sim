import { EEntType, LONGLAT } from '../common';
import { getArrDepth } from '../../util/arrs';
import proj4 from 'proj4';
import { vecAng2, vecDot } from '../../geom/vectors';
import { rotateMatrix, multMatrix } from '../../geom/matrix';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9fZ2VvanNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vaW8vaW9fZ2VvanNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQVEsUUFBUSxFQUFvQixPQUFPLEVBQThCLE1BQU0sV0FBVyxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM5QyxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRTdELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFHdEMsSUFBSyxrQkFPSjtBQVBELFdBQUssa0JBQWtCO0lBQ25CLHFDQUFlLENBQUE7SUFDZiwrQ0FBeUIsQ0FBQTtJQUN6Qix5Q0FBbUIsQ0FBQTtJQUNuQiwrQ0FBeUIsQ0FBQTtJQUN6Qix5REFBbUMsQ0FBQTtJQUNuQyxtREFBNkIsQ0FBQTtBQUNqQyxDQUFDLEVBUEksa0JBQWtCLEtBQWxCLGtCQUFrQixRQU90QjtBQUNELE1BQU0sVUFBVSxhQUFhLENBQUMsS0FBYyxFQUFFLFFBQXVCLEVBQUUsT0FBZ0IsRUFBRSxJQUFZO0lBQ2pHLCtCQUErQjtJQUMvQixNQUFNLFFBQVEsR0FBb0IsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0QsOEJBQThCO0lBQzlCLElBQUksVUFBVSxHQUFZLElBQUksQ0FBQztJQUMvQixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDdkQsTUFBTSxLQUFLLEdBQVEsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixD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