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
const vectors_1 = require("../../geom/vectors");
const common_1 = require("../common");
const distance_1 = require("../../geom/distance");
const arrs_1 = require("../../../libs/util/arrs");
const TypedArrayUtils_js_1 = require("../../TypedArrayUtils.js");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lGdW5jc0VkaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9mdW5jcy9HSUZ1bmNzRWRpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQThEO0FBQzlELHNDQUFrRTtBQUNsRSxrREFBK0M7QUFDL0MsaURBQXFEO0FBRXJELGlFQUEyRDtBQUMzRCw2Q0FBK0I7QUFFL0IsUUFBUTtBQUNSLElBQVksWUFHWDtBQUhELFdBQVksWUFBWTtJQUNwQiw2QkFBYyxDQUFBO0lBQ2QsK0JBQWlCLENBQUE7QUFDckIsQ0FBQyxFQUhXLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBR3ZCO0FBQ0QsSUFBWSxlQUtYO0FBTEQsV0FBWSxlQUFlO0lBQ3ZCLDBDQUF3QixDQUFBO0lBQ3hCLDBDQUF5QixDQUFBO0lBQ3pCLGtEQUFpQyxDQUFBO0lBQ2pDLGtEQUFpQyxDQUFBO0FBQ3JDLENBQUMsRUFMVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQUsxQjtBQUNELElBQVksWUFHWDtBQUhELFdBQVksWUFBWTtJQUNwQix1Q0FBd0IsQ0FBQTtJQUN4Qix5Q0FBMkIsQ0FBQTtBQUMvQixDQUFDLEVBSFcsWUFBWSxHQUFaLG9CQUFZLEtBQVosb0JBQVksUUFHdkI7QUFDRDs7R0FFRztBQUNILE1BQWEsV0FBVztJQUdwQixtR0FBbUc7SUFDbkc7O09BRUc7SUFDSCxZQUFZLEtBQWtCO1FBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxtR0FBbUc7SUFDbkc7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsUUFBbUMsRUFBRSxPQUFlLEVBQUUsTUFBdUI7UUFDdkYscUJBQXFCO1FBQ3JCLHFFQUFxRTtRQUNyRSxJQUFJLElBQUEsa0JBQVcsRUFBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDN0IsTUFB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