import { TPosi } from '..';
import { IGeomMaps, TTri, TEdge, TWire,
    TPgonTri, TPoint, TPline, TPgon, EEntType, IEntSets, IGeomSIMData, ISIMRenumMaps, TVert, IGeomData } from '../common';
import { GIModelData } from '../GIModelData';

/**
 * Class for ...
 */
export class SIMGeomImpExp {
    private modeldata: GIModelData;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    /**
     * Reconstruct the topology data, adding vertsm edges, wires.
     * @param geom_data The data from the SIM file
     */
    public importReconstructTopo( geom_data: IGeomSIMData ): IGeomData {
        // reconstruct verts, edges, wires base don the list of positions in SIM
        const verts: TVert[] = [];
        const edges: TEdge[] = [];
        const wires: TWire[] = [];
        const points: TPoint[] = [];
        const plines: TPline[] = [];
        const pgons: TPgon[] = [];
        // reconstruct points
        for (const point of geom_data.points) {
            points.push( verts.push(point) - 1 );
        }
        // reconstruct polylines
        for (const pline of geom_data.plines) {
            const closed: boolean = pline[0] == pline[pline.length - 1];
            const num_verts: number = closed ? pline.length - 1 : pline.length;
            const verts_i: number[] = [];
            for (let i = 0; i < num_verts; i++) {
                verts_i.push(verts.push(pline[i]) - 1)
            }
            const edges_i: number[] = [];
            for (let i = 0; i < num_verts - 1; i++) {
                edges_i.push(edges.push([verts_i[i], verts_i[i+1]]) - 1)
            }
            if (closed) {
                edges_i.push(edges.push([verts_i[num_verts - 1], verts_i[0]]) - 1)
            }
            plines.push( wires.push(edges_i) - 1 );
        }
        // reconstruct polygons
        for (const pgon of geom_data.pgons) {
            const wires_i: number[] = []
            for (const wire of pgon) {
                const verts_i: number[] = [];
                for (let i = 0; i < wire.length; i++) {
                    verts_i.push(verts.push(wire[i]) - 1)
                }
                const edges_i: number[] = [];
                for (let i = 0; i < verts_i.length - 1; i++) {
                    edges_i.push(edges.push([verts_i[i], verts_i[i+1]]) - 1)
                }
                edges_i.push(edges.push([verts_i[verts_i.length - 1], verts_i[0]]) - 1)
                wires_i.push ( wires.push(edges_i) - 1 );
            }
            pgons.push( wires_i );
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
        }
    }
    /**
     * Import GI data into this model, and renumber teh entities in the process.
     * @param other_geom_maps The data to import
     */
    public importSIMRenum( geom_data: IGeomData ): ISIMRenumMaps {
        // positions
        const renum_posis_map: Map<number, number> = new Map();
        for (let i = 0; i < geom_data.num_posis; i++) {
            renum_posis_map.set(i, this.modeldata.model.metadata.nextPosi());
        }
        // vertices
        const renum_verts_map: Map<number, number> = new Map();
        for (let i = 0; i < geom_data.verts.length; i++) {
            renum_verts_map.set(i, this.modeldata.model.metadata.nextVert());
        }
        // edges
        const renum_edges_map: Map<number, number> = new Map();
        for (let i = 0; i < geom_data.edges.length; i++) {
            renum_edges_map.set(i, this.modeldata.model.metadata.nextEdge());
        }
        // wires
        const renum_wires_map: Map<number, number> = new Map();
        for (let i = 0; i < geom_data.wires.length; i++) {
            renum_wires_map.set(i, this.modeldata.model.metadata.nextWire());
        }
        // points
        const renum_points_map: Map<number, number> = new Map();
        for (let i = 0; i < geom_data.points.length; i++) {
            renum_points_map.set(i, this.modeldata.model.metadata.nextPoint());
        }
        // plines
        const renum_plines_map: Map<number, number> = new Map();
        for (let i = 0; i < geom_data.plines.length; i++) {
            renum_plines_map.set(i, this.modeldata.model.metadata.nextPline());
        }
        // pgons
        const renum_pgons_map: Map<number, number> = new Map();
        for (let i = 0; i < geom_data.pgons.length; i++) {
            renum_pgons_map.set(i, this.modeldata.model.metadata.nextPgon());
        }
        // colls
        const renum_colls_map: Map<number, number> = new Map();
        for (let i = 0; i < geom_data.coll_pgons.length; i++) {
            renum_colls_map.set(i, this.modeldata.model.metadata.nextColl());
        }
        // return maps
        const renum_maps: ISIMRenumMaps = {
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
    public importSIM(geom_data: IGeomData, renum_maps: ISIMRenumMaps): void {
        const ssid: number = this.modeldata.active_ssid;
        // posis->verts, create empty []
        for (let i = 0; i < geom_data.num_posis; i++) {
            const other_posi_i: number = renum_maps.posis.get(i);
            this._geom_maps.up_posis_verts.set(other_posi_i, []);
            // snapshot
            this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.POSI, other_posi_i);
        }
        // add vertices to model
        for (let i = 0; i < geom_data.verts.length; i++) {
            const other_vert_i: number = renum_maps.verts.get(i);
            const other_posi_i: number = renum_maps.posis.get(geom_data.verts[i]);
            // down
            this._geom_maps.dn_verts_posis.set(other_vert_i, other_posi_i);
            // up
            this._geom_maps.up_posis_verts.get(other_posi_i).push(other_vert_i);
        }
        // add edges to model
        for (let i = 0; i < geom_data.edges.length; i++) {
            const other_edge_i: number = renum_maps.edges.get(i);
            const other_verts_i: TEdge = geom_data.edges[i].map(other_vert_i => renum_maps.verts.get(other_vert_i) ) as TEdge;
            // down
            this._geom_maps.dn_edges_verts.set(other_edge_i, other_verts_i);
            // up
            other_verts_i.forEach( (vert_i, index) => {
                if (!this._geom_maps.up_verts_edges.has(vert_i)) {
                    this._geom_maps.up_verts_edges.set(vert_i, []);
                }
                if (index === 0) {
                    this._geom_maps.up_verts_edges.get(vert_i).push(other_edge_i);
                } else if (index === 1) {
                    this._geom_maps.up_verts_edges.get(vert_i).splice(0, 0, other_edge_i);
                }
                if (index > 1) {
                    throw new Error('Import data error: Found an edge with more than two vertices.');
                }
            });
        }
        // add wires to model
        for (let i = 0; i < geom_data.wires.length; i++) {
            const other_wire_i: number = renum_maps.wires.get(i);
            const other_edges_i: TWire = geom_data.wires[i].map(other_edge_i => renum_maps.edges.get(other_edge_i) ) as TWire;
            // down
            this._geom_maps.dn_wires_edges.set(other_wire_i, other_edges_i);
            // up
            other_edges_i.forEach( edge_i => {
                this._geom_maps.up_edges_wires.set(edge_i, other_wire_i);
            });
        }
        // add points to model
        for (let i = 0; i < geom_data.points.length; i++) {
            const other_point_i: number = renum_maps.points.get(i);
            const other_vert_i: TPoint = renum_maps.verts.get(geom_data.points[i]) as TPoint;
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
            const other_pline_i: number = renum_maps.plines.get(i);
            const other_wire_i: TPline = renum_maps.wires.get(geom_data.plines[i]) as TPline;
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
            const other_pgon_i: number = renum_maps.pgons.get(i);
            const other_wires_i: TPgon = geom_data.pgons[i].map(other_wire_i => renum_maps.wires.get(other_wire_i) ) as TPgon;
            // down
            this._geom_maps.dn_pgons_wires.set(other_pgon_i, other_wires_i);
            // up
            other_wires_i.forEach( wire_i => {
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

            const other_coll_i: number = renum_maps.colls.get(i);
            const other_pgons_i: number[] = geom_data.coll_pgons[i].map(coll_pgon_i => renum_maps.pgons.get(coll_pgon_i));
            const other_plines_i: number[] = geom_data.coll_plines[i].map(coll_pline_i => renum_maps.plines.get(coll_pline_i));
            const other_points_i: number[] = geom_data.coll_points[i].map(coll_point_i => renum_maps.points.get(coll_point_i));
            const other_childs_i: number[] = geom_data.coll_colls[i].map(coll_child_i => renum_maps.colls.get(coll_child_i));
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
    public exportSIMRenum(ent_sets: IEntSets): ISIMRenumMaps {
        let i: number;
        // posis
        const renum_posis_map: Map<number, number> = new Map();
        i = 0;
        ent_sets.ps.forEach(ent_i => {
            renum_posis_map.set(ent_i, i);
            i += 1;
        });
        // verts
        const renum_verts_map: Map<number, number> = new Map();
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
        const renum_edges_map: Map<number, number> = new Map();
        i = 0;
        ent_sets._e.forEach(ent_i => {
            renum_edges_map.set(ent_i, i);
            i += 1;
        });
        // wires
        const renum_wires_map: Map<number, number> = new Map();
        i = 0;
        ent_sets._w.forEach(ent_i => {
            renum_wires_map.set(ent_i, i);
            i += 1;
        });
        // points
        const renum_points_map: Map<number, number> = new Map();
        i = 0;
        ent_sets.pt.forEach(ent_i => {
            renum_points_map.set(ent_i, i);
            i += 1;
        });
        // plines
        const renum_plines_map: Map<number, number> = new Map();
        i = 0;
        ent_sets.pl.forEach(ent_i => {
            renum_plines_map.set(ent_i, i);
            i += 1;
        });
        // pgons
        const renum_pgons_map: Map<number, number> = new Map();
        i = 0;
        ent_sets.pg.forEach(ent_i => {
            renum_pgons_map.set(ent_i, i);
            i += 1;
        });
        // colls
        const renum_colls_map: Map<number, number> = new Map();
        i = 0;
        ent_sets.co.forEach(ent_i => {
            renum_colls_map.set(ent_i, i);
            i += 1;
        });
        // return maps
        const renum_maps: ISIMRenumMaps =  {
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
    public exportSIM(ent_sets: IEntSets, renum_maps: ISIMRenumMaps): IGeomSIMData {
        const data: IGeomSIMData = {
            num_posis: 0,
            points: [],
            plines: [],
            pgons: [],
            coll_pgons: [], coll_plines: [], coll_points: [], coll_colls: []
        };
        // posis
        data.num_posis = renum_maps.posis.size;
        // points -> posis
        ent_sets.pt.forEach( ent_i => {
            const posi_i: number = this.modeldata.geom.nav.navAnyToPosi(EEntType.POINT, ent_i)[0]
            data.points.push(renum_maps.posis.get( posi_i ));
        });
        // plines -> posis
        ent_sets.pl.forEach( ent_i => {
            const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.PLINE, ent_i);
            if (this.modeldata.geom.query.isWireClosed(this.modeldata.geom.nav.navPlineToWire(ent_i))) {
                posis_i.push(posis_i[0])
            }
            const remapped_posis: number[] = posis_i.map( posi_i => renum_maps.posis.get( posi_i ) );
            data.plines.push( remapped_posis );
        });
        // pgons -> posis
        ent_sets.pg.forEach( ent_i => {
            const wires_i: TPgon = this._geom_maps.dn_pgons_wires.get(ent_i);
            const pgon_posis_i: number[][] = [];
            for (const wire_i of wires_i) {
                const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
                const remapped_posis: number[] = posis_i.map( posi_i => renum_maps.posis.get( posi_i ) );
                pgon_posis_i.push(remapped_posis);
            }
            data.pgons.push( pgon_posis_i );
        });
        // colls
        ent_sets.co.forEach( ent_i => {
            data.coll_pgons.push(this.modeldata.geom.nav.navCollToPgon(ent_i).map(pgon_i => renum_maps.pgons.get(pgon_i)) );
            data.coll_plines.push(this.modeldata.geom.nav.navCollToPline(ent_i).map(pline_i => renum_maps.plines.get(pline_i))  );
            data.coll_points.push(this.modeldata.geom.nav.navCollToPoint(ent_i).map(point_i => renum_maps.points.get(point_i))  );
            data.coll_colls.push(this.modeldata.geom.nav.navCollToCollChildren(ent_i).map(child_coll_i => renum_maps.colls.get(child_coll_i)) );
        });
        return data;
    }
}
