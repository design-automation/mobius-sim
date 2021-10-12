"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIGeomEditPline = void 0;
/**
 * Class for modifying plines.
 */
class GIGeomEditPline {
    /**
     * Constructor
     */
    constructor(modeldata, geom_maps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    /**
     * Close a polyline.
     * \n
     * If the pline is already closed, do nothing.
     * \n
     */
    closePline(pline_i) {
        const wire_i = this.modeldata.geom.nav.navPlineToWire(pline_i);
        // get the wire start and end verts
        const wire = this._geom_maps.dn_wires_edges.get(wire_i);
        const num_edges = wire.length;
        const start_edge_i = wire[0];
        const end_edge_i = wire[num_edges - 1];
        const start_vert_i = this.modeldata.geom.nav.navEdgeToVert(start_edge_i)[0];
        const end_vert_i = this.modeldata.geom.nav.navEdgeToVert(end_edge_i)[1];
        if (start_vert_i === end_vert_i) {
            return;
        }
        // add the edge to the model
        const new_edge_i = this.modeldata.geom.add._addEdge(end_vert_i, start_vert_i);
        // update the down arrays
        this._geom_maps.dn_wires_edges.get(wire_i).push(new_edge_i);
        // update the up arrays
        this._geom_maps.up_edges_wires.set(new_edge_i, wire_i);
        // return the new edge
        return new_edge_i;
    }
    /**
     * Open a wire, by deleting the last edge.
     * \n
     * If the wire is already open, do nothing.
     * \n
     * If the wire does not belong to a pline, then do nothing.
     * @param wire_i The wire to close.
     */
    openPline(pline_i) {
        const wire_i = this.modeldata.geom.nav.navPlineToWire(pline_i);
        // get the wire start and end verts
        const wire = this._geom_maps.dn_wires_edges.get(wire_i);
        // check wire has more than two edges
        const num_edges = wire.length;
        if (num_edges < 3) {
            return;
        }
        // get start and end
        const start_edge_i = wire[0];
        const end_edge_i = wire[num_edges - 1];
        const start_vert_i = this.modeldata.geom.nav.navEdgeToVert(start_edge_i)[0];
        const end_vert_i = this.modeldata.geom.nav.navEdgeToVert(end_edge_i)[1];
        // if this wire is not closed, then return
        if (start_vert_i !== end_vert_i) {
            return;
        }
        // del the end edge from the pline
        throw new Error('Not implemented');
    }
    /**
     *
     * @param pline_i
     * @param posi_i
     * @param to_end
     */
    appendVertToOpenPline(pline_i, posi_i, to_end) {
        const wire_i = this.modeldata.geom.nav.navPlineToWire(pline_i);
        // get the wire start and end verts
        const wire = this._geom_maps.dn_wires_edges.get(wire_i);
        if (to_end) {
            const end_edge_i = wire[wire.length - 1];
            const end_vert_i = this.modeldata.geom.nav.navEdgeToVert(end_edge_i)[1];
            // create one new vertex and one new edge
            const new_vert_i = this.modeldata.geom.add._addVertex(posi_i);
            const new_edge_i = this.modeldata.geom.add._addEdge(end_vert_i, new_vert_i);
            // update the down arrays
            wire.push(new_edge_i);
            // update the up arrays for edges to wires
            this._geom_maps.up_edges_wires.set(new_edge_i, wire_i);
            // return the new edge
            return new_edge_i;
        }
        else {
            const start_edge_i = wire[0];
            const start_vert_i = this.modeldata.geom.nav.navEdgeToVert(start_edge_i)[0];
            // create one new vertex and one new edge
            const new_vert_i = this.modeldata.geom.add._addVertex(posi_i);
            const new_edge_i = this.modeldata.geom.add._addEdge(new_vert_i, start_vert_i);
            // update the down arrays
            wire.splice(0, 0, new_edge_i);
            // update the up arrays for edges to wires
            this._geom_maps.up_edges_wires.set(new_edge_i, wire_i);
            // return the new edge
            return new_edge_i;
        }
    }
}
exports.GIGeomEditPline = GIGeomEditPline;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tRWRpdFBsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vZ2VvbS9HSUdlb21FZGl0UGxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0E7O0dBRUc7QUFDSCxNQUFhLGVBQWU7SUFHeEI7O09BRUc7SUFDSCxZQUFZLFNBQXNCLEVBQUUsU0FBb0I7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUNEOzs7OztPQUtHO0lBQ0ksVUFBVSxDQUFDLE9BQWU7UUFDN0IsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2RSxtQ0FBbUM7UUFDbkMsTUFBTSxJQUFJLEdBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9ELE1BQU0sU0FBUyxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdEMsTUFBTSxZQUFZLEdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sVUFBVSxHQUFXLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0MsTUFBTSxZQUFZLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRixNQUFNLFVBQVUsR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hGLElBQUksWUFBWSxLQUFLLFVBQVUsRUFBRTtZQUFFLE9BQU87U0FBRTtR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