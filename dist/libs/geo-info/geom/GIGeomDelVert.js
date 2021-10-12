"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIGeomDelVert = void 0;
const common_1 = require("../common");
const arrs_1 = require("../../util/arrs");
/**
 * Class for deleting geometry.
 */
class GIGeomDelVert {
    /**
     * Constructor
     */
    constructor(modeldata, geom_maps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    /**
     * Deletes a vert.
     *
     * In the general case, the two edges adjacent to the deleted vert will be merged.
     * This means that the next edge will be deleted.
     * The end vert of the previous edge will connect to the end posi of the next edge.
     *
     * The first special case is if the vert is for a point. In that case, just delete the point.
     *
     * Then there are two special cases for whicj we delete the whole object
     *
     * 1) If the wire is open and has only 1 edge, then delete the wire
     * 2) if the wire is closed pgon and has only 3 edges, then:
     *    a) If the wire is the boundary of the pgon, then delete the whole pgon
     *    b) If the wire is a hole in the pgon, then delete the hole
     *
     * Assuming the special cases above do not apply,
     * then there are two more special cases for open wires
     *
     * 1) If the vert is at the start of an open wire, then delete the first edge
     * 2) If teh vert is at the end of an open wire, then delete the last edge
     *
     * Finally, we come to the standard case.
     * The next edge is deleted, and the prev edge gets rewired.
     *
     * Call by GIGeomEditTopo.replaceVertPosi()
     *
     * Checks time stamps.
     * @param vert_i
     */
    delVert(vert_i) {
        const ssid = this.modeldata.active_ssid;
        // pgon
        if (this.modeldata.geom._geom_maps.up_verts_tris.has(vert_i)) {
            const pgon_i = this.modeldata.geom.nav.navAnyToPgon(common_1.EEntType.VERT, vert_i)[0];
            this.delPgonVerts(pgon_i, [vert_i]);
            return;
        }
        // point
        if (this.modeldata.geom._geom_maps.up_verts_points.has(vert_i)) {
            const point_i = this.modeldata.geom._geom_maps.up_verts_points.get(vert_i);
            this.modeldata.geom.snapshot.delPoints(ssid, point_i);
            return;
        }
        // pline
        const pline_i = this.modeldata.geom.nav.navAnyToPline(common_1.EEntType.VERT, vert_i)[0];
        this.delPlineVerts(pline_i, [vert_i]);
        return;
    }
    /**
     * Deletes multiple verts in a pline.
     *
     * Checks time stamps.
     */
    delPlineVerts(pline_i, verts_i) {
        const ssid = this.modeldata.active_ssid;
        // get the posis, edges, and wires, and other info
        const wire_i = this._geom_maps.dn_plines_wires.get(pline_i);
        const wire_edges_i = this._geom_maps.dn_wires_edges.get(wire_i);
        const wire_verts_i = this.modeldata.geom.query.getWireVerts(wire_i);
        const wire_is_closed = this.modeldata.geom.query.isWireClosed(wire_i);
        const num_verts = wire_verts_i.length;
        // do we have to delete the whole pline?
        if (num_verts - verts_i.length < 2) {
            const pline_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.WIRE, wire_i);
            this.modeldata.geom.snapshot.delPlines(ssid, pline_i);
            this.modeldata.geom.snapshot.delUnusedPosis(ssid, pline_posis_i);
        }
        // check the object time stamp
        this.modeldata.getObjsCheckTs(common_1.EEntType.PLINE, pline_i);
        // delete the verts
        for (const vert_i of verts_i) {
            // check, has it already been deleted
            if (!this._geom_maps.dn_verts_posis.has(vert_i)) {
                return;
            }
            // get the index of this vert
            const index_vert_i = wire_verts_i.indexOf(vert_i);
            // update the edges and wires
            if (!wire_is_closed && num_verts === 2) {
                // special case, open pline with 2 verts
                this.__delVert__OpenPline1Edge(wire_i);
            }
            else if (!wire_is_closed && index_vert_i === 0) {
                // special case, open pline, delete start edge and vert
                this.__delVert__OpenPlineStart(wire_edges_i, wire_verts_i, vert_i);
            }
            else if (!wire_is_closed && index_vert_i === num_verts - 1) {
                // special case, open pline, delete end edge and vert
                this.__delVert__OpenPlineEnd(wire_edges_i, wire_verts_i, vert_i);
            }
            else {
                // standard case, delete the prev edge and reqire the next edge
                this.__delVert__StandardCase(wire_edges_i, vert_i);
            }
        }
    }
    /**
     * Deletes multiple verts in a pline.
     *
     * Checks time stamps.
     */
    delPgonVerts(pgon_i, verts_i) {
        const ssid = this.modeldata.active_ssid;
        // get the pwires, and total num verts in whole pgon
        const wires_i = this._geom_maps.dn_pgons_wires.get(pgon_i);
        const num_verts = this.modeldata.geom.nav.navAnyToVert(common_1.EEntType.PGON, pgon_i).length;
        // do we have to delete the whole pgon?
        if (num_verts - verts_i.length < 3) {
            const pgon_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.PGON, pgon_i);
            this.modeldata.geom.snapshot.delPgons(ssid, pgon_i);
            this.modeldata.geom.snapshot.delUnusedPosis(ssid, pgon_posis_i);
        }
        // check the object time stamp
        this.modeldata.getObjsCheckTs(common_1.EEntType.PGON, pgon_i);
        // delete the verts
        for (const vert_i of verts_i) {
            const wire_i = this.modeldata.geom.nav.navAnyToWire(common_1.EEntType.VERT, vert_i)[0];
            const wire_edges_i = this._geom_maps.dn_wires_edges.get(wire_i);
            // update the edges and wires
            if (num_verts === 3) {
                const index_face_wire = wires_i.indexOf(wire_i);
                // special case, pgon with three verts
                if (index_face_wire === 0) {
                    // special case, pgon boundary with verts, delete the pgon
                    this.__delVert__PgonBoundaryWire3Edge(pgon_i);
                }
                else {
                    // special case, pgon hole with verts, delete the hole
                    this.__delVert__PgonHoleWire3Edge(pgon_i, wire_i);
                }
            }
            else {
                // standard case, delete the prev edge and reqire the next edge
                this.__delVert__StandardCase(wire_edges_i, vert_i);
                // for pgons, also update tris
            }
        }
        this.modeldata.geom.edit_pgon.triPgons(pgon_i);
    }
    /**
     * Special case, delete the pline
     * @param wire_i
     */
    __delVert__OpenPline1Edge(wire_i) {
        const ssid = this.modeldata.active_ssid;
        const pline_i = this._geom_maps.up_wires_plines.get(wire_i);
        this.modeldata.geom.snapshot.delPlines(ssid, pline_i);
    }
    /**
     * Special case, delete the first edge
     * @param vert_i
     */
    __delVert__OpenPlineStart(wire_edges_i, wire_verts_i, vert_i) {
        const posi_i = this._geom_maps.dn_verts_posis.get(vert_i);
        // vert_i is at the star of an open wire, we have one edge
        const start_edge_i = wire_edges_i[0];
        // delete the first edge
        this._geom_maps.dn_edges_verts.delete(start_edge_i);
        this._geom_maps.up_edges_wires.delete(start_edge_i);
        this.modeldata.attribs.del.delEnt(common_1.EEntType.EDGE, start_edge_i);
        // update the second vert
        const second_vert_i = wire_verts_i[1];
        (0, arrs_1.arrRem)(this._geom_maps.up_verts_edges.get(second_vert_i), start_edge_i);
        // update the wire
        (0, arrs_1.arrRem)(wire_edges_i, start_edge_i);
        // delete the vert
        this._geom_maps.dn_verts_posis.delete(vert_i);
        this._geom_maps.up_verts_edges.delete(vert_i);
        this.modeldata.attribs.del.delEnt(common_1.EEntType.VERT, vert_i);
        // update the posis
        (0, arrs_1.arrRem)(this._geom_maps.up_posis_verts.get(posi_i), vert_i);
    }
    /**
     * Special case, delete the last edge
     * @param vert_i
     */
    __delVert__OpenPlineEnd(wire_edges_i, wire_verts_i, vert_i) {
        const posi_i = this._geom_maps.dn_verts_posis.get(vert_i);
        // vert_i is at the end of an open wire, we have one edge
        const end_edge_i = wire_edges_i[wire_edges_i.length - 1];
        // delete the last edge
        this._geom_maps.dn_edges_verts.delete(end_edge_i);
        this._geom_maps.up_edges_wires.delete(end_edge_i);
        this.modeldata.attribs.del.delEnt(common_1.EEntType.EDGE, end_edge_i);
        // update the one before last vert
        const before_last_vert_i = wire_verts_i[wire_verts_i.length - 2];
        (0, arrs_1.arrRem)(this._geom_maps.up_verts_edges.get(before_last_vert_i), end_edge_i);
        // update the wire
        (0, arrs_1.arrRem)(wire_edges_i, end_edge_i);
        // delete the vert
        this._geom_maps.dn_verts_posis.delete(vert_i);
        this._geom_maps.up_verts_edges.delete(vert_i);
        this.modeldata.attribs.del.delEnt(common_1.EEntType.VERT, vert_i);
        // update the posis
        (0, arrs_1.arrRem)(this._geom_maps.up_posis_verts.get(posi_i), vert_i);
    }
    /**
     * Special case, delete the pgon
     * @param face_i
     */
    __delVert__PgonBoundaryWire3Edge(pgon_i) {
        const ssid = this.modeldata.active_ssid;
        // TODO do we need to del posis?
        this.modeldata.geom.snapshot.delPgons(ssid, pgon_i);
    }
    /**
     * Special case, delete either the hole
     * @param vert_i
     */
    __delVert__PgonHoleWire3Edge(pgon_i, wire_i) {
        // TODO
        console.log('Not implemented: Deleting posis in holes.');
    }
    /**
     * Final case, delete the next edge, reqire the previous edge
     * For pgons, this does not update the tris
     * @param vert_i
     */
    __delVert__StandardCase(wire_edges_i, vert_i) {
        const posi_i = this._geom_maps.dn_verts_posis.get(vert_i);
        // vert_i is in the middle of a wire, we must have two edges
        const edges_i = this._geom_maps.up_verts_edges.get(vert_i);
        const prev_edge_i = edges_i[0]; // is_first ? edges_i[1] : edges_i[0];
        const next_edge_i = edges_i[1]; // is_first ? edges_i[0] : edges_i[1];
        // get the verts of the two edges
        const prev_edge_verts_i = this._geom_maps.dn_edges_verts.get(prev_edge_i);
        const next_edge_verts_i = this._geom_maps.dn_edges_verts.get(next_edge_i);
        const prev_vert_i = prev_edge_verts_i[0];
        const next_vert_i = next_edge_verts_i[1];
        // console.log(wire_edges_i);
        // console.log(vert_i);
        // console.log(is_first);
        // console.log(edges_i);
        // console.log(prev_edge_i, next_edge_i)
        // console.log(prev_edge_verts_i, next_edge_verts_i)
        // console.log(prev_vert_i, next_vert_i)
        // run some checks
        if (prev_vert_i === vert_i) {
            throw new Error('Unexpected vertex ordering 1');
        }
        if (next_vert_i === vert_i) {
            throw new Error('Unexpected vertex ordering 2');
        }
        if (prev_edge_verts_i[1] !== next_edge_verts_i[0]) {
            throw new Error('Unexpected vertex ordering 3');
        }
        if (prev_edge_verts_i[1] !== vert_i) {
            throw new Error('Unexpected vertex ordering 4');
        }
        // rewire the end vert of the previous edge to the end vert of the next edge
        prev_edge_verts_i[1] = next_vert_i;
        this._geom_maps.up_verts_edges.get(next_vert_i)[0] = prev_edge_i;
        // delete the next edge
        this._geom_maps.dn_edges_verts.delete(next_edge_i);
        this._geom_maps.up_edges_wires.delete(next_edge_i);
        this.modeldata.attribs.del.delEnt(common_1.EEntType.EDGE, next_edge_i);
        // update the wire
        (0, arrs_1.arrRem)(wire_edges_i, next_edge_i);
        // delete the vert
        this._geom_maps.dn_verts_posis.delete(vert_i);
        this._geom_maps.up_verts_edges.delete(vert_i);
        this.modeldata.attribs.del.delEnt(common_1.EEntType.VERT, vert_i);
        // update the posis
        (0, arrs_1.arrRem)(this._geom_maps.up_posis_verts.get(posi_i), vert_i);
    }
}
exports.GIGeomDelVert = GIGeomDelVert;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tRGVsVmVydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWJzL2dlby1pbmZvL2dlb20vR0lHZW9tRGVsVmVydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQ0FBZ0Q7QUFDaEQsMENBQXlDO0FBR3pDOztHQUVHO0FBQ0gsTUFBYSxhQUFhO0lBR3RCOztPQUVHO0lBQ0gsWUFBWSxTQUFzQixFQUFFLFNBQW9CO1FBQ3BELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQ2hDLENBQUM7SUFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0E2Qkc7SUFDSSxPQUFPLENBQUMsTUFBYztRQUN6QixNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxPQUFPO1FBQ1AsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMxRCxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLGlCQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RGLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNwQyxPQUFPO1NBQ1Y7UUFDRCxRQUFRO1FBQ1IsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM1RCxNQUFNLE9BQU8sR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FB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