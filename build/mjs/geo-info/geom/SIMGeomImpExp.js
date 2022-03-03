import { EEntType } from '../common';
/**
 * Class for ...
 */
export class SIMGeomImpExp {
    modeldata;
    _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata, geom_maps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    /**
     * Reconstruct the topology data, adding vertsm edges, wires.
     * @param geom_data The data from the SIM file
     */
    importReconstructTopo(geom_data) {
        // reconstruct verts, edges, wires base don the list of positions in SIM
        const verts = [];
        const edges = [];
        const wires = [];
        const points = [];
        const plines = [];
        const pgons = [];
        // reconstruct points
        for (const point of geom_data.points) {
            points.push(verts.push(point) - 1);
        }
        // reconstruct polylines
        for (const pline of geom_data.plines) {
            const closed = pline[0] == pline[pline.length - 1];
            const num_verts = closed ? pline.length - 1 : pline.length;
            const verts_i = [];
            for (let i = 0; i < num_verts; i++) {
                verts_i.push(verts.push(pline[i]) - 1);
            }
            const edges_i = [];
            for (let i = 0; i < num_verts - 1; i++) {
                edges_i.push(edges.push([verts_i[i], verts_i[i + 1]]) - 1);
            }
            if (closed) {
                edges_i.push(edges.push([verts_i[num_verts - 1], verts_i[0]]) - 1);
            }
            plines.push(wires.push(edges_i) - 1);
        }
        // reconstruct polygons
        for (const pgon of geom_data.pgons) {
            const wires_i = [];
            for (const wire of pgon) {
                const verts_i = [];
                for (let i = 0; i < wire.length; i++) {
                    verts_i.push(verts.push(wire[i]) - 1);
                }
                const edges_i = [];
                for (let i = 0; i < verts_i.length - 1; i++) {
                    edges_i.push(edges.push([verts_i[i], verts_i[i + 1]]) - 1);
                }
                edges_i.push(edges.push([verts_i[verts_i.length - 1], verts_i[0]]) - 1);
                wires_i.push(wires.push(edges_i) - 1);
            }
            pgons.push(wires_i);
        }
        return {
            num_posis: geom_data.num_posis,
            verts: verts,
            edges: edges,
            wires: wires,
            points: points,
            plines: plines,
            pgons: pgons,
            coll_pgons: geom_data.coll_pgons,
            coll_plines: geom_data.coll_plines,
            coll_points: geom_data.coll_points,
            coll_colls: geom_data.coll_colls
        };
    }
    /**
     * Import GI data into this model, and renumber teh entities in the process.
     * @param other_geom_maps The data to import
     */
    importSIMRenum(geom_data) {
        // positions
        const renum_posis_map = new Map();
        for (let i = 0; i < geom_data.num_posis; i++) {
            renum_posis_map.set(i, this.modeldata.model.metadata.nextPosi());
        }
        // vertices
        const renum_verts_map = new Map();
        for (let i = 0; i < geom_data.verts.length; i++) {
            renum_verts_map.set(i, this.modeldata.model.metadata.nextVert());
        }
        // edges
        const renum_edges_map = new Map();
        for (let i = 0; i < geom_data.edges.length; i++) {
            renum_edges_map.set(i, this.modeldata.model.metadata.nextEdge());
        }
        // wires
        const renum_wires_map = new Map();
        for (let i = 0; i < geom_data.wires.length; i++) {
            renum_wires_map.set(i, this.modeldata.model.metadata.nextWire());
        }
        // points
        const renum_points_map = new Map();
        for (let i = 0; i < geom_data.points.length; i++) {
            renum_points_map.set(i, this.modeldata.model.metadata.nextPoint());
        }
        // plines
        const renum_plines_map = new Map();
        for (let i = 0; i < geom_data.plines.length; i++) {
            renum_plines_map.set(i, this.modeldata.model.metadata.nextPline());
        }
        // pgons
        const renum_pgons_map = new Map();
        for (let i = 0; i < geom_data.pgons.length; i++) {
            renum_pgons_map.set(i, this.modeldata.model.metadata.nextPgon());
        }
        // colls
        const renum_colls_map = new Map();
        for (let i = 0; i < geom_data.coll_pgons.length; i++) {
            renum_colls_map.set(i, this.modeldata.model.metadata.nextColl());
        }
        // return maps
        const renum_maps = {
            posis: renum_posis_map,
            verts: renum_verts_map,
            edges: renum_edges_map,
            wires: renum_wires_map,
            points: renum_points_map,
            plines: renum_plines_map,
            pgons: renum_pgons_map,
            colls: renum_colls_map
        };
        return renum_maps;
    }
    /**
     * Import GI data into this model
     * @param other_geom_maps The geom_arrays of the other model.
     */
    importSIM(geom_data, renum_maps) {
        const ssid = this.modeldata.active_ssid;
        // posis->verts, create empty []
        for (let i = 0; i < geom_data.num_posis; i++) {
            const other_posi_i = renum_maps.posis.get(i);
            this._geom_maps.up_posis_verts.set(other_posi_i, []);
            // snapshot
            this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.POSI, other_posi_i);
        }
        // add vertices to model
        for (let i = 0; i < geom_data.verts.length; i++) {
            const other_vert_i = renum_maps.verts.get(i);
            const other_posi_i = renum_maps.posis.get(geom_data.verts[i]);
            // down
            this._geom_maps.dn_verts_posis.set(other_vert_i, other_posi_i);
            // up
            this._geom_maps.up_posis_verts.get(other_posi_i).push(other_vert_i);
        }
        // add edges to model
        for (let i = 0; i < geom_data.edges.length; i++) {
            const other_edge_i = renum_maps.edges.get(i);
            const other_verts_i = geom_data.edges[i].map(other_vert_i => renum_maps.verts.get(other_vert_i));
            // down
            this._geom_maps.dn_edges_verts.set(other_edge_i, other_verts_i);
            // up
            other_verts_i.forEach((vert_i, index) => {
                if (!this._geom_maps.up_verts_edges.has(vert_i)) {
                    this._geom_maps.up_verts_edges.set(vert_i, []);
                }
                if (index === 0) {
                    this._geom_maps.up_verts_edges.get(vert_i).push(other_edge_i);
                }
                else if (index === 1) {
                    this._geom_maps.up_verts_edges.get(vert_i).splice(0, 0, other_edge_i);
                }
                if (index > 1) {
                    throw new Error('Import data error: Found an edge with more than two vertices.');
                }
            });
        }
        // add wires to model
        for (let i = 0; i < geom_data.wires.length; i++) {
            const other_wire_i = renum_maps.wires.get(i);
            const other_edges_i = geom_data.wires[i].map(other_edge_i => renum_maps.edges.get(other_edge_i));
            // down
            this._geom_maps.dn_wires_edges.set(other_wire_i, other_edges_i);
            // up
            other_edges_i.forEach(edge_i => {
                this._geom_maps.up_edges_wires.set(edge_i, other_wire_i);
            });
        }
        // add points to model
        for (let i = 0; i < geom_data.points.length; i++) {
            const other_point_i = renum_maps.points.get(i);
            const other_vert_i = renum_maps.verts.get(geom_data.points[i]);
            // down
            this._geom_maps.dn_points_verts.set(other_point_i, other_vert_i);
            // up
            this._geom_maps.up_verts_points.set(other_vert_i, other_point_i);
            // timestamp
            this.modeldata.updateEntTs(EEntType.POINT, other_point_i);
            // snapshot
            this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.POINT, other_point_i);
        }
        // add plines to model
        for (let i = 0; i < geom_data.plines.length; i++) {
            const other_pline_i = renum_maps.plines.get(i);
            const other_wire_i = renum_maps.wires.get(geom_data.plines[i]);
            // down
            this._geom_maps.dn_plines_wires.set(other_pline_i, other_wire_i);
            // up
            this._geom_maps.up_wires_plines.set(other_wire_i, other_pline_i);
            // timestamp
            this.modeldata.updateEntTs(EEntType.PLINE, other_pline_i);
            // snapshot
            this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.PLINE, other_pline_i);
        }
        // add pgons to model
        for (let i = 0; i < geom_data.pgons.length; i++) {
            const other_pgon_i = renum_maps.pgons.get(i);
            const other_wires_i = geom_data.pgons[i].map(other_wire_i => renum_maps.wires.get(other_wire_i));
            // down
            this._geom_maps.dn_pgons_wires.set(other_pgon_i, other_wires_i);
            // up
            other_wires_i.forEach(wire_i => {
                this._geom_maps.up_wires_pgons.set(wire_i, other_pgon_i);
            });
            // timestamp
            this.modeldata.updateEntTs(EEntType.PGON, other_pgon_i);
            // snapshot
            this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.PGON, other_pgon_i);
        }
        // add colls to model
        for (let i = 0; i < geom_data.coll_pgons.length; i++) {
            // const other_coll_i: number = gi_data.colls_i[i];
            // // set
            // this._geom_maps.colls.add( renum_colls_map.get(other_coll_i) );
            // // snapshot
            // this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.COLL, other_coll_i);
            const other_coll_i = renum_maps.colls.get(i);
            const other_pgons_i = geom_data.coll_pgons[i].map(coll_pgon_i => renum_maps.pgons.get(coll_pgon_i));
            const other_plines_i = geom_data.coll_plines[i].map(coll_pline_i => renum_maps.plines.get(coll_pline_i));
            const other_points_i = geom_data.coll_points[i].map(coll_point_i => renum_maps.points.get(coll_point_i));
            const other_childs_i = geom_data.coll_colls[i].map(coll_child_i => renum_maps.colls.get(coll_child_i));
            // set
            this._geom_maps.colls.add(other_coll_i);
            // snapshot (creates new empts sets of pgons, plines, points, and child collections)
            this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.COLL, other_coll_i);
            // add contents of collection in this snapshot
            this.modeldata.geom.snapshot.addCollPgons(ssid, other_coll_i, other_pgons_i);
            this.modeldata.geom.snapshot.addCollPlines(ssid, other_coll_i, other_plines_i);
            this.modeldata.geom.snapshot.addCollPoints(ssid, other_coll_i, other_points_i);
            this.modeldata.geom.snapshot.addCollChildren(ssid, other_coll_i, other_childs_i);
        }
        // ========================================================================================
        // return ???
    }
    /**
     * Export GI data out of this model.
     */
    exportSIMRenum(ent_sets) {
        let i;
        // posis
        const renum_posis_map = new Map();
        i = 0;
        ent_sets.ps.forEach(ent_i => {
            renum_posis_map.set(ent_i, i);
            i += 1;
        });
        // verts
        const renum_verts_map = new Map();
        i = 0;
        ent_sets._v.forEach(ent_i => {
            renum_verts_map.set(ent_i, i);
            i += 1;
        });
        // // tris
        // const renum_tris_map: Map<number, number> = new Map();
        // i = 0;
        // ent_sets._t.forEach(ent_i => {
        //     renum_tris_map.set(ent_i, i);
        //     i += 1;
        // });
        // edges
        const renum_edges_map = new Map();
        i = 0;
        ent_sets._e.forEach(ent_i => {
            renum_edges_map.set(ent_i, i);
            i += 1;
        });
        // wires
        const renum_wires_map = new Map();
        i = 0;
        ent_sets._w.forEach(ent_i => {
            renum_wires_map.set(ent_i, i);
            i += 1;
        });
        // points
        const renum_points_map = new Map();
        i = 0;
        ent_sets.pt.forEach(ent_i => {
            renum_points_map.set(ent_i, i);
            i += 1;
        });
        // plines
        const renum_plines_map = new Map();
        i = 0;
        ent_sets.pl.forEach(ent_i => {
            renum_plines_map.set(ent_i, i);
            i += 1;
        });
        // pgons
        const renum_pgons_map = new Map();
        i = 0;
        ent_sets.pg.forEach(ent_i => {
            renum_pgons_map.set(ent_i, i);
            i += 1;
        });
        // colls
        const renum_colls_map = new Map();
        i = 0;
        ent_sets.co.forEach(ent_i => {
            renum_colls_map.set(ent_i, i);
            i += 1;
        });
        // return maps
        const renum_maps = {
            posis: renum_posis_map,
            verts: renum_verts_map,
            edges: renum_edges_map,
            wires: renum_wires_map,
            points: renum_points_map,
            plines: renum_plines_map,
            pgons: renum_pgons_map,
            colls: renum_colls_map
        };
        return renum_maps;
    }
    /**
     * Export SIM data out of this model.
     */
    exportSIM(ent_sets, renum_maps) {
        const data = {
            num_posis: 0,
            points: [],
            plines: [],
            pgons: [],
            coll_pgons: [], coll_plines: [], coll_points: [], coll_colls: []
        };
        // posis
        data.num_posis = renum_maps.posis.size;
        // points -> posis
        ent_sets.pt.forEach(ent_i => {
            const posi_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.POINT, ent_i)[0];
            data.points.push(renum_maps.posis.get(posi_i));
        });
        // plines -> posis
        ent_sets.pl.forEach(ent_i => {
            const posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.PLINE, ent_i);
            if (this.modeldata.geom.query.isWireClosed(this.modeldata.geom.nav.navPlineToWire(ent_i))) {
                posis_i.push(posis_i[0]);
            }
            const remapped_posis = posis_i.map(posi_i => renum_maps.posis.get(posi_i));
            data.plines.push(remapped_posis);
        });
        // pgons -> posis
        ent_sets.pg.forEach(ent_i => {
            const wires_i = this._geom_maps.dn_pgons_wires.get(ent_i);
            const pgon_posis_i = [];
            for (const wire_i of wires_i) {
                const posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
                const remapped_posis = posis_i.map(posi_i => renum_maps.posis.get(posi_i));
                pgon_posis_i.push(remapped_posis);
            }
            data.pgons.push(pgon_posis_i);
        });
        // colls
        ent_sets.co.forEach(ent_i => {
            data.coll_pgons.push(this.modeldata.geom.nav.navCollToPgon(ent_i).map(pgon_i => renum_maps.pgons.get(pgon_i)));
            data.coll_plines.push(this.modeldata.geom.nav.navCollToPline(ent_i).map(pline_i => renum_maps.plines.get(pline_i)));
            data.coll_points.push(this.modeldata.geom.nav.navCollToPoint(ent_i).map(point_i => renum_maps.points.get(point_i)));
            data.coll_colls.push(this.modeldata.geom.nav.navCollToCollChildren(ent_i).map(child_coll_i => renum_maps.colls.get(child_coll_i)));
        });
        return data;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU0lNR2VvbUltcEV4cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vZ2VvbS9TSU1HZW9tSW1wRXhwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFDOEIsUUFBUSxFQUEyRCxNQUFNLFdBQVcsQ0FBQztBQUcxSDs7R0FFRztBQUNILE1BQU0sT0FBTyxhQUFhO0lBQ2QsU0FBUyxDQUFjO0lBQ3ZCLFVBQVUsQ0FBWTtJQUM5Qjs7T0FFRztJQUNILFlBQVksU0FBc0IsRUFBRSxTQUFvQjtRQUNwRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUNoQyxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0kscUJBQXFCLENBQUUsU0FBdUI7UUFDakQsd0VBQXdFO1FBQ3hFLE1BQU0sS0FBSyxHQUFZLEVBQUUsQ0FBQztRQUMxQixNQUFNLEtBQUssR0FBWSxFQUFFLENBQUM7UUFDMUIsTUFBTSxLQUFLLEdBQVksRUFBRSxDQUFDO1FBQzFCLE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUM1QixNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDNUIsTUFBTSxLQUFLLEdBQVksRUFBRSxDQUFDO1FBQzFCLHFCQUFxQjtRQUNyQixLQUFLLE1BQU0sS0FBSyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDO1NBQ3hDO1FBQ0Qsd0JBQXdCO1FBQ3hCLEtBQUssTUFBTSxLQUFLLElBQUksU0FBUyxDQUFDLE1BQU0sRUFBRTtZQUNsQyxNQUFNLE1BQU0sR0FBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDNUQsTUFB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