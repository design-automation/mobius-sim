"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIMGeomImpExp = void 0;
const common_1 = require("../common");
/**
 * Class for ...
 */
class SIMGeomImpExp {
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
            this.modeldata.geom.snapshot.addNewEnt(ssid, common_1.EEntType.POSI, other_posi_i);
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
            this.modeldata.updateEntTs(common_1.EEntType.POINT, other_point_i);
            // snapshot
            this.modeldata.geom.snapshot.addNewEnt(ssid, common_1.EEntType.POINT, other_point_i);
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
            this.modeldata.updateEntTs(common_1.EEntType.PLINE, other_pline_i);
            // snapshot
            this.modeldata.geom.snapshot.addNewEnt(ssid, common_1.EEntType.PLINE, other_pline_i);
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
            this.modeldata.updateEntTs(common_1.EEntType.PGON, other_pgon_i);
            // snapshot
            this.modeldata.geom.snapshot.addNewEnt(ssid, common_1.EEntType.PGON, other_pgon_i);
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
            this.modeldata.geom.snapshot.addNewEnt(ssid, common_1.EEntType.COLL, other_coll_i);
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
            const posi_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.POINT, ent_i)[0];
            data.points.push(renum_maps.posis.get(posi_i));
        });
        // plines -> posis
        ent_sets.pl.forEach(ent_i => {
            const posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.PLINE, ent_i);
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
                const posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.WIRE, wire_i);
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
exports.SIMGeomImpExp = SIMGeomImpExp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU0lNR2VvbUltcEV4cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vZ2VvbS9TSU1HZW9tSW1wRXhwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHNDQUMwSDtBQUcxSDs7R0FFRztBQUNILE1BQWEsYUFBYTtJQUd0Qjs7T0FFRztJQUNILFlBQVksU0FBc0IsRUFBRSxTQUFvQjtRQUNwRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUNoQyxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0kscUJBQXFCLENBQUUsU0FBdUI7UUFDakQsd0VBQXdFO1FBQ3hFLE1BQU0sS0FBSyxHQUFZLEVBQUUsQ0FBQztRQUMxQixNQUFNLEtBQUssR0FBWSxFQUFFLENBQUM7UUFDMUIsTUFBTSxLQUFLLEdBQVksRUFBRSxDQUFDO1FBQzFCLE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUM1QixNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDNUIsTUFBTSxLQUFLLEdBQVksRUFBRSxDQUFDO1FBQzFCLHFCQUFxQjtRQUNyQixLQUFLLE1BQU0sS0FBSyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDO1NBQ3hDO1FBQ0Qsd0JBQXdCO1FBQ3hCLEtBQUssTUFBTSxLQUFLLElBQUksU0FBUyxDQUFDLE1BQU0sRUFBRTtZQUNsQyxNQUFNLE1BQU0sR0FBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDNUQsTUFBTSxTQUFTLEdBQVcsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxD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