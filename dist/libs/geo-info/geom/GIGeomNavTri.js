"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIGeomNavTri = void 0;
/**
 * Class for navigating the triangles in the geometry data structure.
 */
class GIGeomNavTri {
    /**
     * Constructor
     */
    constructor(modeldata, geom_maps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    // ============================================================================
    // Navigate tirangles - down
    // ============================================================================
    /**
     * Never none
     * @param tri_i
     */
    navTriToVert(tri_i) {
        return this._geom_maps.dn_tris_verts.get(tri_i); // WARNING BY REF
    }
    /**
     * Never none
     * @param tri_i
     */
    navTriToPosi(tri_i) {
        const verts_i = this._geom_maps.dn_tris_verts.get(tri_i);
        return verts_i.map(vert_i => this._geom_maps.dn_verts_posis.get(vert_i));
    }
    /**
     * Never none
     * @param pgon_i
     */
    navPgonToTri(pgon_i) {
        return this._geom_maps.dn_pgons_tris.get(pgon_i); // WARNING BY REF
    }
    // ============================================================================
    // Navigate tirangles - up
    // ============================================================================
    /**
     * Returns undefined if none
     * @param vert_i
     */
    navVertToTri(vert_i) {
        return this._geom_maps.up_verts_tris.get(vert_i); // WARNING BY REF
    }
    /**
     * Never none
     * @param tri_i
     */
    navTriToPgon(tri_i) {
        return this._geom_maps.up_tris_pgons.get(tri_i);
    }
    /**
     * Never none
     * @param tri_i
     */
    navTriToColl(tri_i) {
        const pgon_i = this._geom_maps.up_tris_pgons.get(tri_i);
        return this.modeldata.geom.nav.navPgonToColl(pgon_i);
    }
}
exports.GIGeomNavTri = GIGeomNavTri;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tTmF2VHJpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vZ2VvbS9HSUdlb21OYXZUcmkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0E7O0dBRUc7QUFDSCxNQUFhLFlBQVk7SUFHckI7O09BRUc7SUFDSCxZQUFZLFNBQXNCLEVBQUUsU0FBb0I7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUNELCtFQUErRTtJQUMvRSw0QkFBNEI7SUFDNUIsK0VBQStFO0lBQy9FOzs7T0FHRztJQUNJLFlBQVksQ0FBQyxLQUFhO1FBQzdCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsaUJBQWlCO0lBQ3RFLENBQUM7SUFDRDs7O09BR0c7SUFDSSxZQUFZLENBQUMsS0FBYTtRQUM3QixNQUFNLE9BQU8sR0FBYSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkUsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUNEOzs7T0FHRztJQUNJLFlBQVksQ0FBQyxNQUFjO1FBQzlCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsaUJBQWlCO0lBQ3ZFLENBQUM7SUFDRCwrRUFBK0U7SUFDL0UsMEJBQTBCO0lBQzFCLCtFQUErRTtJQUMvRTs7O09BR0c7SUFDSSxZQUFZLENBQUMsTUFBYztRQUM5QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtJQUN2RSxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksWUFBWSxDQUFDLEtBQWE7UUFDN0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUNEOzs7T0FHRztJQUNJLFlBQVksQ0FBQyxLQUFhO1FBQzdCLE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekQsQ0FBQztDQXFESjtBQWhIRCxvQ0FnSEMifQ==