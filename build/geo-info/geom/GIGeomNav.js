import { EEntType } from '../common';
/**
 * Class for navigating the geometry.
 */
export class GIGeomNav {
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
        return this._geom_maps.up_posis_verts.get(posi_i).filter(ent_i => this.modeldata.geom.snapshot.hasEnt(ssid, EEntType.VERT, ent_i));
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
        if (ent_type === EEntType.EDGE) {
            return [ent_i];
        }
        if (ent_type === EEntType.VERT) {
            const edges_i = [];
            const v_edges_i = this._geom_maps.up_verts_edges.get(ent_i);
            if (v_edges_i !== undefined) {
                for (const edge_i of v_edges_i) {
                    edges_i.push(edge_i);
                }
            }
            return edges_i;
        }
        if (ent_type === EEntType.POSI) {
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
        if (ent_type === EEntType.WIRE) {
            return [ent_i];
        }
        if (ent_type === EEntType.EDGE) {
            return [this._geom_maps.up_edges_wires.get(ent_i)];
        }
        if (ent_type === EEntType.VERT) {
            const edges_i = this._geom_maps.up_verts_edges.get(ent_i);
            if (edges_i !== undefined) {
                return [this._geom_maps.up_edges_wires.get(edges_i[0])]; // only 1 edge
            }
        }
        // a vertex can have two edges which belong to the same wire
        // we do not want to have two copies of that wire, so we need to take care to only get 1 edge
        if (ent_type === EEntType.POSI) {
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
        if (ent_type === EEntType.POINT) {
            return [ent_i];
        }
        if (ent_type === EEntType.VERT) {
            const point_i = this._geom_maps.up_verts_points.get(ent_i);
            return point_i === undefined ? [] : [point_i];
        }
        if (ent_type === EEntType.POSI) {
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
        if (ent_type === EEntType.PLINE) {
            return [ent_i];
        }
        if (ent_type === EEntType.POINT) {
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
        if (ent_type === EEntType.PGON) {
            return [ent_i];
        }
        if (ent_type > EEntType.WIRE) {
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
        if (ent_type === EEntType.COLL) {
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
        if (ent_type === EEntType.POSI) {
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
        if (ent_type === EEntType.WIRE) {
            return [ent_i];
        }
        if (ent_type === EEntType.PLINE) {
            return [this._geom_maps.dn_plines_wires.get(ent_i)];
        }
        if (ent_type === EEntType.PGON) {
            return this._geom_maps.dn_pgons_wires.get(ent_i); // WARNING BY REF
        }
        if (ent_type === EEntType.COLL) {
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
        if (ent_type === EEntType.EDGE) {
            return [ent_i];
        }
        if (ent_type === EEntType.WIRE) {
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
        if (ent_type === EEntType.VERT) {
            return [ent_i];
        }
        if (ent_type === EEntType.EDGE) {
            return this._geom_maps.dn_edges_verts.get(ent_i);
        }
        if (ent_type === EEntType.WIRE) {
            return this.modeldata.geom.query.getWireVerts(ent_i);
        }
        if (ent_type === EEntType.POINT) {
            return [this._geom_maps.dn_points_verts.get(ent_i)];
        }
        const verts_i = [];
        if (ent_type === EEntType.COLL) {
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
        if (ent_type === EEntType.POSI) {
            return [ent_i];
        }
        if (ent_type === EEntType.VERT) {
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
        if (ent_type === EEntType.POSI) {
            return [ent_i];
        }
        return this._navDnAnyToPosi(ent_type, ent_i);
    }
    navAnyToVert(ent_type, ent_i) {
        // console.log("navAnyToVert");
        if (ent_type === EEntType.VERT) {
            return [ent_i];
        }
        if (ent_type === EEntType.POSI) {
            return this.navPosiToVert(ent_i); // WARNING BY REF
        }
        return this._navDnAnyToVert(ent_type, ent_i);
    }
    navAnyToEdge(ent_type, ent_i) {
        // console.log("navAnyToEdge");
        if (ent_type === EEntType.EDGE) {
            return [ent_i];
        }
        if (ent_type <= EEntType.EDGE) {
            return this._navUpAnyToEdge(ent_type, ent_i);
        }
        return this._navDnAnyToEdge(ent_type, ent_i);
    }
    navAnyToWire(ent_type, ent_i) {
        // console.log("navAnyToWire");
        if (ent_type === EEntType.WIRE) {
            return [ent_i];
        }
        if (ent_type <= EEntType.WIRE) {
            return this._navUpAnyToWire(ent_type, ent_i);
        }
        return this._navDnAnyToWire(ent_type, ent_i);
    }
    navAnyToPoint(ent_type, ent_i) {
        // console.log("navAnyToPoint");
        if (ent_type === EEntType.POINT) {
            return [ent_i];
        }
        if (ent_type <= EEntType.POINT) {
            return this._navUpAnyToPoint(ent_type, ent_i);
        }
        if (ent_type === EEntType.COLL) {
            return this.navCollToPoint(ent_i);
        }
        return [];
    }
    navAnyToPline(ent_type, ent_i) {
        // console.log("navAnyToPline");
        if (ent_type === EEntType.PLINE) {
            return [ent_i];
        }
        if (ent_type <= EEntType.PLINE) {
            return this._navUpAnyToPline(ent_type, ent_i);
        }
        if (ent_type === EEntType.COLL) {
            return this.navCollToPline(ent_i);
        }
        return [];
    }
    navAnyToPgon(ent_type, ent_i) {
        // console.log("navAnyToPgon");
        if (ent_type === EEntType.PGON) {
            return [ent_i];
        }
        if (ent_type <= EEntType.PGON) {
            return this._navUpAnyToPgon(ent_type, ent_i);
        }
        if (ent_type === EEntType.COLL) {
            return this.navCollToPgon(ent_i);
        }
        return [];
    }
    navAnyToColl(ent_type, ent_i) {
        // console.log("navAnyToColl");
        if (ent_type === EEntType.COLL) {
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
        if (from_ets === EEntType.COLL && to_ets === EEntType.COLL) {
            return this.navCollToCollChildren(ent_i);
        }
        // same level
        if (from_ets === to_ets) {
            return [ent_i];
        }
        // up or down?
        switch (to_ets) {
            case EEntType.POSI:
                return this.navAnyToPosi(from_ets, ent_i);
            case EEntType.VERT:
                return this.navAnyToVert(from_ets, ent_i);
            case EEntType.EDGE:
                return this.navAnyToEdge(from_ets, ent_i);
            case EEntType.WIRE:
                return this.navAnyToWire(from_ets, ent_i);
            case EEntType.POINT:
                return this.navAnyToPoint(from_ets, ent_i);
            case EEntType.PLINE:
                return this.navAnyToPline(from_ets, ent_i);
            case EEntType.PGON:
                return this.navAnyToPgon(from_ets, ent_i);
            case EEntType.COLL:
                return this.navAnyToColl(from_ets, ent_i);
            default:
                throw new Error('Bad navigation in geometry data structure: ' + to_ets + ent_i);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tTmF2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGlicy9nZW8taW5mby9nZW9tL0dJR2VvbU5hdi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUcsUUFBUSxFQUFhLE1BQU0sV0FBVyxDQUFDO0FBRWpEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFNBQVM7SUFHbEI7O09BRUc7SUFDSCxZQUFZLFNBQXNCLEVBQUUsU0FBb0I7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUNELCtFQUErRTtJQUMvRSw4QkFBOEI7SUFDOUIsK0VBQStFO0lBQy9FOzs7T0FHRztJQUNJLGFBQWEsQ0FBQyxNQUFjO1FBQy9CLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFDRDs7O09BR0c7SUFDSSxhQUFhLENBQUMsTUFBYztRQUMvQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtJQUN4RSxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksYUFBYSxDQUFDLE1BQWM7UUFDL0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBaUI7SUFDeEUsQ0FBQztJQUNEOzs7T0FHRztJQUNJLGNBQWMsQ0FBQyxPQUFlO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFDRDs7O09BR0c7SUFDSSxjQUFjLENBQUMsTUFBYztRQUNoQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksYUFBYSxDQUFDLE1BQWM7UUFDL0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBaUI7SUFDeEUsQ0FBQztJQUNEOzs7T0FHRztJQUNJLGNBQWMsQ0FBQyxNQUFjO1FBQ2hDLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUNEOzs7T0FHRztJQUNJLGNBQWMsQ0FBQyxNQUFjO1FBQ2hDLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUNEOzs7T0FHRztJQUNJLGFBQWEsQ0FBQyxNQUFjO1FBQy9CLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUNEOzs7T0FHRztJQUNJLHFCQUFxQixDQUFDLE1BQWM7UUFDdkMsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDaEQsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLGdCQUFnQjtJQUN2RixDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksd0JBQXdCLENBQUMsTUFBYztRQUMxQyxNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUNELCtFQUErRTtJQUMvRSw0QkFBNEI7SUFDNUIsK0VBQStFO0lBQy9FOzs7T0FHRztJQUNJLGFBQWEsQ0FBQyxNQUFjO1FBQy9CLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBRSxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUUsQ0FBQztJQUN6SSxDQUFDO0lBQ0Q7Ozs7O09BS0c7SUFDSSxhQUFhLENBQUMsTUFBYztRQUMvQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtJQUN4RSxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksYUFBYSxDQUFDLE1BQWM7UUFDL0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUNEOzs7T0FHRztJQUNJLGNBQWMsQ0FBQyxNQUFjO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFDRDs7O09BR0c7SUFDSSxjQUFjLENBQUMsTUFBYztRQUNoQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksWUFBWSxDQUFDLEtBQWE7UUFDN0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUNEOzs7T0FHRztJQUNJLGFBQWEsQ0FBQyxNQUFjO1FBQy9CLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFDRDs7O09BR0c7SUFDSSxjQUFjLENBQUMsT0FBZTtRQUNqQyxNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFDRDs7O09BR0c7SUFDSSxjQUFjLENBQUMsT0FBZTtRQUNqQyxNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFDRDs7O09BR0c7SUFDSSxhQUFhLENBQUMsTUFBYztRQUMvQixNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFDRDs7O09BR0c7SUFDSSxtQkFBbUIsQ0FBQyxNQUFjO1FBQ3JDLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxjQUFjO0lBQ25GLENBQUM7SUFDRDs7O09BR0c7SUFDSSxzQkFBc0IsQ0FBQyxNQUFjO1FBQ3hDLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLHNCQUFzQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBQ0QsK0VBQStFO0lBQy9FLHFDQUFxQztJQUNyQywrRUFBK0U7SUFDL0U7OztPQUdHO0lBQ0ssZUFBZSxDQUFDLFFBQWtCLEVBQUUsS0FBYTtRQUNyRCxrQ0FBa0M7UUFDbEMsdURBQXVEO1FBQ3ZELElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTtRQUNuRCxJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQzVCLE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztZQUM3QixNQUFNLFNBQVMsR0FBYSxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEUsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO2dCQUN6QixLQUFLLE1BQU0sTUFBTSxJQUFJLFNBQVMsRUFBRTtvQkFDNUIsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDeEI7YUFDSjtZQUNELE9BQU8sT0FBTyxDQUFDO1NBQ2xCO1FBQ0QsSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRTtZQUM1QixxQ0FBcUM7WUFDckMsaUZBQWlGO1lBQ2pGLE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztZQUM3QixLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzVDLE1BQU0sU0FBUyxHQUFhLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdkUsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO29CQUN6QixLQUFLLE1BQU0sTUFBTSxJQUFJLFNBQVMsRUFBRTt3QkFDNUIsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDeEI7aUJBQ0o7YUFDSjtZQUNELE9BQU8sT0FBTyxDQUFDO1NBQ2xCO1FBQ0QsT0FBTyxFQUFFLENBQUMsQ0FBQyxTQUFTO0lBQ3hCLENBQUM7SUFDRDs7O09BR0c7SUFDSyxlQUFlLENBQUMsUUFBa0IsRUFBRSxLQUFhO1FBQ3JELGtDQUFrQztRQUNsQyx1REFBdUQ7UUFDdkQsSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRTtZQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUFFO1FBQ25ELElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDNUIsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ3REO1FBQ0QsSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRTtZQUM1QixNQUFNLE9BQU8sR0FBYSxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEUsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO2dCQUN2QixPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjO2FBQzFFO1NBQ0o7UUFDRCw0REFBNEQ7UUFDNUQsNkZBQTZGO1FBQzdGLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDNUIsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO1lBQzdCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDNUMsTUFBTSxPQUFPLEdBQWEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNyRSxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7b0JBQ3ZCLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxjQUFjO2lCQUNqRjthQUNKO1lBQ0QsT0FBTyxPQUFPLENBQUM7U0FDbEI7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFDRDs7O09BR0c7SUFDSyxnQkFBZ0IsQ0FBQyxRQUFrQixFQUFFLEtBQWE7UUFDdEQsbUNBQW1DO1FBQ25DLHdEQUF3RDtRQUN4RCxJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsS0FBSyxFQUFFO1lBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUU7UUFDcEQsSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRTtZQUM1QixNQUFNLE9BQU8sR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkUsT0FBTyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDakQ7UUFDRCxJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQzVCLE1BQU0sUUFBUSxHQUFhLEVBQUUsQ0FBQztZQUM5QixLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzVDLE1BQU0sT0FBTyxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDcEUsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO29CQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQUU7YUFDekQ7WUFDRCxPQUFPLFFBQVEsQ0FBQztTQUNuQjtRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUNEOzs7T0FHRztJQUNLLGdCQUFnQixDQUFDLFFBQWtCLEVBQUUsS0FBYTtRQUN0RCxtQ0FBbUM7UUFDbkMsd0RBQXdEO1FBQ3hELElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxLQUFLLEVBQUU7WUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTtRQUNwRCxJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsS0FBSyxFQUFFO1lBQUUsT0FBTSxFQUFFLENBQUM7U0FBRTtRQUM5QyxNQUFNLFFBQVEsR0FBYSxFQUFFLENBQUM7UUFDOUIsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUN4RCxNQUFNLE9BQU8sR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEUsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO2dCQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7YUFBRTtTQUN6RDtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFDRDs7O09BR0c7SUFDSyxlQUFlLENBQUMsUUFBa0IsRUFBRSxLQUFhO1FBQ3JELGtDQUFrQztRQUNsQyx1REFBdUQ7UUFDdkQsSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRTtZQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUFFO1FBQ25ELElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFBRSxPQUFNLEVBQUUsQ0FBQztTQUFFLENBQUMsa0JBQWtCO1FBQzlELE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztRQUM3QixLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ3hELE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsRSxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUFFO1NBQ3REO1FBQ0QsMEVBQTBFO1FBQzFFLG9EQUFvRDtRQUNwRCx3REFBd0Q7UUFDeEQsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUNEOzs7T0FHRztJQUNLLGVBQWUsQ0FBQyxRQUFrQixFQUFFLEtBQWE7UUFDckQsa0NBQWtDO1FBQ2xDLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTtRQUNuRCxNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7UUFDN0IsS0FBSyxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUN2RCxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQy9DLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDeEI7U0FDSjtRQUNELEtBQUssTUFBTSxPQUFPLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDdkQsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUMvQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3hCO1NBQ0o7UUFDRCxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ3JELEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDN0MsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN4QjtTQUNKO1FBQ0QsZ0RBQWdEO1FBQ2hELElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFBRSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUFFO1FBQ3hFLE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFDRCwrRUFBK0U7SUFDL0UsdUNBQXVDO0lBQ3ZDLCtFQUErRTtJQUMvRTs7O09BR0c7SUFDSyxlQUFlLENBQUMsUUFBa0IsRUFBRSxLQUFhO1FBQ3JELGtDQUFrQztRQUNsQyx1REFBdUQ7UUFDdkQsSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRTtZQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUFFO1FBQ25ELElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxLQUFLLEVBQUU7WUFDN0IsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ3ZEO1FBQ0QsSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRTtZQUM1QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtTQUN0RTtRQUNELElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDNUIsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO1lBQzdCLEtBQUssTUFBTSxPQUFPLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDOUMsT0FBTyxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUUsQ0FBQzthQUNoRTtZQUNELEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDNUMsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQzdELE9BQU8sQ0FBQyxJQUFJLENBQUUsTUFBTSxDQUFFLENBQUM7aUJBQzFCO2FBQ0o7WUFDRCxPQUFPLE9BQU8sQ0FBQztTQUNsQjtRQUNELE9BQU8sRUFBRSxDQUFDLENBQUMsU0FBUztJQUN4QixDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ssZUFBZSxDQUFDLFFBQWtCLEVBQUUsS0FBYTtRQUNyRCxrQ0FBa0M7UUFDbEMsdURBQXVEO1FBQ3ZELElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTtRQUNuRCxJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQUUsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTtRQUNyRixNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7UUFDN0IsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUN4RCxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDN0QsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN4QjtTQUNKO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUNEOzs7T0FHRztJQUNLLGVBQWUsQ0FBQyxRQUFrQixFQUFFLEtBQWE7UUFDckQsa0NBQWtDO1FBQ2xDLHVEQUF1RDtRQUN2RCxJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUU7UUFDbkQsSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUU7UUFDckYsSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUFFO1FBQ3pGLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxLQUFLLEVBQUU7WUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FBRTtRQUN6RixNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7UUFDN0IsSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRTtZQUM1QixLQUFLLE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzlDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQzlDO1NBQ0o7UUFDRCxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ3hELEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDakUsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN4QjtTQUNKO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUNEOzs7T0FHRztJQUNLLGVBQWUsQ0FBQyxRQUFrQixFQUFFLEtBQWE7UUFDckQsa0NBQWtDO1FBQ2xDLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTtRQUNuRCxJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQUUsT0FBTyxDQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBRSxDQUFDO1NBQUU7UUFDekYseUVBQXlFO1FBQ3pFLE1BQU0sV0FBVyxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQzNDLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDeEQsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUMvRDtRQUNELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBQ0QsK0VBQStFO0lBQy9FLG9CQUFvQjtJQUNwQiwrRUFBK0U7SUFDeEUsWUFBWSxDQUFDLFFBQWtCLEVBQUUsS0FBYTtRQUNqRCwrQkFBK0I7UUFDL0IsSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRTtZQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUFFO1FBQ25ELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUNNLFlBQVksQ0FBQyxRQUFrQixFQUFFLEtBQWE7UUFDakQsK0JBQStCO1FBQy9CLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTtRQUNuRCxJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQzVCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtTQUN0RDtRQUNELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUNNLFlBQVksQ0FBQyxRQUFrQixFQUFFLEtBQWE7UUFDakQsK0JBQStCO1FBQy9CLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTtRQUNuRCxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQzNCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDaEQ7UUFDRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFDTSxZQUFZLENBQUMsUUFBa0IsRUFBRSxLQUFhO1FBQ2pELCtCQUErQjtRQUMvQixJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUU7UUFDbkQsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLElBQUksRUFBRTtZQUMzQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2hEO1FBQ0QsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQ00sYUFBYSxDQUFDLFFBQWtCLEVBQUUsS0FBYTtRQUNsRCxnQ0FBZ0M7UUFDaEMsSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLEtBQUssRUFBRTtZQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUFFO1FBQ3BELElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUU7WUFDNUIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2pEO1FBQ0QsSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRTtZQUM1QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDckM7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFDTSxhQUFhLENBQUMsUUFBa0IsRUFBRSxLQUFhO1FBQ2xELGdDQUFnQztRQUNoQyxJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsS0FBSyxFQUFFO1lBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUU7UUFDcEQsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtZQUM1QixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDakQ7UUFDRCxJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQzVCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNyQztRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUNNLFlBQVksQ0FBQyxRQUFrQixFQUFFLEtBQWE7UUFDakQsK0JBQStCO1FBQy9CLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTtRQUNuRCxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQzNCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDaEQ7UUFDRCxJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQzVCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNwQztRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUNNLFlBQVksQ0FBQyxRQUFrQixFQUFFLEtBQWE7UUFDakQsK0JBQStCO1FBQy9CLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTtRQUNuRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFDRCwrRUFBK0U7SUFDL0Usc0JBQXNCO0lBQ3RCLCtFQUErRTtJQUMvRTs7Ozs7O09BTUc7SUFDSSxXQUFXLENBQUMsUUFBa0IsRUFBRSxNQUFnQixFQUFFLEtBQWE7UUFDbEUsOEJBQThCO1FBQzlCLG9DQUFvQztRQUNwQyx5RUFBeUU7UUFDekUsSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksSUFBSSxNQUFNLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRTtZQUN4RCxPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM1QztRQUNELGFBQWE7UUFDYixJQUFJLFFBQVEsS0FBSyxNQUFNLEVBQUU7WUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTtRQUM1QyxjQUFjO1FBQ2QsUUFBUSxNQUFNLEVBQUU7WUFDWixLQUFLLFFBQVEsQ0FBQyxJQUFJO2dCQUNkLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDOUMsS0FBSyxRQUFRLENBQUMsSUFBSTtnQkFDZCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzlDLEtBQUssUUFBUSxDQUFDLElBQUk7Z0JBQ2QsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM5QyxLQUFLLFFBQVEsQ0FBQyxJQUFJO2dCQUNkLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDOUMsS0FBSyxRQUFRLENBQUMsS0FBSztnQkFDZixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9DLEtBQUssUUFBUSxDQUFDLEtBQUs7Z0JBQ2YsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMvQyxLQUFLLFFBQVEsQ0FBQyxJQUFJO2dCQUNkLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDOUMsS0FBSyxRQUFRLENBQUMsSUFBSTtnQkFDZCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzlDO2dCQUNJLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDO1NBQ3ZGO0lBQ0wsQ0FBQztDQUNKIn0=