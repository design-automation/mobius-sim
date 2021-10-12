"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIGeomNav = void 0;
const common_1 = require("../common");
/**
 * Class for navigating the geometry.
 */
class GIGeomNav {
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
     * Never none
     * @param vert_i
     */
    navVertToPosi(vert_i) {
        return this._geom_maps.dn_verts_posis.get(vert_i);
    }
    /**
     * Never none, an array of length 2
     * @param edge_i
     */
    navEdgeToVert(edge_i) {
        return this._geom_maps.dn_edges_verts.get(edge_i); // WARNING BY REF
    }
    /**
     * Never none
     * @param wire_i
     */
    navWireToEdge(wire_i) {
        return this._geom_maps.dn_wires_edges.get(wire_i); // WARNING BY REF
    }
    /**
     * Never none
     * @param point_i
     */
    navPointToVert(point_i) {
        return this._geom_maps.dn_points_verts.get(point_i);
    }
    /**
     * Never none
     * @param line_i
     */
    navPlineToWire(line_i) {
        return this._geom_maps.dn_plines_wires.get(line_i);
    }
    /**
     * Never none
     * @param pgon_i
     */
    navPgonToWire(pgon_i) {
        return this._geom_maps.dn_pgons_wires.get(pgon_i); // WARNING BY REF
    }
    /**
     * If none, returns []
     * @param coll_i
     */
    navCollToPoint(coll_i) {
        const ssid = this.modeldata.active_ssid;
        return this.modeldata.geom.nav_snapshot.navCollToPoint(ssid, coll_i);
    }
    /**
     * If none, returns []
     * @param coll_i
     */
    navCollToPline(coll_i) {
        const ssid = this.modeldata.active_ssid;
        return this.modeldata.geom.nav_snapshot.navCollToPline(ssid, coll_i);
    }
    /**
     * If none, returns []
     * @param coll_i
     */
    navCollToPgon(coll_i) {
        const ssid = this.modeldata.active_ssid;
        return this.modeldata.geom.nav_snapshot.navCollToPgon(ssid, coll_i);
    }
    /**
     * If none, returns []
     * @param coll_i
     */
    navCollToCollChildren(coll_i) {
        const ssid = this.modeldata.active_ssid;
        return this.modeldata.geom.snapshot.getCollChildren(ssid, coll_i); // coll children
    }
    /**
     * Get the descendent collections of a collection.
     * @param coll_i
     */
    navCollToCollDescendents(coll_i) {
        const ssid = this.modeldata.active_ssid;
        return this.modeldata.geom.nav_snapshot.navCollToCollDescendents(ssid, coll_i);
    }
    // ============================================================================
    // Navigate up the hierarchy
    // ============================================================================
    /**
     * Returns [] is none
     * @param posi_i
     */
    navPosiToVert(posi_i) {
        const ssid = this.modeldata.active_ssid;
        return this._geom_maps.up_posis_verts.get(posi_i).filter(ent_i => this.modeldata.geom.snapshot.hasEnt(ssid, common_1.EEntType.VERT, ent_i));
    }
    /**
     * Returns undefined if none (consider points)
     * The array of edges wil be length of either one or two, [in_edge, out_edge].
     * If the vertex is at the start or end of a polyline, then length will be one.
     * @param vert_i
     */
    navVertToEdge(vert_i) {
        return this._geom_maps.up_verts_edges.get(vert_i); // WARNING BY REF
    }
    /**
     * Returns undefined if none.
     * @param edge_i
     */
    navEdgeToWire(edge_i) {
        return this._geom_maps.up_edges_wires.get(edge_i);
    }
    /**
     * Returns undefined if none
     * @param vert_i
     */
    navVertToPoint(vert_i) {
        return this._geom_maps.up_verts_points.get(vert_i);
    }
    /**
     * Returns undefined if none
     * @param tri_i
     */
    navWireToPline(wire_i) {
        return this._geom_maps.up_wires_plines.get(wire_i);
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
     * @param wire_i
     */
    navWireToPgon(wire_i) {
        return this._geom_maps.up_wires_pgons.get(wire_i);
    }
    /**
     * Returns [] if none
     * @param point_i
     */
    navPointToColl(point_i) {
        const ssid = this.modeldata.active_ssid;
        return this.modeldata.geom.snapshot.getPointColls(ssid, point_i);
    }
    /**
     * Returns [] if none
     * @param pline_i
     */
    navPlineToColl(pline_i) {
        const ssid = this.modeldata.active_ssid;
        return this.modeldata.geom.snapshot.getPlineColls(ssid, pline_i);
    }
    /**
     * Returns [] if none
     * @param pgon_i
     */
    navPgonToColl(pgon_i) {
        const ssid = this.modeldata.active_ssid;
        return this.modeldata.geom.snapshot.getPgonColls(ssid, pgon_i);
    }
    /**
     * Returns undefined if none
     * @param coll_i
     */
    navCollToCollParent(coll_i) {
        const ssid = this.modeldata.active_ssid;
        return this.modeldata.geom.snapshot.getCollParent(ssid, coll_i); // coll parent
    }
    /**
     * Get the ancestor collections of a collection.
     * @param coll_i
     */
    navCollToCollAncestors(coll_i) {
        const ssid = this.modeldata.active_ssid;
        return this.modeldata.geom.nav_snapshot.navCollToCollAncestors(ssid, coll_i);
    }
    // ============================================================================
    // Private, Navigate up from any to ?
    // ============================================================================
    /**
     * Returns [] if none.
     * @param
     */
    _navUpAnyToEdge(ent_type, ent_i) {
        // console.log("_navUpAnyToEdge");
        // if (ent_type > EEntType.EDGE) { throw new Error(); }
        if (ent_type === common_1.EEntType.EDGE) {
            return [ent_i];
        }
        if (ent_type === common_1.EEntType.VERT) {
            const edges_i = [];
            const v_edges_i = this._geom_maps.up_verts_edges.get(ent_i);
            if (v_edges_i !== undefined) {
                for (const edge_i of v_edges_i) {
                    edges_i.push(edge_i);
                }
            }
            return edges_i;
        }
        if (ent_type === common_1.EEntType.POSI) {
            // one posi could have multiple verts
            // but edges on those verts will always be different so no need to check for dups
            const edges_i = [];
            for (const vert_i of this.navPosiToVert(ent_i)) {
                const v_edges_i = this._geom_maps.up_verts_edges.get(vert_i);
                if (v_edges_i !== undefined) {
                    for (const edge_i of v_edges_i) {
                        edges_i.push(edge_i);
                    }
                }
            }
            return edges_i;
        }
        return []; // points
    }
    /**
     * Returns [] if none.
     * @param
     */
    _navUpAnyToWire(ent_type, ent_i) {
        // console.log("_navUpAnyToWire");
        // if (ent_type > EEntType.WIRE) { throw new Error(); }
        if (ent_type === common_1.EEntType.WIRE) {
            return [ent_i];
        }
        if (ent_type === common_1.EEntType.EDGE) {
            return [this._geom_maps.up_edges_wires.get(ent_i)];
        }
        if (ent_type === common_1.EEntType.VERT) {
            const edges_i = this._geom_maps.up_verts_edges.get(ent_i);
            if (edges_i !== undefined) {
                return [this._geom_maps.up_edges_wires.get(edges_i[0])]; // only 1 edge
            }
        }
        // a vertex can have two edges which belong to the same wire
        // we do not want to have two copies of that wire, so we need to take care to only get 1 edge
        if (ent_type === common_1.EEntType.POSI) {
            const wires_i = [];
            for (const vert_i of this.navPosiToVert(ent_i)) {
                const edges_i = this._geom_maps.up_verts_edges.get(vert_i);
                if (edges_i !== undefined) {
                    wires_i.push(this._geom_maps.up_edges_wires.get(edges_i[0])); // only 1 edge
                }
            }
            return wires_i;
        }
        return [];
    }
    /**
     * Returns [] if none.
     * @param
     */
    _navUpAnyToPoint(ent_type, ent_i) {
        // console.log("_navUpAnyToPoint");
        // if (ent_type > EEntType.POINT) { throw new Error(); }
        if (ent_type === common_1.EEntType.POINT) {
            return [ent_i];
        }
        if (ent_type === common_1.EEntType.VERT) {
            const point_i = this._geom_maps.up_verts_points.get(ent_i);
            return point_i === undefined ? [] : [point_i];
        }
        if (ent_type === common_1.EEntType.POSI) {
            const points_i = [];
            for (const vert_i of this.navPosiToVert(ent_i)) {
                const point_i = this._geom_maps.up_verts_points.get(vert_i);
                if (point_i !== undefined) {
                    points_i.push(point_i);
                }
            }
            return points_i;
        }
        return [];
    }
    /**
     * Returns [] if none.
     * @param
     */
    _navUpAnyToPline(ent_type, ent_i) {
        // console.log("_navUpAnyToPline");
        // if (ent_type > EEntType.PLINE) { throw new Error(); }
        if (ent_type === common_1.EEntType.PLINE) {
            return [ent_i];
        }
        if (ent_type === common_1.EEntType.POINT) {
            return [];
        }
        const plines_i = [];
        for (const wire_i of this._navUpAnyToWire(ent_type, ent_i)) {
            const pline_i = this._geom_maps.up_wires_plines.get(wire_i);
            if (pline_i !== undefined) {
                plines_i.push(pline_i);
            }
        }
        return plines_i;
    }
    /**
     * Returns [] if none.
     * @param
     */
    _navUpAnyToPgon(ent_type, ent_i) {
        // console.log("_navUpAnyToPgon");
        // if (ent_type > EEntType.PGON) { throw new Error(); }
        if (ent_type === common_1.EEntType.PGON) {
            return [ent_i];
        }
        if (ent_type > common_1.EEntType.WIRE) {
            return [];
        } // point and pline
        const pgons_i = [];
        for (const wire_i of this._navUpAnyToWire(ent_type, ent_i)) {
            const pgon_i = this._geom_maps.up_wires_pgons.get(wire_i);
            if (pgon_i !== undefined) {
                pgons_i.push(pgon_i);
            }
        }
        // it is possible that there is a posi that has two wires on the same pgon
        // this would result in the pgon being duplicated...
        // but checking for this results in a performance hit...
        return pgons_i;
    }
    /**
     * Returns [] if none.
     * @param posi_i
     */
    _navUpAnyToColl(ent_type, ent_i) {
        // console.log("_navUpAnyToColl");
        if (ent_type === common_1.EEntType.COLL) {
            return [ent_i];
        }
        const colls_i = [];
        for (const point_i of this.navAnyToPoint(ent_type, ent_i)) {
            for (const coll_i of this.navPointToColl(point_i)) {
                colls_i.push(coll_i);
            }
        }
        for (const pline_i of this.navAnyToPline(ent_type, ent_i)) {
            for (const coll_i of this.navPlineToColl(pline_i)) {
                colls_i.push(coll_i);
            }
        }
        for (const pgon_i of this.navAnyToPgon(ent_type, ent_i)) {
            for (const coll_i of this.navPgonToColl(pgon_i)) {
                colls_i.push(coll_i);
            }
        }
        // if ent_type is posi, we could have duplicates
        if (ent_type === common_1.EEntType.POSI) {
            return Array.from(new Set(colls_i));
        }
        return colls_i;
    }
    // ============================================================================
    // Private, Navigate down from any to ?
    // ============================================================================
    /**
     * Returns [] if none.
     * @param
     */
    _navDnAnyToWire(ent_type, ent_i) {
        // console.log("_navDnAnyToWire");
        // if (ent_type < EEntType.WIRE) { throw new Error(); }
        if (ent_type === common_1.EEntType.WIRE) {
            return [ent_i];
        }
        if (ent_type === common_1.EEntType.PLINE) {
            return [this._geom_maps.dn_plines_wires.get(ent_i)];
        }
        if (ent_type === common_1.EEntType.PGON) {
            return this._geom_maps.dn_pgons_wires.get(ent_i); // WARNING BY REF
        }
        if (ent_type === common_1.EEntType.COLL) {
            const wires_i = [];
            for (const pline_i of this.navCollToPline(ent_i)) {
                wires_i.push(this._geom_maps.dn_plines_wires.get(pline_i));
            }
            for (const pgon_i of this.navCollToPgon(ent_i)) {
                for (const wire_i of this._geom_maps.dn_pgons_wires.get(pgon_i)) {
                    wires_i.push(wire_i);
                }
            }
            return wires_i;
        }
        return []; // points
    }
    /**
     * Returns [] if none.
     * @param
     */
    _navDnAnyToEdge(ent_type, ent_i) {
        // console.log("_navDnAnyToEdge");
        // if (ent_type < EEntType.EDGE) { throw new Error(); }
        if (ent_type === common_1.EEntType.EDGE) {
            return [ent_i];
        }
        if (ent_type === common_1.EEntType.WIRE) {
            return this._geom_maps.dn_wires_edges.get(ent_i);
        }
        const edges_i = [];
        for (const wire_i of this._navDnAnyToWire(ent_type, ent_i)) {
            for (const edge_i of this._geom_maps.dn_wires_edges.get(wire_i)) {
                edges_i.push(edge_i);
            }
        }
        return edges_i;
    }
    /**
     * Returns [] if none.
     * @param
     */
    _navDnAnyToVert(ent_type, ent_i) {
        // console.log("_navDnAnyToVert");
        // if (ent_type < EEntType.VERT) { throw new Error(); }
        if (ent_type === common_1.EEntType.VERT) {
            return [ent_i];
        }
        if (ent_type === common_1.EEntType.EDGE) {
            return this._geom_maps.dn_edges_verts.get(ent_i);
        }
        if (ent_type === common_1.EEntType.WIRE) {
            return this.modeldata.geom.query.getWireVerts(ent_i);
        }
        if (ent_type === common_1.EEntType.POINT) {
            return [this._geom_maps.dn_points_verts.get(ent_i)];
        }
        const verts_i = [];
        for (const wire_i of this._navDnAnyToWire(ent_type, ent_i)) {
            for (const vert_i of this.modeldata.geom.query.getWireVerts(wire_i)) {
                verts_i.push(vert_i);
            }
        }
        return verts_i;
    }
    /**
     * Returns [] if none.
     * @param
     */
    _navDnAnyToPosi(ent_type, ent_i) {
        // console.log("_navDnAnyToPosi");
        if (ent_type === common_1.EEntType.POSI) {
            return [ent_i];
        }
        if (ent_type === common_1.EEntType.VERT) {
            return [this._geom_maps.dn_verts_posis.get(ent_i)];
        }
        // multiple verts can share the same vertex, so we need to check for dups
        const set_posis_i = new Set();
        for (const vert_i of this._navDnAnyToVert(ent_type, ent_i)) {
            set_posis_i.add(this._geom_maps.dn_verts_posis.get(vert_i));
        }
        return Array.from(set_posis_i);
    }
    // ============================================================================
    // Navigate any to ?
    // ============================================================================
    navAnyToPosi(ent_type, ent_i) {
        // console.log("navAnyToPosi");
        if (ent_type === common_1.EEntType.POSI) {
            return [ent_i];
        }
        return this._navDnAnyToPosi(ent_type, ent_i);
    }
    navAnyToVert(ent_type, ent_i) {
        // console.log("navAnyToVert");
        if (ent_type === common_1.EEntType.VERT) {
            return [ent_i];
        }
        if (ent_type === common_1.EEntType.POSI) {
            return this.navPosiToVert(ent_i); // WARNING BY REF
        }
        return this._navDnAnyToVert(ent_type, ent_i);
    }
    navAnyToEdge(ent_type, ent_i) {
        // console.log("navAnyToEdge");
        if (ent_type === common_1.EEntType.EDGE) {
            return [ent_i];
        }
        if (ent_type <= common_1.EEntType.EDGE) {
            return this._navUpAnyToEdge(ent_type, ent_i);
        }
        return this._navDnAnyToEdge(ent_type, ent_i);
    }
    navAnyToWire(ent_type, ent_i) {
        // console.log("navAnyToWire");
        if (ent_type === common_1.EEntType.WIRE) {
            return [ent_i];
        }
        if (ent_type <= common_1.EEntType.WIRE) {
            return this._navUpAnyToWire(ent_type, ent_i);
        }
        return this._navDnAnyToWire(ent_type, ent_i);
    }
    navAnyToPoint(ent_type, ent_i) {
        // console.log("navAnyToPoint");
        if (ent_type === common_1.EEntType.POINT) {
            return [ent_i];
        }
        if (ent_type <= common_1.EEntType.POINT) {
            return this._navUpAnyToPoint(ent_type, ent_i);
        }
        if (ent_type === common_1.EEntType.COLL) {
            return this.navCollToPoint(ent_i);
        }
        return [];
    }
    navAnyToPline(ent_type, ent_i) {
        // console.log("navAnyToPline");
        if (ent_type === common_1.EEntType.PLINE) {
            return [ent_i];
        }
        if (ent_type <= common_1.EEntType.PLINE) {
            return this._navUpAnyToPline(ent_type, ent_i);
        }
        if (ent_type === common_1.EEntType.COLL) {
            return this.navCollToPline(ent_i);
        }
        return [];
    }
    navAnyToPgon(ent_type, ent_i) {
        // console.log("navAnyToPgon");
        if (ent_type === common_1.EEntType.PGON) {
            return [ent_i];
        }
        if (ent_type <= common_1.EEntType.PGON) {
            return this._navUpAnyToPgon(ent_type, ent_i);
        }
        if (ent_type === common_1.EEntType.COLL) {
            return this.navCollToPgon(ent_i);
        }
        return [];
    }
    navAnyToColl(ent_type, ent_i) {
        // console.log("navAnyToColl");
        if (ent_type === common_1.EEntType.COLL) {
            return [ent_i];
        }
        return this._navUpAnyToColl(ent_type, ent_i);
    }
    // ============================================================================
    // Navigate any to any
    // ============================================================================
    /**
     * Main function used for queries.
     * Includes #ps #_v #_e #_w #pt #pl #pg
     * @param from_ets
     * @param to_ets
     * @param ent_i
     */
    navAnyToAny(from_ets, to_ets, ent_i) {
        // console.log("navAnyToAny");
        // check if this is nav coll to coll
        // for coll to coll, we assume we are going down, from parent to children
        if (from_ets === common_1.EEntType.COLL && to_ets === common_1.EEntType.COLL) {
            return this.navCollToCollChildren(ent_i);
        }
        // same level
        if (from_ets === to_ets) {
            return [ent_i];
        }
        // up or down?
        switch (to_ets) {
            case common_1.EEntType.POSI:
                return this.navAnyToPosi(from_ets, ent_i);
            case common_1.EEntType.VERT:
                return this.navAnyToVert(from_ets, ent_i);
            case common_1.EEntType.EDGE:
                return this.navAnyToEdge(from_ets, ent_i);
            case common_1.EEntType.WIRE:
                return this.navAnyToWire(from_ets, ent_i);
            case common_1.EEntType.POINT:
                return this.navAnyToPoint(from_ets, ent_i);
            case common_1.EEntType.PLINE:
                return this.navAnyToPline(from_ets, ent_i);
            case common_1.EEntType.PGON:
                return this.navAnyToPgon(from_ets, ent_i);
            case common_1.EEntType.COLL:
                return this.navAnyToColl(from_ets, ent_i);
            default:
                throw new Error('Bad navigation in geometry data structure: ' + to_ets + ent_i);
        }
    }
}
exports.GIGeomNav = GIGeomNav;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tTmF2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vZ2VvbS9HSUdlb21OYXYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0NBQWlEO0FBRWpEOztHQUVHO0FBQ0gsTUFBYSxTQUFTO0lBR2xCOztPQUVHO0lBQ0gsWUFBWSxTQUFzQixFQUFFLFNBQW9CO1FBQ3BELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQ2hDLENBQUM7SUFDRCwrRUFBK0U7SUFDL0UsOEJBQThCO0lBQzlCLCtFQUErRTtJQUMvRTs7O09BR0c7SUFDSSxhQUFhLENBQUMsTUFBYztRQUMvQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksYUFBYSxDQUFDLE1BQWM7UUFDL0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBaUI7SUFDeEUsQ0FBQztJQUNEOzs7T0FHRztJQUNJLGFBQWEsQ0FBQyxNQUFjO1FBQy9CLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsaUJBQWlCO0lBQ3hFLENBQUM7SUFDRDs7O09BR0c7SUFDSSxjQUFjLENBQUMsT0FBZTtRQUNqQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksY0FBYyxDQUFDLE1BQWM7UUFDaEMsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFD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