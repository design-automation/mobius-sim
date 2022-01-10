"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIGeomImpExp = void 0;
const common_1 = require("../common");
/**
 * Class for ...
 */
class GIGeomImpExp {
    /**
     * Constructor
     */
    constructor(modeldata, geom_maps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    /**
     * Import GI data into this model, and renumber teh entities in the process.
     * @param other_geom_maps The data to import
     */
    importGIRenum(gi_data) {
        // positions
        const renum_posis_map = new Map();
        for (let i = 0; i < gi_data.num_posis; i++) {
            renum_posis_map.set(i, this.modeldata.model.metadata.nextPosi());
        }
        // vertices
        const renum_verts_map = new Map();
        for (let i = 0; i < gi_data.verts.length; i++) {
            renum_verts_map.set(i, this.modeldata.model.metadata.nextVert());
        }
        // triangles
        const renum_tris_map = new Map();
        for (let i = 0; i < gi_data.tris.length; i++) {
            renum_tris_map.set(i, this.modeldata.model.metadata.nextTri());
        }
        // edges
        const renum_edges_map = new Map();
        for (let i = 0; i < gi_data.edges.length; i++) {
            renum_edges_map.set(i, this.modeldata.model.metadata.nextEdge());
        }
        // wires
        const renum_wires_map = new Map();
        for (let i = 0; i < gi_data.wires.length; i++) {
            renum_wires_map.set(i, this.modeldata.model.metadata.nextWire());
        }
        // points
        const renum_points_map = new Map();
        for (let i = 0; i < gi_data.points.length; i++) {
            renum_points_map.set(i, this.modeldata.model.metadata.nextPoint());
        }
        // plines
        const renum_plines_map = new Map();
        for (let i = 0; i < gi_data.plines.length; i++) {
            renum_plines_map.set(i, this.modeldata.model.metadata.nextPline());
        }
        // pgons
        const renum_pgons_map = new Map();
        for (let i = 0; i < gi_data.pgons.length; i++) {
            renum_pgons_map.set(i, this.modeldata.model.metadata.nextPgon());
        }
        // colls
        const renum_colls_map = new Map();
        for (let i = 0; i < gi_data.coll_pgons.length; i++) {
            renum_colls_map.set(i, this.modeldata.model.metadata.nextColl());
        }
        // return maps
        const renum_maps = {
            posis: renum_posis_map,
            verts: renum_verts_map,
            tris: renum_tris_map,
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
    importGI(gi_data, renum_maps) {
        const ssid = this.modeldata.active_ssid;
        // posis->verts, create empty []
        for (let i = 0; i < gi_data.num_posis; i++) {
            const other_posi_i = renum_maps.posis.get(i);
            this._geom_maps.up_posis_verts.set(other_posi_i, []);
            // snapshot
            this.modeldata.geom.snapshot.addNewEnt(ssid, common_1.EEntType.POSI, other_posi_i);
        }
        // add vertices to model
        for (let i = 0; i < gi_data.verts.length; i++) {
            const other_vert_i = renum_maps.verts.get(i);
            const other_posi_i = renum_maps.posis.get(gi_data.verts[i]);
            // down
            this._geom_maps.dn_verts_posis.set(other_vert_i, other_posi_i);
            // up
            this._geom_maps.up_posis_verts.get(other_posi_i).push(other_vert_i);
        }
        // add triangles to model
        for (let i = 0; i < gi_data.tris.length; i++) {
            const other_tri_i = renum_maps.tris.get(i);
            const other_verts_i = gi_data.tris[i].map(other_vert_i => renum_maps.verts.get(other_vert_i));
            // down
            this._geom_maps.dn_tris_verts.set(other_tri_i, other_verts_i);
            // up
            other_verts_i.forEach(vert_i => {
                if (!this._geom_maps.up_verts_tris.has(vert_i)) {
                    this._geom_maps.up_verts_tris.set(vert_i, []);
                }
                this._geom_maps.up_verts_tris.get(vert_i).push(other_tri_i);
            });
        }
        // add edges to model
        for (let i = 0; i < gi_data.edges.length; i++) {
            const other_edge_i = renum_maps.edges.get(i);
            const other_verts_i = gi_data.edges[i].map(other_vert_i => renum_maps.verts.get(other_vert_i));
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
        for (let i = 0; i < gi_data.wires.length; i++) {
            const other_wire_i = renum_maps.wires.get(i);
            const other_edges_i = gi_data.wires[i].map(other_edge_i => renum_maps.edges.get(other_edge_i));
            // down
            this._geom_maps.dn_wires_edges.set(other_wire_i, other_edges_i);
            // up
            other_edges_i.forEach(edge_i => {
                this._geom_maps.up_edges_wires.set(edge_i, other_wire_i);
            });
        }
        // add points to model
        for (let i = 0; i < gi_data.points.length; i++) {
            const other_point_i = renum_maps.points.get(i);
            const other_vert_i = renum_maps.verts.get(gi_data.points[i]);
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
        for (let i = 0; i < gi_data.plines.length; i++) {
            const other_pline_i = renum_maps.plines.get(i);
            const other_wire_i = renum_maps.wires.get(gi_data.plines[i]);
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
        for (let i = 0; i < gi_data.pgons.length; i++) {
            const other_pgon_i = renum_maps.pgons.get(i);
            const other_wires_i = gi_data.pgons[i].map(other_wire_i => renum_maps.wires.get(other_wire_i));
            const other_tris_i = gi_data.pgontris[i].map(other_tri_i => renum_maps.tris.get(other_tri_i));
            // down
            this._geom_maps.dn_pgons_wires.set(other_pgon_i, other_wires_i);
            this._geom_maps.dn_pgons_tris.set(other_pgon_i, other_tris_i);
            // up
            other_wires_i.forEach(wire_i => {
                this._geom_maps.up_wires_pgons.set(wire_i, other_pgon_i);
            });
            other_tris_i.forEach(tri_i => {
                this._geom_maps.up_tris_pgons.set(tri_i, other_pgon_i);
            });
            // timestamp
            this.modeldata.updateEntTs(common_1.EEntType.PGON, other_pgon_i);
            // snapshot
            this.modeldata.geom.snapshot.addNewEnt(ssid, common_1.EEntType.PGON, other_pgon_i);
        }
        // add colls to model
        for (let i = 0; i < gi_data.coll_pgons.length; i++) {
            // const other_coll_i: number = gi_data.colls_i[i];
            // // set
            // this._geom_maps.colls.add( renum_colls_map.get(other_coll_i) );
            // // snapshot
            // this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.COLL, other_coll_i);
            const other_coll_i = renum_maps.colls.get(i);
            const other_pgons_i = gi_data.coll_pgons[i].map(coll_pgon_i => renum_maps.pgons.get(coll_pgon_i));
            const other_plines_i = gi_data.coll_plines[i].map(coll_pline_i => renum_maps.plines.get(coll_pline_i));
            const other_points_i = gi_data.coll_points[i].map(coll_point_i => renum_maps.points.get(coll_point_i));
            const other_childs_i = gi_data.coll_childs[i].map(coll_child_i => renum_maps.colls.get(coll_child_i));
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
    exportGIRenum(ent_sets) {
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
        // tris
        const renum_tris_map = new Map();
        i = 0;
        ent_sets._t.forEach(ent_i => {
            renum_tris_map.set(ent_i, i);
            i += 1;
        });
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
            tris: renum_tris_map,
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
     * Export GI data out of this model.
     */
    exportGI(ent_sets, renum_maps) {
        const data = {
            num_posis: 0,
            verts: [],
            tris: [],
            edges: [],
            wires: [],
            points: [],
            plines: [],
            pgons: [], pgontris: [],
            coll_pgons: [], coll_plines: [], coll_points: [], coll_childs: [],
            selected: this.modeldata.geom.selected
        };
        // posis
        data.num_posis = renum_maps.posis.size;
        // verts
        ent_sets._v.forEach(ent_i => {
            data.verts.push(renum_maps.posis.get(this._geom_maps.dn_verts_posis.get(ent_i)));
        });
        // tris
        ent_sets._t.forEach(ent_i => {
            data.tris.push(this._geom_maps.dn_tris_verts.get(ent_i).map(vert_i => renum_maps.verts.get(vert_i)));
        });
        // edges
        ent_sets._e.forEach(ent_i => {
            data.edges.push(this._geom_maps.dn_edges_verts.get(ent_i).map(vert_i => renum_maps.verts.get(vert_i)));
        });
        // wires
        ent_sets._w.forEach(ent_i => {
            data.wires.push(this._geom_maps.dn_wires_edges.get(ent_i).map(edge_i => renum_maps.edges.get(edge_i)));
        });
        // points
        ent_sets.pt.forEach(ent_i => {
            data.points.push(renum_maps.verts.get(this._geom_maps.dn_points_verts.get(ent_i)));
        });
        // plines
        ent_sets.pl.forEach(ent_i => {
            data.plines.push(renum_maps.wires.get(this._geom_maps.dn_plines_wires.get(ent_i)));
        });
        // pgons
        ent_sets.pg.forEach(ent_i => {
            data.pgons.push(this._geom_maps.dn_pgons_wires.get(ent_i).map(wire_i => renum_maps.wires.get(wire_i)));
            data.pgontris.push(this._geom_maps.dn_pgons_tris.get(ent_i).map(tri_i => renum_maps.tris.get(tri_i)));
        });
        // colls
        ent_sets.co.forEach(ent_i => {
            data.coll_pgons.push(this.modeldata.geom.nav.navCollToPgon(ent_i).map(pgon_i => renum_maps.pgons.get(pgon_i)));
            data.coll_plines.push(this.modeldata.geom.nav.navCollToPline(ent_i).map(pline_i => renum_maps.plines.get(pline_i)));
            data.coll_points.push(this.modeldata.geom.nav.navCollToPoint(ent_i).map(point_i => renum_maps.points.get(point_i)));
            data.coll_childs.push(this.modeldata.geom.nav.navCollToCollChildren(ent_i).map(child_coll_i => renum_maps.colls.get(child_coll_i)));
        });
        return data;
    }
}
exports.GIGeomImpExp = GIGeomImpExp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tSW1wRXhwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGlicy9nZW8taW5mby9nZW9tL0dJR2VvbUltcEV4cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQ0FDc0c7QUFHdEc7O0dBRUc7QUFDSCxNQUFhLFlBQVk7SUFHckI7O09BRUc7SUFDSCxZQUFZLFNBQXNCLEVBQUUsU0FBb0I7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUNEOzs7T0FHRztJQUNJLGFBQWEsQ0FBRSxPQUFzQjtRQUN4QyxZQUFZO1FBQ1osTUFBTSxlQUFlLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDdkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDcEU7UUFDRCxXQUFXO1FBQ1gsTUFBTSxlQUFlLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDdkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQ3BFO1FBQ0QsWUFBWTtRQUNaLE1BQU0sY0FBYyxHQUF3QixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3RELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENB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