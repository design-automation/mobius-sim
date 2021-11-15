/**
 * Class for navigating the triangles in the geometry data structure.
 */
export class GIGeomNavTri {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tTmF2VHJpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGlicy9nZW8taW5mby9nZW9tL0dJR2VvbU5hdlRyaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQTs7R0FFRztBQUNILE1BQU0sT0FBTyxZQUFZO0lBR3JCOztPQUVHO0lBQ0gsWUFBWSxTQUFzQixFQUFFLFNBQW9CO1FBQ3BELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQ2hDLENBQUM7SUFDRCwrRUFBK0U7SUFDL0UsNEJBQTRCO0lBQzVCLCtFQUErRTtJQUMvRTs7O09BR0c7SUFDSSxZQUFZLENBQUMsS0FBYTtRQUM3QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtJQUN0RSxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksWUFBWSxDQUFDLEtBQWE7UUFDN0IsTUFBTSxPQUFPLEdBQWEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25FLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFDRDs7O09BR0c7SUFDSSxZQUFZLENBQUMsTUFBYztRQUM5QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtJQUN2RSxDQUFDO0lBQ0QsK0VBQStFO0lBQy9FLDBCQUEwQjtJQUMxQiwrRUFBK0U7SUFDL0U7OztPQUdHO0lBQ0ksWUFBWSxDQUFDLE1BQWM7UUFDOUIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBaUI7SUFDdkUsQ0FBQztJQUNEOzs7T0FHRztJQUNJLFlBQVksQ0FBQyxLQUFhO1FBQzdCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFDRDs7O09BR0c7SUFDSSxZQUFZLENBQUMsS0FBYTtRQUM3QixNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELENBQUM7Q0FxREoifQ==