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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tRGVsVmVydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vZ2VvbS9HSUdlb21EZWxWZXJ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUFnRDtBQUNoRCwwQ0FBeUM7QUFHekM7O0dBRUc7QUFDSCxNQUFhLGFBQWE7SUFHdEI7O09BRUc7SUFDSCxZQUFZLFNBQXNCLEVBQUUsU0FBb0I7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQTZCRztJQUNJLE9BQU8sQ0FBQyxNQUFjO1FBQ3pCLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE9BQU87UUFDUCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzFELE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsaUJBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEYsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE9BQU87U0FDVjtRQUNELFFBQVE7UUFDUixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzVELE1BQU0sT0FBTyxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0s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