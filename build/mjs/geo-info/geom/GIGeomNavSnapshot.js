import { EEntType } from '../common';
/**
 * Class for navigating the geometry.
 */
export class GIGeomNavSnapshot {
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
    // Navigate down the hierarchy
    // ============================================================================
    /**
     * Returns all points in this collection and in descendent collections.
     * If none, returns []
     * @param coll_i
     */
    navCollToPoint(ssid, coll_i) {
        // get the descendants of this collection
        const coll_and_desc_i = this.navCollToCollDescendents(ssid, coll_i);
        // if no descendants, just return the the ents in this coll
        if (coll_and_desc_i.length === 0) {
            return this.modeldata.geom.snapshot.getCollPoints(ssid, coll_i); // coll points
        }
        // we have descendants, so get all points
        coll_and_desc_i.splice(0, 0, coll_i);
        const points_i_set = new Set();
        for (const one_coll_i of coll_and_desc_i) {
            for (const point_i of this.modeldata.geom.snapshot.getCollPoints(ssid, one_coll_i)) {
                points_i_set.add(point_i);
            }
        }
        return Array.from(points_i_set);
    }
    /**
     * Returns all polylines in this collection and in descendent collections.
     * If none, returns []
     * @param coll_i
     */
    navCollToPline(ssid, coll_i) {
        // get the descendants of this collection
        const coll_and_desc_i = this.navCollToCollDescendents(ssid, coll_i);
        // if no descendants, just return the the ents in this coll
        if (coll_and_desc_i.length === 0) {
            return this.modeldata.geom.snapshot.getCollPlines(ssid, coll_i); // coll lines
        }
        // we have descendants, so get all plines
        coll_and_desc_i.splice(0, 0, coll_i);
        const plines_i_set = new Set();
        for (const one_coll_i of coll_and_desc_i) {
            for (const pline_i of this.modeldata.geom.snapshot.getCollPlines(ssid, one_coll_i)) {
                plines_i_set.add(pline_i);
            }
        }
        return Array.from(plines_i_set);
    }
    /**
     * Returns all polygons in this collection and in descendent collections.
     * If none, returns []
     * @param coll_i
     */
    navCollToPgon(ssid, coll_i) {
        // get the descendants of this collection
        const coll_and_desc_i = this.navCollToCollDescendents(ssid, coll_i);
        // if no descendants, just return the the ents in this coll
        if (coll_and_desc_i.length === 0) {
            return this.modeldata.geom.snapshot.getCollPgons(ssid, coll_i); // coll pgons
        }
        // we have descendants, so get all pgons
        coll_and_desc_i.splice(0, 0, coll_i);
        const pgons_i_set = new Set();
        for (const one_coll_i of coll_and_desc_i) {
            for (const pgon_i of this.modeldata.geom.snapshot.getCollPgons(ssid, one_coll_i)) {
                pgons_i_set.add(pgon_i);
            }
        }
        return Array.from(pgons_i_set);
    }
    /**
     * Returns children of this collection.
     * If none, returns []
     * @param coll_i
     */
    navCollToCollChildren(ssid, coll_i) {
        return this.modeldata.geom.snapshot.getCollChildren(ssid, coll_i); // coll children
    }
    /**
     * Get the descendent collections of a collection.
     * @param coll_i
     */
    navCollToCollDescendents(ssid, coll_i) {
        const descendent_colls_i = [];
        this._getCollDescendents(ssid, coll_i, descendent_colls_i);
        return descendent_colls_i;
    }
    _getCollDescendents(ssid, coll_i, descendent_colls_i) {
        const child_colls_i = this.modeldata.geom.snapshot.getCollChildren(ssid, coll_i);
        if (child_colls_i === undefined) {
            return;
        }
        child_colls_i.forEach(coll2_i => {
            descendent_colls_i.push(coll2_i);
            this._getCollDescendents(ssid, coll2_i, descendent_colls_i);
        });
    }
    // ============================================================================
    // Navigate up the hierarchy
    // ============================================================================
    /**
     * Returns [] if none
     * @param point_i
     */
    navPosiToVert(ssid, posi_i) {
        const verts_i = this._geom_maps.up_posis_verts.get(posi_i);
        const filt_verts_i = [];
        for (const vert_i of verts_i) {
            const [ent_type, ent_i] = this.modeldata.geom.query.getTopoObj(EEntType.VERT, vert_i);
            if (this.modeldata.geom.snapshot.hasEnt(ssid, ent_type, ent_i)) {
                filt_verts_i.push(vert_i);
            }
        }
        return filt_verts_i;
    }
    /**
     * Returns [] if none
     * @param point_i
     */
    navPointToColl(ssid, point_i) {
        return this.modeldata.geom.snapshot.getPointColls(ssid, point_i);
    }
    /**
     * Returns [] if none
     * @param pline_i
     */
    navPlineToColl(ssid, pline_i) {
        return this.modeldata.geom.snapshot.getPlineColls(ssid, pline_i);
    }
    /**
     * Returns [] if none
     * @param pgon_i
     */
    navPgonToColl(ssid, pgon_i) {
        return this.modeldata.geom.snapshot.getPgonColls(ssid, pgon_i);
    }
    /**
     * Returns undefined if none
     * @param coll_i
     */
    navCollToCollParent(ssid, coll_i) {
        return this.modeldata.geom.snapshot.getCollParent(ssid, coll_i); // coll parent
    }
    /**
     * Get the ancestor collections of a collection.
     * @param coll_i
     */
    navCollToCollAncestors(ssid, coll_i) {
        const ancestor_colls_i = [];
        let parent_coll_i = this.modeldata.geom.snapshot.getCollParent(ssid, coll_i);
        while (parent_coll_i !== undefined) {
            ancestor_colls_i.push(parent_coll_i);
            parent_coll_i = this.modeldata.geom.snapshot.getCollParent(ssid, parent_coll_i);
        }
        return ancestor_colls_i;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tTmF2U25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWJzL2dlby1pbmZvL2dlb20vR0lHZW9tTmF2U25hcHNob3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFHLFFBQVEsRUFBMEIsTUFBTSxXQUFXLENBQUM7QUFFOUQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8saUJBQWlCO0lBQ2xCLFNBQVMsQ0FBYztJQUN2QixVQUFVLENBQVk7SUFDOUI7O09BRUc7SUFDSCxZQUFZLFNBQXNCLEVBQUUsU0FBb0I7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUNELCtFQUErRTtJQUMvRSw4QkFBOEI7SUFDOUIsK0VBQStFO0lBQy9FOzs7O09BSUc7SUFDSSxjQUFjLENBQUMsSUFBWSxFQUFFLE1BQWM7UUFDOUMseUNBQXlDO1FBQ3pDLE1BQU0sZUFBZSxHQUFhLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUUsMkRBQTJEO1FBQzNELElBQUksZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDOUIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLGNBQWM7U0FDbEY7UUFDRCx5Q0FBeUM7UUFDekMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sWUFBWSxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQzVDLEtBQUssTUFBTSxVQUFVLElBQUksZUFBZSxFQUFFO1lBQ3RDLEtBQUssTUFBTSxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENB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