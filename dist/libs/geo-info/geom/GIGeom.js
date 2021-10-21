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
import { GIGeomNavTri } from './GIGeomNavTri';
import { GIGeomNavSnapshot } from './GIGeomNavSnapshot';
/**
 * Class for geometry.
 */
export class GIGeom {
    /**
     * Constructor
     */
    constructor(modeldata) {
        //  all arrays
        this._geom_maps = {
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
        this.modeldata = modeldata;
        this.imp_exp = new GIGeomImpExp(modeldata, this._geom_maps);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vZ2VvbS9HSUdlb20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRWhELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDaEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUV4RDs7R0FFRztBQUNILE1BQU0sT0FBTyxNQUFNO0lBc0NmOztPQUVHO0lBQ0gsWUFBWSxTQUFzQjtRQXRDbEMsY0FBYztRQUNQLGVBQVUsR0FBYztZQUMzQixjQUFjLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDekIsYUFBYSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ3hCLGNBQWMsRUFBRSxJQUFJLEdBQUcs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