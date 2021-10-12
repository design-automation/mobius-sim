"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIGeomNavSnapshot = void 0;
const common_1 = require("../common");
/**
 * Class for navigating the geometry.
 */
class GIGeomNavSnapshot {
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
            const [ent_type, ent_i] = this.modeldata.geom.query.getTopoObj(common_1.EEntType.VERT, vert_i);
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
exports.GIGeomNavSnapshot = GIGeomNavSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tTmF2U25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9nZW9tL0dJR2VvbU5hdlNuYXBzaG90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUE4RDtBQUU5RDs7R0FFRztBQUNILE1BQWEsaUJBQWlCO0lBRzFCOztPQUVHO0lBQ0gsWUFBWSxTQUFzQixFQUFFLFNBQW9CO1FBQ3BELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQ2hDLENBQUM7SUFDRCwrRUFBK0U7SUFDL0UsOEJBQThCO0lBQzlCLCtFQUErRTtJQUMvRTs7OztPQUlHO0lBQ0ksY0FBYyxDQUFDLElBQVksRUFBRSxNQUFjO1FBQzlDLHlDQUF5QztRQUN6QyxNQUFNLGVBQWUsR0FBYSxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlFLDJEQUEyRDtRQUMzRCxJQUFJLGVBQWUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzlCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxjQUFjO1NBQ2xGO1FBQ0QseUNBQXlDO1FBQ3pDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNyQyxNQUFNLFlBQVksR0FBZ0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUM1QyxLQUFLLE1BQU0sVUFBVSxJQUFJLGVBQWUsRUFBRTtZQUN0QyxLQUFLLE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxFQUFFO2dCQUNoRixZQUFZ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