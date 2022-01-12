import { multMatrix, xfromSourceTargetMatrix } from '../../geom/matrix';
import { vecAdd, vecCross, vecDiv, vecFromTo, vecMult } from '../../geom/vectors';
import { EEntType, EAttribNames } from '../common';
import * as THREE from 'three';
import { getEntIdxs, isDim0, isDim2 } from '../common_id_funcs';
import { getArrDepth } from '../../util/arrs';
import { distance } from '../../geom/distance';
import lodash from 'lodash';
// Enums
export var _EClose;
(function (_EClose) {
    _EClose["OPEN"] = "open";
    _EClose["CLOSE"] = "close";
})(_EClose || (_EClose = {}));
export var _ELoftMethod;
(function (_ELoftMethod) {
    _ELoftMethod["OPEN_QUADS"] = "open_quads";
    _ELoftMethod["CLOSED_QUADS"] = "closed_quads";
    _ELoftMethod["OPEN_STRINGERS"] = "open_stringers";
    _ELoftMethod["CLOSED_STRINGERS"] = "closed_stringers";
    _ELoftMethod["OPEN_RIBS"] = "open_ribs";
    _ELoftMethod["CLOSED_RIBS"] = "closed_ribs";
    _ELoftMethod["COPIES"] = "copies";
})(_ELoftMethod || (_ELoftMethod = {}));
export var _EExtrudeMethod;
(function (_EExtrudeMethod) {
    _EExtrudeMethod["QUADS"] = "quads";
    _EExtrudeMethod["STRINGERS"] = "stringers";
    _EExtrudeMethod["RIBS"] = "ribs";
    _EExtrudeMethod["COPIES"] = "copies";
})(_EExtrudeMethod || (_EExtrudeMethod = {}));
export var _ECutMethod;
(function (_ECutMethod) {
    _ECutMethod["KEEP_ABOVE"] = "keep_above";
    _ECutMethod["KEEP_BELOW"] = "keep_below";
    _ECutMethod["KEEP_BOTH"] = "keep_both";
})(_ECutMethod || (_ECutMethod = {}));
/**
 * Class for editing geometry.
 */
export class GIFuncsMake {
    // ================================================================================================
    modeldata;
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
        const depth = getArrDepth(coords);
        if (depth === 1) {
            const coord1 = coords;
            const posi_i = this.modeldata.geom.add.addPosi();
            this.modeldata.attribs.set.setEntAttribVal(EEntType.POSI, posi_i, EAttribNames.COORDS, coord1);
            return [EEntType.POSI, posi_i];
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
        const depth = getArrDepth(ents_arr);
        if (depth === 1) {
            const [ent_type, index] = ents_arr; // either a posi or something else
            if (ent_type === EEntType.POSI) {
                const point_i = this.modeldata.geom.add.addPoint(index);
                return [EEntType.POINT, point_i];
            }
            else {
                const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                return posis_i.map(posi_i => this.point([EEntType.POSI, posi_i]));
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
        const depth = getArrDepth(posis_arr);
        if (depth === 2) {
            if (posis_arr.length < 2) {
                throw new Error('Error in make.Polyline: Polylines must have at least two positions.');
            }
            const bool_close = (close === _EClose.CLOSE);
            const posis_i = getEntIdxs(posis_arr);
            const pline_i = this.modeldata.geom.add.addPline(posis_i, bool_close);
            return [EEntType.PLINE, pline_i];
        }
        else {
            posis_arr = posis_arr;
            return posis_arr.map(ents_arr_item => this._polyline(ents_arr_item, close));
        }
    }
    _getPlinePosisFromEnts(ents_arr) {
        // check if this is a single object ID
        if (getArrDepth(ents_arr) === 1) {
            ents_arr = [ents_arr];
        }
        // check if this is a list of posis, verts, or points
        if (getArrDepth(ents_arr) === 2 && isDim0(ents_arr[0][0])) {
            const ents_arr2 = [];
            for (const ent_arr of ents_arr) {
                const [ent_type, index] = ent_arr;
                if (ent_type === EEntType.POSI) {
                    ents_arr2.push(ent_arr);
                }
                else {
                    const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                    for (const posi_i of posis_i) {
                        ents_arr2.push([EEntType.POSI, posi_i]);
                    }
                }
            }
            ents_arr = [ents_arr2];
        }
        // now process the ents
        const posis_arrs = [];
        for (const ent_arr of ents_arr) {
            if (getArrDepth(ent_arr) === 2) { // this must be a list of posis
                posis_arrs.push(ent_arr);
                continue;
            }
            const [ent_type, index] = ent_arr;
            switch (ent_type) {
                case EEntType.EDGE:
                case EEntType.WIRE:
                case EEntType.PLINE:
                    const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                    const posis_arr = posis_i.map(posi_i => [EEntType.POSI, posi_i]);
                    posis_arrs.push(posis_arr);
                    break;
                case EEntType.PGON:
                    const wires_i = this.modeldata.geom.nav.navAnyToWire(ent_type, index);
                    for (let j = 0; j < wires_i.length; j++) {
                        const wire_i = wires_i[j];
                        const wire_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
                        const wire_posis_arr = wire_posis_i.map(posi_i => [EEntType.POSI, posi_i]);
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
        const depth = getArrDepth(posis_arr);
        if (depth === 2) {
            if (posis_arr.length < 3) {
                throw new Error('Error in make.Polygon: Polygons must have at least three positions.');
            }
            const posis_i = getEntIdxs(posis_arr);
            const pgon_i = this.modeldata.geom.add.addPgon(posis_i);
            return [EEntType.PGON, pgon_i];
        }
        else {
            posis_arr = posis_arr;
            return posis_arr.map(ents_arr_item => this._polygon(ents_arr_item));
        }
    }
    _getPgonPosisFromEnts(ents_arr) {
        // check if this is a single object ID
        if (getArrDepth(ents_arr) === 1) {
            ents_arr = [ents_arr];
        }
        // check if this is a list of posis
        if (getArrDepth(ents_arr) === 2 && ents_arr[0][0] === EEntType.POSI) {
            // ents_arr =  [ents_arr] as TEntTypeIdx[][];
            const ents_arr2 = [];
            for (const ent_arr of ents_arr) {
                const [ent_type, index] = ent_arr;
                if (ent_type === EEntType.POSI) {
                    ents_arr2.push(ent_arr);
                }
                else {
                    const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                    for (const posi_i of posis_i) {
                        ents_arr2.push([EEntType.POSI, posi_i]);
                    }
                }
            }
            ents_arr = [ents_arr2];
        }
        // now process the ents
        const posis_arrs = [];
        for (const ent_arr of ents_arr) {
            if (getArrDepth(ent_arr) === 2) { // this must be a list of posis
                posis_arrs.push(ent_arr);
                continue;
            }
            const [ent_type, index] = ent_arr;
            switch (ent_type) {
                case EEntType.WIRE:
                case EEntType.PLINE:
                    const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                    const posis_arr = posis_i.map(posi_i => [EEntType.POSI, posi_i]);
                    posis_arrs.push(posis_arr);
                    break;
                case EEntType.PGON:
                    const wires_i = this.modeldata.geom.nav.navAnyToWire(ent_type, index);
                    for (let j = 0; j < wires_i.length; j++) {
                        const wire_i = wires_i[j];
                        const wire_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
                        const wire_posis_arr = wire_posis_i.map(posi_i => [EEntType.POSI, posi_i]);
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
        const depth = getArrDepth(ents_arr);
        if (depth === 2) {
            const posis_i = getEntIdxs(ents_arr);
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
        const depth = getArrDepth(ents_arrs);
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
                    const exist_posis_a_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i_a);
                    const exist_posis_b_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i_b);
                    // create the new posis strip if necessary
                    for (const k of [0, 1]) {
                        if (strip_posis_map.get(exist_posis_a_i[k]) === undefined) {
                            const xyz_a = this.modeldata.attribs.posis.getPosiCoords(exist_posis_a_i[k]);
                            const xyz_b = this.modeldata.attribs.posis.getPosiCoords(exist_posis_b_i[k]);
                            const extrude_vec_div = vecDiv(vecFromTo(xyz_a, xyz_b), divisions);
                            const strip_posis_i = [exist_posis_a_i[k]];
                            for (let d = 1; d < divisions; d++) {
                                const strip_posi_i = this.modeldata.geom.add.addPosi();
                                const move_xyz = vecMult(extrude_vec_div, d);
                                this.modeldata.attribs.posis.setPosiCoords(strip_posi_i, vecAdd(xyz_a, move_xyz));
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
                    const posis_i_a = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edges_i_a[j]);
                    const posis_i_b = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edges_i_b[j]);
                    const pgon_i = this.modeldata.geom.add.addPgon([posis_i_a[0], posis_i_a[1], posis_i_b[1], posis_i_b[0]]);
                    new_pgons_i.push(pgon_i);
                }
            }
        }
        return new_pgons_i.map(pgon_i => [EEntType.PGON, pgon_i]);
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
                    const vec = vecDiv(vecFromTo(xyz1, xyz2), divisions);
                    for (let k = 1; k < divisions; k++) {
                        const new_xyz = vecAdd(xyz1, vecMult(vec, k));
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
        return stringer_plines_i.map(pline_i => [EEntType.PLINE, pline_i]);
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
            case EEntType.PGON:
                ribs_is_closed = true;
                break;
            case EEntType.PLINE:
                const wire_i = this.modeldata.geom.nav.navPlineToWire(ents_arr[0][1]);
                ribs_is_closed = this.modeldata.geom.query.isWireClosed(wire_i);
                break;
            case EEntType.WIRE:
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
                    const vec = vecDiv(vecFromTo(xyzs1[k], xyzs2[k]), divisions);
                    vecs.push(vec);
                }
                for (let j = 1; j < divisions; j++) {
                    const rib_posis_i = [];
                    for (let k = 0; k < num_posis; k++) {
                        const new_xyz = vecAdd(xyzs1[k], vecMult(vecs[k], j));
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
        return rib_plines_i.map(pline_i => [EEntType.PLINE, pline_i]);
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
                    const vec = vecDiv(vecFromTo(xyzs1[k], xyzs2[k]), divisions);
                    vecs.push(vec);
                }
                for (let j = 1; j < divisions; j++) {
                    const lofted_ent_arr = this.modeldata.funcs_common.copyGeom(ents_arr[i], true);
                    this.modeldata.funcs_common.clonePosisInEnts(lofted_ent_arr, true);
                    const [lofted_ent_type, lofted_ent_i] = lofted_ent_arr;
                    const new_posis_i = this.modeldata.geom.nav.navAnyToPosi(lofted_ent_type, lofted_ent_i);
                    for (let k = 0; k < num_posis; k++) {
                        const new_xyz = vecAdd(xyzs1[k], vecMult(vecs[k], j));
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
        if (getArrDepth(ents_arr) === 1) {
            const [ent_type, index] = ents_arr;
            // check if this is a collection, call this function again
            if (ent_type === EEntType.COLL) {
                return this._extrudeColl(index, extrude_vec, divisions, method);
            }
            // check if this is a position, a vertex, or a point -> pline
            if (isDim0(ent_type)) {
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
        const ents_arr = (getArrDepth(ents) === 1 ? [ents] : ents);
        const extrude_vec = (Array.isArray(dist) ? dist : [0, 0, dist]);
        const extrude_vec_div = vecDiv(extrude_vec, divisions);
        const copies = [];
        // make the copies
        for (let i = 0; i < divisions + 1; i++) {
            // copy the list of entities
            const copied_ents_arr = this.modeldata.funcs_common.copyGeom(ents_arr, true);
            // copy the positions that belong to the list of entities
            this.modeldata.funcs_common.clonePosisInEntsAndMove(copied_ents_arr, true, vecMult(extrude_vec_div, i));
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
        const res1 = points_i.map(point_i => this._extrudeEdges([EEntType.POINT, point_i], extrude_vec, divisions, method));
        const plines_i = this.modeldata.geom.nav.navCollToPline(index);
        const res2 = plines_i.map(pline_i => this._extrudeEdges([EEntType.PLINE, pline_i], extrude_vec, divisions, method));
        const pgons_i = this.modeldata.geom.nav.navCollToPgon(index);
        const res3 = pgons_i.map(pgon_i => this._extrudeEdges([EEntType.PGON, pgon_i], extrude_vec, divisions, method));
        return [].concat(res1, res2, res3);
    }
    _extrudeDim0(ent_type, index, extrude_vec, divisions) {
        const extrude_vec_div = vecDiv(extrude_vec, divisions);
        const exist_posi_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index)[0];
        const xyz = this.modeldata.attribs.posis.getPosiCoords(exist_posi_i);
        const strip_posis_i = [exist_posi_i];
        for (let i = 1; i < divisions + 1; i++) {
            const strip_posi_i = this.modeldata.geom.add.addPosi();
            const move_xyz = vecMult(extrude_vec_div, i);
            this.modeldata.attribs.posis.setPosiCoords(strip_posi_i, vecAdd(xyz, move_xyz));
            strip_posis_i.push(strip_posi_i);
        }
        // loft between the positions and create a single polyline
        const pline_i = this.modeldata.geom.add.addPline(strip_posis_i);
        return [[EEntType.PLINE, pline_i]];
    }
    _extrudeQuads(ent_type, index, extrude_vec, divisions) {
        const new_pgons_i = [];
        const extrude_vec_div = vecDiv(extrude_vec, divisions);
        const edges_i = this.modeldata.geom.nav.navAnyToEdge(ent_type, index);
        const strip_posis_map = new Map();
        for (const edge_i of edges_i) {
            // get exist posis_i
            const exist_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            // create the new posis strip if necessary
            for (const exist_posi_i of exist_posis_i) {
                if (strip_posis_map.get(exist_posi_i) === undefined) {
                    const xyz = this.modeldata.attribs.posis.getPosiCoords(exist_posi_i);
                    const strip_posis_i = [exist_posi_i];
                    for (let i = 1; i < divisions + 1; i++) {
                        const strip_posi_i = this.modeldata.geom.add.addPosi();
                        const move_xyz = vecMult(extrude_vec_div, i);
                        this.modeldata.attribs.posis.setPosiCoords(strip_posi_i, vecAdd(xyz, move_xyz));
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
        if (isDim2(ent_type)) { // create a top -> polygon
            const cap_pgon_i = this._extrudeCap(index, strip_posis_map, divisions);
            new_pgons_i.push(cap_pgon_i);
        }
        return new_pgons_i.map(pgon_i => [EEntType.PGON, pgon_i]);
    }
    _extrudeStringers(ent_type, index, extrude_vec, divisions) {
        const new_plines_i = [];
        const extrude_vec_div = vecDiv(extrude_vec, divisions);
        const edges_i = this.modeldata.geom.nav.navAnyToEdge(ent_type, index);
        const strip_posis_map = new Map();
        for (const edge_i of edges_i) {
            // get exist posis_i
            const exist_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            // create the new posis strip if necessary
            for (const exist_posi_i of exist_posis_i) {
                if (strip_posis_map.get(exist_posi_i) === undefined) {
                    const xyz = this.modeldata.attribs.posis.getPosiCoords(exist_posi_i);
                    const strip_posis_i = [exist_posi_i];
                    for (let i = 1; i < divisions + 1; i++) {
                        const strip_posi_i = this.modeldata.geom.add.addPosi();
                        const move_xyz = vecMult(extrude_vec_div, i);
                        this.modeldata.attribs.posis.setPosiCoords(strip_posi_i, vecAdd(xyz, move_xyz));
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
        return new_plines_i.map(pline_i => [EEntType.PLINE, pline_i]);
    }
    _extrudeRibs(ent_type, index, extrude_vec, divisions) {
        const new_plines_i = [];
        const extrude_vec_div = vecDiv(extrude_vec, divisions);
        const edges_i = this.modeldata.geom.nav.navAnyToEdge(ent_type, index);
        const strip_posis_map = new Map();
        for (const edge_i of edges_i) {
            // get exist posis_i
            const exist_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            // create the new posis strip if necessary
            for (const exist_posi_i of exist_posis_i) {
                if (strip_posis_map.get(exist_posi_i) === undefined) {
                    const xyz = this.modeldata.attribs.posis.getPosiCoords(exist_posi_i);
                    const strip_posis_i = [exist_posi_i];
                    for (let i = 1; i < divisions + 1; i++) {
                        const strip_posi_i = this.modeldata.geom.add.addPosi();
                        const move_xyz = vecMult(extrude_vec_div, i);
                        this.modeldata.attribs.posis.setPosiCoords(strip_posi_i, vecAdd(xyz, move_xyz));
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
            case EEntType.PGON:
                ribs_is_closed = true;
                const face_wires_i = this.modeldata.geom.nav.navAnyToWire(ent_type, index);
                for (const face_wire_i of face_wires_i) {
                    const face_wire_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, face_wire_i);
                    ribs_posis_i.push(face_wire_posis_i);
                }
                break;
            case EEntType.PLINE:
                const pline_wire_i = this.modeldata.geom.nav.navPlineToWire(index);
                const pline_wire_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, pline_wire_i);
                ribs_posis_i.push(pline_wire_posis_i);
                ribs_is_closed = this.modeldata.geom.query.isWireClosed(pline_wire_i);
                break;
            case EEntType.WIRE:
                const wire_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, index);
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
        return new_plines_i.map(pline_i => [EEntType.PLINE, pline_i]);
    }
    _extrudeCap(pgon_i, strip_posis_map, divisions) {
        // get positions on boundary
        const old_wire_i = this.modeldata.geom.query.getPgonBoundary(pgon_i);
        const old_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, old_wire_i);
        const new_posis_i = old_posis_i.map(old_posi_i => strip_posis_map.get(old_posi_i)[divisions]);
        // get positions for holes
        const old_holes_wires_i = this.modeldata.geom.query.getPgonHoles(pgon_i);
        const new_holes_posis_i = [];
        for (const old_hole_wire_i of old_holes_wires_i) {
            const old_hole_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, old_hole_wire_i);
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
        if (xsection_ent_type === EEntType.WIRE) {
            xsection_wire_i = xsection_index;
        }
        else {
            const xsection_wires_i = this.modeldata.geom.nav.navAnyToWire(xsection_ent_type, xsection_index);
            xsection_wire_i = xsection_wires_i[0]; // select the first wire that is found
        }
        // get all the wires and put them into an array
        const backbone_wires_i = [];
        for (const [ent_type, index] of backbone_ents) {
            if (ent_type === EEntType.WIRE) {
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
                new_pgons.push([EEntType.PGON, pgon_i]);
            }
        }
        return new_pgons;
    }
    _listZip(debug, list1, list2) {
        if (arguments.length === 2) {
            return lodash.unzip(list1);
        }
        const lists = Array.from(arguments).slice(1);
        return lodash.zip(...lists);
    }
    _sweepStringers(backbone_wire_i, xsection_wire_i, divisions) {
        const backbone_is_closed = this.modeldata.geom.query.isWireClosed(backbone_wire_i);
        const ribs_posis_i = this._sweepPosis(backbone_wire_i, xsection_wire_i, divisions);
        const stringers_posis_i = this._listZip(false, ribs_posis_i);
        const plines = [];
        for (const stringer_posis_i of stringers_posis_i) {
            const pline_i = this.modeldata.geom.add.addPline(stringer_posis_i, backbone_is_closed);
            plines.push([EEntType.PLINE, pline_i]);
        }
        return plines;
    }
    _sweepRibs(backbone_wire_i, xsection_wire_i, divisions) {
        const xsection_is_closed = this.modeldata.geom.query.isWireClosed(xsection_wire_i);
        const ribs_posis_i = this._sweepPosis(backbone_wire_i, xsection_wire_i, divisions);
        const plines = [];
        for (const rib_posis_i of ribs_posis_i) {
            const pline_i = this.modeldata.geom.add.addPline(rib_posis_i, xsection_is_closed);
            plines.push([EEntType.PLINE, pline_i]);
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
        const xsextion_xyzs = this.modeldata.attribs.posis.getEntCoords(EEntType.WIRE, xsection_wire_i);
        // get the xyzs of the backbone
        const wire_normal = this.modeldata.geom.query.getWireNormal(backbone_wire_i);
        const wire_is_closed = this.modeldata.geom.query.isWireClosed(backbone_wire_i);
        const wire_xyzs = this.modeldata.attribs.posis.getEntCoords(EEntType.WIRE, backbone_wire_i);
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
                const vec = vecFromTo(xyz0, xyz1);
                const vec_div = vecDiv(vec, divisions);
                // create additional xyzs for planes
                plane_xyzs.push(xyz0);
                for (let j = 1; j < divisions; j++) {
                    plane_xyzs.push(vecAdd(xyz0, vecMult(vec_div, j)));
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
            const matrix = xfromSourceTargetMatrix(XY, plane);
            const xsection_posis_i = [];
            for (const xsextion_xyz of xsextion_xyzs) {
                const new_xyz = multMatrix(xsextion_xyz, matrix);
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
            if (ent_type === EEntType.PLINE) {
                set_plines.add(ent_i);
            }
            else if (ent_type === EEntType.PGON) {
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
        return this._joinPgons(Array.from(set_pgons)).map(pgon_i => [EEntType.PGON, pgon_i]);
    }
    // Return the posi pair, the key and the rev key for an edge
    _edgeKeys(edge_i) {
        const posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
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
            const edges_i = this.modeldata.geom.nav.navAnyToEdge(EEntType.PLINE, pline_i);
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
            const edge_attribs = this.modeldata.attribs.getAttribNames(EEntType.EDGE).map(name => this.modeldata.attribs.getAttrib(EEntType.EDGE, name));
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
                    const new_edges_i = this.modeldata.geom.nav.navAnyToEdge(EEntType.PGON, new_pgon_i);
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
        const plane_normal = vecCross(plane[1], plane[2]);
        const plane_tjs = new THREE.Plane();
        plane_tjs.setFromNormalAndCoplanarPoint(new THREE.Vector3(...plane_normal), new THREE.Vector3(...plane[0]));
        // get polylines and polygons
        const set_plines = new Set();
        const set_pgons = new Set();
        const edges_i = []; // all edges
        for (const [ent_type, ent_i] of ents_arr) {
            if (ent_type === EEntType.PLINE) {
                set_plines.add(ent_i);
            }
            else if (ent_type === EEntType.PGON) {
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
            const sliced = this._cutCreateEnts(EEntType.PLINE, exist_pline_i, edge_to_isect_posis, posi_to_copies, cut_posi_to_copies, posi_to_tjs, method);
            for (const new_pline_i of sliced[0]) {
                above.push([EEntType.PLINE, new_pline_i]);
            }
            for (const new_pline_i of sliced[1]) {
                below.push([EEntType.PLINE, new_pline_i]);
            }
        }
        // slice polygons
        for (const exist_pgon_i of Array.from(set_pgons)) {
            // TODO slice polygons with holes
            const sliced = this._cutCreateEnts(EEntType.PGON, exist_pgon_i, edge_to_isect_posis, posi_to_copies, cut_posi_to_copies, posi_to_tjs, method);
            for (const new_pgon_i of sliced[0]) {
                above.push([EEntType.PGON, new_pgon_i]);
            }
            for (const new_pgon_i of sliced[1]) {
                below.push([EEntType.PGON, new_pgon_i]);
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
            const edge_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
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
        const prev_edge_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, prev_edge_i);
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
        const next_edge_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, next_edge_i);
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
            case EEntType.PLINE:
                const new_pline_i = this.modeldata.geom.add.copyPlines(ent_i, true);
                this.modeldata.geom.edit_topo.replacePosis(ent_type, new_pline_i, new_posis_i);
                return new_pline_i;
            case EEntType.PGON:
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
        const wire_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
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
        if (ent_type === EEntType.PGON && num_cuts % 2 !== 0) {
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
        if (ent_type === EEntType.PGON) {
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
            if (distance(xyz0, xyz1) > 1e-6) {
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
        if (ent_type === EEntType.PLINE) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lGdW5jc01ha2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWJzL2dlby1pbmZvL2Z1bmNzL0dJRnVuY3NNYWtlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN4RSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xGLE9BQU8sRUFBRSxRQUFRLEVBQTZCLFlBQVksRUFBeUMsTUFBTSxXQUFXLENBQUM7QUFDckgsT0FBTyxLQUFLLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDL0IsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDaEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTlDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUUvQyxPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFFNUIsUUFBUTtBQUNSLE1BQU0sQ0FBTixJQUFZLE9BR1g7QUFIRCxXQUFZLE9BQU87SUFDZix3QkFBYSxDQUFBO0lBQ2IsMEJBQWUsQ0FBQTtBQUNuQixDQUFDLEVBSFcsT0FBTyxLQUFQLE9BQU8sUUFHbEI7QUFDRCxNQUFNLENBQU4sSUFBWSxZQVFYO0FBUkQsV0FBWSxZQUFZO0lBQ3BCLHlDQUEwQixDQUFBO0lBQzFCLDZDQUErQixDQUFBO0lBQy9CLGlEQUFrQyxDQUFBO0lBQ2xDLHFEQUF1QyxDQUFBO0lBQ3ZDLHVDQUF1QixDQUFBO0lBQ3ZCLDJDQUEyQixDQUFBO0lBQzNCLGlDQUFpQixDQUFBO0FBQ3JCLENBQUMsRUFSVyxZQUFZLEtBQVosWUFBWSxRQVF2QjtBQUNELE1BQU0sQ0FBTixJQUFZLGVBS1g7QUFMRCxXQUFZ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