/**
 * Class for navigating the triangles in the geometry data structure.
 */
export class GIGeomNavTri {
    modeldata;
    _geom_maps;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tTmF2VHJpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9nZW9tL0dJR2VvbU5hdlRyaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQTs7R0FFRztBQUNILE1BQU0sT0FBTyxZQUFZO0lBQ2IsU0FBUyxDQUFjO0lBQ3ZCLFVBQVUsQ0FBWTtJQUM5Qjs7T0FFRztJQUNILFlBQVksU0FBc0IsRUFBRSxTQUFvQjtRQUNwRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsK0VBQStFO0lBQy9FLDRCQUE0QjtJQUM1QiwrRUFBK0U7SUFDL0U7OztPQUdHO0lBQ0ksWUFBWSxDQUFDLEtBQWE7UUFDN0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxpQkFBaUI7SUFDdEUsQ0FBQztJQUNEOzs7T0FHRztJQUNJLFlBQVksQ0FBQyxLQUFhO1FBQzdCLE1BQU0sT0FBTyxHQUFhLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuRSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksWUFBWSxDQUFDLE1BQWM7UUFDOUIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBaUI7SUFDdkUsQ0FBQztJQUNELCtFQUErRTtJQUMvRSwwQkFBMEI7SUFDMUIsK0VBQStFO0lBQy9FOzs7T0FHRztJQUNJLFlBQVksQ0FBQyxNQUFjO1FBQzlCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsaUJBQWlCO0lBQ3ZFLENBQUM7SUFDRDs7O09BR0c7SUFDSSxZQUFZLENBQUMsS0FBYTtRQUM3QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksWUFBWSxDQUFDLEtBQWE7UUFDN0IsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6RCxDQUFDO0NBcURKIn0=