import { interpByNum, interpByLen } from '../../geom/vectors';
import { EEntType } from '../common';
import { distance } from '../../geom/distance';
import { getArrDepth } from '../../util/arrs';
import { TypedArrayUtils } from '../../TypedArrayUtils.js';
import * as THREE from 'three';
// Enums
export var _ERingMethod;
(function (_ERingMethod) {
    _ERingMethod["OPEN"] = "open";
    _ERingMethod["CLOSE"] = "close";
})(_ERingMethod || (_ERingMethod = {}));
export var _EDivisorMethod;
(function (_EDivisorMethod) {
    _EDivisorMethod["BY_NUMBER"] = "by_number";
    _EDivisorMethod["BY_LENGTH"] = "by_length";
    _EDivisorMethod["BY_MAX_LENGTH"] = "by_max_length";
    _EDivisorMethod["BY_MIN_LENGTH"] = "by_min_length";
})(_EDivisorMethod || (_EDivisorMethod = {}));
export var _EWeldMethod;
(function (_EWeldMethod) {
    _EWeldMethod["MAKE_WELD"] = "make_weld";
    _EWeldMethod["BREAK_WELD"] = "break_weld";
})(_EWeldMethod || (_EWeldMethod = {}));
/**
 * Class for editing geometry.
 */
export class GIFuncsEdit {
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
     * @param ents_arr
     * @param divisor
     * @param method
     */
    divide(ents_arr, divisor, method) {
        // snapshot copy ents
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, false);
        if (getArrDepth(ents_arr) === 1) {
            const [ent_type, ent_i] = ents_arr;
            // time stamp
            this.modeldata.getObjsCheckTs(ent_type, ent_i);
            //
            let exist_edges_i;
            if (ent_type !== EEntType.EDGE) {
                exist_edges_i = this.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i).slice();
            }
            else {
                exist_edges_i = [ent_i];
            }
            const all_new_edges_i = [];
            for (const exist_edge_i of exist_edges_i) {
                const new_edges_i = this._divideEdge(exist_edge_i, divisor, method);
                new_edges_i.forEach(new_edge_i => all_new_edges_i.push(new_edge_i));
            }
            // return the new edges
            return all_new_edges_i.map(one_edge_i => [EEntType.EDGE, one_edge_i]);
        }
        else {
            return [].concat(...ents_arr.map(one_edge => this.divide(one_edge, divisor, method)));
        }
    }
    _divideEdge(edge_i, divisor, method) {
        const posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        const start = this.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
        const end = this.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
        let new_xyzs;
        if (method === _EDivisorMethod.BY_NUMBER) {
            new_xyzs = interpByNum(start, end, divisor - 1);
        }
        else if (method === _EDivisorMethod.BY_LENGTH) {
            new_xyzs = interpByLen(start, end, divisor);
        }
        else if (method === _EDivisorMethod.BY_MAX_LENGTH) {
            const len = distance(start, end);
            if (divisor === 0) {
                new_xyzs = [];
            }
            else {
                const num_div = Math.ceil(len / divisor);
                const num_div_max = num_div > 1 ? num_div - 1 : 0;
                new_xyzs = interpByNum(start, end, num_div_max);
            }
        }
        else { // BY_MIN_LENGTH
            if (divisor === 0) {
                new_xyzs = [];
            }
            else {
                const len = distance(start, end);
                const num_div = Math.floor(len / divisor);
                const num_div_min = num_div > 1 ? num_div - 1 : 0;
                new_xyzs = interpByNum(start, end, num_div_min);
            }
        }
        const new_edges_i = [];
        let old_edge_i = edge_i;
        for (const new_xyz of new_xyzs) {
            const posi_i = this.modeldata.geom.add.addPosi();
            this.modeldata.attribs.posis.setPosiCoords(posi_i, new_xyz);
            const new_edge_i = this.modeldata.geom.edit_topo.insertVertIntoWire(old_edge_i, posi_i);
            new_edges_i.push(old_edge_i);
            old_edge_i = new_edge_i;
        }
        new_edges_i.push(old_edge_i);
        return new_edges_i;
    }
    // ================================================================================================
    /**
     *
     * @param pgon_i
     * @param holes_ents_arr
     */
    hole(pgon, holes_ents_arr) {
        const pgon_i = pgon[1];
        const holes_posis_i = this._getHolePosisFromEnts(holes_ents_arr);
        // time stamp
        this.modeldata.getObjsCheckTs(EEntType.PGON, pgon_i);
        // create the hole
        const wires_i = this.modeldata.geom.edit_pgon.cutPgonHoles(pgon_i, holes_posis_i);
        // return hole wires
        return wires_i.map(wire_i => [EEntType.WIRE, wire_i]);
    }
    _getHolePosisFromEnts(ents_arr) {
        const depth = getArrDepth(ents_arr);
        if (depth === 1) {
            const [ent_type, ent_i] = ents_arr;
            // we have just a single entity, must be a wire, a pline, or a pgon, so get the posis and return them
            return [this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i)];
        }
        else if (depth === 2) {
            ents_arr = ents_arr;
            // we have a list of entites, could be a list of posis or a list of wires/plines/pgons
            // so lets check the first entity, is it a posi?
            if (ents_arr[0][0] === EEntType.POSI) {
                // we assume we have a list of posis
                const posis_i = [];
                if (ents_arr.length < 3) {
                    // TODO improve this error message, print the list of entities
                    throw new Error('The data for generating holes in a polygon is invalid. A list of positions must have at least three positions.');
                }
                for (const [ent_type, ent_i] of ents_arr) {
                    if (ent_type !== EEntType.POSI) {
                        // TODO improve this error message, print the list of entities
                        throw new Error('The list of entities for generating holes is inconsistent. A list has been found that contains a mixture of positions and other entities.');
                    }
                    posis_i.push(ent_i);
                }
                return [posis_i];
            }
            else {
                // we have a list of other entities
                const posis_arrs_i = [];
                for (const [ent_type, ent_i] of ents_arr) {
                    if (ent_type === EEntType.POSI) {
                        // TODO improve this error message, print the list of entities
                        throw new Error('The data for generating holes in a polygon is inconsistent. A list has been found that contains a mixture of positions and other entities.');
                    }
                    const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
                    if (posis_i.length > 2) {
                        // if there are less than 3 posis, then ignore this ent (no error)
                        posis_arrs_i.push(posis_i);
                    }
                }
                return posis_arrs_i;
            }
        }
        else {
            // we have some kind of nested list, so call this function recursivley
            const posis_arrs_i = [];
            for (const a_ents_arr of ents_arr) {
                const posis_arrs2_i = this._getHolePosisFromEnts(a_ents_arr);
                for (const posis_arr2_i of posis_arrs2_i) {
                    posis_arrs_i.push(posis_arr2_i);
                }
            }
            return posis_arrs_i;
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param method
     */
    weld(ents_arr, method) {
        // snapshot copy ents (no change to posis)
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, false) as TEntTypeIdx[];
        // get unique verts
        const map = this.modeldata.geom.query.getEntsMap(ents_arr, [EEntType.VERT, EEntType.POINT, EEntType.PLINE, EEntType.PGON]);
        // time stamp
        map.get(EEntType.POINT).forEach(point_i => this.modeldata.getObjsCheckTs(EEntType.POINT, point_i));
        map.get(EEntType.PLINE).forEach(pline_i => this.modeldata.getObjsCheckTs(EEntType.PLINE, pline_i));
        map.get(EEntType.PGON).forEach(pgon_i => this.modeldata.getObjsCheckTs(EEntType.PGON, pgon_i));
        // process ents
        const verts_i = Array.from(map.get(EEntType.VERT));
        switch (method) {
            case _EWeldMethod.BREAK_WELD:
                this.modeldata.geom.edit_topo.cloneVertPositions(verts_i);
                break;
            case _EWeldMethod.MAKE_WELD:
                this.modeldata.geom.edit_topo.mergeVertPositions(verts_i);
                break;
            default:
                break;
        }
        // TODO
        return [];
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param tolerance
     */
    fuse(ents_arr, tolerance) {
        // const ssid: number = this.modeldata.timestamp;
        // snapshot copy ents (no change to posis)
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, false) as TEntTypeIdx[];
        // get unique ents
        const map = this.modeldata.geom.query.getEntsMap(ents_arr, [EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON]);
        // time stamp
        map.get(EEntType.POINT).forEach(point_i => this.modeldata.getObjsCheckTs(EEntType.POINT, point_i));
        map.get(EEntType.PLINE).forEach(pline_i => this.modeldata.getObjsCheckTs(EEntType.PLINE, pline_i));
        map.get(EEntType.PGON).forEach(pgon_i => this.modeldata.getObjsCheckTs(EEntType.PGON, pgon_i));
        // get posis
        const posis_i = Array.from(map.get(EEntType.POSI));
        // find neighbour
        const map_posi_i_to_xyz = new Map();
        const typed_positions = new Float32Array(posis_i.length * 4);
        const typed_buff = new THREE.BufferGeometry();
        typed_buff.setAttribute('position', new THREE.BufferAttribute(typed_positions, 4));
        for (let i = 0; i < posis_i.length; i++) {
            const posi_i = posis_i[i];
            const xyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
            map_posi_i_to_xyz.set(posi_i, xyz);
            typed_positions[i * 4 + 0] = xyz[0];
            typed_positions[i * 4 + 1] = xyz[1];
            typed_positions[i * 4 + 2] = xyz[2];
            typed_positions[i * 4 + 3] = posi_i;
        }
        const kdtree = new TypedArrayUtils.Kdtree(typed_positions, this._fuseDistSq, 4);
        // create a neighbours list
        const nns = []; // [posi_i, num_neighbours, neighbour_poisi_i]
        for (let i = 0; i < posis_i.length; i++) {
            const posi_i = posis_i[i];
            const nn = kdtree.nearest(map_posi_i_to_xyz.get(posi_i), posis_i.length, tolerance * tolerance);
            const nn_posis_i = [];
            for (const a_nn of nn) {
                const obj = a_nn[0].obj;
                const nn_posi_i = obj[3];
                nn_posis_i.push(nn_posi_i);
            }
            nns.push([posis_i[i], nn_posis_i.length, nn_posis_i]);
        }
        // sort so that positions with most neighbours win
        nns.sort((a, b) => b[1] - a[1]);
        // create new positions, replace posis for existing vertices
        const nns_filt = []; // [posi_i, num_neighbours, neighbour_poisi_i]
        const exclude_posis_i = new Set(); // exclude any posis that have already been moved
        const new_posis_i = [];
        for (const nn of nns) {
            if (!exclude_posis_i.has(nn[0]) && nn[1] > 1) {
                nns_filt.push(nn);
                const new_xyz = [0, 0, 0];
                for (const n_posi_i of nn[2]) {
                    exclude_posis_i.add(n_posi_i);
                    const xyz = map_posi_i_to_xyz.get(n_posi_i);
                    new_xyz[0] += xyz[0];
                    new_xyz[1] += xyz[1];
                    new_xyz[2] += xyz[2];
                }
                new_xyz[0] = new_xyz[0] / nn[1];
                new_xyz[1] = new_xyz[1] / nn[1];
                new_xyz[2] = new_xyz[2] / nn[1];
                const new_posi_i = this.modeldata.geom.add.addPosi();
                new_posis_i.push(new_posi_i);
                this.modeldata.attribs.posis.setPosiCoords(new_posi_i, new_xyz);
                for (const n_posi_i of nn[2]) {
                    const verts_i = this.modeldata.geom.nav.navPosiToVert(n_posi_i);
                    // create a copy of the list of verts
                    // otherwise verts may be removed from the list while inside the loop
                    const copy_verts_i = verts_i.slice();
                    // loop through the list, replace each vert posi
                    for (const vert_i of copy_verts_i) {
                        this.modeldata.geom.edit_topo.replaceVertPosi(vert_i, new_posi_i);
                    }
                    // this.modeldata.geom.add.addPline([new_posi_i, n_posi_i], false); // temp
                }
            }
        }
        // delete the posis if they are unused
        const ssid = this.modeldata.active_ssid;
        this.modeldata.geom.snapshot.delUnusedPosis(ssid, Array.from(exclude_posis_i));
        // return new posis
        return new_posis_i.map(posi_i => [EEntType.POSI, posi_i]);
    }
    _fuseDistSq(xyz1, xyz2) {
        return Math.pow(xyz1[0] - xyz2[0], 2) + Math.pow(xyz1[1] - xyz2[1], 2) + Math.pow(xyz1[2] - xyz2[2], 2);
    }
    // ================================================================================================
    ring(ents_arr, method) {
        for (const [ent_type, ent_i] of ents_arr) {
            // time stamp
            this.modeldata.getObjsCheckTs(ent_type, ent_i);
            //
            switch (method) {
                case _ERingMethod.CLOSE:
                    this.modeldata.geom.edit_pline.closePline(ent_i);
                    break;
                case _ERingMethod.OPEN:
                    this.modeldata.geom.edit_pline.openPline(ent_i);
                    break;
                default:
                    break;
            }
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param offset
     */
    shift(ents_arr, offset) {
        for (const [ent_type, ent_i] of ents_arr) {
            // time stamp
            this.modeldata.getObjsCheckTs(ent_type, ent_i);
            //
            const wires_i = this.modeldata.geom.nav.navAnyToWire(ent_type, ent_i);
            wires_i.forEach(wire_i => this.modeldata.geom.edit_topo.shift(wire_i, offset));
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     */
    reverse(ents_arr) {
        for (const [ent_type, ent_i] of ents_arr) {
            // time stamp
            this.modeldata.getObjsCheckTs(ent_type, ent_i);
            //
            const wires_i = this.modeldata.geom.nav.navAnyToWire(ent_type, ent_i);
            wires_i.forEach(wire_i => this.modeldata.geom.edit_topo.reverse(wire_i));
        }
    }
    // ================================================================================================
    /**
     * Delete ents in the model.
     * The posis in ents will only be deleted if they are not used by other ents.
     * If collectons are deleted, the contents of the collection is not deleted.
     * If topological entities are deleted, then the object may need to be cloned.
     */
    delete(ents_arr, invert) {
        const ssid = this.modeldata.active_ssid;
        // null case
        if (ents_arr === null) {
            this._deleteNull(invert);
            return;
        }
        // create array
        ents_arr = (Array.isArray(ents_arr[0]) ? ents_arr : [ents_arr]);
        // empty array
        if (ents_arr.length === 0) {
            return;
        }
        // create sets
        const ent_sets = this.modeldata.geom.snapshot.getSubEntsSets(ssid, ents_arr);
        // console.log(">>>before");
        // Object.keys(ent_sets).forEach( key => console.log(key, Array.from(ent_sets[key])));
        if (invert) {
            this.modeldata.geom.snapshot.invertEntSets(ssid, ent_sets);
        }
        // console.log(">>>after");
        // Object.keys(ent_sets).forEach( key => console.log(key, Array.from(ent_sets[key])));
        this.modeldata.geom.snapshot.delEntSets(ssid, ent_sets);
    }
    _deleteNull(invert) {
        const ssid = this.modeldata.active_ssid;
        if (invert) {
            // delete nothing
            return;
        }
        else {
            // delete everything
            this.modeldata.geom.snapshot.delAllEnts(ssid);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lGdW5jc0VkaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWJzL2dlby1pbmZvL2Z1bmNzL0dJRnVuY3NFZGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDOUQsT0FBTyxFQUFFLFFBQVEsRUFBK0IsTUFBTSxXQUFXLENBQUM7QUFDbEUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUU5QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxLQUFLLEtBQUssTUFBTSxPQUFPLENBQUM7QUFFL0IsUUFBUTtBQUNSLE1BQU0sQ0FBTixJQUFZLFlBR1g7QUFIRCxXQUFZLFlBQVk7SUFDcEIsNkJBQWMsQ0FBQTtJQUNkLCtCQUFpQixDQUFBO0FBQ3JCLENBQUMsRUFIVyxZQUFZLEtBQVosWUFBWSxRQUd2QjtBQUNELE1BQU0sQ0FBTixJQUFZLGVBS1g7QUFMRCxXQUFZLGVBQWU7SUFDdkIsMENBQXdCLENBQUE7SUFDeEIsMENBQXlCLENBQUE7SUFDekIsa0RBQWlDLENBQUE7SUFDakMsa0RBQWlDLENBQUE7QUFDckMsQ0FBQyxFQUxXLGVBQWUsS0FBZixlQUFlLFFBSzFCO0FBQ0QsTUFBTSxDQUFOLElBQVksWUFHWDtBQUhELFdBQVksWUFBWTtJQUNwQix1Q0FBd0IsQ0FBQTtJQUN4Qix5Q0FBMkIsQ0FBQTtBQUMvQixDQUFDLEVBSFcsWUFBWSxLQUFaLFlBQVksUUFHdkI7QUFDRDs7R0FFRztBQUNILE1BQU0sT0FBTyxXQUFXO0lBR3BCLG1HQUFtRztJQUNuRzs7T0FFRztJQUNILFlBQVksS0FBa0I7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNE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