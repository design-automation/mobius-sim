import { EEntType } from '../common';
import { arrRem } from '../../util/arrs';
/**
 * Class for geometry.
 */
export class GIGeomEditTopo {
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
        const edge_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
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
            arrRem(this._geom_maps.up_posis_verts.get(old_posi_i), vert_i);
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
                    const edge_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edges_i[0]);
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
                    const [a_posi_i, b1_posi_i] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, prev_edge_i);
                    const [b2_posi_i, c_posi_i] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, next_edge_i);
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
        arrRem(this._geom_maps.up_posis_verts.get(old_posi_i), vert_i);
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
                arrRem(this._geom_maps.up_posis_verts.get(old_posi_i), vert_i);
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
                arrRem(this._geom_maps.up_posis_verts.get(exist_posi_i), vert_i);
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
            arrRem(this._geom_maps.up_posis_verts.get(vert_i_to_posi_i[vert_i]), vert_i);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tRWRpdFRvcG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWJzL2dlby1pbmZvL2dlb20vR0lHZW9tRWRpdFRvcG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBd0QsTUFBTSxXQUFXLENBQUM7QUFDM0YsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR3pDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGNBQWM7SUFHdkI7O09BRUc7SUFDSCxZQUFZLFNBQXNCLEVBQUUsU0FBb0I7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUNELCtFQUErRTtJQUMvRSxrQkFBa0I7SUFDbEIsK0VBQStFO0lBQy9FOzs7Ozs7O09BT0c7SUFDSSxrQkFBa0IsQ0FBQyxNQUFjLEVBQUUsTUFBYztRQUNwRCxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sSUFBSSxHQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvRCxNQUFNLGdCQUFnQixHQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzRSxNQUFNLG1CQUFtQixHQUFhLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlGLE1BQU0sbUJBQW1CLEdBQWEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUYsa0JBQWtCO1FBQ2xCLElBQUksbUJBQW1CLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNsQyxJQUFJLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sRUFBRTtnQkFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO2FBQy9DO1NBQ0o7UUFDRCx5Q0FBeUM7UUFDekMsSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xDLElBQUksbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxFQUFFO2dCQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7YUFDL0M7WUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDckY7YUFBTTtZQUNILElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUMvRDtRQUNELHlDQUF5QztRQUN6QyxNQUFNLFVBQVUsR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sVUFBVSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0YseUJBQXlCO1FBQ3pCLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN6RCwwQ0FBMEM7UUFDMUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2RCxzQkFBc0I7UUFDdEIsT0FBTyxVQUFVLENBQUM7SUFDdEIsQ0FBQztJQUNMOzs7Ozs7O1dBT087SUFDSSxtQkFBbUIsQ0FBQyxNQUFjLEVBQUUsT0FBaUI7UUFDeEQsaURBQWlEO1FBQ2pELElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDcEIsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUMxQztRQUNELG1GQUFtRjtRQUNuRixNQUFNLFlBQVksR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUcsTUFBTSxDQUFDLENBQUM7UUFDNUYsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2hDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDakQsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDbEQ7UUFDRCwyQ0FBMkM7UUFDM0MsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUFFLE9BQU8sRUFBRSxDQUFDO1NBQUU7UUFDeEMsMEJBQTBCO1FBQzFCLE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckUsTUFBTSxJQUFJLEdBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9ELE1BQU0sVUFBVSxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RSxNQUFNLFdBQVcsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUseUNBQXlDO1FBQ3pDLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQjtTQUN2RjthQUFNO1lBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLHdCQUF3QjtTQUMvRTtRQUNELDBCQUEwQjtRQUMxQixNQUFNLFdBQVcsR0FBYyxFQUFFLENBQUM7UUFDbEMsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDMUIsTUFBTSxVQUFVLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0RSxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ2hDO1FBQ0QsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3Qiw2Q0FBNkM7UUFDN0MsaUZBQWlGO1FBQ2pGLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDN0QsdUJBQXVCO1FBQ3ZCLE1BQU0sV0FBVyxHQUFhLEVBQUUsQ0FBQztRQUNqQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDN0MsTUFBTSxVQUFVLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hHLDBDQUEwQztZQUMxQyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZELGtCQUFrQjtZQUNsQixXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ2hDO1FBQ0Qsc0NBQXNDO1FBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsV0FBVyxDQUFDLENBQUM7UUFDekQsc0JBQXNCO1FBQ3RCLE9BQU8sV0FBVyxDQUFDO0lBQ3ZCLENBQUM7SUFDRDs7O09BR0c7SUFDSSxZQUFZLENBQUMsUUFBa0IsRUFBRSxLQUFhLEVBQUUsV0FBcUI7UUFDeEUsTUFBTSxXQUFXLEdBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEYsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLFdBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDM0MsTUFBTSxJQUFJLEtBQUssQ0FBQyw0RUFBNEUsQ0FBQyxDQUFDO1NBQ2pHO1FBQ0QsTUFBTSxlQUFlLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxzQkFBc0I7UUFDOUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDekMsTUFBTSxVQUFVLEdBQVcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkM7UUFDRCxNQUFNLE9BQU8sR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNoRixLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtZQUMxQixNQUFNLFVBQVUsR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sQ0FBQyxHQUFXLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5QyxNQUFNLFVBQVUsR0FBVyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUMscUJBQXFCO1lBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDdkQsK0RBQStEO1lBQy9ELE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDL0QsNERBQTREO1lBQzVELElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDL0Q7SUFDTCxDQUFDO0lBQ0Q7Ozs7Ozs7T0FPRztJQUNJLGVBQWUsQ0FBQyxNQUFjLEVBQUUsVUFBa0IsRUFBRSxpQkFBMEIsSUFBSTtRQUNyRixpREFBaUQ7UUFDakQsTUFBTSxVQUFVLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RSxJQUFJLFVBQVUsS0FBSyxVQUFVLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFDMUMsZ0JBQWdCO1FBQ2hCLHNDQUFzQztRQUN0QyxNQUFNLE9BQU8sR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hFLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUN2QixNQUFNLFNBQVMsR0FBVyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ3pDLFFBQVEsU0FBUyxFQUFFO2dCQUNmLEtBQUssQ0FBQztvQkFDRiw0REFBNEQ7b0JBQzVELHFDQUFxQztvQkFDckMsTUFBTSxZQUFZLEdBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvRixJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxVQUFVLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLFVBQVUsRUFBRTt3QkFDbEUsaURBQWlEO3dCQUNqRCxJQUFJLGNBQWMsRUFBRTs0QkFDaEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzt5QkFDaEQ7d0JBQ0QsT0FBTztxQkFDVjtvQkFDRCwwQkFBMEI7b0JBQzFCLE1BQU07Z0JBQ1YsS0FBSyxDQUFDO29CQUNGLHFDQUFxQztvQkFDckMsTUFBTSxXQUFXLEdBQVcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxNQUFNLFdBQVcsR0FBVyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLEdBQXFCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxXQUFXLENBQXFCLENBQUM7b0JBQ3JJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLEdBQXFCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxXQUFXLENBQXFCLENBQUM7b0JBQ3JJLElBQUksUUFBUSxLQUFLLFVBQVUsSUFBSSxRQUFRLEtBQUssVUFBVSxFQUFFO3dCQUNwRCx3REFBd0Q7d0JBQ3hELDBEQUEwRDt3QkFDMUQsTUFBTSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsR0FDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQXFCLENBQUM7d0JBQzNFLHNCQUFzQjt3QkFDdEIsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFOzRCQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7eUJBQ2pFO3dCQUNELG1CQUFtQjt3QkFDbkIsSUFBSSxjQUFjLEVBQUU7NEJBQ2hCLHdCQUF3Qjs0QkFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs0QkFDL0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzt5QkFDaEQ7d0JBQ0QsT0FBTztxQkFDVjt5QkFBTSxJQUFJLFFBQVEsS0FBSyxVQUFVLElBQUksUUFBUSxLQUFLLFVBQVUsRUFBRTt3QkFDM0QsdURBQXVEO3dCQUN2RCx5REFBeUQ7d0JBQ3pELElBQUksY0FBYyxFQUFFOzRCQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3lCQUNoRDt3QkFDRCxPQUFPO3FCQUNWO29CQUNELDBCQUEwQjtvQkFDMUIsTUFBTTthQUNiO1NBQ0o7UUFFRCxjQUFjO1FBQ2QsNkJBQTZCO1FBQzdCLHFCQUFxQjtRQUNyQixJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZELCtEQUErRDtRQUMvRCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQy9ELDREQUE0RDtRQUM1RCxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFDRCxxR0FBcUc7SUFDckcsc0JBQXNCO0lBQ3RCLDZDQUE2QztJQUM3QywrRUFBK0U7SUFDL0UsZ0RBQWdEO0lBQ2hELDJCQUEyQjtJQUMzQixrQkFBa0I7SUFDbEIsMkVBQTJFO0lBQzNFLDhHQUE4RztJQUM5Ryx1RkFBdUY7SUFDdkYsb0VBQW9FO0lBQ3BFLHdDQUF3QztJQUN4QyxvRUFBb0U7SUFDcEUsb0JBQW9CO0lBQ3BCLDBCQUEwQjtJQUMxQixnQkFBZ0I7SUFDaEIscUJBQXFCO0lBQ3JCLGtCQUFrQjtJQUNsQixvREFBb0Q7SUFDcEQsc0RBQXNEO0lBQ3RELHNEQUFzRDtJQUN0RCxvSkFBb0o7SUFDcEosb0pBQW9KO0lBQ3BKLHlFQUF5RTtJQUN6RSwyRUFBMkU7SUFDM0Usa0VBQWtFO0lBQ2xFLDhGQUE4RjtJQUM5Riw4Q0FBOEM7SUFDOUMscUZBQXFGO0lBQ3JGLG9CQUFvQjtJQUNwQix3Q0FBd0M7SUFDeEMsc0VBQXNFO0lBQ3RFLG9FQUFvRTtJQUNwRSxvQkFBb0I7SUFDcEIsMEJBQTBCO0lBQzFCLCtFQUErRTtJQUMvRSwwRUFBMEU7SUFDMUUsd0NBQXdDO0lBQ3hDLG9FQUFvRTtJQUNwRSxvQkFBb0I7SUFDcEIsMEJBQTBCO0lBQzFCLGdCQUFnQjtJQUNoQixxQkFBcUI7SUFDckIsc0JBQXNCO0lBQ3RCLHdCQUF3QjtJQUN4QixRQUFRO0lBRVIscUJBQXFCO0lBQ3JCLGdGQUFnRjtJQUNoRiw0QkFBNEI7SUFDNUIsOERBQThEO0lBQzlELHNFQUFzRTtJQUN0RSxzRUFBc0U7SUFDdEUsbUVBQW1FO0lBQ25FLG1FQUFtRTtJQUNuRSxJQUFJO0lBQ0o7OztPQUdHO0lBQ0ksa0JBQWtCLENBQUMsT0FBaUI7UUFDdkMsbUZBQW1GO1FBQ25GLE1BQU0saUJBQWlCLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxrQkFBa0I7UUFDNUUsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDMUIsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNyRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNoQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3BDO1lBQ0QsTUFBTSxVQUFVLEdBQVcsaUJBQWlCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pELGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ2pEO1FBQ0QsaURBQWlEO1FBQ2pELE1BQU0sc0JBQXNCLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDOUQsaUJBQWlCLENBQUMsT0FBTyxDQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFO1lBQ2xELE1BQU0sZUFBZSxHQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDcEYsTUFBTSxjQUFjLEdBQVcsZUFBZSxDQUFDLE1BQU0sQ0FBQztZQUN0RCxJQUFJLFVBQVUsS0FBSyxjQUFjLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQ3pDLE1BQU0sVUFBVSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBVyxDQUFDO29CQUN6RixzQkFBc0IsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2lCQUN0RDthQUNKO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCw0REFBNEQ7UUFDNUQsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDMUIsTUFBTSxVQUFVLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN6RSxJQUFJLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDeEMsTUFBTSxVQUFVLEdBQVcsc0JBQXNCLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNsRSx5QkFBeUI7Z0JBQ3pCLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ3ZELCtEQUErRDtnQkFDL0QsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDL0QsNERBQTREO2dCQUM1RCxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQy9EO1NBQ0o7UUFDRCwrQkFBK0I7UUFDL0IsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUNEOzs7Ozs7T0FNRztJQUNJLGtCQUFrQixDQUFDLE9BQWlCO1FBQ3ZDLE1BQU0sV0FBVyxHQUFhLEVBQUUsQ0FBQztRQUNqQyxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtZQUMxQixNQUFNLFlBQVksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzNFLE1BQU0sV0FBVyxHQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDbEYsTUFBTSxlQUFlLEdBQVcsV0FBVyxDQUFDLE1BQU0sQ0FBQztZQUNuRCxJQUFJLGVBQWUsR0FBRyxDQUFDLEVBQUU7Z0JBQ3JCLE1BQU0sVUFBVSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBVyxDQUFDO2dCQUMzRix5QkFBeUI7Z0JBQ3pCLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ3ZELCtEQUErRDtnQkFDL0QsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDakUsNERBQTREO2dCQUM1RCxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM1RCx1REFBdUQ7Z0JBQ3ZELFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDaEM7U0FDSjtRQUNELCtCQUErQjtRQUMvQixPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0lBQ0Q7Ozs7OztPQU1HO0lBQ0ksa0JBQWtCLENBQUMsT0FBaUI7UUFDdkMsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDaEQsc0NBQXNDO1FBQ3RDLHlEQUF5RDtRQUN6RCxNQUFNLG9CQUFvQixHQUEwQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQzlELE1BQU0sZ0JBQWdCLEdBQWEsRUFBRSxDQUFDLENBQUMsZ0JBQWdCO1FBQ3ZELEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO1lBQzFCLE1BQU0sWUFBWSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDM0UsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEdBQUcsWUFBWSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQ3pDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDOUM7WUFDRCxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3ZEO1FBQ0Qsd0JBQXdCO1FBQ3hCLCtDQUErQztRQUMvQyxNQUFNLGNBQWMsR0FBYSxFQUFFLENBQUM7UUFDcEMsTUFBTSxPQUFPLEdBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLEtBQUssTUFBTSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEVBQUU7WUFDMUUsTUFBTSxRQUFRLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNoRixPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixNQUFNLFdBQVcsR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2xGLE1BQU0sZUFBZSxHQUFXLFdBQVcsQ0FBQyxNQUFNLENBQUM7WUFDbkQsSUFBSSxlQUFlLEtBQUssYUFBYSxDQUFDLE1BQU0sRUFBRTtnQkFDMUMsY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNyQztTQUNKO1FBQ0Qsb0JBQW9CO1FBQ3BCLE1BQU0sU0FBUyxHQUFXLG9CQUFvQixDQUFDLElBQUksQ0FBQztRQUNwRCxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztRQUNwQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztRQUNwQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztRQUNwQyxNQUFNLFVBQVUsR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFZLENBQUM7UUFDdkUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEUseUJBQXlCO1FBQ3pCLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO1lBQzFCLHlCQUF5QjtZQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3ZELCtEQUErRDtZQUMvRCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDN0UsNERBQTREO1lBQzVELElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDL0Q7UUFDRCw4REFBOEQ7UUFDOUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDNUQsK0JBQStCO1FBQy9CLE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7SUFDRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDSSxPQUFPLENBQUMsTUFBYztRQUN6QixNQUFNLElBQUksR0FBVSxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2Ysb0JBQW9CO1FBQ3BCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxHQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDZiwwREFBMEQ7WUFDMUQsTUFBTSxPQUFPLEdBQWEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNyQjtRQUNELDZEQUE2RDtRQUM3RCxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEUsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ3RCLE1BQU0sSUFBSSxHQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvRCxNQUFNLFNBQVMsR0FBYSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxFQUFFO2dCQUNwQixLQUFLLE1BQU0sS0FBSyxJQUFJLFNBQVMsRUFBRTtvQkFDM0IsTUFBTSxHQUFHLEdBQVMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMzRCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7aUJBQ2pCO2FBQ0o7U0FDSjtJQUNMLENBQUM7SUFDRDs7Ozs7OztPQU9HO0lBQ0ksS0FBSyxDQUFDLE1BQWMsRUFBRSxNQUFjO1FBQ3ZDLE1BQU0sSUFBSSxHQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBRSxDQUFFLENBQUM7SUFDbkUsQ0FBQztDQUVKIn0=