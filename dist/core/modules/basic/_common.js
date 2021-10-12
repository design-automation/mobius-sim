"use strict";
/**
 * Shared utility functions
 * @module
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlanesSeq = exports.getCenterOfMass = exports.getCentroid = exports.getCentoridFromEnts = exports.getPlane = exports.getRay = exports.getOrigin = void 0;
const _check_ids_1 = require("../../_check_ids");
const common_1 = require("../../../libs/geo-info/common");
const arrs_1 = require("../../../libs/util/arrs");
const vectors_1 = require("../../../libs/geom/vectors");
const common_func_1 = require("../../../libs/geo-info/common_func");
const _ray_1 = require("../../../core/inline/_ray");
const _plane_1 = require("../../../core/inline/_plane");
const THREE = __importStar(require("three"));
const three_1 = require("three");
const EPS = 1e-8;
// ================================================================================================
function getOrigin(__model__, data, fn_name) {
    if ((0, common_func_1.isXYZ)(data)) {
        return data;
    }
    if ((0, common_func_1.isRay)(data)) {
        return data[0];
    }
    if ((0, common_func_1.isPlane)(data)) {
        return data[0];
    }
    const ents = data;
    const origin = getCentoridFromEnts(__model__, ents, fn_name);
    return origin;
}
exports.getOrigin = getOrigin;
// ================================================================================================
function getRay(__model__, data, fn_name) {
    if ((0, common_func_1.isXYZ)(data)) {
        return [data, [0, 0, 1]];
    }
    if ((0, common_func_1.isRay)(data)) {
        return data;
    }
    if ((0, common_func_1.isPlane)(data)) {
        return (0, _ray_1.rayFromPln)(false, data);
    }
    const ents = data;
    const origin = getCentoridFromEnts(__model__, ents, fn_name);
    return [origin, [0, 0, 1]];
}
exports.getRay = getRay;
// ================================================================================================
function getPlane(__model__, data, fn_name) {
    if ((0, common_func_1.isXYZ)(data)) {
        return [data, [1, 0, 0], [0, 1, 0]];
    }
    if ((0, common_func_1.isRay)(data)) {
        return (0, _plane_1.plnFromRay)(false, data);
    }
    if ((0, common_func_1.isPlane)(data)) {
        return data;
    }
    const ents = data;
    const origin = getCentoridFromEnts(__model__, ents, fn_name);
    return [origin, [1, 0, 0], [0, 1, 0]];
}
exports.getPlane = getPlane;
// ================================================================================================
function getCentoridFromEnts(__model__, ents, fn_name) {
    // this must be an ID or an array of IDs, so lets get the centroid
    // TODO this error message is confusing
    const ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'ents', ents, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [common_1.EEntType.POSI, common_1.EEntType.VERT, common_1.EEntType.POINT, common_1.EEntType.EDGE, common_1.EEntType.WIRE,
        common_1.EEntType.PLINE, common_1.EEntType.PGON, common_1.EEntType.COLL]);
    const centroid = getCentroid(__model__, ents_arr);
    if (Array.isArray(centroid[0])) {
        return (0, vectors_1.vecAvg)(centroid);
    }
    return centroid;
}
exports.getCentoridFromEnts = getCentoridFromEnts;
// ================================================================================================
function getCentroid(__model__, ents_arr) {
    if ((0, arrs_1.getArrDepth)(ents_arr) === 1) {
        const [ent_type, index] = ents_arr;
        const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
        return _centroidPosis(__model__, posis_i);
    }
    else {
        // divide the input into posis and non posis
        ents_arr = ents_arr;
        const posis_i = [];
        const np_ents_arr = [];
        for (const ent_arr of ents_arr) {
            if (ent_arr[0] === common_1.EEntType.POSI) {
                posis_i.push(ent_arr[1]);
            }
            else {
                np_ents_arr.push(ent_arr);
            }
        }
        // if we only have posis, just return one centorid
        // in all other cases return a list of centroids
        const np_cents = np_ents_arr.map(ent_arr => getCentroid(__model__, ent_arr));
        if (posis_i.length > 0) {
            const cen_posis = _centroidPosis(__model__, posis_i);
            if (np_cents.length === 0) {
                return cen_posis;
            }
            else {
                np_cents.push(cen_posis);
            }
        }
        return np_cents;
    }
}
exports.getCentroid = getCentroid;
function _centroidPosis(__model__, posis_i) {
    const unique_posis_i = Array.from(new Set(posis_i));
    const unique_xyzs = unique_posis_i.map(posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
    return (0, vectors_1.vecDiv)((0, vectors_1.vecSum)(unique_xyzs), unique_xyzs.length);
}
// ================================================================================================
function getCenterOfMass(__model__, ents_arr) {
    if ((0, arrs_1.getArrDepth)(ents_arr) === 1) {
        const [ent_type, ent_i] = ents_arr;
        const pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
        if (pgons_i.length === 0) {
            return null;
        }
        return _centerOfMass(__model__, pgons_i);
    }
    else {
        const cents = [];
        ents_arr = ents_arr;
        for (const [ent_type, ent_i] of ents_arr) {
            const pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
            if (pgons_i.length === 0) {
                cents.push(null);
            }
            cents.push(_centerOfMass(__model__, pgons_i));
        }
        return cents;
    }
}
exports.getCenterOfMass = getCenterOfMass;
function _centerOfMass(__model__, pgons_i) {
    const face_midpoints = [];
    const face_areas = [];
    let total_area = 0;
    for (const face_i of pgons_i) {
        const [midpoint_xyz, area] = _centerOfMassOfPgon(__model__, face_i);
        face_midpoints.push(midpoint_xyz);
        face_areas.push(area);
        total_area += area;
    }
    const cent = [0, 0, 0];
    for (let i = 0; i < face_midpoints.length; i++) {
        const weight = face_areas[i] / total_area;
        cent[0] = cent[0] + face_midpoints[i][0] * weight;
        cent[1] = cent[1] + face_midpoints[i][1] * weight;
        cent[2] = cent[2] + face_midpoints[i][2] * weight;
    }
    return cent;
}
function _centerOfMassOfPgon(__model__, pgon_i) {
    const tri_midpoints = [];
    const tri_areas = [];
    let total_area = 0;
    const map_posi_to_v3 = new Map();
    let midpoint = new three_1.Vector3();
    for (const tri_i of __model__.modeldata.geom.nav_tri.navPgonToTri(pgon_i)) {
        const posis_i = __model__.modeldata.geom.nav_tri.navTriToPosi(tri_i);
        const posis_v3 = [];
        for (const posi_i of posis_i) {
            let posi_v3 = map_posi_to_v3.get(posi_i);
            if (posi_v3 === undefined) {
                const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
                posi_v3 = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);
            }
            posis_v3.push(posi_v3);
        }
        const tri_tjs = new THREE.Triangle(posis_v3[0], posis_v3[1], posis_v3[2]);
        tri_tjs.getMidpoint(midpoint);
        const midpoint_xyz = [midpoint.x, midpoint.y, midpoint.z];
        const area = tri_tjs.getArea();
        tri_midpoints.push(midpoint_xyz);
        tri_areas.push(area);
        total_area += area;
    }
    const cent = [0, 0, 0];
    for (let i = 0; i < tri_midpoints.length; i++) {
        const weight = tri_areas[i] / total_area;
        cent[0] = cent[0] + tri_midpoints[i][0] * weight;
        cent[1] = cent[1] + tri_midpoints[i][1] * weight;
        cent[2] = cent[2] + tri_midpoints[i][2] * weight;
    }
    return [cent, total_area];
}
// ================================================================================================
// used by sweep
// TODO update offset code to use this as well
/* Function to get a set of planes along the length of a wire.
 * The planes are orientated perpendicular to the wire.
 *
 */
function getPlanesSeq(xyzs, normal, close) {
    normal = (0, vectors_1.vecNorm)(normal);
    // if closed, add a posi to the end
    if (close) {
        xyzs.splice(0, 0, xyzs[xyzs.length - 1]);
        xyzs.push(xyzs[1]);
    }
    // get the perp vectors
    let perp_vec = null;
    let has_bad_edges = false;
    const perp_vecs = []; // normalise dvectors
    for (let i = 0; i < xyzs.length - 1; i++) {
        const xyz0 = xyzs[i];
        const xyz1 = xyzs[i + 1];
        const edge_vec = (0, vectors_1.vecFromTo)(xyz0, xyz1);
        if ((0, vectors_1.vecLen)(edge_vec) > 0) {
            perp_vec = (0, vectors_1.vecCross)((0, vectors_1.vecNorm)(edge_vec), normal);
        }
        else {
            perp_vec = null;
            has_bad_edges = true;
        }
        perp_vecs.push(perp_vec);
    }
    // fix any bad pairs, by setting the perp vec to its next neighbour
    if (has_bad_edges) {
        if (perp_vecs[perp_vecs.length - 1] === null) {
            throw new Error('Error: could not process wire.');
        }
        for (let i = perp_vecs.length - 1; i >= 0; i--) {
            if (perp_vecs[i] === null) {
                perp_vecs[i] = perp_vec;
            }
            else {
                perp_vec = perp_vecs[i];
            }
        }
    }
    // array for planes
    const planes = [];
    // if not closed, we need to deal with the first and last planes
    if (!close) {
        // first plane
        const first_xyz = xyzs[0];
        const x_axis = perp_vecs[0];
        const first2_perp_vec = perp_vecs[1];
        let y_axis = normal;
        if ((0, vectors_1.vecDot)(x_axis, first2_perp_vec) < EPS) { // TODOD < what is a good value for this?
            y_axis = (0, vectors_1.vecCross)(x_axis, first2_perp_vec);
        }
        const first_plane = [first_xyz, x_axis, y_axis];
        planes.push(first_plane);
    }
    // loop through all the edges and create a plane at the end of the edge
    for (let i = 0; i < perp_vecs.length - 1; i++) {
        // get the xyz
        const xyz = xyzs[i + 1];
        // get the two perpendicular vectors
        const this_perp_vec = perp_vecs[i];
        const next_perp_vec = perp_vecs[i + 1];
        // calc the local norm
        let y_axis = normal;
        if ((0, vectors_1.vecDot)(this_perp_vec, next_perp_vec) < EPS) { // TODOD < what is a good value for this?
            y_axis = (0, vectors_1.vecCross)(this_perp_vec, next_perp_vec);
        }
        // calc the offset vector
        let x_axis = (0, vectors_1.vecNorm)((0, vectors_1.vecAdd)(this_perp_vec, next_perp_vec));
        const dot = (0, vectors_1.vecDot)(this_perp_vec, x_axis);
        const vec_len = 1 / dot;
        x_axis = (0, vectors_1.vecSetLen)(x_axis, vec_len);
        // create the plane
        const plane = [xyz, x_axis, y_axis];
        planes.push(plane);
    }
    // if not closed, we need to deal with the first and last planes
    if (!close) {
        // last plane
        const last_xyz = xyzs[xyzs.length - 1];
        const x_axis = perp_vecs[perp_vecs.length - 1];
        const last2_perp_vec = perp_vecs[perp_vecs.length - 2];
        let y_axis = normal;
        if ((0, vectors_1.vecDot)(last2_perp_vec, x_axis) < EPS) { // TODOD < what is a good value for this?
            y_axis = (0, vectors_1.vecCross)(last2_perp_vec, x_axis);
        }
        const last_plane = [last_xyz, x_axis, y_axis];
        planes.push(last_plane);
    }
    // return the planes
    return planes;
}
exports.getPlanesSeq = getPlanesSeq;
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NvbW1vbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL21vZHVsZXMvYmFzaWMvX2NvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztHQUdHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsaURBQWdEO0FBR2hELGtEQUF1RjtBQUN2RixpREFBcUQ7QUFDckQsdURBQW9JO0FBQ3BJLG1FQUEwRTtBQUMxRSxtREFBc0Q7QUFDdEQsdURBQXdEO0FBQ3hELDZDQUErQjtBQUMvQixpQ0FBZ0M7QUFDaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBRWpCLG1HQUFtRztBQUNuRyxTQUFnQixTQUFTLENBQUMsU0FBa0IsRUFBRSxJQUFnQyxFQUFFLE9BQWU7SUFDM0YsSUFBSSxJQUFBLG1CQUFLLEVBQUMsSUFBSSxDQUFDLEVBQUU7UUFBRSxPQUFPLElBQVksQ0FBQztLQUFFO0lBQ3pDLElBQUksSUFBQSxtQkFBSyxFQUFDLElBQUksQ0FBQyxFQUFFO1FBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFTLENBQUM7S0FBRTtJQUM1QyxJQUFJLElBQUEscUJBQU8sRUFBQyxJQUFJLENBQUMsRUFBRTtRQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBUyxDQUFDO0tBQUU7SUFDOUMsTUFBTSxJQUFJLEdBQWMsSUFBaUIsQ0FBQztJQUMxQyxNQUFNLE1BQU0sR0FBUyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25FLE9BQU8sTUFBYyxDQUFDO0FBQzFCLENBQUM7QUFQRCw4QkFPQztBQUNELG1HQUFtRztBQUNuRyxTQUFnQixNQUFNLENBQUMsU0FBa0IsRUFBRSxJQUFnQyxFQUFFLE9BQWU7SUFDeEYsSUFBSSxJQUFBLG1CQUFLLEVBQUMsSUFBSSxDQUFDLEVBQUU7UUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFB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