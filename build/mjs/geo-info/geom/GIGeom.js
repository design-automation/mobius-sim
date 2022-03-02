import { GIGeomAdd } from './GIGeomAdd';
import { GIGeomEditTopo } from './GIGeomEditTopo';
import { GIGeomQuery } from './GIGeomQuery';
import { GIGeomCheck } from './GIGeomCheck';
import { GIGeomCompare } from './GIGeomCompare';
import { GIGeomEditPline } from './GIGeomEditPline';
import { GIGeomEditPgon } from './GIGeomEditPgon';
import { GIGeomNav } from './GIGeomNav';
import { GIGeomDelVert } from './GIGeomDelVert';
import { GIGeomSnapshot } from './GIGeomSnapshot';
import { GIGeomThreejs } from './GIGeomThreejs';
import { GIGeomImpExp } from './GIGeomImpExp';
import { SIMGeomImpExp } from './SIMGeomImpExp';
import { GIGeomNavTri } from './GIGeomNavTri';
import { GIGeomNavSnapshot } from './GIGeomNavSnapshot';
/**
 * Class for geometry.
 */
export class GIGeom {
    modeldata;
    selected; // entities that should become selected
    //  all arrays
    _geom_maps = {
        dn_verts_posis: new Map(),
        dn_tris_verts: new Map(),
        dn_edges_verts: new Map(),
        dn_wires_edges: new Map(),
        dn_pgons_tris: new Map(),
        dn_points_verts: new Map(),
        dn_plines_wires: new Map(),
        dn_pgons_wires: new Map(),
        up_posis_verts: new Map(),
        up_tris_pgons: new Map(),
        up_verts_edges: new Map(),
        up_verts_tris: new Map(),
        up_edges_wires: new Map(),
        up_verts_points: new Map(),
        up_wires_plines: new Map(),
        up_wires_pgons: new Map(),
        colls: new Set()
    };
    // sub classes with methods
    imp_exp;
    sim_imp_exp;
    add;
    del_vert;
    edit_topo;
    edit_pline;
    edit_pgon;
    nav;
    nav_tri;
    query;
    check;
    compare;
    threejs;
    snapshot;
    nav_snapshot;
    /**
     * Constructor
     */
    constructor(modeldata) {
        this.modeldata = modeldata;
        this.imp_exp = new GIGeomImpExp(modeldata, this._geom_maps);
        this.sim_imp_exp = new SIMGeomImpExp(modeldata, this._geom_maps);
        this.add = new GIGeomAdd(modeldata, this._geom_maps);
        this.del_vert = new GIGeomDelVert(modeldata, this._geom_maps);
        this.edit_topo = new GIGeomEditTopo(modeldata, this._geom_maps);
        this.edit_pline = new GIGeomEditPline(modeldata, this._geom_maps);
        this.edit_pgon = new GIGeomEditPgon(modeldata, this._geom_maps);
        this.nav = new GIGeomNav(modeldata, this._geom_maps);
        this.nav_tri = new GIGeomNavTri(modeldata, this._geom_maps);
        this.query = new GIGeomQuery(modeldata, this._geom_maps);
        this.check = new GIGeomCheck(modeldata, this._geom_maps);
        this.compare = new GIGeomCompare(modeldata, this._geom_maps);
        this.threejs = new GIGeomThreejs(modeldata, this._geom_maps);
        this.snapshot = new GIGeomSnapshot(modeldata, this._geom_maps);
        this.nav_snapshot = new GIGeomNavSnapshot(modeldata, this._geom_maps);
        this.selected = new Map();
    }
    /**
     * Generate a string for debugging
     */
    toStr() {
        throw new Error('Not implemented');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9nZW9tL0dJR2VvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFaEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUV4RDs7R0FFRztBQUNILE1BQU0sT0FBTyxNQUFNO0lBQ1IsU0FBUyxDQUFjO0lBQ3ZCLFFBQVEsQ0FBNkIsQ0FBQyx1Q0FBdUM7SUFDcEYsY0FBYztJQUNQLFVBQVUsR0FBYztRQUMzQixjQUFjLEVBQUUsSUFBSSxHQUFHLEVBQUU7UUFD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