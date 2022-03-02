"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIGeomEditPgon = void 0;
const common_1 = require("../common");
const arrs_1 = require("../../util/arrs");
const vectors_1 = require("../../geom/vectors");
/**
 * Class for geometry.
 */
class GIGeomEditPgon {
    /**
     * Constructor
     */
    constructor(modeldata, geom_maps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    /**
     * Creates one or more holes in a polygon.
     * Updates time stamp for the polygon.
     * \n
     */
    cutPgonHoles(pgon_i, posis_i_arr) {
        // get the normal of the face
        const face_normal = this.modeldata.geom.query.getPgonNormal(pgon_i);
        // make the wires for the holes
        const hole_wires_i = [];
        for (const hole_posis_i of posis_i_arr) {
            const hole_vert_i_arr = hole_posis_i.map(posi_i => this.modeldata.geom.add._addVertex(posi_i));
            const hole_edges_i_arr = [];
            for (let i = 0; i < hole_vert_i_arr.length - 1; i++) {
                hole_edges_i_arr.push(this.modeldata.geom.add._addEdge(hole_vert_i_arr[i], hole_vert_i_arr[i + 1]));
            }
            hole_edges_i_arr.push(this.modeldata.geom.add._addEdge(hole_vert_i_arr[hole_vert_i_arr.length - 1], hole_vert_i_arr[0]));
            const hole_wire_i = this.modeldata.geom.add._addWire(hole_edges_i_arr, true);
            // get normal of wire and check if we need to reverse the wire
            const wire_normal = this.modeldata.geom.query.getWireNormal(hole_wire_i);
            if ((0, vectors_1.vecDot)(face_normal, wire_normal) > 0) {
                this.modeldata.geom.edit_topo.reverse(hole_wire_i);
            }
            // add to list of holes
            hole_wires_i.push(hole_wire_i);
        }
        // create the holes, does everything at face level
        this._cutPgonHoles(pgon_i, hole_wires_i);
        // update the time stamp
        // snapshot: new ts no longer required
        // this.modeldata.geom.timestamp.updateObjsTs(EEntType.PGON, pgon_i);
        // no need to change either the up or down arrays
        // return the new wires
        return hole_wires_i;
    }
    /**
     * Retriangulate the polygons.
     * Updates time stamp for the polygons.
     * \n
     */
    triPgons(pgons_i) {
        if (!Array.isArray(pgons_i)) {
            const pgon_i = pgons_i;
            const wires_i = this.modeldata.geom.nav.navAnyToWire(common_1.EEntType.PGON, pgon_i);
            const outer_i = wires_i[0];
            const holes_i = wires_i.slice(1);
            // create the triangles
            const new_tris_i = this.modeldata.geom.add._addTris(outer_i, holes_i);
            // delete the old trianges
            const old_pgon_tris_i = this._geom_maps.dn_pgons_tris.get(pgon_i);
            if (old_pgon_tris_i) {
                for (const old_face_tri_i of old_pgon_tris_i) {
                    // verts to tris
                    for (const vert_i of this._geom_maps.dn_tris_verts.get(old_face_tri_i)) {
                        const vert_tris_i = this._geom_maps.up_verts_tris.get(vert_i);
                        (0, arrs_1.arrRem)(vert_tris_i, old_face_tri_i);
                    }
                    // tris to verts
                    this._geom_maps.dn_tris_verts.delete(old_face_tri_i);
                    // tris to faces
                    this._geom_maps.up_tris_pgons.delete(old_face_tri_i);
                }
            }
            // update up array for tri to pgon
            for (const new_tri_i of new_tris_i) {
                this._geom_maps.up_tris_pgons.set(new_tri_i, pgon_i);
            }
            // update down array for pgon to tri
            this._geom_maps.dn_pgons_tris.set(pgon_i, new_tris_i);
        }
        else { // An array of pgons
            pgons_i.forEach(pgon_i => this.triPgons(pgon_i));
        }
    }
    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     * Adds a hole to a face and updates the arrays.
     * Wires are assumed to be closed!
     * This also calls addTris()
     * @param wire_i
     */
    _cutPgonHoles(pgon_i, hole_wires_i) {
        // get the wires and triangles arrays
        const pgon_wires_i = this._geom_maps.dn_pgons_wires.get(pgon_i);
        const old_pgon_tris_i = this._geom_maps.dn_pgons_tris.get(pgon_i);
        // get the outer wire
        const outer_wire_i = pgon_wires_i[0];
        // get the hole wires
        const all_hole_wires_i = [];
        if (pgon_wires_i.length > 1) {
            pgon_wires_i.slice(1).forEach(wire_i => all_hole_wires_i.push(wire_i));
        }
        hole_wires_i.forEach(wire_i => all_hole_wires_i.push(wire_i));
        // create the triangles
        const new_tris_i = this.modeldata.geom.add._addTris(outer_wire_i, all_hole_wires_i);
        // create the wires
        const new_wires_i = pgon_wires_i.concat(hole_wires_i);
        // update down arrays
        this._geom_maps.dn_pgons_wires.set(pgon_i, new_wires_i);
        this._geom_maps.dn_pgons_tris.set(pgon_i, new_tris_i);
        // update up arrays
        hole_wires_i.forEach(hole_wire_i => this._geom_maps.up_wires_pgons.set(hole_wire_i, pgon_i));
        new_tris_i.forEach(tri_i => this._geom_maps.up_tris_pgons.set(tri_i, pgon_i));
        // delete the old trianges
        for (const old_face_tri_i of old_pgon_tris_i) {
            // remove these deleted tris from the verts
            for (const vert_i of this._geom_maps.dn_tris_verts.get(old_face_tri_i)) {
                const tris_i = this._geom_maps.up_verts_tris.get(vert_i);
                (0, arrs_1.arrRem)(tris_i, old_face_tri_i);
            }
            // tris to verts
            this._geom_maps.dn_tris_verts.delete(old_face_tri_i);
            // tris to faces
            this._geom_maps.up_tris_pgons.delete(old_face_tri_i);
        }
        // return the numeric index of the pgon
        return pgon_i;
    }
    /**
     * Updates the tris in a face
     * @param pgon_i
     */
    _updatePgonTris(pgon_i) {
        const wires_i = this._geom_maps.dn_pgons_wires.get(pgon_i);
        // get the wires
        const border_wire_i = wires_i[0];
        // get the border and holes
        const holes_wires_i = wires_i.slice(1);
        const tris_i = this.modeldata.geom.add._addTris(border_wire_i, holes_wires_i);
        // delete the old tris
        for (const tri_i of this._geom_maps.dn_pgons_tris.get(pgon_i)) {
            // update the verts
            const verts_i = this._geom_maps.dn_tris_verts.get(tri_i);
            for (const vert_i of verts_i) {
                this._geom_maps.up_verts_tris.delete(vert_i); // up
            }
            // tris to verts
            this._geom_maps.dn_tris_verts.delete(tri_i); // down
            // tris to pgons
            this._geom_maps.up_tris_pgons.delete(tri_i); // up
        }
        // update down arrays
        this._geom_maps.dn_pgons_tris.set(pgon_i, tris_i);
        // update up arrays
        for (const tri_i of tris_i) {
            this._geom_maps.up_tris_pgons.set(tri_i, pgon_i);
        }
    }
}
exports.GIGeomEditPgon = GIGeomEditPgon;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tRWRpdFBnb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWJzL2dlby1pbmZvL2dlb20vR0lHZW9tRWRpdFBnb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0NBQXNEO0FBQ3RELDBDQUF5QztBQUN6QyxnREFBNEM7QUFHNUM7O0dBRUc7QUFDSCxNQUFhLGNBQWM7SUFHdkI7O09BRUc7SUFDSCxZQUFZLFNBQXNCLEVBQUUsU0FBb0I7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUNEOzs7O09BSUc7SUFDSSxZQUFZLENBQUMsTUFBYyxFQUFFLFdBQXVCO1FBQ3ZELDZCQUE2QjtRQUM3QixNQUFNLFdBQVcsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFFLCtCQUErQjtRQUMvQixNQUFNLFlBQVksR0FBYSxFQUFFLENBQUM7UUFDbEMsS0FBSyxNQUFNLFlBQVksSUFBSSxXQUFXLEVBQUU7WUFDcEMsTUFBTSxlQUFlLEdBQWEsWUFBWSxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMxRyxNQUFNLGdCQUFnQixHQUFhLEVBQUUsQ0FBQztZQUN0QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2pELGdCQUFnQixDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxD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