import { EEntType } from '../common';
/**
 * Class for navigating the geometry.
 */
export class GIGeomNav {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tTmF2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9nZW9tL0dJR2VvbU5hdi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUcsUUFBUSxFQUFhLE1BQU0sV0FBVyxDQUFDO0FBRWpEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFNBQVM7SUFDVixTQUFTLENBQWM7SUFDdkIsVUFBVSxDQUFZO0lBQzlCOztPQUVHO0lBQ0gsWUFBWSxTQUFzQixFQUFFLFNBQW9CO1FBQ3BELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQ2hDLENBQUM7SUFDRCwrRUFBK0U7SUFDL0UsOEJBQThCO0lBQzlCLCtFQUErRTtJQUMvRTs7O09BR0c7SUFDSSxhQUFhLENBQUMsTUFBYztRQUMvQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksYUFBYSxDQUFDLE1BQWM7UUFDL0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBaUI7SUFDeEUsQ0FBQztJQUNEOzs7T0FHRztJQUNJLGFBQWEsQ0FBQyxNQUFjO1FBQy9CLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsaUJBQWlCO0lBQ3hFLENBQUM7SUFDRDs7O09BR0c7SUFDSSxjQUFjLENBQUMsT0FBZTtRQUNqQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksY0FBYyxDQUFDLE1BQWM7UUFDaEMsT0FBTyxJ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