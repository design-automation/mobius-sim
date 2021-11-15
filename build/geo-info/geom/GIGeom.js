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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGlicy9nZW8taW5mby9nZW9tL0dJR2VvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFaEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRXhEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLE1BQU07SUFzQ2Y7O09BRUc7SUFDSCxZQUFZLFNBQXNCO1FBdENsQyxjQUFjO1FBQ1AsZUFBVSxHQUFjO1lBQzNCLGNBQWMsRUFBRSxJQUFJLEdBQUcsRUFBRTtZQUN6QixhQUFhLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDeEIsY0FBYyxFQUFFLElBQUksR0FBRyxFQUFFO1lB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