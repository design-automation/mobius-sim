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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIFuncsEdit = exports._EWeldMethod = exports._EDivisorMethod = exports._ERingMethod = void 0;
const vectors_1 = require("@libs/geom/vectors");
const common_1 = require("../common");
const distance_1 = require("@libs/geom/distance");
const arrs_1 = require("@libs/util/arrs");
const TypedArrayUtils_js_1 = require("@libs/TypedArrayUtils.js");
const THREE = __importStar(require("three"));
// Enums
var _ERingMethod;
(function (_ERingMethod) {
    _ERingMethod["OPEN"] = "open";
    _ERingMethod["CLOSE"] = "close";
})(_ERingMethod = exports._ERingMethod || (exports._ERingMethod = {}));
var _EDivisorMethod;
(function (_EDivisorMethod) {
    _EDivisorMethod["BY_NUMBER"] = "by_number";
    _EDivisorMethod["BY_LENGTH"] = "by_length";
    _EDivisorMethod["BY_MAX_LENGTH"] = "by_max_length";
    _EDivisorMethod["BY_MIN_LENGTH"] = "by_min_length";
})(_EDivisorMethod = exports._EDivisorMethod || (exports._EDivisorMethod = {}));
var _EWeldMethod;
(function (_EWeldMethod) {
    _EWeldMethod["MAKE_WELD"] = "make_weld";
    _EWeldMethod["BREAK_WELD"] = "break_weld";
})(_EWeldMethod = exports._EWeldMethod || (exports._EWeldMethod = {}));
/**
 * Class for editing geometry.
 */
class GIFuncsEdit {
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
        if ((0, arrs_1.getArrDepth)(ents_arr) === 1) {
            const [ent_type, ent_i] = ents_arr;
            // time stamp
            this.modeldata.getObjsCheckTs(ent_type, ent_i);
            //
            let exist_edges_i;
            if (ent_type !== common_1.EEntType.EDGE) {
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
            return all_new_edges_i.map(one_edge_i => [common_1.EEntType.EDGE, one_edge_i]);
        }
        else {
            return [].concat(...ents_arr.map(one_edge => this.divide(one_edge, divisor, method)));
        }
    }
    _divideEdge(edge_i, divisor, method) {
        const posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edge_i);
        const start = this.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
        const end = this.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
        let new_xyzs;
        if (method === _EDivisorMethod.BY_NUMBER) {
            new_xyzs = (0, vectors_1.interpByNum)(start, end, divisor - 1);
        }
        else if (method === _EDivisorMethod.BY_LENGTH) {
            new_xyzs = (0, vectors_1.interpByLen)(start, end, divisor);
        }
        else if (method === _EDivisorMethod.BY_MAX_LENGTH) {
            const len = (0, distance_1.distance)(start, end);
            if (divisor === 0) {
                new_xyzs = [];
            }
            else {
                const num_div = Math.ceil(len / divisor);
                const num_div_max = num_div > 1 ? num_div - 1 : 0;
                new_xyzs = (0, vectors_1.interpByNum)(start, end, num_div_max);
            }
        }
        else { // BY_MIN_LENGTH
            if (divisor === 0) {
                new_xyzs = [];
            }
            else {
                const len = (0, distance_1.distance)(start, end);
                const num_div = Math.floor(len / divisor);
                const num_div_min = num_div > 1 ? num_div - 1 : 0;
                new_xyzs = (0, vectors_1.interpByNum)(start, end, num_div_min);
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
        this.modeldata.getObjsCheckTs(common_1.EEntType.PGON, pgon_i);
        // create the hole
        const wires_i = this.modeldata.geom.edit_pgon.cutPgonHoles(pgon_i, holes_posis_i);
        // return hole wires
        return wires_i.map(wire_i => [common_1.EEntType.WIRE, wire_i]);
    }
    _getHolePosisFromEnts(ents_arr) {
        const depth = (0, arrs_1.getArrDepth)(ents_arr);
        if (depth === 1) {
            const [ent_type, ent_i] = ents_arr;
            // we have just a single entity, must be a wire, a pline, or a pgon, so get the posis and return them
            return [this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i)];
        }
        else if (depth === 2) {
            ents_arr = ents_arr;
            // we have a list of entites, could be a list of posis or a list of wires/plines/pgons
            // so lets check the first entity, is it a posi?
            if (ents_arr[0][0] === common_1.EEntType.POSI) {
                // we assume we have a list of posis
                const posis_i = [];
                if (ents_arr.length < 3) {
                    // TODO improve this error message, print the list of entities
                    throw new Error('The data for generating holes in a polygon is invalid. A list of positions must have at least three positions.');
                }
                for (const [ent_type, ent_i] of ents_arr) {
                    if (ent_type !== common_1.EEntType.POSI) {
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
                    if (ent_type === common_1.EEntType.POSI) {
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
        const map = this.modeldata.geom.query.getEntsMap(ents_arr, [common_1.EEntType.VERT, common_1.EEntType.POINT, common_1.EEntType.PLINE, common_1.EEntType.PGON]);
        // time stamp
        map.get(common_1.EEntType.POINT).forEach(point_i => this.modeldata.getObjsCheckTs(common_1.EEntType.POINT, point_i));
        map.get(common_1.EEntType.PLINE).forEach(pline_i => this.modeldata.getObjsCheckTs(common_1.EEntType.PLINE, pline_i));
        map.get(common_1.EEntType.PGON).forEach(pgon_i => this.modeldata.getObjsCheckTs(common_1.EEntType.PGON, pgon_i));
        // process ents
        const verts_i = Array.from(map.get(common_1.EEntType.VERT));
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
        const map = this.modeldata.geom.query.getEntsMap(ents_arr, [common_1.EEntType.POSI, common_1.EEntType.POINT, common_1.EEntType.PLINE, common_1.EEntType.PGON]);
        // time stamp
        map.get(common_1.EEntType.POINT).forEach(point_i => this.modeldata.getObjsCheckTs(common_1.EEntType.POINT, point_i));
        map.get(common_1.EEntType.PLINE).forEach(pline_i => this.modeldata.getObjsCheckTs(common_1.EEntType.PLINE, pline_i));
        map.get(common_1.EEntType.PGON).forEach(pgon_i => this.modeldata.getObjsCheckTs(common_1.EEntType.PGON, pgon_i));
        // get posis
        const posis_i = Array.from(map.get(common_1.EEntType.POSI));
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
        const kdtree = new TypedArrayUtils_js_1.TypedArrayUtils.Kdtree(typed_positions, this._fuseDistSq, 4);
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
        return new_posis_i.map(posi_i => [common_1.EEntType.POSI, posi_i]);
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
exports.GIFuncsEdit = GIFuncsEdit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lGdW5jc0VkaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWJzL2dlby1pbmZvL2Z1bmNzL0dJRnVuY3NFZGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBOEQ7QUFDOUQsc0NBQWtFO0FBQ2xFLGtEQUErQztBQUMvQywwQ0FBOEM7QUFFOUMsaUVBQTJEO0FBQzNELDZDQUErQjtBQUUvQixRQUFRO0FBQ1IsSUFBWSxZQUdYO0FBSEQsV0FBWSxZQUFZO0lBQ3BCLDZCQUFjLENBQUE7SUFDZCwrQkFBaUIsQ0FBQTtBQUNyQixDQUFDLEVBSFcsWUFBWSxHQUFaLG9CQUFZLEtBQVosb0JBQVksUUFHdkI7QUFDRCxJQUFZLGVBS1g7QUFMRCxXQUFZLGVBQWU7SUFDdkIsMENBQXdCLENBQUE7SUFDeEIsMENBQXlCLENBQUE7SUFDekIsa0RBQWlDLENBQUE7SUFDakMsa0RBQWlDLENBQUE7QUFDckMsQ0FBQyxFQUxXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBSzFCO0FBQ0QsSUFBWSxZQUdYO0FBSEQsV0FBWSxZQUFZO0lBQ3BCLHVDQUF3QixDQUFBO0lBQ3hCLHlDQUEyQixDQUFBO0FBQy9CLENBQUMsRUFIVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUd2QjtBQUNEOztHQUVHO0FBQ0gsTUFBYSxXQUFXO0lBR3BCLG1HQUFtRztJQUNuRzs7T0FFRztJQUNILFlBQVksS0FBa0I7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNELG1HQUFtRztJQUNuRzs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxRQUFtQyxFQUFFLE9BQWUsRUFBRSxNQUF1QjtRQUN2RixxQkFBcUI7UUFDckIscUVBQXFFO1FBQ3JFLElBQUksSUFBQSxrQkFBVyxFQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM3QixNQUFNLENBQUMs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