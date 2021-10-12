"use strict";
/**
 * The `calc` module has functions for performing various types of calculations with entities in the model.
 * These functions neither make nor modify anything in the model.
 * These functions all return either numbers or lists of numbers.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BBox = exports.Plane = exports.Ray = exports.Eval = exports._normal = exports.Normal = exports.Centroid = exports._ECentroidMethod = exports.Vector = exports.Area = exports.Length = exports.Distance = exports._EDistanceMethod = void 0;
const _check_ids_1 = require("../../_check_ids");
const chk = __importStar(require("../../_check_types"));
const common_1 = require("../../../libs/geo-info/common");
const common_id_funcs_1 = require("../../../libs/geo-info/common_id_funcs");
const distance_1 = require("../../../libs/geom/distance");
const vectors_1 = require("../../../libs/geom/vectors");
const triangulate_1 = require("../../../libs/triangulate/triangulate");
const triangle_1 = require("../../../libs/geom/triangle");
const underscore_1 = __importDefault(require("underscore"));
const _common_1 = require("./_common");
const _ray_1 = require("../../../core/inline/_ray");
const arrs_1 = require("../../../libs/util/arrs");
// ================================================================================================
var _EDistanceMethod;
(function (_EDistanceMethod) {
    _EDistanceMethod["PS_PS_DISTANCE"] = "ps_to_ps_distance";
    _EDistanceMethod["PS_E_DISTANCE"] = "ps_to_e_distance";
    _EDistanceMethod["PS_W_DISTANCE"] = "ps_to_w_distance";
})(_EDistanceMethod = exports._EDistanceMethod || (exports._EDistanceMethod = {}));
/**
 * Calculates the minimum distance from one position to other entities in the model.
 *
 * @param __model__
 * @param entities1 Position to calculate distance from.
 * @param entities2 List of entities to calculate distance to.
 * @param method Enum; distance method.
 * @returns Distance, or list of distances (if position2 is a list).
 * @example distance1 = calc.Distance (position1, position2, p_to_p_distance)
 * @example_info position1 = [0,0,0], position2 = [[0,0,10],[0,0,20]], Expected value of distance is 10.
 */
function Distance(__model__, entities1, entities2, method) {
    if ((0, arrs_1.isEmptyArr)(entities1)) {
        return [];
    }
    if ((0, arrs_1.isEmptyArr)(entities2)) {
        return [];
    }
    if (Array.isArray(entities1)) {
        entities1 = (0, arrs_1.arrMakeFlat)(entities1);
    }
    entities2 = (0, arrs_1.arrMakeFlat)(entities2);
    // --- Error Check ---
    const fn_name = 'calc.Distance';
    let ents_arr1;
    let ents_arr2;
    if (__model__.debug) {
        ents_arr1 = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities1', entities1, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
        ents_arr2 = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities2', entities2, [_check_ids_1.ID.isIDL1], null);
    }
    else {
        ents_arr1 = (0, common_id_funcs_1.idsBreak)(entities1);
        ents_arr2 = (0, common_id_funcs_1.idsBreak)(entities2);
    }
    // --- Error Check ---
    // get the from posis
    let from_posis_i;
    if ((0, arrs_1.arrMaxDepth)(ents_arr1) === 1 && ents_arr1[0] === common_1.EEntType.POSI) {
        from_posis_i = ents_arr1[1];
    }
    else {
        from_posis_i = [];
        for (const [ent_type, ent_i] of ents_arr1) {
            if (ent_type === common_1.EEntType.POSI) {
                from_posis_i.push(ent_i);
            }
            else {
                const ent_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
                for (const ent_posi_i of ent_posis_i) {
                    from_posis_i.push(ent_posi_i);
                }
            }
        }
    }
    // get the to ent_type
    let to_ent_type;
    switch (method) {
        case _EDistanceMethod.PS_PS_DISTANCE:
            to_ent_type = common_1.EEntType.POSI;
            break;
        case _EDistanceMethod.PS_W_DISTANCE:
        case _EDistanceMethod.PS_E_DISTANCE:
            to_ent_type = common_1.EEntType.EDGE;
            break;
        default:
            break;
    }
    // get the ents and posis sets
    const set_to_ents_i = new Set();
    let set_to_posis_i = new Set();
    for (const [ent_type, ent_i] of ents_arr2) {
        // ents
        if (ent_type === to_ent_type) {
            set_to_ents_i.add(ent_i);
        }
        else {
            const sub_ents_i = __model__.modeldata.geom.nav.navAnyToAny(ent_type, to_ent_type, ent_i);
            for (const sub_ent_i of sub_ents_i) {
                set_to_ents_i.add(sub_ent_i);
            }
        }
        // posis
        if (to_ent_type !== common_1.EEntType.POSI) {
            const sub_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
            for (const sub_posi_i of sub_posis_i) {
                set_to_posis_i.add(sub_posi_i);
            }
        }
    }
    // create an array of to_ents
    const to_ents_i = Array.from(set_to_ents_i);
    // cerate a posis xyz map
    const map_posi_i_xyz = new Map();
    if (to_ent_type === common_1.EEntType.POSI) {
        set_to_posis_i = set_to_ents_i;
    }
    for (const posi_i of set_to_posis_i) {
        const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        map_posi_i_xyz.set(posi_i, xyz);
    }
    // calc the distance
    switch (method) {
        case _EDistanceMethod.PS_PS_DISTANCE:
            return _distanceManyPosisToPosis(__model__, from_posis_i, to_ents_i, map_posi_i_xyz, method);
        case _EDistanceMethod.PS_W_DISTANCE:
        case _EDistanceMethod.PS_E_DISTANCE:
            return _distanceManyPosisToEdges(__model__, from_posis_i, to_ents_i, map_posi_i_xyz, method);
        default:
            break;
    }
}
exports.Distance = Distance;
function _distanceManyPosisToPosis(__model__, from_posi_i, to_ents_i, map_posi_i_xyz, method) {
    if (!Array.isArray(from_posi_i)) {
        from_posi_i = from_posi_i;
        return _distancePstoPs(__model__, from_posi_i, to_ents_i, map_posi_i_xyz);
    }
    else {
        from_posi_i = from_posi_i;
        // TODO This can be optimised
        // From posis may have duplicates, only calc once
        return from_posi_i.map(one_from => _distanceManyPosisToPosis(__model__, one_from, to_ents_i, map_posi_i_xyz, method));
    }
}
// function _distanceManyPosisToWires(__model__: GIModel, from_posi_i: number|number[], to_ents_i: number[],
//         method: _EDistanceMethod): number|number[] {
//     if (!Array.isArray(from_posi_i)) {
//         from_posi_i = from_posi_i as number;
//         return _distancePstoW(__model__, from_posi_i, to_ents_i) as number;
//     } else  {
//         from_posi_i = from_posi_i as number[];
//         // TODO This can be optimised
//         // There is some vector stuff that gets repeated for each posi to line dist calc
//         return from_posi_i.map( one_from => _distanceManyPosisToWires(__model__, one_from, to_ents_i, method) ) as number[];
//     }
// }
function _distanceManyPosisToEdges(__model__, from_posi_i, to_ents_i, map_posi_i_xyz, method) {
    if (!Array.isArray(from_posi_i)) {
        from_posi_i = from_posi_i;
        return _distancePstoE(__model__, from_posi_i, to_ents_i, map_posi_i_xyz);
    }
    else {
        from_posi_i = from_posi_i;
        // TODO This can be optimised
        // From posis may have duplicates, only calc once
        // Adjacent edges could be calculated once only
        return from_posi_i.map(one_from => _distanceManyPosisToEdges(__model__, one_from, to_ents_i, map_posi_i_xyz, method));
    }
}
function _distancePstoPs(__model__, from_posi_i, to_posis_i, map_posi_i_xyz) {
    const from_xyz = __model__.modeldata.attribs.posis.getPosiCoords(from_posi_i);
    let min_dist = Infinity;
    // loop, measure dist
    for (const to_posi_i of to_posis_i) {
        // get xyz
        const to_xyz = map_posi_i_xyz.get(to_posi_i);
        // calc dist
        const dist = _distancePointToPoint(from_xyz, to_xyz);
        if (dist < min_dist) {
            min_dist = dist;
        }
    }
    return min_dist;
}
// function _distancePstoW(__model__: GIModel, from_posi_i: number, to_wires_i: number[]): number {
//     const from_xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(from_posi_i);
//     let min_dist = Infinity;
//     const map_posi_xyz: Map<number, Txyz> = new Map();
//     for (const wire_i of to_wires_i) {
//         // get the posis
//         const to_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
//         // if closed, add first posi to end
//         if (__model__.modeldata.geom.query.isWireClosed(wire_i)) { to_posis_i.push(to_posis_i[0]); }
//         // add the first xyz to the list, this will be prev
//         let prev_xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(to_posis_i[0]);
//         map_posi_xyz.set(to_posis_i[0], prev_xyz);
//         // loop, measure dist
//         for (let i = 1; i < to_posis_i.length; i++) {
//             // get xyz
//             const curr_posi_i: number = to_posis_i[i];
//             let curr_xyz: Txyz = map_posi_xyz.get(curr_posi_i);
//             if (curr_xyz === undefined) {
//                 curr_xyz = __model__.modeldata.attribs.posis.getPosiCoords(curr_posi_i);
//                 map_posi_xyz.set(curr_posi_i, curr_xyz);
//             }
//             // calc dist
//             const dist: number = _distancePointToLine(from_xyz, prev_xyz, curr_xyz);
//             if (dist < min_dist) { min_dist = dist; }
//             // next
//             prev_xyz = curr_xyz;
//         }
//     }
//     return min_dist;
// }
function _distancePstoE(__model__, from_posi_i, to_edges_i, map_posi_i_xyz) {
    const from_xyz = __model__.modeldata.attribs.posis.getPosiCoords(from_posi_i);
    let min_dist = Infinity;
    for (const edge_i of to_edges_i) {
        // get the posis
        const edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edge_i);
        const xyz_start = map_posi_i_xyz.get(edge_posis_i[0]);
        const xyz_end = map_posi_i_xyz.get(edge_posis_i[1]);
        // calc dist
        const dist = _distancePointToLine(from_xyz, xyz_start, xyz_end);
        if (dist < min_dist) {
            min_dist = dist;
        }
    }
    return min_dist;
}
function _distancePointToPoint(from, to) {
    const a = from[0] - to[0];
    const b = from[1] - to[1];
    const c = from[2] - to[2];
    return Math.sqrt(a * a + b * b + c * c);
}
function _distancePointToLine(from, start, end) {
    const vec_from = (0, vectors_1.vecFromTo)(start, from);
    const vec_line = (0, vectors_1.vecFromTo)(start, end);
    const len = (0, vectors_1.vecLen)(vec_line);
    const vec_line_norm = (0, vectors_1.vecDiv)(vec_line, len);
    const dot = (0, vectors_1.vecDot)(vec_from, vec_line_norm);
    if (dot <= 0) {
        return _distancePointToPoint(from, start);
    }
    else if (dot >= len) {
        return _distancePointToPoint(from, end);
    }
    const close = (0, vectors_1.vecAdd)(start, (0, vectors_1.vecSetLen)(vec_line, dot));
    return _distancePointToPoint(from, close);
}
// ================================================================================================
/**
 * Calculates the length of an entity.
 *
 * The entity can be an edge, a wire, a polyline, or anything from which wires can be extracted.
 * This includes polylines, polygons, faces, and collections.
 *
 * Given a list of edges, wires, or polylines, a list of lengths are returned.
 *
 * Given any types of entities from which wires can be extracted, a list of lengths are returned.
 * For example, given a single polygon, a list of lengths are returned (since a polygon may have multiple wires).
 *
 * @param __model__
 * @param entities Single or list of edges or wires or other entities from which wires can be extracted.
 * @returns Lengths, a number or list of numbers.
 * @example length1 = calc.Length(line1)
 */
function Length(__model__, entities) {
    if ((0, arrs_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Length';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [common_1.EEntType.EDGE, common_1.EEntType.WIRE, common_1.EEntType.PLINE, common_1.EEntType.PGON, common_1.EEntType.COLL]);
    }
    else {
        ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
    }
    // --- Error Check ---
    return _length(__model__, ents_arr);
}
exports.Length = Length;
function _length(__model__, ents_arrs) {
    if ((0, arrs_1.getArrDepth)(ents_arrs) === 1) {
        const [ent_type, index] = ents_arrs;
        if (ent_type === common_1.EEntType.EDGE) {
            return _edgeLength(__model__, index);
        }
        else if (ent_type === common_1.EEntType.WIRE) {
            return _wireLength(__model__, index);
        }
        else if (ent_type === common_1.EEntType.PLINE) {
            const wire_i = __model__.modeldata.geom.nav.navPlineToWire(index);
            return _wireLength(__model__, wire_i);
        }
        else {
            const wires_i = __model__.modeldata.geom.nav.navAnyToWire(ent_type, index);
            return wires_i.map(wire_i => _wireLength(__model__, wire_i));
        }
    }
    else {
        const lengths = ents_arrs.map(ents_arr => _length(__model__, ents_arr));
        return underscore_1.default.flatten(lengths);
    }
}
function _edgeLength(__model__, edge_i) {
    const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edge_i);
    const xyz_0 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
    const xyz_1 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
    return (0, distance_1.distance)(xyz_0, xyz_1);
}
function _wireLength(__model__, wire_i) {
    const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.WIRE, wire_i);
    let dist = 0;
    for (let i = 0; i < posis_i.length - 1; i++) {
        const xyz_0 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[i]);
        const xyz_1 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[i + 1]);
        dist += (0, distance_1.distance)(xyz_0, xyz_1);
    }
    if (__model__.modeldata.geom.query.isWireClosed(wire_i)) {
        const xyz_0 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[posis_i.length - 1]);
        const xyz_1 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
        dist += (0, distance_1.distance)(xyz_0, xyz_1);
    }
    return dist;
}
// ================================================================================================
/**
 * Calculates the area of en entity.
 *
 * The entity can be a polygon, a face, a closed polyline, a closed wire, or a collection.
 *
 * Given a list of entities, a list of areas are returned.
 *
 * @param __model__
 * @param entities Single or list of polygons, closed polylines, closed wires, collections.
 * @returns Area.
 * @example area1 = calc.Area (surface1)
 */
function Area(__model__, entities) {
    if ((0, arrs_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Area';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [common_1.EEntType.PGON, common_1.EEntType.PLINE, common_1.EEntType.WIRE, common_1.EEntType.COLL]);
    }
    else {
        ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
    }
    // --- Error Check ---
    return _area(__model__, ents_arr);
}
exports.Area = Area;
function _area(__model__, ents_arrs) {
    if ((0, arrs_1.getArrDepth)(ents_arrs) === 1) {
        const [ent_type, ent_i] = ents_arrs;
        if (ent_type === common_1.EEntType.PGON) {
            // faces, these are already triangulated
            const tris_i = __model__.modeldata.geom.nav_tri.navPgonToTri(ent_i);
            let total_area = 0;
            for (const tri_i of tris_i) {
                const corners_i = __model__.modeldata.geom.nav_tri.navTriToPosi(tri_i);
                if (corners_i.length !== 3) {
                    continue;
                } // two or more verts have same posi, so area is 0
                const corners_xyzs = corners_i.map(corner_i => __model__.modeldata.attribs.posis.getPosiCoords(corner_i));
                const tri_area = (0, triangle_1.area)(corners_xyzs[0], corners_xyzs[1], corners_xyzs[2]);
                total_area += tri_area;
            }
            return total_area;
        }
        else if (ent_type === common_1.EEntType.PLINE || ent_type === common_1.EEntType.WIRE) {
            // wires, these need to be triangulated
            let wire_i = ent_i;
            if (ent_type === common_1.EEntType.PLINE) {
                wire_i = __model__.modeldata.geom.nav.navPlineToWire(ent_i);
            }
            if (!__model__.modeldata.geom.query.isWireClosed(wire_i)) {
                throw new Error('To calculate area, wire must be closed');
            }
            const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.WIRE, ent_i);
            const xyzs = posis_i.map(posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
            const tris = (0, triangulate_1.triangulate)(xyzs);
            let total_area = 0;
            for (const tri of tris) {
                const corners_xyzs = tri.map(corner_i => xyzs[corner_i]);
                const tri_area = (0, triangle_1.area)(corners_xyzs[0], corners_xyzs[1], corners_xyzs[2]);
                total_area += tri_area;
            }
            return total_area;
        }
        else {
            return 0;
        }
    }
    else {
        const areas = ents_arrs.map(ents_arr => _area(__model__, ents_arr));
        return underscore_1.default.flatten(areas);
    }
}
// ================================================================================================
/**
 * Returns a vector along an edge, from the start position to the end position.
 * The vector is not normalized.
 *
 * Given a single edge, a single vector will be returned. Given a list of edges, a list of vectors will be returned.
 *
 * Given any entity that has edges (collection, polygons, polylines, faces, and wires),
 * a list of edges will be extracted, and a list of vectors will be returned.
 *
 * @param __model__
 * @param entities Single or list of edges, or any entity from which edges can be extracted.
 * @returns The vector [x, y, z] or a list of vectors.
 */
function Vector(__model__, entities) {
    if ((0, arrs_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Vector';
    let ents_arrs;
    if (__model__.debug) {
        ents_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [common_1.EEntType.PGON, common_1.EEntType.PLINE, common_1.EEntType.WIRE, common_1.EEntType.EDGE]);
    }
    else {
        ents_arrs = (0, common_id_funcs_1.idsBreak)(entities);
    }
    // --- Error Check ---
    return _vector(__model__, ents_arrs);
}
exports.Vector = Vector;
function _vector(__model__, ents_arrs) {
    if ((0, arrs_1.getArrDepth)(ents_arrs) === 1) {
        const [ent_type, index] = ents_arrs;
        if (ent_type === common_1.EEntType.EDGE) {
            const verts_i = __model__.modeldata.geom.nav.navAnyToVert(ent_type, index);
            const start = __model__.modeldata.attribs.posis.getVertCoords(verts_i[0]);
            const end = __model__.modeldata.attribs.posis.getVertCoords(verts_i[1]);
            // if (!start || !end) { console.log(">>>>", verts_i, start, end, __model__.modeldata.geom._geom_maps); }
            return (0, vectors_1.vecSub)(end, start);
        }
        else {
            const edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
            const edges_arrs = edges_i.map(edge_i => [common_1.EEntType.EDGE, edge_i]);
            return edges_arrs.map(edges_arr => _vector(__model__, edges_arr));
        }
    }
    else {
        const vectors_arrs = ents_arrs.map(ents_arr => _vector(__model__, ents_arr));
        const all_vectors = [];
        for (const vectors_arr of vectors_arrs) {
            if ((0, arrs_1.getArrDepth)(vectors_arr) === 1) {
                all_vectors.push(vectors_arr);
            }
            else {
                for (const vector_arr of vectors_arr) {
                    all_vectors.push(vector_arr);
                }
            }
        }
        return all_vectors;
    }
}
// ================================================================================================
var _ECentroidMethod;
(function (_ECentroidMethod) {
    _ECentroidMethod["PS_AVERAGE"] = "ps_average";
    _ECentroidMethod["CENTER_OF_MASS"] = "center_of_mass";
})(_ECentroidMethod = exports._ECentroidMethod || (exports._ECentroidMethod = {}));
/**
 * Calculates the centroid of an entity.
 *
 * If 'ps_average' is selected, the centroid is the average of the positions that make up that entity.
 *
 * If 'center_of_mass' is selected, the centroid is the centre of mass of the faces that make up that entity.
 * Note that only faces are deemed to have mass.
 *
 * Given a list of entities, a list of centroids will be returned.
 *
 * Given a list of positions, a single centroid that is the average of all those positions will be returned.
 *
 * @param __model__
 * @param entities Single or list of entities. (Can be any type of entities.)
 * @param method Enum, the method for calculating the centroid.
 * @returns A centroid [x, y, z] or a list of centroids.
 * @example centroid1 = calc.Centroid (polygon1)
 */
function Centroid(__model__, entities, method) {
    if ((0, arrs_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Centroid';
    let ents_arrs;
    if (__model__.debug) {
        ents_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
    }
    else {
        ents_arrs = (0, common_id_funcs_1.idsBreak)(entities);
    }
    // --- Error Check ---
    switch (method) {
        case _ECentroidMethod.PS_AVERAGE:
            return (0, _common_1.getCentroid)(__model__, ents_arrs);
        case _ECentroidMethod.CENTER_OF_MASS:
            return (0, _common_1.getCenterOfMass)(__model__, ents_arrs);
        default:
            break;
    }
}
exports.Centroid = Centroid;
// ================================================================================================
/**
 * Calculates the normal vector of an entity or list of entities. The vector is normalised, and scaled
 * by the specified scale factor.
 *
 * Given a single entity, a single normal will be returned. Given a list of entities, a list of normals will be returned.
 *
 * For polygons, faces, and face wires the normal is calculated by taking the average of all the normals of the face triangles.
 *
 * For polylines and polyline wires, the normal is calculated by triangulating the positions, and then
 * taking the average of all the normals of the triangles.
 *
 * For edges, the normal is calculated by takingthe avery of the normals of the two vertices.
 *
 * For vertices, the normal is calculated by creating a triangle out of the two adjacent edges,
 * and then calculating the normal of the triangle.
 * (If there is only one edge, or if the two adjacent edges are colinear, the the normal of the wire is returned.)
 *
 * For positions, the normal is calculated by taking the average of the normals of all the vertices linked to the position.
 *
 * If the normal cannot be calculated, [0, 0, 0] will be returned.
 *
 * @param __model__
 * @param entities Single or list of entities. (Can be any type of entities.)
 * @param scale The scale factor for the normal vector. (This is equivalent to the length of the normal vector.)
 * @returns The normal vector [x, y, z] or a list of normal vectors.
 * @example normal1 = calc.Normal (polygon1, 1)
 * @example_info If the input is non-planar, the output vector will be an average of all normals vector of the polygon triangles.
 */
function Normal(__model__, entities, scale) {
    if ((0, arrs_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Normal';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
        chk.checkArgs(fn_name, 'scale', scale, [chk.isNum]);
    }
    else {
        ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
    }
    // --- Error Check ---
    return _normal(__model__, ents_arr, scale);
}
exports.Normal = Normal;
function _normal(__model__, ents_arr, scale) {
    if ((0, arrs_1.getArrDepth)(ents_arr) === 1) {
        const ent_type = ents_arr[0];
        const index = ents_arr[1];
        if (ent_type === common_1.EEntType.PGON) {
            const norm_vec = __model__.modeldata.geom.query.getPgonNormal(index);
            return (0, vectors_1.vecMult)(norm_vec, scale);
        }
        else if (ent_type === common_1.EEntType.PLINE) {
            const norm_vec = __model__.modeldata.geom.query.getWireNormal(__model__.modeldata.geom.nav.navPlineToWire(index));
            return (0, vectors_1.vecMult)(norm_vec, scale);
        }
        else if (ent_type === common_1.EEntType.WIRE) {
            const norm_vec = __model__.modeldata.geom.query.getWireNormal(index);
            return (0, vectors_1.vecMult)(norm_vec, scale);
        }
        else if (ent_type === common_1.EEntType.EDGE) {
            const verts_i = __model__.modeldata.geom.nav.navEdgeToVert(index);
            const norm_vecs = verts_i.map(vert_i => _vertNormal(__model__, vert_i));
            const norm_vec = (0, vectors_1.vecDiv)((0, vectors_1.vecSum)(norm_vecs), norm_vecs.length);
            return (0, vectors_1.vecMult)(norm_vec, scale);
        }
        else if (ent_type === common_1.EEntType.VERT) {
            const norm_vec = _vertNormal(__model__, index);
            return (0, vectors_1.vecMult)(norm_vec, scale);
        }
        else if (ent_type === common_1.EEntType.POSI) {
            const verts_i = __model__.modeldata.geom.nav.navPosiToVert(index);
            if (verts_i.length > 0) {
                const norm_vecs = verts_i.map(vert_i => _vertNormal(__model__, vert_i));
                const norm_vec = (0, vectors_1.vecDiv)((0, vectors_1.vecSum)(norm_vecs), norm_vecs.length);
                return (0, vectors_1.vecMult)(norm_vec, scale);
            }
            return [0, 0, 0];
        }
        else if (ent_type === common_1.EEntType.POINT) {
            return [0, 0, 0];
        }
    }
    else {
        return ents_arr.map(ent_arr => _normal(__model__, ent_arr, scale));
    }
}
exports._normal = _normal;
function _vertNormal(__model__, index) {
    let norm_vec;
    const edges_i = __model__.modeldata.geom.nav.navVertToEdge(index);
    if (edges_i.length === 1) {
        const posis0_i = __model__.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edges_i[0]);
        const posis1_i = __model__.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edges_i[1]);
        const p_mid = __model__.modeldata.attribs.posis.getPosiCoords(posis0_i[1]); // same as posis1_i[0]
        const p_a = __model__.modeldata.attribs.posis.getPosiCoords(posis0_i[0]);
        const p_b = __model__.modeldata.attribs.posis.getPosiCoords(posis1_i[1]);
        norm_vec = (0, vectors_1.vecCross)((0, vectors_1.vecFromTo)(p_mid, p_a), (0, vectors_1.vecFromTo)(p_mid, p_b), true);
        if ((0, vectors_1.vecLen)(norm_vec) > 0) {
            return norm_vec;
        }
    }
    const wire_i = __model__.modeldata.geom.nav.navEdgeToWire(edges_i[0]);
    norm_vec = __model__.modeldata.geom.query.getWireNormal(wire_i);
    return norm_vec;
}
// ================================================================================================
/**
 * Calculates the xyz coord along an edge, wire, or polyline given a t parameter.
 *
 * The 't' parameter varies between 0 and 1, where 0 indicates the start and 1 indicates the end.
 * For example, given a polyline,
 * evaluating at t=0 gives that xyz at the start,
 * evaluating at t=0.5 gives the xyz halfway along the polyline,
 * evaluating at t=1 gives the xyz at the end of the polyline.
 *
 * Given a single edge, wire, or polyline, a single xyz coord will be returned.
 *
 * Given a list of edges, wires, or polylines, a list of xyz coords will be returned.
 *
 * Given any entity that has wires (faces, polygons and collections),
 * a list of wires will be extracted, and a list of coords will be returned.
 *
 * @param __model__
 * @param entities Single or list of edges, wires, polylines, or faces, polygons, or collections.
 * @param t_param A value between 0 to 1.
 * @returns The coordinates [x, y, z], or a list of coordinates.
 * @example coord1 = calc.Eval (polyline1, 0.23)
 */
function Eval(__model__, entities, t_param) {
    if ((0, arrs_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Eval';
    let ents_arrs;
    if (__model__.debug) {
        ents_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [common_1.EEntType.EDGE, common_1.EEntType.WIRE, common_1.EEntType.PLINE, common_1.EEntType.PGON, common_1.EEntType.COLL]);
        chk.checkArgs(fn_name, 'param', t_param, [chk.isNum01]);
    }
    else {
        ents_arrs = (0, common_id_funcs_1.idsBreak)(entities);
    }
    // --- Error Check ---
    return _eval(__model__, ents_arrs, t_param);
}
exports.Eval = Eval;
function _eval(__model__, ents_arr, t_param) {
    if ((0, arrs_1.getArrDepth)(ents_arr) === 1) {
        const [ent_type, index] = ents_arr;
        if (ent_type === common_1.EEntType.EDGE || ent_type === common_1.EEntType.WIRE || ent_type === common_1.EEntType.PLINE) {
            const edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
            const num_edges = edges_i.length;
            // get all the edge lengths
            let total_dist = 0;
            const dists = [];
            const xyz_pairs = [];
            for (const edge_i of edges_i) {
                const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edge_i);
                const xyz_0 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
                const xyz_1 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
                const dist = (0, distance_1.distance)(xyz_0, xyz_1);
                total_dist += dist;
                dists.push(total_dist);
                xyz_pairs.push([xyz_0, xyz_1]);
            }
            // map the t_param
            const t_param_mapped = t_param * total_dist;
            // loop through and find the point
            for (let i = 0; i < num_edges; i++) {
                if (t_param_mapped < dists[i]) {
                    const xyz_pair = xyz_pairs[i];
                    let dist_a = 0;
                    if (i > 0) {
                        dist_a = dists[i - 1];
                    }
                    const dist_b = dists[i];
                    const edge_length = dist_b - dist_a;
                    const to_t = t_param_mapped - dist_a;
                    const vec_len = to_t / edge_length;
                    return (0, vectors_1.vecAdd)(xyz_pair[0], (0, vectors_1.vecMult)((0, vectors_1.vecSub)(xyz_pair[1], xyz_pair[0]), vec_len));
                }
            }
            // t param must be 1 (or greater)
            return xyz_pairs[num_edges - 1][1];
        }
        else {
            const wires_i = __model__.modeldata.geom.nav.navAnyToWire(ent_type, index);
            const wires_arrs = wires_i.map(wire_i => [common_1.EEntType.WIRE, wire_i]);
            return wires_arrs.map(wires_arr => _eval(__model__, wires_arr, t_param));
        }
    }
    else {
        return ents_arr.map(ent_arr => _eval(__model__, ent_arr, t_param));
    }
}
// ================================================================================================
/**
 * Returns a ray for an edge or a polygons.
 *
 * For edges, it returns a ray along the edge, from the start vertex to the end vertex
 *
 * For a polygon, it returns the ray that is the z-axis of the plane.
 *
 * For an edge, the ray vector is not normalised. For a polygon, the ray vector is normalised.
 *
 * @param __model__
 * @param entities An edge, a wirea polygon, or a list.
 * @returns The ray.
 */
function Ray(__model__, entities) {
    if ((0, arrs_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Ray';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1, _check_ids_1.ID.isIDL2], [common_1.EEntType.EDGE, common_1.EEntType.WIRE, common_1.EEntType.PLINE, common_1.EEntType.PGON]);
    }
    else {
        ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
    }
    // --- Error Check ---
    return _getRay(__model__, ents_arr);
}
exports.Ray = Ray;
function _getRayFromEdge(__model__, ent_arr) {
    const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]);
    const xyzs = posis_i.map(posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
    return [xyzs[0], (0, vectors_1.vecSub)(xyzs[1], xyzs[0])];
}
function _getRayFromPgon(__model__, ent_arr) {
    const plane = _getPlane(__model__, ent_arr);
    return (0, _ray_1.rayFromPln)(false, plane);
}
function _getRayFromEdges(__model__, ent_arr) {
    const edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_arr[0], ent_arr[1]);
    return edges_i.map(edge_i => _getRayFromEdge(__model__, [common_1.EEntType.EDGE, edge_i]));
}
function _getRay(__model__, ents_arr) {
    if ((0, arrs_1.getArrDepth)(ents_arr) === 1) {
        const ent_arr = ents_arr;
        if (ent_arr[0] === common_1.EEntType.EDGE) {
            return _getRayFromEdge(__model__, ent_arr);
        }
        else if (ent_arr[0] === common_1.EEntType.PLINE || ent_arr[0] === common_1.EEntType.WIRE) {
            return _getRayFromEdges(__model__, ent_arr);
        }
        else if (ent_arr[0] === common_1.EEntType.PGON) {
            return _getRayFromPgon(__model__, ent_arr);
        }
    }
    else {
        return ents_arr.map(ent_arr => _getRay(__model__, ent_arr));
    }
}
// ================================================================================================
/**
 * Returns a plane from a polygon, a face, a polyline, or a wire.
 * For polylines or wires, there must be at least three non-colinear vertices.
 *
 * The winding order is counter-clockwise.
 * This means that if the vertices are ordered counter-clockwise relative to your point of view,
 * then the z axis of the plane will be pointing towards you.
 *
 * @param entities Any entities
 * @returns The plane.
 */
function Plane(__model__, entities) {
    if ((0, arrs_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Plane';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1, _check_ids_1.ID.isIDL2], null); // takes in any
    }
    else {
        ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
    }
    // --- Error Check ---
    return _getPlane(__model__, ents_arr);
}
exports.Plane = Plane;
function _getPlane(__model__, ents_arr) {
    if ((0, arrs_1.getArrDepth)(ents_arr) === 1) {
        const ent_arr = ents_arr;
        const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]);
        const unique_posis_i = Array.from(new Set(posis_i));
        if (unique_posis_i.length < 3) {
            throw new Error('Too few points to calculate plane.');
        }
        const unique_xyzs = unique_posis_i.map(posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
        const origin = (0, vectors_1.vecDiv)((0, vectors_1.vecSum)(unique_xyzs), unique_xyzs.length);
        // const normal: Txyz = newellNorm(unique_xyzs);
        const normal = _normal(__model__, ent_arr, 1);
        const x_vec = (0, vectors_1.vecNorm)((0, vectors_1.vecFromTo)(unique_xyzs[0], unique_xyzs[1]));
        const y_vec = (0, vectors_1.vecCross)(normal, x_vec); // must be z-axis, x-axis
        return [origin, x_vec, y_vec];
    }
    else {
        return ents_arr.map(ent_arr => _getPlane(__model__, ent_arr));
    }
}
// ================================================================================================
/**
 * Returns the bounding box of the entities.
 * The bounding box is an imaginary box that completley contains all the geometry.
 * The box is always aligned with the global x, y, and z axes.
 * The bounding box consists of a list of lists, as follows [[x, y, z], [x, y, z], [x, y, z], [x, y, z]].
 *
 * - The first [x, y, z] is the coordinates of the centre of the bounding box.
 * - The second [x, y, z] is the corner of the bounding box with the lowest x, y, z values.
 * - The third [x, y, z] is the corner of the bounding box with the highest x, y, z values.
 * - The fourth [x, y, z] is the dimensions of the bounding box.
 *
 * @param __model__
 * @param entities The etities for which to calculate the bounding box.
 * @returns The bounding box consisting of a list of four lists.
 */
function BBox(__model__, entities) {
    entities = (0, arrs_1.arrMakeFlat)(entities);
    // --- Error Check ---
    const fn_name = 'calc.BBox';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isIDL1], null); // all
    }
    else {
        ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
    }
    // --- Error Check ---
    return _getBoundingBox(__model__, ents_arr);
}
exports.BBox = BBox;
function _getBoundingBox(__model__, ents_arr) {
    const posis_set_i = new Set();
    for (const ent_arr of ents_arr) {
        const ent_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]);
        for (const ent_posi_i of ent_posis_i) {
            posis_set_i.add(ent_posi_i);
        }
    }
    const unique_posis_i = Array.from(posis_set_i);
    const unique_xyzs = unique_posis_i.map(posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
    const corner_min = [Infinity, Infinity, Infinity];
    const corner_max = [-Infinity, -Infinity, -Infinity];
    for (const unique_xyz of unique_xyzs) {
        if (unique_xyz[0] < corner_min[0]) {
            corner_min[0] = unique_xyz[0];
        }
        if (unique_xyz[1] < corner_min[1]) {
            corner_min[1] = unique_xyz[1];
        }
        if (unique_xyz[2] < corner_min[2]) {
            corner_min[2] = unique_xyz[2];
        }
        if (unique_xyz[0] > corner_max[0]) {
            corner_max[0] = unique_xyz[0];
        }
        if (unique_xyz[1] > corner_max[1]) {
            corner_max[1] = unique_xyz[1];
        }
        if (unique_xyz[2] > corner_max[2]) {
            corner_max[2] = unique_xyz[2];
        }
    }
    return [
        [(corner_min[0] + corner_max[0]) / 2, (corner_min[1] + corner_max[1]) / 2, (corner_min[2] + corner_max[2]) / 2],
        corner_min,
        corner_max,
        [corner_max[0] - corner_min[0], corner_max[1] - corner_min[1], corner_max[2] - corner_min[2]]
    ];
}
// ================================================================================================
// /**
//  * Calculates the distance between a ray or plane and a list of positions.
//  *
//  * @param __model__
//  * @param ray_or_plane Ray or a plane.
//  * @param entities A position or list of positions.
//  * @param method Enum; all_distances or min_distance.
//  * @returns Distance, or list of distances.
//  * @example distance1 = virtual.Distance(ray, positions, all_distances)
//  * @example_info Returns a list of distances between the ray and each position.
//  */
// export function Distance(__model__: GIModel, ray_or_plane: TRay|TPlane, entities: TId|TId[], method: _EDistanceMethod): number|number[] {
//     // --- Error Check ---
//     const fn_name = 'virtual.Distance';
//     checkCommTypes(fn_name, 'ray_or_plane', ray_or_plane, [TypeCheckObj.isRay, TypeCheckObj.isPlane]);
//     const ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
//         [EEntType.POSI]) as TEntTypeIdx|TEntTypeIdx[];
//     // --- Error Check ---
//     const one_posi: boolean = getArrDepth(ents_arr) === 1;
//     // get the to posis_i
//     let posis_i: number|number[] = null;
//     if (one_posi) {
//         posis_i = ents_arr[1] as number;
//     } else {
//         posis_i = (ents_arr as TEntTypeIdx[]).map( ent_arr => ent_arr[1] ) as number[];
//     }
//     // get a list of distances
//     let dists: number|number[] = null;
//     if (ray_or_plane.length === 2) { // ray
//         const ray_tjs: THREE.Ray = new THREE.Ray(new THREE.Vector3(...ray_or_plane[0]), new THREE.Vector3(...ray_or_plane[1]));
//         dists = _distanceRaytoP(__model__, ray_tjs, posis_i);
//     } else if (ray_or_plane.length === 3) { // plane
//         const plane_normal: Txyz = vecCross(ray_or_plane[1], ray_or_plane[2]);
//         const plane_tjs: THREE.Plane = new THREE.Plane();
//         plane_tjs.setFromNormalAndCoplanarPoint( new THREE.Vector3(...plane_normal), new THREE.Vector3(...ray_or_plane[0]) );
//         dists = _distancePlanetoP(__model__, plane_tjs, posis_i);
//     }
//     // return either the min or the whole list
//     if (method === _EDistanceMethod.MIN_DISTANCE && !one_posi) {
//         return Math.min(...dists as number[]);
//     }
//     return dists;
// }
// function _distanceRaytoP(__model__: GIModel, ray_tjs: THREE.Ray, posis_i: number|number[]): number|number[] {
//     if (!Array.isArray(posis_i)) {
//         const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i);
//         return ray_tjs.distanceToPoint( new THREE.Vector3(...xyz) ) as number;
//     } else {
//         return posis_i.map( posi_i => _distanceRaytoP(__model__, ray_tjs, posi_i) ) as number[];
//     }
// }
// function _distancePlanetoP(__model__: GIModel, plane_tjs: THREE.Plane, posis_i: number|number[]): number|number[] {
//     if (!Array.isArray(posis_i)) {
//         const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i);
//         return plane_tjs.distanceToPoint( new THREE.Vector3(...xyz) ) as number;
//     } else {
//         return posis_i.map( posi_i => _distancePlanetoP(__model__, plane_tjs, posi_i) ) as number[];
//     }
// }
// export enum _EDistanceMethod {
//     ALL_DISTANCES = 'all_distances',
//     MIN_DISTANCE = 'min_distance'
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL21vZHVsZXMvYmFzaWMvY2FsYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7O0dBS0c7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxpREFBZ0Q7QUFFaEQsd0RBQTBDO0FBRzFDLGtEQUFtRztBQUNuRywyRUFBaUU7QUFDakUsa0RBQStDO0FBQy9DLGdEQUFzSTtBQUN0SSwrREFBNEQ7QUFDNUQsa0RBQTJDO0FBQzNDLDREQUFnQztBQUNoQyx1Q0FBeUQ7QUFDekQsbURBQXNEO0FBQ3RELGlEQUEyRjtBQUUzRixtR0FBbUc7QUFDbkcsSUFBWSxnQkFJWDtBQUpELFdBQVksZ0JBQWdCO0lBQ3hCLHdEQUFvQyxDQUFBO0lBQ3BDLHNEQUFrQyxDQUFBO0lBQ2xDLHNEQUFrQyxDQUFBO0FBQ3RDLENBQUMsRUFKVyxnQkFBZ0IsR0FBaEIsd0JBQWdCLEtBQWhCLHdCQUFnQixRQUkzQjtBQUNEOzs7Ozs7Ozs7O0dBVUc7QUFDSCxTQUFnQixRQUFRLENBQUMsU0FBa0IsRUFBRSxTQUFvQixFQUFFLFNBQW9CLEVBQUUsTUFBd0I7SUFDN0csSUFBSSxJQUFBLGlCQUFVLEVBQUMsU0FBUyxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3pDLElBQUksSUFBQSxpQkFBVSxFQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUN6QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFBRSxTQUFTLEdBQUcsSUFBQSxrQkFBVyxFQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQUU7SUFDckUsU0FBUyxHQUFHLElBQUEsa0JBQVcsRUFBQyxTQUFTLENBQUMsQ0FBQztJQUNuQyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDO0lBQ2hDLElBQUksU0FBb0MsQ0FBQztJ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bEMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUFFO1FBQ3JFLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FBRTtRQUNyRSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQUU7UUFDckUsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUFFO1FBQ3JFLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FBRTtRQUNyRSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQUU7S0FDeEU7SUFDRCxPQUFPO1FBQ0gsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvRyxVQUFVO1FBQ1YsVUFBVTtRQUNWLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEcsQ0FBQztBQUNOLENBQUM7QUFDRCxtR0FBbUc7QUFDbkcsTUFBTTtBQUNOLDZFQUE2RTtBQUM3RSxLQUFLO0FBQ0wsc0JBQXNCO0FBQ3RCLHlDQUF5QztBQUN6QyxzREFBc0Q7QUFDdEQsd0RBQXdEO0FBQ3hELDhDQUE4QztBQUM5QywwRUFBMEU7QUFDMUUsa0ZBQWtGO0FBQ2xGLE1BQU07QUFDTiw0SUFBNEk7QUFDNUksNkJBQTZCO0FBQzdCLDBDQUEwQztBQUMxQyx5R0FBeUc7QUFDekcsa0hBQWtIO0FBQ2xILHlEQUF5RDtBQUN6RCw2QkFBNkI7QUFDN0IsNkRBQTZEO0FBQzdELDRCQUE0QjtBQUM1QiwyQ0FBMkM7QUFDM0Msc0JBQXNCO0FBQ3RCLDJDQUEyQztBQUMzQyxlQUFlO0FBQ2YsMEZBQTBGO0FBQzFGLFFBQVE7QUFDUixpQ0FBaUM7QUFDakMseUNBQXlDO0FBQ3pDLDhDQUE4QztBQUM5QyxrSUFBa0k7QUFDbEksZ0VBQWdFO0FBQ2hFLHVEQUF1RDtBQUN2RCxpRkFBaUY7QUFDakYsNERBQTREO0FBQzVELGdJQUFnSTtBQUNoSSxvRUFBb0U7QUFDcEUsUUFBUTtBQUNSLGlEQUFpRDtBQUNqRCxtRUFBbUU7QUFDbkUsaURBQWlEO0FBQ2pELFFBQVE7QUFDUixvQkFBb0I7QUFDcEIsSUFBSTtBQUNKLGdIQUFnSDtBQUNoSCxxQ0FBcUM7QUFDckMsc0ZBQXNGO0FBQ3RGLGlGQUFpRjtBQUNqRixlQUFlO0FBQ2YsbUdBQW1HO0FBQ25HLFFBQVE7QUFDUixJQUFJO0FBQ0osc0hBQXNIO0FBQ3RILHFDQUFxQztBQUNyQyxzRkFBc0Y7QUFDdEYsbUZBQW1GO0FBQ25GLGVBQWU7QUFDZix1R0FBdUc7QUFDdkcsUUFBUTtBQUNSLElBQUk7QUFDSixpQ0FBaUM7QUFDakMsdUNBQXVDO0FBQ3ZDLG9DQUFvQztBQUNwQyxJQUFJIn0=