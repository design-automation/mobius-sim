/**
 * Class for modifying plines.
 */
export class GIGeomEditPline {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tRWRpdFBsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGlicy9nZW8taW5mby9nZW9tL0dJR2VvbUVkaXRQbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQTs7R0FFRztBQUNILE1BQU0sT0FBTyxlQUFlO0lBR3hCOztPQUVHO0lBQ0gsWUFBWSxTQUFzQixFQUFFLFNBQW9CO1FBQ3BELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQ2hDLENBQUM7SUFDRDs7Ozs7T0FLRztJQUNJLFVBQVUsQ0FBQyxPQUFlO1FBQzdCLE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkUsbUNBQW1DO1FBQ25DLE1BQU0sSUFBSSxHQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvRCxNQUFNLFNBQVMsR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3RDLE1BQU0sWUFBWSxHQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLFVBQVUsR0FBVyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sWUFBWSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEYsTUFBTSxVQUFVLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRixJQUFJLFlBQVksS0FBSyxVQUFVLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFDNUMs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