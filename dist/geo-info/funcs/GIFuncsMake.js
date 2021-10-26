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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lGdW5jc01ha2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWJzL2dlby1pbmZvL2Z1bmNzL0dJRnVuY3NNYWtlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN4RSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xGLE9BQU8sRUFBRSxRQUFRLEVBQTZCLFlBQVksRUFBeUMsTUFBTSxXQUFXLENBQUM7QUFDckgsT0FBTyxLQUFLLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDL0IsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDaEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTlDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUUvQyxPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFFNUIsUUFBUTtBQUNSLE1BQU0sQ0FBTixJQUFZLE9BR1g7QUFIRCxXQUFZLE9BQU87SUFDZix3QkFBYSxDQUFBO0lBQ2IsMEJBQWUsQ0FBQTtBQUNuQixDQUFDLEVBSFcsT0FBTyxLQUFQLE9BQU8sUUFHbEI7QUFDRCxNQUFNLENBQU4sSUFBWSxZQVFYO0FBUkQsV0FBWSxZQUFZO0lBQ3BCLHlDQUEwQixDQUFBO0lBQzFCLDZDQUErQixDQUFBO0lBQy9CLGlEQUFrQyxDQUFBO0lBQ2xDLHFEQUF1QyxDQUFBO0lBQ3ZDLHVDQUF1QixDQUFBO0lBQ3ZCLDJDQUEyQixDQUFBO0lBQzNCLGlDQUFpQixDQUFBO0FBQ3JCLENBQUMsRUFSVyxZQUFZLEtBQVosWUFBWSxRQVF2QjtBQUNELE1BQU0sQ0FBTixJQUFZLGVBS1g7QUFMRCxXQUFZLGVB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