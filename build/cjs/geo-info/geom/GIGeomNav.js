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
        if (ent_type === common_1.EEntType.COLL) {
            for (const point_i of this.navCollToPoint(ent_i)) {
                verts_i.push(this.navPointToVert(point_i));
            }
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tTmF2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9nZW9tL0dJR2VvbU5hdi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQ0FBaUQ7QUFFakQ7O0dBRUc7QUFDSCxNQUFhLFNBQVM7SUFHbEI7O09BRUc7SUFDSCxZQUFZLFNBQXNCLEVBQUUsU0FBb0I7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUNELCtFQUErRTtJQUMvRSw4QkFBOEI7SUFDOUIsK0VBQStFO0lBQy9FOzs7T0FHRztJQUNJLGFBQWEsQ0FBQyxNQUFjO1FBQy9CLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFDRDs7O09BR0c7SUFDSSxhQUFhLENBQUMsTUFBYztRQUMvQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtJQUN4RSxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksYUFBYSxDQUFDLE1BQWM7UUFDL0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBaUI7SUFDeEUsQ0FBQztJQUNEOzs7T0FHRztJQUNJLGNBQWMsQ0FBQyxPQUFlO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFDRDs7O09BR0c7SUFDSSxjQUFjLENBQUMsTUFBYztRQUNoQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RCxD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