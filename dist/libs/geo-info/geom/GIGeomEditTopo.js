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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tRWRpdFRvcG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9nZW9tL0dJR2VvbUVkaXRUb3BvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUEyRjtBQUMzRiwwQ0FBeUM7QUFHekM7O0dBRUc7QUFDSCxNQUFhLGNBQWM7SUFHdkI7O09BRUc7SUFDSCxZQUFZLFNBQXNCLEVBQUUsU0FBb0I7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUNELCtFQUErRTtJQUMvRSxrQkFBa0I7SUFDbEIsK0VBQStFO0lBQy9FOzs7Ozs7O09BT0c7SUFDSSxrQkFBa0IsQ0FBQyxNQUFjLEVBQUUsTUFBYztRQUNwRCxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sSUFBSSxHQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvRCxNQUFNLGdCQUFnQixHQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzRSxNQUFNLG1CQUFtQixHQUFhLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlGLE1BQU0sbUJBQW1CLEdBQWEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUYsa0JBQWtCO1FBQ2xCLElBQUksbUJBQW1CLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNs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