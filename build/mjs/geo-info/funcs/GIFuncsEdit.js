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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lGdW5jc0VkaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWJzL2dlby1pbmZvL2Z1bmNzL0dJRnVuY3NFZGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDOUQsT0FBTyxFQUFFLFFBQVEsRUFBK0IsTUFBTSxXQUFXLENBQUM7QUFDbEUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUU5QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxLQUFLLEtBQUssTUFBTSxPQUFPLENBQUM7QUFFL0IsUUFBUTtBQUNSLE1BQU0sQ0FBTixJQUFZLFlBR1g7QUFIRCxXQUFZLFlBQVk7SUFDcEIsNkJBQWMsQ0FBQTtJQUNkLCtCQUFpQixDQUFBO0FBQ3JCLENBQUMsRUFIVyxZQUFZLEtBQVosWUFBWSxRQUd2QjtBQUNELE1BQU0sQ0FBTixJQUFZLGVBS1g7QUFMRCxXQUFZLGVBQWU7SUFDdkIsMENBQXdCLENBQUE7SUFDeEIsMENBQXlCLENBQUE7SUFDekIsa0RBQWlDLENBQUE7SUFDakMsa0RBQWlDLENBQUE7QUFDckMsQ0FBQyxFQUxXLGVBQWUsS0FBZixlQUFlLFFBSzFCO0FBQ0QsTUFBTSxDQUFOLElBQVksWUFHWDtBQUhELFdBQVksWUFBWTtJQUNwQix1Q0FBd0IsQ0FBQTtJQUN4Qix5Q0FBMkIsQ0FBQTtBQUMvQixDQUFDLEVBSFcsWUFBWSxLQUFaLFlBQVksUUFHdkI7QUFDRDs7R0FFRztBQUNILE1BQU0sT0FBTyxXQUFXO0lBQ3BCLG1HQUFtRztJQUMzRixTQUFTLENBQWM7SUFDL0IsbUdBQW1HO0lBQ25HOztPQUVHO0lBQ0gsWUFBWSxLQUFrQjtRQUMxQixJQUFJLENBQUMsU0FB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