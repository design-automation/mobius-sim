"use strict";
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
exports.GIFuncsMake = exports._ECutMethod = exports._EExtrudeMethod = exports._ELoftMethod = exports._EClose = void 0;
const lodash_1 = __importDefault(require("lodash"));
const THREE = __importStar(require("three"));
const distance_1 = require("../../geom/distance");
const matrix_1 = require("../../geom/matrix");
const vectors_1 = require("../../geom/vectors");
const arrs_1 = require("../../util/arrs");
const common_1 = require("../common");
const common_id_funcs_1 = require("../common_id_funcs");
// Enums
var _EClose;
(function (_EClose) {
    _EClose["OPEN"] = "open";
    _EClose["CLOSE"] = "close";
})(_EClose = exports._EClose || (exports._EClose = {}));
var _ELoftMethod;
(function (_ELoftMethod) {
    _ELoftMethod["OPEN_QUADS"] = "open_quads";
    _ELoftMethod["CLOSED_QUADS"] = "closed_quads";
    _ELoftMethod["OPEN_STRINGERS"] = "open_stringers";
    _ELoftMethod["CLOSED_STRINGERS"] = "closed_stringers";
    _ELoftMethod["OPEN_RIBS"] = "open_ribs";
    _ELoftMethod["CLOSED_RIBS"] = "closed_ribs";
    _ELoftMethod["COPIES"] = "copies";
})(_ELoftMethod = exports._ELoftMethod || (exports._ELoftMethod = {}));
var _EExtrudeMethod;
(function (_EExtrudeMethod) {
    _EExtrudeMethod["QUADS"] = "quads";
    _EExtrudeMethod["STRINGERS"] = "stringers";
    _EExtrudeMethod["RIBS"] = "ribs";
    _EExtrudeMethod["COPIES"] = "copies";
})(_EExtrudeMethod = exports._EExtrudeMethod || (exports._EExtrudeMethod = {}));
var _ECutMethod;
(function (_ECutMethod) {
    _ECutMethod["KEEP_ABOVE"] = "keep_above";
    _ECutMethod["KEEP_BELOW"] = "keep_below";
    _ECutMethod["KEEP_BOTH"] = "keep_both";
})(_ECutMethod = exports._ECutMethod || (exports._ECutMethod = {}));
/**
 * Class for editing geometry.
 */
class GIFuncsMake {
    // ================================================================================================
    /**
     * Constructor
     */
    constructor(model) {
        this.modeldata = model;
    }
    // ================================================================================================
    /**
     *
     * @param coords
     */
    position(coords) {
        const ssid = this.modeldata.active_ssid;
        const depth = (0, arrs_1.getArrDepth)(coords);
        if (depth === 1) {
            const coord1 = coords;
            const posi_i = this.modeldata.geom.add.addPosi();
            this.modeldata.attribs.set.setEntAttribVal(common_1.EEntType.POSI, posi_i, common_1.EAttribNames.COORDS, coord1);
            return [common_1.EEntType.POSI, posi_i];
        }
        else if (depth === 2) {
            const coords2 = coords;
            return coords2.map(coord => this.position(coord));
        }
        else {
            const coords3 = coords;
            return coords3.map(coord2 => this.position(coord2));
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     */
    point(ents_arr) {
        const ssid = this.modeldata.active_ssid;
        const depth = (0, arrs_1.getArrDepth)(ents_arr);
        if (depth === 1) {
            const [ent_type, index] = ents_arr; // either a posi or something else
            if (ent_type === common_1.EEntType.POSI) {
                const point_i = this.modeldata.geom.add.addPoint(index);
                return [common_1.EEntType.POINT, point_i];
            }
            else {
                const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                return posis_i.map(posi_i => this.point([common_1.EEntType.POSI, posi_i]));
            }
        }
        else if (depth === 2) {
            ents_arr = ents_arr;
            return ents_arr.map(ents_arr_item => this.point(ents_arr_item));
        }
        else { // depth > 2
            ents_arr = ents_arr;
            return ents_arr.map(ents_arr_item => this.point(ents_arr_item));
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param close
     */
    polyline(ents_arr, close) {
        const posis_arr = this._getPlinePosisFromEnts(ents_arr);
        return this._polyline(posis_arr, close);
    }
    _polyline(posis_arr, close) {
        const depth = (0, arrs_1.getArrDepth)(posis_arr);
        if (depth === 2) {
            if (posis_arr.length < 2) {
                throw new Error('Error in make.Polyline: Polylines must have at least two positions.');
            }
            const bool_close = (close === _EClose.CLOSE);
            const posis_i = (0, common_id_funcs_1.getEntIdxs)(posis_arr);
            const pline_i = this.modeldata.geom.add.addPline(posis_i, bool_close);
            return [common_1.EEntType.PLINE, pline_i];
        }
        else {
            posis_arr = posis_arr;
            return posis_arr.map(ents_arr_item => this._polyline(ents_arr_item, close));
        }
    }
    _getPlinePosisFromEnts(ents_arr) {
        // check if this is a single object ID
        if ((0, arrs_1.getArrDepth)(ents_arr) === 1) {
            ents_arr = [ents_arr];
        }
        // check if this is a list of posis, verts, or points
        if ((0, arrs_1.getArrDepth)(ents_arr) === 2 && (0, common_id_funcs_1.isDim0)(ents_arr[0][0])) {
            const ents_arr2 = [];
            for (const ent_arr of ents_arr) {
                const [ent_type, index] = ent_arr;
                if (ent_type === common_1.EEntType.POSI) {
                    ents_arr2.push(ent_arr);
                }
                else {
                    const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                    for (const posi_i of posis_i) {
                        ents_arr2.push([common_1.EEntType.POSI, posi_i]);
                    }
                }
            }
            ents_arr = [ents_arr2];
        }
        // now process the ents
        const posis_arrs = [];
        for (const ent_arr of ents_arr) {
            if ((0, arrs_1.getArrDepth)(ent_arr) === 2) { // this must be a list of posis
                posis_arrs.push(ent_arr);
                continue;
            }
            const [ent_type, index] = ent_arr;
            switch (ent_type) {
                case common_1.EEntType.EDGE:
                case common_1.EEntType.WIRE:
                case common_1.EEntType.PLINE:
                    const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                    const posis_arr = posis_i.map(posi_i => [common_1.EEntType.POSI, posi_i]);
                    posis_arrs.push(posis_arr);
                    break;
                case common_1.EEntType.PGON:
                    const wires_i = this.modeldata.geom.nav.navAnyToWire(ent_type, index);
                    for (let j = 0; j < wires_i.length; j++) {
                        const wire_i = wires_i[j];
                        const wire_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.WIRE, wire_i);
                        const wire_posis_arr = wire_posis_i.map(posi_i => [common_1.EEntType.POSI, posi_i]);
                        posis_arrs.push(wire_posis_arr);
                    }
                    break;
                default:
                    break;
            }
        }
        return posis_arrs;
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     */
    polygon(ents_arr) {
        const posis_arr = this._getPgonPosisFromEnts(ents_arr);
        return this._polygon(posis_arr);
    }
    _polygon(posis_arr) {
        const depth = (0, arrs_1.getArrDepth)(posis_arr);
        if (depth === 2) {
            if (posis_arr.length < 3) {
                throw new Error('Error in make.Polygon: Polygons must have at least three positions.');
            }
            const posis_i = (0, common_id_funcs_1.getEntIdxs)(posis_arr);
            const pgon_i = this.modeldata.geom.add.addPgon(posis_i);
            return [common_1.EEntType.PGON, pgon_i];
        }
        else {
            posis_arr = posis_arr;
            return posis_arr.map(ents_arr_item => this._polygon(ents_arr_item));
        }
    }
    _getPgonPosisFromEnts(ents_arr) {
        // check if this is a single object ID
        if ((0, arrs_1.getArrDepth)(ents_arr) === 1) {
            ents_arr = [ents_arr];
        }
        // check if this is a list of posis
        if ((0, arrs_1.getArrDepth)(ents_arr) === 2 && ents_arr[0][0] === common_1.EEntType.POSI) {
            // ents_arr =  [ents_arr] as TEntTypeIdx[][];
            const ents_arr2 = [];
            for (const ent_arr of ents_arr) {
                const [ent_type, index] = ent_arr;
                if (ent_type === common_1.EEntType.POSI) {
                    ents_arr2.push(ent_arr);
                }
                else {
                    const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                    for (const posi_i of posis_i) {
                        ents_arr2.push([common_1.EEntType.POSI, posi_i]);
                    }
                }
            }
            ents_arr = [ents_arr2];
        }
        // now process the ents
        const posis_arrs = [];
        for (const ent_arr of ents_arr) {
            if ((0, arrs_1.getArrDepth)(ent_arr) === 2) { // this must be a list of posis
                posis_arrs.push(ent_arr);
                continue;
            }
            const [ent_type, index] = ent_arr;
            switch (ent_type) {
                case common_1.EEntType.WIRE:
                case common_1.EEntType.PLINE:
                    const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                    const posis_arr = posis_i.map(posi_i => [common_1.EEntType.POSI, posi_i]);
                    posis_arrs.push(posis_arr);
                    break;
                case common_1.EEntType.PGON:
                    const wires_i = this.modeldata.geom.nav.navAnyToWire(ent_type, index);
                    for (let j = 0; j < wires_i.length; j++) {
                        const wire_i = wires_i[j];
                        const wire_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.WIRE, wire_i);
                        const wire_posis_arr = wire_posis_i.map(posi_i => [common_1.EEntType.POSI, posi_i]);
                        posis_arrs.push(wire_posis_arr);
                    }
                    break;
                default:
                    break;
            }
        }
        return posis_arrs;
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     */
    tin(ents_arr) {
        const depth = (0, arrs_1.getArrDepth)(ents_arr);
        if (depth === 2) {
            const posis_i = (0, common_id_funcs_1.getEntIdxs)(ents_arr);
            const vtxs_tf = [];
            for (const posi_i of posis_i) {
                const xyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
                vtxs_tf.push(xyz);
            }
            // const tin = turf.triangulate(vtxs_tf);
            // console.log(tin);
            return null;
        }
        else {
            ents_arr = ents_arr;
            return ents_arr.map(ents_arr_item => this.tin(ents_arr_item));
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arrs
     * @param divisions
     * @param method
     */
    loft(ents_arrs, divisions, method) {
        const depth = (0, arrs_1.getArrDepth)(ents_arrs);
        if (depth === 2) {
            const ents_arr = ents_arrs;
            switch (method) {
                case _ELoftMethod.OPEN_QUADS:
                case _ELoftMethod.CLOSED_QUADS:
                    return this._loftQuads(ents_arr, divisions, method);
                case _ELoftMethod.OPEN_STRINGERS:
                case _ELoftMethod.CLOSED_STRINGERS:
                    return this._loftStringers(ents_arr, divisions, method);
                case _ELoftMethod.OPEN_RIBS:
                case _ELoftMethod.CLOSED_RIBS:
                    return this._loftRibs(ents_arr, divisions, method);
                case _ELoftMethod.COPIES:
                    return this._loftCopies(ents_arr, divisions);
                default:
                    break;
            }
        }
        else if (depth === 3) {
            const all_loft_ents = [];
            for (const ents_arr of ents_arrs) {
                const loft_ents = this.loft(ents_arr, divisions, method);
                loft_ents.forEach(loft_ent => all_loft_ents.push(loft_ent));
            }
            return all_loft_ents;
        }
    }
    _loftQuads(ents_arr, divisions, method) {
        const edges_arrs_i = [];
        let num_edges = 0;
        for (const ents of ents_arr) {
            const [ent_type, index] = ents;
            const edges_i = this.modeldata.geom.nav.navAnyToEdge(ent_type, index);
            if (edges_arrs_i.length === 0) {
                num_edges = edges_i.length;
            }
            if (edges_i.length !== num_edges) {
                throw new Error('make.Loft: Number of edges is not consistent.');
            }
            edges_arrs_i.push(edges_i);
        }
        if (method === _ELoftMethod.CLOSED_QUADS) {
            edges_arrs_i.push(edges_arrs_i[0]);
        }
        const new_pgons_i = [];
        for (let i = 0; i < edges_arrs_i.length - 1; i++) {
            const edges_i_a = edges_arrs_i[i];
            const edges_i_b = edges_arrs_i[i + 1];
            if (divisions > 0) {
                const strip_posis_map = new Map();
                for (let j = 0; j < num_edges; j++) {
                    const edge_i_a = edges_i_a[j];
                    const edge_i_b = edges_i_b[j];
                    // get exist two posis_i
                    const exist_posis_a_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edge_i_a);
                    const exist_posis_b_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edge_i_b);
                    // create the new posis strip if necessary
                    for (const k of [0, 1]) {
                        if (strip_posis_map.get(exist_posis_a_i[k]) === undefined) {
                            const xyz_a = this.modeldata.attribs.posis.getPosiCoords(exist_posis_a_i[k]);
                            const xyz_b = this.modeldata.attribs.posis.getPosiCoords(exist_posis_b_i[k]);
                            const extrude_vec_div = (0, vectors_1.vecDiv)((0, vectors_1.vecFromTo)(xyz_a, xyz_b), divisions);
                            const strip_posis_i = [exist_posis_a_i[k]];
                            for (let d = 1; d < divisions; d++) {
                                const strip_posi_i = this.modeldata.geom.add.addPosi();
                                const move_xyz = (0, vectors_1.vecMult)(extrude_vec_div, d);
                                this.modeldata.attribs.posis.setPosiCoords(strip_posi_i, (0, vectors_1.vecAdd)(xyz_a, move_xyz));
                                strip_posis_i.push(strip_posi_i);
                            }
                            strip_posis_i.push(exist_posis_b_i[k]);
                            strip_posis_map.set(exist_posis_a_i[k], strip_posis_i);
                        }
                    }
                    // get the two strips and make polygons
                    const strip1_posis_i = strip_posis_map.get(exist_posis_a_i[0]);
                    const strip2_posis_i = strip_posis_map.get(exist_posis_a_i[1]);
                    for (let k = 0; k < strip1_posis_i.length - 1; k++) {
                        const c1 = strip1_posis_i[k];
                        const c2 = strip2_posis_i[k];
                        const c3 = strip2_posis_i[k + 1];
                        const c4 = strip1_posis_i[k + 1];
                        const pgon_i = this.modeldata.geom.add.addPgon([c1, c2, c3, c4]);
                        new_pgons_i.push(pgon_i);
                    }
                }
            }
            else {
                for (let j = 0; j < num_edges; j++) {
                    const posis_i_a = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edges_i_a[j]);
                    const posis_i_b = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edges_i_b[j]);
                    const pgon_i = this.modeldata.geom.add.addPgon([posis_i_a[0], posis_i_a[1], posis_i_b[1], posis_i_b[0]]);
                    new_pgons_i.push(pgon_i);
                }
            }
        }
        return new_pgons_i.map(pgon_i => [common_1.EEntType.PGON, pgon_i]);
    }
    _loftStringers(ents_arr, divisions, method) {
        const posis_arrs_i = [];
        let num_posis = 0;
        for (const ents of ents_arr) {
            const [ent_type, index] = ents;
            const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
            if (posis_arrs_i.length === 0) {
                num_posis = posis_i.length;
            }
            if (posis_i.length !== num_posis) {
                throw new Error('make.Loft: Number of positions is not consistent.');
            }
            posis_arrs_i.push(posis_i);
        }
        const is_closed = method === _ELoftMethod.CLOSED_STRINGERS;
        if (is_closed) {
            posis_arrs_i.push(posis_arrs_i[0]);
        }
        const stringer_plines_i = [];
        for (let i = 0; i < num_posis; i++) {
            const stringer_posis_i = [];
            for (let j = 0; j < posis_arrs_i.length - 1; j++) {
                stringer_posis_i.push(posis_arrs_i[j][i]);
                if (divisions > 0) {
                    const xyz1 = this.modeldata.attribs.posis.getPosiCoords(posis_arrs_i[j][i]);
                    const xyz2 = this.modeldata.attribs.posis.getPosiCoords(posis_arrs_i[j + 1][i]);
                    const vec = (0, vectors_1.vecDiv)((0, vectors_1.vecFromTo)(xyz1, xyz2), divisions);
                    for (let k = 1; k < divisions; k++) {
                        const new_xyz = (0, vectors_1.vecAdd)(xyz1, (0, vectors_1.vecMult)(vec, k));
                        const new_posi_i = this.modeldata.geom.add.addPosi();
                        this.modeldata.attribs.posis.setPosiCoords(new_posi_i, new_xyz);
                        stringer_posis_i.push(new_posi_i);
                    }
                }
            }
            if (!is_closed) {
                stringer_posis_i.push(posis_arrs_i[posis_arrs_i.length - 1][i]);
            }
            const pline_i = this.modeldata.geom.add.addPline(stringer_posis_i, is_closed);
            stringer_plines_i.push(pline_i);
        }
        return stringer_plines_i.map(pline_i => [common_1.EEntType.PLINE, pline_i]);
    }
    _loftRibs(ents_arr, divisions, method) {
        const posis_arrs_i = [];
        let num_posis = 0;
        for (const ents of ents_arr) {
            const [ent_type, index] = ents;
            const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
            if (posis_arrs_i.length === 0) {
                num_posis = posis_i.length;
            }
            if (posis_i.length !== num_posis) {
                throw new Error('make.Loft: Number of positions is not consistent.');
            }
            posis_arrs_i.push(posis_i);
        }
        const is_closed = method === _ELoftMethod.CLOSED_RIBS;
        if (is_closed) {
            posis_arrs_i.push(posis_arrs_i[0]);
        }
        let ribs_is_closed = false;
        switch (ents_arr[0][0]) { // check if the first entity is closed
            case common_1.EEntType.PGON:
                ribs_is_closed = true;
                break;
            case common_1.EEntType.PLINE:
                const wire_i = this.modeldata.geom.nav.navPlineToWire(ents_arr[0][1]);
                ribs_is_closed = this.modeldata.geom.query.isWireClosed(wire_i);
                break;
            case common_1.EEntType.WIRE:
                ribs_is_closed = this.modeldata.geom.query.isWireClosed(ents_arr[0][1]);
                break;
            default:
                break;
        }
        const rib_plines_i = [];
        for (let i = 0; i < posis_arrs_i.length - 1; i++) {
            const pline_i = this.modeldata.geom.add.addPline(posis_arrs_i[i], ribs_is_closed);
            rib_plines_i.push(pline_i);
            if (divisions > 0) {
                const xyzs1 = posis_arrs_i[i].map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
                const xyzs2 = posis_arrs_i[i + 1].map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
                const vecs = [];
                for (let k = 0; k < num_posis; k++) {
                    const vec = (0, vectors_1.vecDiv)((0, vectors_1.vecFromTo)(xyzs1[k], xyzs2[k]), divisions);
                    vecs.push(vec);
                }
                for (let j = 1; j < divisions; j++) {
                    const rib_posis_i = [];
                    for (let k = 0; k < num_posis; k++) {
                        const new_xyz = (0, vectors_1.vecAdd)(xyzs1[k], (0, vectors_1.vecMult)(vecs[k], j));
                        const new_posi_i = this.modeldata.geom.add.addPosi();
                        this.modeldata.attribs.posis.setPosiCoords(new_posi_i, new_xyz);
                        rib_posis_i.push(new_posi_i);
                    }
                    const new_rib_pline_i = this.modeldata.geom.add.addPline(rib_posis_i, ribs_is_closed);
                    rib_plines_i.push(new_rib_pline_i);
                }
            }
        }
        if (!is_closed) {
            const pline_i = this.modeldata.geom.add.addPline(posis_arrs_i[posis_arrs_i.length - 1], ribs_is_closed);
            rib_plines_i.push(pline_i);
        }
        return rib_plines_i.map(pline_i => [common_1.EEntType.PLINE, pline_i]);
    }
    _loftCopies(ents_arr, divisions) {
        const posis_arrs_i = [];
        let num_posis = 0;
        for (const ents of ents_arr) {
            const [ent_type, index] = ents;
            const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
            if (posis_arrs_i.length === 0) {
                num_posis = posis_i.length;
            }
            if (posis_i.length !== num_posis) {
                throw new Error('make.Loft: Number of positions is not consistent.');
            }
            posis_arrs_i.push(posis_i);
        }
        const copies = [];
        for (let i = 0; i < posis_arrs_i.length - 1; i++) {
            copies.push(ents_arr[i]);
            if (divisions > 0) {
                const xyzs1 = posis_arrs_i[i].map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
                const xyzs2 = posis_arrs_i[i + 1].map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
                const vecs = [];
                for (let k = 0; k < num_posis; k++) {
                    const vec = (0, vectors_1.vecDiv)((0, vectors_1.vecFromTo)(xyzs1[k], xyzs2[k]), divisions);
                    vecs.push(vec);
                }
                for (let j = 1; j < divisions; j++) {
                    const lofted_ent_arr = this.modeldata.funcs_common.copyGeom(ents_arr[i], true);
                    this.modeldata.funcs_common.clonePosisInEnts(lofted_ent_arr, true);
                    const [lofted_ent_type, lofted_ent_i] = lofted_ent_arr;
                    const new_posis_i = this.modeldata.geom.nav.navAnyToPosi(lofted_ent_type, lofted_ent_i);
                    for (let k = 0; k < num_posis; k++) {
                        const new_xyz = (0, vectors_1.vecAdd)(xyzs1[k], (0, vectors_1.vecMult)(vecs[k], j));
                        this.modeldata.attribs.posis.setPosiCoords(new_posis_i[k], new_xyz);
                    }
                    copies.push(lofted_ent_arr);
                }
            }
        }
        copies.push(ents_arr[ents_arr.length - 1]);
        return copies;
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param dist
     * @param divisions
     * @param method
     */
    extrude(ents_arr, dist, divisions, method) {
        // extrude
        if (method === _EExtrudeMethod.COPIES) {
            return this._extrudeCopies(ents_arr, dist, divisions);
        }
        else {
            return this._extrudeEdges(ents_arr, dist, divisions, method);
        }
    }
    _extrudeEdges(ents_arr, dist, divisions, method) {
        const extrude_vec = (Array.isArray(dist) ? dist : [0, 0, dist]);
        if ((0, arrs_1.getArrDepth)(ents_arr) === 1) {
            const [ent_type, index] = ents_arr;
            // check if this is a collection, call this function again
            if (ent_type === common_1.EEntType.COLL) {
                return this._extrudeColl(index, extrude_vec, divisions, method);
            }
            // check if this is a position, a vertex, or a point -> pline
            if ((0, common_id_funcs_1.isDim0)(ent_type)) {
                return this._extrudeDim0(ent_type, index, extrude_vec, divisions);
            }
            // extrude edges -> polygons
            switch (method) {
                case _EExtrudeMethod.QUADS:
                    return this._extrudeQuads(ent_type, index, extrude_vec, divisions);
                case _EExtrudeMethod.STRINGERS:
                    return this._extrudeStringers(ent_type, index, extrude_vec, divisions);
                case _EExtrudeMethod.RIBS:
                    return this._extrudeRibs(ent_type, index, extrude_vec, divisions);
                default:
                    throw new Error('Extrude method not recognised.');
            }
        }
        else {
            const new_ents_arr = [];
            ents_arr.forEach(ent_arr => {
                const result = this._extrudeEdges(ent_arr, extrude_vec, divisions, method);
                result.forEach(new_ent_arr => new_ents_arr.push(new_ent_arr));
            });
            return new_ents_arr;
        }
    }
    _extrudeCopies(ents, dist, divisions) {
        const ents_arr = ((0, arrs_1.getArrDepth)(ents) === 1 ? [ents] : ents);
        const extrude_vec = (Array.isArray(dist) ? dist : [0, 0, dist]);
        const extrude_vec_div = (0, vectors_1.vecDiv)(extrude_vec, divisions);
        const copies = [];
        // make the copies
        for (let i = 0; i < divisions + 1; i++) {
            // copy the list of entities
            const copied_ents_arr = this.modeldata.funcs_common.copyGeom(ents_arr, true);
            // copy the positions that belong to the list of entities
            this.modeldata.funcs_common.clonePosisInEntsAndMove(copied_ents_arr, true, (0, vectors_1.vecMult)(extrude_vec_div, i));
            // add to the array
            for (const copied_ent_arr of copied_ents_arr) {
                copies.push(copied_ent_arr);
            }
        }
        // return the copies
        return copies;
    }
    _extrudeColl(index, extrude_vec, divisions, method) {
        const points_i = this.modeldata.geom.nav.navCollToPoint(index);
        const res1 = points_i.map(point_i => this._extrudeEdges([common_1.EEntType.POINT, point_i], extrude_vec, divisions, method));
        const plines_i = this.modeldata.geom.nav.navCollToPline(index);
        const res2 = plines_i.map(pline_i => this._extrudeEdges([common_1.EEntType.PLINE, pline_i], extrude_vec, divisions, method));
        const pgons_i = this.modeldata.geom.nav.navCollToPgon(index);
        const res3 = pgons_i.map(pgon_i => this._extrudeEdges([common_1.EEntType.PGON, pgon_i], extrude_vec, divisions, method));
        return [].concat(res1, res2, res3);
    }
    _extrudeDim0(ent_type, index, extrude_vec, divisions) {
        const extrude_vec_div = (0, vectors_1.vecDiv)(extrude_vec, divisions);
        const exist_posi_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index)[0];
        const xyz = this.modeldata.attribs.posis.getPosiCoords(exist_posi_i);
        const strip_posis_i = [exist_posi_i];
        for (let i = 1; i < divisions + 1; i++) {
            const strip_posi_i = this.modeldata.geom.add.addPosi();
            const move_xyz = (0, vectors_1.vecMult)(extrude_vec_div, i);
            this.modeldata.attribs.posis.setPosiCoords(strip_posi_i, (0, vectors_1.vecAdd)(xyz, move_xyz));
            strip_posis_i.push(strip_posi_i);
        }
        // loft between the positions and create a single polyline
        const pline_i = this.modeldata.geom.add.addPline(strip_posis_i);
        return [[common_1.EEntType.PLINE, pline_i]];
    }
    _extrudeQuads(ent_type, index, extrude_vec, divisions) {
        const new_pgons_i = [];
        const extrude_vec_div = (0, vectors_1.vecDiv)(extrude_vec, divisions);
        const edges_i = this.modeldata.geom.nav.navAnyToEdge(ent_type, index);
        const strip_posis_map = new Map();
        for (const edge_i of edges_i) {
            // get exist posis_i
            const exist_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edge_i);
            // create the new posis strip if necessary
            for (const exist_posi_i of exist_posis_i) {
                if (strip_posis_map.get(exist_posi_i) === undefined) {
                    const xyz = this.modeldata.attribs.posis.getPosiCoords(exist_posi_i);
                    const strip_posis_i = [exist_posi_i];
                    for (let i = 1; i < divisions + 1; i++) {
                        const strip_posi_i = this.modeldata.geom.add.addPosi();
                        const move_xyz = (0, vectors_1.vecMult)(extrude_vec_div, i);
                        this.modeldata.attribs.posis.setPosiCoords(strip_posi_i, (0, vectors_1.vecAdd)(xyz, move_xyz));
                        strip_posis_i.push(strip_posi_i);
                    }
                    strip_posis_map.set(exist_posi_i, strip_posis_i);
                }
            }
            // get the two strips and make polygons
            const strip1_posis_i = strip_posis_map.get(exist_posis_i[0]);
            const strip2_posis_i = strip_posis_map.get(exist_posis_i[1]);
            for (let i = 0; i < strip1_posis_i.length - 1; i++) {
                const c1 = strip1_posis_i[i];
                const c2 = strip2_posis_i[i];
                const c3 = strip2_posis_i[i + 1];
                const c4 = strip1_posis_i[i + 1];
                const pgon_i = this.modeldata.geom.add.addPgon([c1, c2, c3, c4]);
                new_pgons_i.push(pgon_i);
            }
        }
        // cap the top
        if ((0, common_id_funcs_1.isDim2)(ent_type)) { // create a top -> polygon
            const cap_pgon_i = this._extrudeCap(index, strip_posis_map, divisions);
            new_pgons_i.push(cap_pgon_i);
        }
        return new_pgons_i.map(pgon_i => [common_1.EEntType.PGON, pgon_i]);
    }
    _extrudeStringers(ent_type, index, extrude_vec, divisions) {
        const new_plines_i = [];
        const extrude_vec_div = (0, vectors_1.vecDiv)(extrude_vec, divisions);
        const edges_i = this.modeldata.geom.nav.navAnyToEdge(ent_type, index);
        const strip_posis_map = new Map();
        for (const edge_i of edges_i) {
            // get exist posis_i
            const exist_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edge_i);
            // create the new posis strip if necessary
            for (const exist_posi_i of exist_posis_i) {
                if (strip_posis_map.get(exist_posi_i) === undefined) {
                    const xyz = this.modeldata.attribs.posis.getPosiCoords(exist_posi_i);
                    const strip_posis_i = [exist_posi_i];
                    for (let i = 1; i < divisions + 1; i++) {
                        const strip_posi_i = this.modeldata.geom.add.addPosi();
                        const move_xyz = (0, vectors_1.vecMult)(extrude_vec_div, i);
                        this.modeldata.attribs.posis.setPosiCoords(strip_posi_i, (0, vectors_1.vecAdd)(xyz, move_xyz));
                        strip_posis_i.push(strip_posi_i);
                    }
                    strip_posis_map.set(exist_posi_i, strip_posis_i);
                }
            }
        }
        // make the stringers
        strip_posis_map.forEach(strip_posis_i => {
            const pline_i = this.modeldata.geom.add.addPline(strip_posis_i);
            new_plines_i.push(pline_i);
        });
        // return the stringers
        return new_plines_i.map(pline_i => [common_1.EEntType.PLINE, pline_i]);
    }
    _extrudeRibs(ent_type, index, extrude_vec, divisions) {
        const new_plines_i = [];
        const extrude_vec_div = (0, vectors_1.vecDiv)(extrude_vec, divisions);
        const edges_i = this.modeldata.geom.nav.navAnyToEdge(ent_type, index);
        const strip_posis_map = new Map();
        for (const edge_i of edges_i) {
            // get exist posis_i
            const exist_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edge_i);
            // create the new posis strip if necessary
            for (const exist_posi_i of exist_posis_i) {
                if (strip_posis_map.get(exist_posi_i) === undefined) {
                    const xyz = this.modeldata.attribs.posis.getPosiCoords(exist_posi_i);
                    const strip_posis_i = [exist_posi_i];
                    for (let i = 1; i < divisions + 1; i++) {
                        const strip_posi_i = this.modeldata.geom.add.addPosi();
                        const move_xyz = (0, vectors_1.vecMult)(extrude_vec_div, i);
                        this.modeldata.attribs.posis.setPosiCoords(strip_posi_i, (0, vectors_1.vecAdd)(xyz, move_xyz));
                        strip_posis_i.push(strip_posi_i);
                    }
                    strip_posis_map.set(exist_posi_i, strip_posis_i);
                }
            }
        }
        // make an array of ents to process as ribs
        let ribs_is_closed = false;
        const ribs_posis_i = [];
        switch (ent_type) { // check if the entity is closed
            case common_1.EEntType.PGON:
                ribs_is_closed = true;
                const face_wires_i = this.modeldata.geom.nav.navAnyToWire(ent_type, index);
                for (const face_wire_i of face_wires_i) {
                    const face_wire_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.WIRE, face_wire_i);
                    ribs_posis_i.push(face_wire_posis_i);
                }
                break;
            case common_1.EEntType.PLINE:
                const pline_wire_i = this.modeldata.geom.nav.navPlineToWire(index);
                const pline_wire_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.WIRE, pline_wire_i);
                ribs_posis_i.push(pline_wire_posis_i);
                ribs_is_closed = this.modeldata.geom.query.isWireClosed(pline_wire_i);
                break;
            case common_1.EEntType.WIRE:
                const wire_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.WIRE, index);
                ribs_posis_i.push(wire_posis_i);
                ribs_is_closed = this.modeldata.geom.query.isWireClosed(index);
                break;
            default:
                const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                ribs_posis_i.push(posis_i);
                break;
        }
        // make the ribs
        for (let i = 0; i < divisions + 1; i++) {
            for (const rib_posis_i of ribs_posis_i) {
                const mapped_rib_posis_i = rib_posis_i.map(rib_posi_i => strip_posis_map.get(rib_posi_i)[i]);
                const pline_i = this.modeldata.geom.add.addPline(mapped_rib_posis_i, ribs_is_closed);
                new_plines_i.push(pline_i);
            }
        }
        // return the ribs
        return new_plines_i.map(pline_i => [common_1.EEntType.PLINE, pline_i]);
    }
    _extrudeCap(pgon_i, strip_posis_map, divisions) {
        // get positions on boundary
        const old_wire_i = this.modeldata.geom.query.getPgonBoundary(pgon_i);
        const old_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.WIRE, old_wire_i);
        const new_posis_i = old_posis_i.map(old_posi_i => strip_posis_map.get(old_posi_i)[divisions]);
        // get positions for holes
        const old_holes_wires_i = this.modeldata.geom.query.getPgonHoles(pgon_i);
        const new_holes_posis_i = [];
        for (const old_hole_wire_i of old_holes_wires_i) {
            const old_hole_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.WIRE, old_hole_wire_i);
            const new_hole_posis_i = old_hole_posis_i.map(old_posi_i => strip_posis_map.get(old_posi_i)[divisions]);
            new_holes_posis_i.push(new_hole_posis_i);
        }
        // make new polygon
        const new_pgon_i = this.modeldata.geom.add.addPgon(new_posis_i, new_holes_posis_i);
        return new_pgon_i;
    }
    // ================================================================================================
    /**
     *
     * @param backbone_ents
     * @param xsection_ent
     * @param divisions
     * @param method
     */
    sweep(backbone_ents, xsection_ent, divisions, method) {
        // the xsection
        const [xsection_ent_type, xsection_index] = xsection_ent;
        let xsection_wire_i = null;
        if (xsection_ent_type === common_1.EEntType.WIRE) {
            xsection_wire_i = xsection_index;
        }
        else {
            const xsection_wires_i = this.modeldata.geom.nav.navAnyToWire(xsection_ent_type, xsection_index);
            xsection_wire_i = xsection_wires_i[0]; // select the first wire that is found
        }
        // get all the wires and put them into an array
        const backbone_wires_i = [];
        for (const [ent_type, index] of backbone_ents) {
            if (ent_type === common_1.EEntType.WIRE) {
                backbone_wires_i.push(index);
            }
            else {
                const ent_wires_i = this.modeldata.geom.nav.navAnyToWire(ent_type, index);
                backbone_wires_i.push(...ent_wires_i);
            }
        }
        return this._sweep(backbone_wires_i, xsection_wire_i, divisions, method);
    }
    _sweep(backbone_wires_i, xsection_wire_i, divisions, method) {
        if (!Array.isArray(backbone_wires_i)) {
            // extrude edges -> polygons
            switch (method) {
                case _EExtrudeMethod.QUADS:
                    return this._sweepQuads(backbone_wires_i, xsection_wire_i, divisions);
                case _EExtrudeMethod.STRINGERS:
                    return this._sweepStringers(backbone_wires_i, xsection_wire_i, divisions);
                case _EExtrudeMethod.RIBS:
                    return this._sweepRibs(backbone_wires_i, xsection_wire_i, divisions);
                case _EExtrudeMethod.COPIES:
                    return this._sweepCopies(backbone_wires_i, xsection_wire_i, divisions);
                default:
                    throw new Error('Extrude method not recognised.');
            }
        }
        else {
            const new_ents = [];
            for (const wire_i of backbone_wires_i) {
                const wire_new_ents = this._sweep(wire_i, xsection_wire_i, divisions, method);
                for (const wire_new_ent of wire_new_ents) {
                    new_ents.push(wire_new_ent);
                }
            }
            return new_ents;
        }
    }
    _sweepQuads(backbone_wire_i, xsection_wire_i, divisions) {
        const strips_posis_i = this._sweepPosis(backbone_wire_i, xsection_wire_i, divisions);
        const backbone_is_closed = this.modeldata.geom.query.isWireClosed(backbone_wire_i);
        const xsection_is_closed = this.modeldata.geom.query.isWireClosed(xsection_wire_i);
        // add row if backbone_is_closed
        if (backbone_is_closed) {
            strips_posis_i.push(strips_posis_i[0].slice());
        }
        // add a posi_i to end of each strip if xsection_is_closed
        if (xsection_is_closed) {
            for (const strip_posis_i of strips_posis_i) {
                strip_posis_i.push(strip_posis_i[0]);
            }
        }
        // create quads
        const new_pgons = [];
        for (let i = 0; i < strips_posis_i.length - 1; i++) {
            const strip1_posis_i = strips_posis_i[i];
            const strip2_posis_i = strips_posis_i[i + 1];
            for (let j = 0; j < strip1_posis_i.length - 1; j++) {
                const c1 = strip1_posis_i[j];
                const c2 = strip2_posis_i[j];
                const c3 = strip2_posis_i[j + 1];
                const c4 = strip1_posis_i[j + 1];
                const pgon_i = this.modeldata.geom.add.addPgon([c1, c2, c3, c4]);
                new_pgons.push([common_1.EEntType.PGON, pgon_i]);
            }
        }
        return new_pgons;
    }
    _listZip(debug, list1, list2) {
        if (arguments.length === 2) {
            return lodash_1.default.unzip(list1);
        }
        const lists = Array.from(arguments).slice(1);
        return lodash_1.default.zip(...lists);
    }
    _sweepStringers(backbone_wire_i, xsection_wire_i, divisions) {
        const backbone_is_closed = this.modeldata.geom.query.isWireClosed(backbone_wire_i);
        const ribs_posis_i = this._sweepPosis(backbone_wire_i, xsection_wire_i, divisions);
        const stringers_posis_i = this._listZip(false, ribs_posis_i);
        const plines = [];
        for (const stringer_posis_i of stringers_posis_i) {
            const pline_i = this.modeldata.geom.add.addPline(stringer_posis_i, backbone_is_closed);
            plines.push([common_1.EEntType.PLINE, pline_i]);
        }
        return plines;
    }
    _sweepRibs(backbone_wire_i, xsection_wire_i, divisions) {
        const xsection_is_closed = this.modeldata.geom.query.isWireClosed(xsection_wire_i);
        const ribs_posis_i = this._sweepPosis(backbone_wire_i, xsection_wire_i, divisions);
        const plines = [];
        for (const rib_posis_i of ribs_posis_i) {
            const pline_i = this.modeldata.geom.add.addPline(rib_posis_i, xsection_is_closed);
            plines.push([common_1.EEntType.PLINE, pline_i]);
        }
        return plines;
    }
    _sweepCopies(backbone_wire_i, xsection_wire_i, divisions) {
        const posis_i = this._sweepPosis(backbone_wire_i, xsection_wire_i, divisions);
        // TODO
        throw new Error('Not implemented');
        // TODO
    }
    _sweepPosis(backbone_wire_i, xsection_wire_i, divisions) {
        // get the xyzs of the cross section
        const xsextion_xyzs = this.modeldata.attribs.posis.getEntCoords(common_1.EEntType.WIRE, xsection_wire_i);
        // get the xyzs of the backbone
        const wire_normal = this.modeldata.geom.query.getWireNormal(backbone_wire_i);
        const wire_is_closed = this.modeldata.geom.query.isWireClosed(backbone_wire_i);
        const wire_xyzs = this.modeldata.attribs.posis.getEntCoords(common_1.EEntType.WIRE, backbone_wire_i);
        let plane_xyzs = [];
        // if not divisions is not 1, then we need to add xyzs
        if (divisions === 1) {
            plane_xyzs = wire_xyzs;
        }
        else {
            if (wire_is_closed) {
                wire_xyzs.push(wire_xyzs[0]);
            }
            for (let i = 0; i < wire_xyzs.length - 1; i++) {
                const xyz0 = wire_xyzs[i];
                const xyz1 = wire_xyzs[i + 1];
                const vec = (0, vectors_1.vecFromTo)(xyz0, xyz1);
                const vec_div = (0, vectors_1.vecDiv)(vec, divisions);
                // create additional xyzs for planes
                plane_xyzs.push(xyz0);
                for (let j = 1; j < divisions; j++) {
                    plane_xyzs.push((0, vectors_1.vecAdd)(xyz0, (0, vectors_1.vecMult)(vec_div, j)));
                }
            }
            if (!wire_is_closed) {
                plane_xyzs.push(wire_xyzs[wire_xyzs.length - 1]);
            }
        }
        // create the planes
        const planes = this.modeldata.funcs_common.getPlanesSeq(plane_xyzs, wire_normal, wire_is_closed);
        // create the new  posis
        const XY = [[0, 0, 0], [1, 0, 0], [0, 1, 0]];
        const all_new_posis_i = [];
        for (const plane of planes) {
            const matrix = (0, matrix_1.xfromSourceTargetMatrix)(XY, plane);
            const xsection_posis_i = [];
            for (const xsextion_xyz of xsextion_xyzs) {
                const new_xyz = (0, matrix_1.multMatrix)(xsextion_xyz, matrix);
                const posi_i = this.modeldata.geom.add.addPosi();
                this.modeldata.attribs.posis.setPosiCoords(posi_i, new_xyz);
                xsection_posis_i.push(posi_i);
            }
            all_new_posis_i.push(xsection_posis_i);
        }
        // return the new posis
        return all_new_posis_i;
    }
    // ================================================================================================
    /**
     * Makes new polyline and polygons by joining existing polylines or polygons
     * @param ents_arr
     * @param plane
     * @param method
     */
    join(ents_arr) {
        // get polylines and polygons
        const set_plines = new Set();
        const set_pgons = new Set();
        for (const [ent_type, ent_i] of ents_arr) {
            if (ent_type === common_1.EEntType.PLINE) {
                set_plines.add(ent_i);
            }
            else if (ent_type === common_1.EEntType.PGON) {
                set_pgons.add(ent_i);
            }
            else {
                const plines = this.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
                for (const pline of plines) {
                    set_plines.add(pline);
                }
                const pgons = this.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
                for (const pgon of pgons) {
                    set_pgons.add(pgon);
                }
            }
        }
        if (set_plines.size > 0) {
            throw new Error('Join plines not implemented');
        }
        return this._joinPgons(Array.from(set_pgons)).map(pgon_i => [common_1.EEntType.PGON, pgon_i]);
    }
    // Return the posi pair, the key and the rev key for an edge
    _edgeKeys(edge_i) {
        const posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edge_i);
        if (posis_i.length !== 2) {
            return null;
        } // just one posi
        return [posis_i, posis_i[0] + '_' + posis_i[1], posis_i[1] + '_' + posis_i[0]];
    }
    // Join polylines
    _joinPlines(plines_i) {
        // pline edges TODO
        const pline_edges_i = [];
        for (const pline_i of plines_i) {
            const edges_i = this.modeldata.geom.nav.navAnyToEdge(common_1.EEntType.PLINE, pline_i);
            for (const edge_i of edges_i) {
                pline_edges_i.push(edge_i);
            }
        }
        //
        // TODO complete this function
        //
        return null;
    }
    // Join polygons
    _joinPgons(pgons_i) {
        // loop through all the pgons
        // for each polygon make various maps that we need later
        const map_pgon_edges = new Map();
        const map_edge_pgon = new Map();
        const edge_posis_map = new Map();
        const edge_posisrevkey_map = new Map();
        const posiskey_edge_map = new Map(); // TODO there could be more than one edge between 2 posis
        for (const pgon_i of pgons_i) {
            // we only take the first wire, so ignore holes
            const wire_i = this.modeldata.geom.nav.navPgonToWire(pgon_i)[0];
            const edges_i = this.modeldata.geom.nav.navWireToEdge(wire_i);
            const filt_edges_i = []; // we will ignore edges with just one posi
            map_pgon_edges.set(pgon_i, filt_edges_i);
            // loop through the edges of this polygon
            for (const edge_i of edges_i) {
                const keys = this._edgeKeys(edge_i);
                if (keys === null) {
                    continue;
                } // just one posi
                filt_edges_i.push(edge_i);
                edge_posis_map.set(edge_i, keys[0]);
                edge_posisrevkey_map.set(edge_i, keys[2]);
                map_edge_pgon.set(edge_i, pgon_i);
                posiskey_edge_map.set(keys[1], edge_i);
            }
        }
        // find dup pgon edges
        const grp_pgons_map = new Map();
        const pgon_grp_map = new Map();
        let grp_count = 0;
        for (const pgon_i of pgons_i) {
            let has_neighbour = false;
            for (const edge_i of map_pgon_edges.get(pgon_i)) {
                const revkey = edge_posisrevkey_map.get(edge_i);
                if (posiskey_edge_map.has(revkey)) {
                    // found a duplicate opposite edge
                    has_neighbour = true;
                    const other_edge_i = posiskey_edge_map.get(revkey);
                    // create or add to a groups of polygons
                    const this_pgon_i = map_edge_pgon.get(edge_i);
                    const other_pgon_i = map_edge_pgon.get(other_edge_i);
                    if (pgon_grp_map.has(this_pgon_i) && pgon_grp_map.has(other_pgon_i)) {
                        // console.log("1>>>",
                        //     Array.from(grp_pgons_map),
                        //     Array.from(pgon_grp_map)
                        // );
                        // we have two groups that are connected
                        // merge the two groups into one
                        const this_grp = pgon_grp_map.get(this_pgon_i);
                        const other_grp = pgon_grp_map.get(other_pgon_i);
                        if (this_grp !== other_grp) {
                            const this_grp_set = grp_pgons_map.get(this_grp);
                            const other_grp_set = grp_pgons_map.get(other_grp);
                            for (const other_grp_pgon_i of Array.from(other_grp_set)) {
                                this_grp_set.add(other_grp_pgon_i);
                                pgon_grp_map.set(other_grp_pgon_i, this_grp);
                            }
                            grp_pgons_map.delete(other_grp);
                        }
                    }
                    else if (pgon_grp_map.has(this_pgon_i)) {
                        // console.log("2>>>",
                        //     Array.from(grp_pgons_map),
                        //     Array.from(pgon_grp_map)
                        // );
                        // we have a group for this pgon already
                        // add other pgon to this group
                        const this_grp = pgon_grp_map.get(this_pgon_i);
                        grp_pgons_map.get(this_grp).add(other_pgon_i);
                        pgon_grp_map.set(other_pgon_i, this_grp);
                    }
                    else if (pgon_grp_map.has(other_pgon_i)) {
                        // console.log("3>>>",
                        //     Array.from(grp_pgons_map),
                        //     Array.from(pgon_grp_map)
                        // );
                        // we have a group for other pgon already
                        // add this pgon to other group
                        const other_grp = pgon_grp_map.get(other_pgon_i);
                        grp_pgons_map.get(other_grp).add(this_pgon_i);
                        pgon_grp_map.set(this_pgon_i, other_grp);
                    }
                    else {
                        // console.log("4>>>",
                        //     Array.from(grp_pgons_map),
                        //     Array.from(pgon_grp_map)
                        // );
                        // we have no groups, so create a new group
                        const grp = grp_count + 1;
                        grp_count = grp;
                        const grp_set = new Set();
                        grp_pgons_map.set(grp, grp_set);
                        // this
                        grp_set.add(this_pgon_i);
                        pgon_grp_map.set(this_pgon_i, grp);
                        // other
                        grp_set.add(other_pgon_i);
                        pgon_grp_map.set(other_pgon_i, grp);
                    }
                }
            }
            if (!has_neighbour) {
                // console.log("Pgon has no neighbour", pgon_i)
                // if a pgon has no neighbours then we treat its edges as a group
                // this will result in a duplicate of the pgon being generated
                const grp = grp_count + 1;
                grp_count = grp;
                grp_pgons_map.set(grp, new Set([pgon_i]));
            }
        }
        // console.log("grp_pgons_map = ", grp_pgons_map);
        // loop through the pgon groups
        const new_pgons_i = [];
        for (const grp_set of Array.from(grp_pgons_map.values())) {
            // create a map from start posi to the edge, skipping edges with dups
            // these are the edges that will be used in the loops
            const startposi_edge_map = new Map();
            for (const pgon_i of Array.from(grp_set)) { // grp_set.values()) { // TODO check this <<<<<<
                for (const edge_i of map_pgon_edges.get(pgon_i)) {
                    if (posiskey_edge_map.has(edge_posisrevkey_map.get(edge_i))) {
                        continue;
                    }
                    const posis_i = edge_posis_map.get(edge_i);
                    startposi_edge_map.set(posis_i[0], edge_i);
                }
            }
            // create loops for new pgons
            // when joining pgons, it can result in more that one new pgon
            // for example, consider a cylinder with optn top and bottom
            // when you join, you get two disks, one top and one bottom
            const num_edges = startposi_edge_map.size;
            if (num_edges === 0) {
                continue;
            }
            let next_edge_i = startposi_edge_map.values().next().value; // first edge
            const loops_edges_i = []; // list of lists of edges
            // now follow the edges, they should form one or more closed loops
            // at the same time as following the loops, also store the edge attribs for later
            loops_edges_i.push([]);
            let loop_start_posi = edge_posis_map.get(next_edge_i)[0];
            const used_edges_set = new Set();
            for (let i = 0; i < num_edges; i++) {
                // check that no error orccured
                if (used_edges_set.has(next_edge_i)) {
                    throw new Error('Join error: Edge already used.');
                }
                used_edges_set.add(next_edge_i);
                // add the edge to the last loop
                loops_edges_i[loops_edges_i.length - 1].push(next_edge_i);
                // check if we are at end of loop
                const edge_posis_i = edge_posis_map.get(next_edge_i);
                if (edge_posis_i[1] === loop_start_posi) {
                    // current loop is finished, so there must be another loop
                    loops_edges_i.push([]);
                    // get next edge that is not already being used
                    const edges_i = Array.from(startposi_edge_map.values());
                    for (const edge_i of edges_i) {
                        if (!used_edges_set.has(edge_i)) {
                            // we found an unused edge, set it as next edge
                            next_edge_i = edge_i;
                            // set the start of the new loop
                            loop_start_posi = edge_posis_map.get(next_edge_i)[0];
                            break;
                        }
                    }
                }
                else {
                    // the loop continues
                    // keep going, get the next edge
                    next_edge_i = startposi_edge_map.get(edge_posis_i[1]);
                }
            }
            // get an array of edge attribute objects
            const edge_attribs = this.modeldata.attribs.getAttribNames(common_1.EEntType.EDGE).map(name => this.modeldata.attribs.getAttrib(common_1.EEntType.EDGE, name));
            // now make the joined polygons and also add edge attributes
            for (const loop_edges_i of loops_edges_i) {
                if (loop_edges_i.length < 3) {
                    continue;
                }
                const posis_i = loop_edges_i.map(edge_i => edge_posis_map.get(edge_i)[0]);
                const new_pgon_i = this.modeldata.geom.add.addPgon(posis_i);
                new_pgons_i.push(new_pgon_i);
                // copy the edge attributes from the existing edge to the new edge
                if (edge_attribs.length) {
                    const new_edges_i = this.modeldata.geom.nav.navAnyToEdge(common_1.EEntType.PGON, new_pgon_i);
                    for (let i = 0; i < new_edges_i.length; i++) {
                        for (const edge_attrib of edge_attribs) {
                            const loop_edge_i = loop_edges_i[i];
                            const attrib_val = edge_attrib.getEntVal(loop_edge_i);
                            edge_attrib.setEntVal(new_edges_i[i], attrib_val);
                        }
                    }
                }
            }
        }
        return new_pgons_i;
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param plane
     * @param method
     */
    cut(ents_arr, plane, method) {
        // snapshot copy ents
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, false) as TEntTypeIdx[];
        // create the threejs entity and calc intersections
        const plane_normal = (0, vectors_1.vecCross)(plane[1], plane[2]);
        const plane_tjs = new THREE.Plane();
        plane_tjs.setFromNormalAndCoplanarPoint(new THREE.Vector3(...plane_normal), new THREE.Vector3(...plane[0]));
        // get polylines and polygons
        const set_plines = new Set();
        const set_pgons = new Set();
        const edges_i = []; // all edges
        for (const [ent_type, ent_i] of ents_arr) {
            if (ent_type === common_1.EEntType.PLINE) {
                set_plines.add(ent_i);
            }
            else if (ent_type === common_1.EEntType.PGON) {
                set_pgons.add(ent_i);
            }
            else {
                const plines = this.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
                for (const pline of plines) {
                    set_plines.add(pline);
                }
                const pgons = this.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
                for (const pgon of pgons) {
                    set_pgons.add(pgon);
                }
            }
            const ent_edges_i = this.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
            for (const ent_edge_i of ent_edges_i) {
                edges_i.push(ent_edge_i);
            }
        }
        const above = [];
        const below = [];
        // cut each edge and store the results
        // const [edge_to_isect_posis, cut_posi_to_copies, posi_to_tjs]: [number[][], number[], THREE.Vector3[]] =
        //     this._cutEdges(edges_i, plane_tjs, method);
        const [edge_to_isect_posis, cut_posi_to_copies, posi_to_tjs] = this._cutEdges(edges_i, plane_tjs, method);
        // create array to store new posis
        const posi_to_copies = [];
        // slice polylines
        for (const exist_pline_i of Array.from(set_plines)) {
            const sliced = this._cutCreateEnts(common_1.EEntType.PLINE, exist_pline_i, edge_to_isect_posis, posi_to_copies, cut_posi_to_copies, posi_to_tjs, method);
            for (const new_pline_i of sliced[0]) {
                above.push([common_1.EEntType.PLINE, new_pline_i]);
            }
            for (const new_pline_i of sliced[1]) {
                below.push([common_1.EEntType.PLINE, new_pline_i]);
            }
        }
        // slice polygons
        for (const exist_pgon_i of Array.from(set_pgons)) {
            // TODO slice polygons with holes
            const sliced = this._cutCreateEnts(common_1.EEntType.PGON, exist_pgon_i, edge_to_isect_posis, posi_to_copies, cut_posi_to_copies, posi_to_tjs, method);
            for (const new_pgon_i of sliced[0]) {
                above.push([common_1.EEntType.PGON, new_pgon_i]);
            }
            for (const new_pgon_i of sliced[1]) {
                below.push([common_1.EEntType.PGON, new_pgon_i]);
            }
        }
        // return
        return [above, below];
    }
    // -------------------
    // cut each edge in the input geometry (can be edges from different objects)
    // store the intersection posi in a sparse array
    // the array is nested, the two indexes [i1][i2] is the two posi ends of the edge, the value is the isect posi
    // also returns some other data
    // if method is "both", then we need copies of the isect posis, so these are also generated
    // finally, the tjs points that are created are also returned, they are used later for checking "starts_above"
    _cutEdges(edges_i, plane_tjs, method) {
        // create sparse arrays for storing data
        const smap_posi_to_tjs = []; // sparse array
        const smap_edge_to_isect_posis = []; // sparse array, map_posis[2][3] is the edge from posi 2 to posi 3 (and 3 to 2)
        const smap_cut_posi_to_copies = []; // sparse array
        // loop through each edge
        for (const edge_i of edges_i) {
            // console.log("=============== Edge = ", edge_i);
            const edge_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edge_i);
            if (edge_posis_i.length !== 2) {
                continue;
            }
            const sorted_edge_posis_i = Array.from(edge_posis_i);
            sorted_edge_posis_i.sort();
            // get the edge isect point
            if (smap_edge_to_isect_posis[sorted_edge_posis_i[0]] === undefined) {
                smap_edge_to_isect_posis[sorted_edge_posis_i[0]] = [];
            }
            const posi_i = smap_edge_to_isect_posis[sorted_edge_posis_i[0]][sorted_edge_posis_i[1]];
            if (posi_i === undefined) {
                // cut the intersection, create a new posi or null
                const new_posi_i = this._cutCreatePosi(edge_i, edge_posis_i, plane_tjs, smap_posi_to_tjs);
                // store the posi or null in the sparse array
                smap_edge_to_isect_posis[sorted_edge_posis_i[0]][sorted_edge_posis_i[1]] = new_posi_i;
                if (new_posi_i !== null) {
                    // if keep both sides, make a copy of the posi
                    if (method === _ECutMethod.KEEP_BOTH) {
                        const copy_posi_i = this.modeldata.geom.add.copyPosis(new_posi_i, true);
                        smap_cut_posi_to_copies[new_posi_i] = copy_posi_i;
                    }
                }
            }
        }
        return [smap_edge_to_isect_posis, smap_cut_posi_to_copies, smap_posi_to_tjs];
    }
    // create the new posi
    _cutCreatePosi(edge_i, edge_posis_i, plane_tjs, smap_posi_to_tjs) {
        // get the tjs posis and distances for the start and end posis of this edge
        // start posi
        const [posi0_tjs, d0] = this._cutGetTjsDistToPlane(edge_posis_i[0], plane_tjs, smap_posi_to_tjs);
        // end posi
        const [posi1_tjs, d1] = this._cutGetTjsDistToPlane(edge_posis_i[1], plane_tjs, smap_posi_to_tjs);
        // console.log("Cutting edge: edge_i, d0, d1", edge_i, d0, d1)
        // if both posis are on the same side of the plane, then no intersection, so return null
        if ((d0 > 0) && (d1 > 0)) {
            // console.log('Cutting edge: edge vertices are above the plane, so no isect')
            return null;
        }
        if ((d0 < 0) && (d1 < 0)) {
            // console.log('Cutting edge: edge vertices are both below the plane, so no isect')
            return null;
        }
        // check if this is a zero length edge
        // console.log("length of edge = ", posi0_tjs.distanceTo(posi1_tjs))
        if (posi0_tjs.distanceTo(posi1_tjs) === 0) {
            // console.log('Cutting edge: edge is zero length, so no isect')
            return null;
        }
        // if either position is very close to the plane, check of V intersection
        // a V intersection is where the plane touches a vertex where two edges meet in a V shape
        // and where both edges are on the same side of the plane
        if ((Math.abs(d0) === 0) && this._cutStartVertexIsV(edge_i, plane_tjs, d1, smap_posi_to_tjs)) {
            // console.log('Cutting edge: first vertex is V, so no isect');
            return null;
        }
        if ((Math.abs(d1) === 0) && this._cutEndVertexIsV(edge_i, plane_tjs, d0, smap_posi_to_tjs)) {
            // console.log('Cutting edge: second vertex is V, so no isect');
            return null;
        }
        // check if cutting exactly through the end vertext
        // in that case, the intersection is the end vertex
        // this is true even is teh edge is coplanar
        if (d1 === 0) {
            // console.log('Cutting edge: second vertex is on plane, so return second posi')
            const copy_posi_i = this.modeldata.geom.add.addPosi();
            this.modeldata.attribs.posis.setPosiCoords(copy_posi_i, [posi1_tjs.x, posi1_tjs.y, posi1_tjs.z]);
            return copy_posi_i;
            // return this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i)[1];
        }
        // check if cutting exactly through the start vertext
        // in that case we ignore it since we assume the cut has already been created by the end vertext of the previous edge
        // this also include the case where the edge is coplanar
        if (d0 === 0) {
            // console.log('Cutting edge: first vertex is on plane, so no isect')
            return null;
        }
        // calculate intersection
        const line_tjs = new THREE.Line3(posi0_tjs, posi1_tjs);
        const isect_tjs = new THREE.Vector3();
        // https://threejs.org/docs/#api/en/math/Plane
        // Returns the intersection point of the passed line and the plane.
        // Returns undefined if the line does not intersect.
        // Returns the line's starting point if the line is coplanar with the plane.
        const result = plane_tjs.intersectLine(line_tjs, isect_tjs);
        if (result === undefined || result === null) {
            // console.log('Cutting edge: no isect was found with edge...');
            return null;
        }
        // create the new posi at the point of intersection
        // console.log("Cutting edge: New isect_tjs", isect_tjs)
        const new_posi_i = this.modeldata.geom.add.addPosi();
        this.modeldata.attribs.posis.setPosiCoords(new_posi_i, [isect_tjs.x, isect_tjs.y, isect_tjs.z]);
        // store the posi in the sparse array
        return new_posi_i;
    }
    // check V at start vertex
    _cutStartVertexIsV(edge_i, plane_tjs, d1, smap_posi_to_tjs) {
        // ---
        // isect is at start of line
        const prev_edge_i = this.modeldata.geom.query.getPrevEdge(edge_i);
        // if there is no prev edge, then this is open pline, so it is single edge V
        if (prev_edge_i === null) {
            return true;
        }
        // check other edge
        const prev_edge_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, prev_edge_i);
        const [_, prev_d] = this._cutGetTjsDistToPlane(prev_edge_posis_i[0], plane_tjs, smap_posi_to_tjs);
        // are both points on same side of plane? must be V
        if ((prev_d > 0) && (d1 > 0)) {
            return true;
        }
        if ((prev_d < 0) && (d1 < 0)) {
            return true;
        }
        // this is not a V, so return false
        return false;
    }
    // check V at end vertex
    _cutEndVertexIsV(edge_i, plane_tjs, d0, smap_posi_to_tjs) {
        // ---
        // isect is at end of line
        const next_edge_i = this.modeldata.geom.query.getNextEdge(edge_i);
        // if there is no next edge, then this is open pline, so it is single edge V
        if (next_edge_i === null) {
            return true;
        }
        // check other edge
        const next_edge_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, next_edge_i);
        const [_, next_d] = this._cutGetTjsDistToPlane(next_edge_posis_i[1], plane_tjs, smap_posi_to_tjs);
        // are both points on same side of plane? must be V
        if ((d0 > 0) && (next_d > 0)) {
            return true;
        }
        if ((d0 < 0) && (next_d < 0)) {
            return true;
        }
        // this is not a V, so return false
        return false;
    }
    // given an exist posis and a tjs plane
    // create a tjs posi and
    // calc the distance to the tjs plane
    // creates a map from exist posi to tjs posi(sparse array)
    // and creates a map from exist posi to dist (sparse array)
    _cutGetTjsDistToPlane(posi_i, plane_tjs, map_posi_to_tjs) {
        // check if we have already calculated this one
        if (map_posi_to_tjs[posi_i] !== undefined) {
            return map_posi_to_tjs[posi_i];
        }
        // create tjs posi
        const xyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
        const posi_tjs = new THREE.Vector3(...xyz);
        // calc distance to tjs plane
        const dist = plane_tjs.distanceToPoint(posi_tjs);
        // save the data
        map_posi_to_tjs[posi_i] = [posi_tjs, dist];
        // return the new tjs posi and the distance to the plane
        return [posi_tjs, dist];
    }
    // given an exist posis, returns a new posi
    // if necessary, a new posi point be created
    // creates a map from exist posi to new posi (sparse array)
    _cutGetPosi(posi_i, map_posi_to_copies) {
        if (map_posi_to_copies[posi_i] !== undefined) {
            return map_posi_to_copies[posi_i];
        }
        const new_posi_i = this.modeldata.geom.add.copyPosis(posi_i, true);
        map_posi_to_copies[posi_i] = new_posi_i;
        return new_posi_i;
    }
    // given a list of exist posis, returns a list of new posi
    // if necessary, new posi will be created
    _cutGetPosis(posis_i, posi_to_copies) {
        return posis_i.map(posi_i => this._cutGetPosi(posi_i, posi_to_copies));
    }
    // makes a copy of an existing ent
    // all posis in the exist ent will be replaced by new posis
    _cutCopyEnt(ent_type, ent_i, exist_posis_i, posi_to_copies) {
        const new_posis_i = this._cutGetPosis(exist_posis_i, posi_to_copies);
        switch (ent_type) {
            case common_1.EEntType.PLINE:
                const new_pline_i = this.modeldata.geom.add.copyPlines(ent_i, true);
                this.modeldata.geom.edit_topo.replacePosis(ent_type, new_pline_i, new_posis_i);
                return new_pline_i;
            case common_1.EEntType.PGON:
                const new_pgon_i = this.modeldata.geom.add.copyPgons(ent_i, true);
                this.modeldata.geom.edit_topo.replacePosis(ent_type, new_pgon_i, new_posis_i);
                return new_pgon_i;
            default:
                break;
        }
    }
    // creates new ents
    // if the ent is not cut by the plane, the ent will be copies (with new posis)
    // if the ent is cut, a new ent will be created
    _cutCreateEnts(ent_type, ent_i, edge_to_isect_posis, posi_to_copies, cut_posi_to_copies, posi_to_tjs, method) {
        // get wire and posis
        const wire_i = this.modeldata.geom.nav.navAnyToWire(ent_type, ent_i)[0];
        const wire_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.WIRE, wire_i);
        const wire_posis_ex_i = wire_posis_i.slice();
        const is_closed = this.modeldata.geom.query.isWireClosed(wire_i);
        if (is_closed) {
            wire_posis_ex_i.push(wire_posis_ex_i[0]);
        }
        const num_posis = wire_posis_ex_i.length;
        // create lists to store posis
        const slice_posis_i = [[], []];
        // analyze the first point
        const dist = posi_to_tjs[wire_posis_ex_i[0]][1];
        const start_above = dist > 0; // is the first point above the plane?
        const first = start_above ? 0 : 1; // the first list to start adding posis
        const second = 1 - first; // the second list to add posis, after you cross the plane
        let index = first;
        // for each pair of posis, get the posi_i intersection or null
        slice_posis_i[index].push([]);
        let num_cuts = 0;
        for (let i = 0; i < num_posis - 1; i++) {
            const edge_posis_i = [wire_posis_ex_i[i], wire_posis_ex_i[i + 1]];
            // find isect or null
            edge_posis_i.sort();
            const isect_posi_i = edge_to_isect_posis[edge_posis_i[0]][edge_posis_i[1]];
            slice_posis_i[index][slice_posis_i[index].length - 1].push(wire_posis_ex_i[i]);
            if (isect_posi_i !== null) {
                num_cuts += 1;
                // add posi before cut
                if (method === _ECutMethod.KEEP_BOTH && index === 0) {
                    const isect_posi2_i = cut_posi_to_copies[isect_posi_i];
                    slice_posis_i[index][slice_posis_i[index].length - 1].push(isect_posi2_i);
                    posi_to_copies[isect_posi2_i] = isect_posi2_i;
                }
                else {
                    slice_posis_i[index][slice_posis_i[index].length - 1].push(isect_posi_i);
                    posi_to_copies[isect_posi_i] = isect_posi_i;
                }
                // switch
                index = 1 - index;
                slice_posis_i[index].push([]);
                // add posi after cut
                if (method === _ECutMethod.KEEP_BOTH && index === 0) {
                    const isect_posi2_i = cut_posi_to_copies[isect_posi_i];
                    slice_posis_i[index][slice_posis_i[index].length - 1].push(isect_posi2_i);
                    posi_to_copies[isect_posi2_i] = isect_posi2_i;
                }
                else {
                    slice_posis_i[index][slice_posis_i[index].length - 1].push(isect_posi_i);
                    posi_to_copies[isect_posi_i] = isect_posi_i;
                }
            }
        }
        if (ent_type === common_1.EEntType.PGON && num_cuts % 2 !== 0) {
            throw new Error('Internal error cutting polygon: number of cuts in uneven');
        }
        // deal with cases where the entity was not cut
        // make a copy of the ent, with new posis
        if (slice_posis_i[second].length === 0) {
            if (start_above && (method === _ECutMethod.KEEP_BOTH || method === _ECutMethod.KEEP_ABOVE)) {
                return [[this._cutCopyEnt(ent_type, ent_i, wire_posis_i, posi_to_copies)], []];
            }
            else if (!start_above && (method === _ECutMethod.KEEP_BOTH || method === _ECutMethod.KEEP_BELOW)) {
                return [[], [this._cutCopyEnt(ent_type, ent_i, wire_posis_i, posi_to_copies)]];
            }
            return [[], []];
        }
        // update the lists, to deal with the end cases
        if (ent_type === common_1.EEntType.PGON) {
            // add the last list of posis to the the first list of posis
            for (const slice_posi_i of slice_posis_i[index][slice_posis_i[index].length - 1]) {
                slice_posis_i[index][0].push(slice_posi_i);
            }
            slice_posis_i[index] = slice_posis_i[index].slice(0, -1);
        }
        else {
            // add the last posi to the last list
            slice_posis_i[index][slice_posis_i[index].length - 1].push(wire_posis_ex_i[num_posis - 1]);
        }
        // make the cut entities
        const above = [];
        const below = [];
        switch (method) {
            case _ECutMethod.KEEP_BOTH:
            case _ECutMethod.KEEP_ABOVE:
                for (const posis_i of slice_posis_i[0]) {
                    const new_ent_i = this._cutCreateEnt(ent_type, posis_i, posi_to_copies);
                    if (new_ent_i !== null) {
                        above.push(new_ent_i);
                    }
                    // const filt_posis_i: number[] = this._cutFilterShortEdges(posis_i, posi_to_tjs);
                    // if (ent_type === EEntType.PLINE) {
                    //     const copy_posis_i: number[] = this._cutGetPosis(filt_posis_i, posi_to_copies);
                    //     above.push( this.modeldata.geom.add.addPline(copy_posis_i, false));
                    // } else {
                    //     const copy_posis_i: number[] = this._cutGetPosis(filt_posis_i, posi_to_copies);
                    //     above.push( this.modeldata.geom.add.addPgon(copy_posis_i));
                    // }
                }
                break;
            default:
                break;
        }
        switch (method) {
            case _ECutMethod.KEEP_BOTH:
            case _ECutMethod.KEEP_BELOW:
                for (const posis_i of slice_posis_i[1]) {
                    const new_ent_i = this._cutCreateEnt(ent_type, posis_i, posi_to_copies);
                    if (new_ent_i !== null) {
                        below.push(new_ent_i);
                    }
                    // const filt_posis_i: number[] = this._cutFilterShortEdges(posis_i, posi_to_tjs);
                    // if (ent_type === EEntType.PLINE) {
                    //     const copy_posis_i: number[] = this._cutGetPosis(filt_posis_i, posi_to_copies);
                    //     below.push( this.modeldata.geom.add.addPline(copy_posis_i, false));
                    // } else {
                    //     const copy_posis_i: number[] = this._cutGetPosis(filt_posis_i, posi_to_copies);
                    //     below.push( this.modeldata.geom.add.addPgon(copy_posis_i));
                    // }
                }
                break;
            default:
                break;
        }
        return [above, below];
    }
    // filter very short edges
    _cutFilterShortEdges(posis_i) {
        const new_posis_i = [posis_i[0]];
        let xyz0 = this.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
        for (let i = 1; i < posis_i.length; i++) {
            const xyz1 = this.modeldata.attribs.posis.getPosiCoords(posis_i[i]);
            if ((0, distance_1.distance)(xyz0, xyz1) > 1e-6) {
                new_posis_i.push(posis_i[i]);
            }
            xyz0 = xyz1;
        }
        return new_posis_i;
    }
    // creates new ents
    _cutCreateEnt(ent_type, posis_i, posi_to_copies) {
        // filter shrt edges
        const filt_posis_i = this._cutFilterShortEdges(posis_i);
        if (ent_type === common_1.EEntType.PLINE) {
            // create polyline
            if (filt_posis_i.length < 2) {
                return null;
            }
            const copy_posis_i = this._cutGetPosis(filt_posis_i, posi_to_copies);
            return this.modeldata.geom.add.addPline(copy_posis_i, false);
        }
        else {
            // create polygon
            if (filt_posis_i.length < 3) {
                return null;
            }
            const copy_posis_i = this._cutGetPosis(filt_posis_i, posi_to_copies);
            return this.modeldata.geom.add.addPgon(copy_posis_i);
        }
    }
}
exports.GIFuncsMake = GIFuncsMake;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lGdW5jc01ha2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWJzL2dlby1pbmZvL2Z1bmNzL0dJRnVuY3NNYWtlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBNEI7QUFDNUIsNkNBQStCO0FBRS9CLGtEQUErQztBQUMvQyw4Q0FBd0U7QUFDeEUsZ0RBQWtGO0FBQ2xGLDBDQUE4QztBQUU5QyxzQ0FBZ0c7QUFDaEcsd0RBQWdFO0FBR2hFLFFBQVE7QUFDUixJQUFZLE9BR1g7QUFIRCxXQUFZLE9BQU87SUFDZix3QkFBYSxDQUFBO0lBQ2IsMEJBQWUsQ0FBQTtBQUNuQixDQUFDLEVBSFcsT0FBTyxHQUFQLGVBQU8sS0FBUCxlQUFPLFFBR2xCO0FBQ0QsSUFBWSxZQVFYO0FBUkQsV0FBWSxZQUFZO0lBQ3BCLHlDQUEwQixDQUFBO0lBQzFCLDZDQUErQixDQUFBO0lBQy9CLGlEQUFrQyxDQUFBO0lBQ2xDLHFEQUF1QyxDQUFBO0lBQ3ZDLHVDQUF1QixDQUFBO0lBQ3ZCLDJDQUEyQixDQUFBO0lBQzNCLGlDQUFpQixDQUFBO0FBQ3JCLENBQUMsRUFSVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQVF2QjtBQUNELElBQVksZUFLWDtBQUxELFdBQVksZUFBZTtJQUN2QixrQ0FBZ0IsQ0FBQTtJQUNoQiwwQ0FBdUIsQ0FBQTtJQUN2QixnQ0FBYSxDQUFBO0lBQ2Isb0NBQWlCLENBQUE7QUFDckIsQ0FBQyxFQUxXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBSzFCO0FBQ0QsSUFBWSxXQUlYO0FBSkQsV0FBWSxXQUFXO0lBQ25CLHdDQUEwQixDQUFBO0lBQzFCLHdDQUF5QixDQUFBO0lBQ3pCLHNDQUF1QixDQUFBO0FBQzNCLENBQUMsRUFKVyxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQUl0QjtBQUVEOztHQUVHO0FBQ0gsTUFBYSxXQUFXO0lB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