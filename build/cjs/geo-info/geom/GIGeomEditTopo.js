"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIGeomEditTopo = void 0;
const common_1 = require("../common");
const arrs_1 = require("../../util/arrs");
/**
 * Class for geometry.
 */
class GIGeomEditTopo {
    /**
     * Constructor
     */
    constructor(modeldata, geom_maps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    // ============================================================================
    // Modify geometry
    // ============================================================================
    /**
     * Insert a vertex into an edge and updates the wire with the new edge
     * \n
     * Applies to both plines and pgons.
     * \n
     * Plines can be open or closed.
     * \n
     */
    insertVertIntoWire(edge_i, posi_i) {
        const wire_i = this.modeldata.geom.nav.navEdgeToWire(edge_i);
        const wire = this._geom_maps.dn_wires_edges.get(wire_i);
        const old_edge_verts_i = this._geom_maps.dn_edges_verts.get(edge_i);
        const old_and_prev_edge_i = this._geom_maps.up_verts_edges.get(old_edge_verts_i[0]);
        const old_and_next_edge_i = this._geom_maps.up_verts_edges.get(old_edge_verts_i[1]);
        // check prev edge
        if (old_and_prev_edge_i.length === 2) {
            if (old_and_prev_edge_i[0] === edge_i) {
                throw new Error('Edges are in wrong order');
            }
        }
        // check next edge amd save the next edge
        if (old_and_next_edge_i.length === 2) {
            if (old_and_next_edge_i[1] === edge_i) {
                throw new Error('Edges are in wrong order');
            }
            this._geom_maps.up_verts_edges.set(old_edge_verts_i[1], [old_and_next_edge_i[1]]);
        }
        else {
            this._geom_maps.up_verts_edges.set(old_edge_verts_i[1], []);
        }
        // create one new vertex and one new edge
        const new_vert_i = this.modeldata.geom.add._addVertex(posi_i);
        this._geom_maps.up_verts_edges.set(new_vert_i, [edge_i]);
        const new_edge_i = this.modeldata.geom.add._addEdge(new_vert_i, old_edge_verts_i[1]);
        // update the down arrays
        old_edge_verts_i[1] = new_vert_i;
        wire.splice(wire.indexOf(edge_i), 1, edge_i, new_edge_i);
        // update the up arrays for edges to wires
        this._geom_maps.up_edges_wires.set(new_edge_i, wire_i);
        // return the new edge
        return new_edge_i;
    }
    /**
         * Insert multiple vertices into an edge and updates the wire with the new edges
         * \n
         * Applies to both plines and pgons.
         * \n
         * Plines can be open or closed.
         * \n
         */
    insertVertsIntoWire(edge_i, posis_i) {
        // check that there are no duplicates in the list
        if (posis_i.length > 1) {
            posis_i = Array.from(new Set(posis_i));
        }
        // check tha the posis being inserted are not already the start or end of this edge
        const edge_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edge_i);
        if (edge_posis_i[0] === posis_i[0]) {
            posis_i = posis_i.slice(1);
        }
        if (edge_posis_i[1] === posis_i[posis_i.length - 1]) {
            posis_i = posis_i.slice(0, posis_i.length - 1);
        }
        // if no more posis, then return empty list
        if (posis_i.length === 0) {
            return [];
        }
        // proceed to insert posis
        const wire_i = this.modeldata.geom.nav.navEdgeToWire(edge_i);
        const wire = this._geom_maps.dn_wires_edges.get(wire_i);
        const end_vert_i = this._geom_maps.dn_edges_verts.get(edge_i)[1];
        const next_edge_i = this._geom_maps.up_verts_edges.get(end_vert_i)[1];
        // check next edge amd save the next edge
        if (next_edge_i !== undefined) {
            this._geom_maps.up_verts_edges.set(end_vert_i, [next_edge_i]); // there is next edge
        }
        else {
            this._geom_maps.up_verts_edges.set(end_vert_i, []); // there is no next edge
        }
        // create the new vertices
        const new_verts_i = [];
        for (const posi_i of posis_i) {
            const new_vert_i = this.modeldata.geom.add._addVertex(posi_i);
            new_verts_i.push(new_vert_i);
        }
        new_verts_i.push(end_vert_i);
        // update the down/ip arrays for teh old edge
        // the old edge becomes the first edge in this list, and it gets a new end vertex
        this._geom_maps.dn_edges_verts.get(edge_i)[1] = new_verts_i[0];
        this._geom_maps.up_verts_edges.set(new_verts_i[0], [edge_i]);
        // create the new edges
        const new_edges_i = [];
        for (let i = 0; i < new_verts_i.length - 1; i++) {
            const new_edge_i = this.modeldata.geom.add._addEdge(new_verts_i[i], new_verts_i[i + 1]);
            // update the up arrays for edges to wires
            this._geom_maps.up_edges_wires.set(new_edge_i, wire_i);
            // add to the list
            new_edges_i.push(new_edge_i);
        }
        // update the down arrays for the wire
        wire.splice(wire.indexOf(edge_i) + 1, 0, ...new_edges_i);
        // return the new edge
        return new_edges_i;
    }
    /**
     * Replace all positions in an entity with a new set of positions.
     * \n
     */
    replacePosis(ent_type, ent_i, new_posis_i) {
        const old_posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        if (old_posis_i.length !== new_posis_i.length) {
            throw new Error('Replacing positions operation failed due to incorrect number of positions.');
        }
        const old_posis_i_map = new Map(); // old_posi_i -> index
        for (let i = 0; i < old_posis_i.length; i++) {
            const old_posi_i = old_posis_i[i];
            old_posis_i_map[old_posi_i] = i;
        }
        const verts_i = this.modeldata.geom.nav.navAnyToVert(ent_type, ent_i);
        for (const vert_i of verts_i) {
            const old_posi_i = this.modeldata.geom.nav.navVertToPosi(vert_i);
            const i = old_posis_i_map[old_posi_i];
            const new_posi_i = new_posis_i[i];
            // set the down array
            this._geom_maps.dn_verts_posis.set(vert_i, new_posi_i);
            // update the up arrays for the old posi, i.e. remove this vert
            (0, arrs_1.arrRem)(this._geom_maps.up_posis_verts.get(old_posi_i), vert_i);
            // update the up arrays for the new posi, i.e. add this vert
            this._geom_maps.up_posis_verts.get(new_posi_i).push(vert_i);
        }
    }
    /**
     * Replace the position of a vertex with a new position.
     * \n
     * If the result is an edge with two same posis, then the vertex will be deleted if del_if_invalid = true.
     * If del_if_invalid = false, no action will be taken.
     * \n
     * Called by modify.Fuse() and poly2d.Stitch().
     */
    replaceVertPosi(vert_i, new_posi_i, del_if_invalid = true) {
        // check if the new posi is same as existing posi
        const old_posi_i = this.modeldata.geom.nav.navVertToPosi(vert_i);
        if (old_posi_i === new_posi_i) {
            return;
        }
        // special cases
        // check if this is a vert for an edge
        const edges_i = this.modeldata.geom.nav.navVertToEdge(vert_i);
        if (edges_i !== undefined) {
            const num_edges = edges_i.length;
            switch (num_edges) {
                case 1:
                    // we must be at an edge at the start or end of an open wire
                    // console.log("special case 1 edge")
                    const edge_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edges_i[0]);
                    if (edge_posis_i[0] === new_posi_i || edge_posis_i[1] === new_posi_i) {
                        // special case where start or end has new_posi_i
                        if (del_if_invalid) {
                            this.modeldata.geom.del_vert.delVert(vert_i);
                        }
                        return;
                    }
                    // continue to normal case
                    break;
                case 2:
                    // we must be in the middle of a wire
                    const prev_edge_i = edges_i[0];
                    const next_edge_i = edges_i[1];
                    const [a_posi_i, b1_posi_i] = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, prev_edge_i);
                    const [b2_posi_i, c_posi_i] = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, next_edge_i);
                    if (a_posi_i === new_posi_i && c_posi_i === new_posi_i) {
                        // special case where both adjacent edges has new_posi_i
                        // console.log("special case 2 edges, both with new_posi")
                        const [b2_vert_i, c_vert_i] = this.modeldata.geom.nav.navEdgeToVert(next_edge_i);
                        // --- start check ---
                        if (vert_i !== b2_vert_i) {
                            throw new Error('Bad navigation in geometry data structure.');
                        }
                        // -- end check ---
                        if (del_if_invalid) {
                            // we only keep vert 'a'
                            this.modeldata.geom.del_vert.delVert(c_vert_i);
                            this.modeldata.geom.del_vert.delVert(vert_i);
                        }
                        return;
                    }
                    else if (a_posi_i === new_posi_i || c_posi_i === new_posi_i) {
                        // special case where one adjacent edges has new_posi_i
                        // console.log("special case 2 edges, one with new posi")
                        if (del_if_invalid) {
                            this.modeldata.geom.del_vert.delVert(vert_i);
                        }
                        return;
                    }
                    // continue to normal case
                    break;
            }
        }
        // normal case
        // console.log("normal case")
        // set the down array
        this._geom_maps.dn_verts_posis.set(vert_i, new_posi_i);
        // update the up arrays for the old posi, i.e. remove this vert
        (0, arrs_1.arrRem)(this._geom_maps.up_posis_verts.get(old_posi_i), vert_i);
        // update the up arrays for the new posi, i.e. add this vert
        this._geom_maps.up_posis_verts.get(new_posi_i).push(vert_i);
    }
    // public replaceVertPosi(vert_i: number, new_posi_i: number, del_if_invalid: boolean = true): void {
    //     // special case
    //     // check if this is a vert for an edge
    //     const edges_i: number[] = this.modeldata.geom.nav.navVertToEdge(vert_i);
    //     const num_edges: number = edges_i.length;
    //     switch (num_edges) {
    //         case 1:
    //             // we must be at an edge at the start or end of an open wire
    //             const edge_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edges_i[0]);
    //             if (edge_posis_i[0] === new_posi_i || edge_posis_i[1]  === new_posi_i) {
    //                 // special case where start or end has new_posi_i
    //                 if (del_if_invalid) {
    //                     this.modeldata.geom.del_vert.delVert(vert_i);
    //                 }
    //                 return;
    //             }
    //             break;
    //         case 2:
    //             // we must be in the middle of a wire
    //             const prev_edge_i: number = edges_i[0];
    //             const next_edge_i: number = edges_i[1];
    //             const [a_posi_i, b1_posi_i]: [number, number] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, prev_edge_i) as [number, number];
    //             const [b2_posi_i, c_posi_i]: [number, number] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, next_edge_i) as [number, number];
    //             if (a_posi_i === new_posi_i && c_posi_i  === new_posi_i) {
    //                 // special case where both adjacent edges has new_posi_i
    //                 const [b2_vert_i, c_vert_i]: [number, number] =
    //                     this.modeldata.geom.nav.navEdgeToVert(next_edge_i) as [number, number];
    //                 if (vert_i !== b2_vert_i) {
    //                     throw new Error('Bad navigation in geometry data structure.');
    //                 }
    //                 if (del_if_invalid) {
    //                     this.modeldata.geom.del_vert.delVert(c_vert_i);
    //                     this.modeldata.geom.del_vert.delVert(vert_i);
    //                 }
    //                 return;
    //             } else if (a_posi_i === new_posi_i || c_posi_i === new_posi_i) {
    //                 // special case where one adjacent edges has new_posi_i
    //                 if (del_if_invalid) {
    //                     this.modeldata.geom.del_vert.delVert(vert_i);
    //                 }
    //                 return;
    //             }
    //             break;
    //         // default:
    //         //     break;
    //     }
    //     // normal case
    //     const old_posi_i: number = this.modeldata.geom.nav.navVertToPosi(vert_i);
    //     // set the down array
    //     this._geom_maps.dn_verts_posis.set(vert_i, new_posi_i);
    //     // update the up arrays for the old posi, i.e. remove this vert
    //     arrRem(this._geom_maps.up_posis_verts.get(old_posi_i), vert_i);
    //     // update the up arrays for the new posi, i.e. add this vert
    //     this._geom_maps.up_posis_verts.get(new_posi_i).push(vert_i);
    // }
    /**
     * Unweld the vertices on naked edges.
     * \n
     */
    unweldVertsShallow(verts_i) {
        // create a map, for each posi_i, count how many verts there are in the input verts
        const exist_posis_i_map = new Map(); // posi_i -> count
        for (const vert_i of verts_i) {
            const posi_i = this.modeldata.geom.nav.navVertToPosi(vert_i);
            if (!exist_posis_i_map.has(posi_i)) {
                exist_posis_i_map.set(posi_i, 0);
            }
            const vert_count = exist_posis_i_map.get(posi_i);
            exist_posis_i_map.set(posi_i, vert_count + 1);
        }
        // copy positions on the perimeter and make a map
        const old_to_new_posis_i_map = new Map();
        exist_posis_i_map.forEach((vert_count, old_posi_i) => {
            const all_old_verts_i = this.modeldata.geom.nav.navPosiToVert(old_posi_i);
            const all_vert_count = all_old_verts_i.length;
            if (vert_count !== all_vert_count) {
                if (!old_to_new_posis_i_map.has(old_posi_i)) {
                    const new_posi_i = this.modeldata.geom.add.copyPosis(old_posi_i, true);
                    old_to_new_posis_i_map.set(old_posi_i, new_posi_i);
                }
            }
        });
        // now go through the geom again and rewire to the new posis
        for (const vert_i of verts_i) {
            const old_posi_i = this.modeldata.geom.nav.navVertToPosi(vert_i);
            if (old_to_new_posis_i_map.has(old_posi_i)) {
                const new_posi_i = old_to_new_posis_i_map.get(old_posi_i);
                // update the down arrays
                this._geom_maps.dn_verts_posis.set(vert_i, new_posi_i);
                // update the up arrays for the old posi, i.e. remove this vert
                (0, arrs_1.arrRem)(this._geom_maps.up_posis_verts.get(old_posi_i), vert_i);
                // update the up arrays for the new posi, i.e. add this vert
                this._geom_maps.up_posis_verts.get(new_posi_i).push(vert_i);
            }
        }
        // return all the new positions
        return Array.from(old_to_new_posis_i_map.values());
    }
    /**
     * Unweld all vertices by cloning the positions that are shared.
     * \n
     * Attributes on the positions are copied.
     * \n
     * @param verts_i
     */
    cloneVertPositions(verts_i) {
        const new_posis_i = [];
        for (const vert_i of verts_i) {
            const exist_posi_i = this.modeldata.geom.nav.navVertToPosi(vert_i);
            const all_verts_i = this.modeldata.geom.nav.navPosiToVert(exist_posi_i);
            const all_verts_count = all_verts_i.length;
            if (all_verts_count > 1) {
                const new_posi_i = this.modeldata.geom.add.copyPosis(exist_posi_i, true);
                // update the down arrays
                this._geom_maps.dn_verts_posis.set(vert_i, new_posi_i);
                // update the up arrays for the old posi, i.e. remove this vert
                (0, arrs_1.arrRem)(this._geom_maps.up_posis_verts.get(exist_posi_i), vert_i);
                // update the up arrays for the new posi, i.e. add this vert
                this._geom_maps.up_posis_verts.get(new_posi_i).push(vert_i);
                // add the new posi_i to the list, to be returned later
                new_posis_i.push(new_posi_i);
            }
        }
        // return all the new positions
        return new_posis_i;
    }
    /**
     * Weld all vertices by merging the positions that are equal, so that they become shared.
     * \n
     * The old positions are deleted if unused. Attributes on those positions are discarded.
     * \n
     * @param verts_i
     */
    mergeVertPositions(verts_i) {
        const ssid = this.modeldata.active_ssid;
        // get a list of unique posis to merge
        // at the same time, make a sparse array vert_i -> posi_i
        const map_posis_to_merge_i = new Map();
        const vert_i_to_posi_i = []; // sparese array
        for (const vert_i of verts_i) {
            const exist_posi_i = this.modeldata.geom.nav.navVertToPosi(vert_i);
            vert_i_to_posi_i[vert_i] = exist_posi_i;
            if (!map_posis_to_merge_i.has(exist_posi_i)) {
                map_posis_to_merge_i.set(exist_posi_i, []);
            }
            map_posis_to_merge_i.get(exist_posi_i).push(vert_i);
        }
        // calculate the new xyz
        // at the same time make a list of posis to del
        const posis_to_del_i = [];
        const new_xyz = [0, 0, 0];
        for (const [exist_posi_i, merge_verts_i] of Array.from(map_posis_to_merge_i)) {
            const posi_xyz = this.modeldata.attribs.posis.getPosiCoords(exist_posi_i);
            new_xyz[0] += posi_xyz[0];
            new_xyz[1] += posi_xyz[1];
            new_xyz[2] += posi_xyz[2];
            const all_verts_i = this.modeldata.geom.nav.navPosiToVert(exist_posi_i);
            const all_verts_count = all_verts_i.length;
            if (all_verts_count === merge_verts_i.length) {
                posis_to_del_i.push(exist_posi_i);
            }
        }
        // make the new posi
        const num_posis = map_posis_to_merge_i.size;
        new_xyz[0] = new_xyz[0] / num_posis;
        new_xyz[1] = new_xyz[1] / num_posis;
        new_xyz[2] = new_xyz[2] / num_posis;
        const new_posi_i = this.modeldata.geom.add.addPosi();
        this.modeldata.attribs.posis.setPosiCoords(new_posi_i, new_xyz);
        // replace the verts posi
        for (const vert_i of verts_i) {
            // update the down arrays
            this._geom_maps.dn_verts_posis.set(vert_i, new_posi_i);
            // update the up arrays for the old posi, i.e. remove this vert
            (0, arrs_1.arrRem)(this._geom_maps.up_posis_verts.get(vert_i_to_posi_i[vert_i]), vert_i);
            // update the up arrays for the new posi, i.e. add this vert
            this._geom_maps.up_posis_verts.get(new_posi_i).push(vert_i);
        }
        // del the posis that are no longer used, i.e. have zero verts
        this.modeldata.geom.snapshot.delPosis(ssid, posis_to_del_i);
        // return all the new positions
        return new_posi_i;
    }
    /**
     * Reverse the edges of a wire.
     * This lists the edges in reverse order, and flips each edge.
     * \n
     * The attributes will not be affected. So the order of edge attribtes will also become reversed.
     *
     * TODO
     * This does not reverse the order of the edges.
     * The method, getWireVertices() in GeomQuery returns the correct vertices.
     * However, you need to be careful with edge order.
     * The next edge after edge 0 may not be edge 1.
     * If reversed it will instead be the last edge.
     */
    reverse(wire_i) {
        const wire = this._geom_maps.dn_wires_edges.get(wire_i);
        wire.reverse();
        // reverse the edges
        for (const edge_i of wire) {
            const edge = this._geom_maps.dn_edges_verts.get(edge_i);
            edge.reverse();
            // the verts pointing up to edges also need to be reversed
            const edges_i = this._geom_maps.up_verts_edges.get(edge[0]);
            edges_i.reverse();
        }
        // if this is the first wire in a face, reverse the triangles
        const pgon_i = this._geom_maps.up_wires_pgons.get(wire_i);
        if (pgon_i !== undefined) {
            const pgon = this._geom_maps.dn_pgons_wires.get(pgon_i);
            const pgon_tris = this._geom_maps.dn_pgons_tris.get(pgon_i);
            if (pgon[0] === wire_i) {
                for (const tri_i of pgon_tris) {
                    const tri = this._geom_maps.dn_tris_verts.get(tri_i);
                    tri.reverse();
                }
            }
        }
    }
    /**
     * Shifts the edges of a wire.
     * \n
     * The attributes will not be affected. For example, lets say a polygon has three edges
     * e1, e2, e3, with attribute values 5, 6, 7
     * If teh edges are shifted by 1, the edges will now be
     * e2, e3, e1, withh attribute values 6, 7, 5
     */
    shift(wire_i, offset) {
        const wire = this._geom_maps.dn_wires_edges.get(wire_i);
        wire.unshift.apply(wire, wire.splice(offset, wire.length));
    }
}
exports.GIGeomEditTopo = GIGeomEditTopo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tRWRpdFRvcG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWJzL2dlby1pbmZvL2dlb20vR0lHZW9tRWRpdFRvcG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0NBQTJGO0FBQzNGLDBDQUF5QztBQUd6Qzs7R0FFRztBQUNILE1BQWEsY0FBYztJQUd2Qjs7T0FFRztJQUNILFlBQVksU0FBc0IsRUFBRSxTQUFvQjtRQUNwRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsK0VBQStFO0lBQy9FLGtCQUFrQjtJQUNsQiwrRUFBK0U7SUFDL0U7Ozs7Ozs7T0FPRztJQUNJLGtCQUFrQixDQUFDLE1BQWMsRUFBRSxNQUFjO1FBQ3BELE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckUsTUFBTSxJQUFJLEdBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9ELE1BQU0sZ0JBQWdCLEdBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNFLE1BQU0sbUJBQW1CLEdBQWEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUYsTUFBTSxtQkFBbUIsR0FBYSxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RixrQkFBa0I7UUFDbEIsSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xDLElB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