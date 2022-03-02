"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIGeom = void 0;
const GIGeomAdd_1 = require("./GIGeomAdd");
const GIGeomEditTopo_1 = require("./GIGeomEditTopo");
const GIGeomQuery_1 = require("./GIGeomQuery");
const GIGeomCheck_1 = require("./GIGeomCheck");
const GIGeomCompare_1 = require("./GIGeomCompare");
const GIGeomEditPline_1 = require("./GIGeomEditPline");
const GIGeomEditPgon_1 = require("./GIGeomEditPgon");
const GIGeomNav_1 = require("./GIGeomNav");
const GIGeomDelVert_1 = require("./GIGeomDelVert");
const GIGeomSnapshot_1 = require("./GIGeomSnapshot");
const GIGeomThreejs_1 = require("./GIGeomThreejs");
const GIGeomImpExp_1 = require("./GIGeomImpExp");
const SIMGeomImpExp_1 = require("./SIMGeomImpExp");
const GIGeomNavTri_1 = require("./GIGeomNavTri");
const GIGeomNavSnapshot_1 = require("./GIGeomNavSnapshot");
/**
 * Class for geometry.
 */
class GIGeom {
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
        this.imp_exp = new GIGeomImpExp_1.GIGeomImpExp(modeldata, this._geom_maps);
        this.sim_imp_exp = new SIMGeomImpExp_1.SIMGeomImpExp(modeldata, this._geom_maps);
        this.add = new GIGeomAdd_1.GIGeomAdd(modeldata, this._geom_maps);
        this.del_vert = new GIGeomDelVert_1.GIGeomDelVert(modeldata, this._geom_maps);
        this.edit_topo = new GIGeomEditTopo_1.GIGeomEditTopo(modeldata, this._geom_maps);
        this.edit_pline = new GIGeomEditPline_1.GIGeomEditPline(modeldata, this._geom_maps);
        this.edit_pgon = new GIGeomEditPgon_1.GIGeomEditPgon(modeldata, this._geom_maps);
        this.nav = new GIGeomNav_1.GIGeomNav(modeldata, this._geom_maps);
        this.nav_tri = new GIGeomNavTri_1.GIGeomNavTri(modeldata, this._geom_maps);
        this.query = new GIGeomQuery_1.GIGeomQuery(modeldata, this._geom_maps);
        this.check = new GIGeomCheck_1.GIGeomCheck(modeldata, this._geom_maps);
        this.compare = new GIGeomCompare_1.GIGeomCompare(modeldata, this._geom_maps);
        this.threejs = new GIGeomThreejs_1.GIGeomThreejs(modeldata, this._geom_maps);
        this.snapshot = new GIGeomSnapshot_1.GIGeomSnapshot(modeldata, this._geom_maps);
        this.nav_snapshot = new GIGeomNavSnapshot_1.GIGeomNavSnapshot(modeldata, this._geom_maps);
        this.selected = new Map();
    }
    /**
     * Generate a string for debugging
     */
    toStr() {
        throw new Error('Not implemented');
    }
}
exports.GIGeom = GIGeom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9nZW9tL0dJR2VvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwyQ0FBd0M7QUFDeEMscURBQWtEO0FBQ2xELCtDQUE0QztBQUM1QywrQ0FBNEM7QUFDNUMsbURBQWdEO0FBQ2hELHVEQUFvRDtBQUNwRCxxREFBa0Q7QUFDbEQsMkNBQXdDO0FBQ3hDLG1EQUFnRDtBQUVoRCxxREFBa0Q7QUFDbEQsbURBQWdEO0FBQ2hELGlEQUE4QztBQUM5QyxtREFBZ0Q7QUFDaEQsaURBQThDO0FBQzlDLDJEQUF3RDtBQUV4RDs7R0FFRztBQUNILE1BQWEsTUFBTTtJQXVDZjs7T0FFRztJQUNILFlBQVksU0FBc0I7UUF2Q2xDLGNBQWM7UUFDUCxlQUFVLEdBQWM7WUFDM0IsY0FBYyxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ3pCLGFBQWEsRUFBRSxJQUFJLEdBQUcsRUFBRTtZQUN4QixjQUFjLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDekIsY0FBYyxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ3pCLGFBQWEsRUFBRSxJQUFJLEdBQUcsRUFBRTtZQUN4QixlQUFlLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDMUIsZUFBZSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQzFCLGNBQWMsRUFBRSxJQUFJLEdBQUcsRUFBRTtZQUN6QixjQUFjLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDekIsYUFBYSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ3hCLGNBQWMsRUFBRSxJQUFJLEdBQUcsRUFBRTtZQUN6QixhQUFhLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDeEIsY0FBYyxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ3pCLGVBQWUsRUFBRSxJQUFJLEdBQUcsRUFBRTtZQUMxQixlQUFlLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDMUIsY0FBYyxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ3pCLEtBQUssRUFBRSxJQUFJLEdBQUcsRUFBRTtTQUNuQixDQUFDO1FBcUJFLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSwyQkFBWSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLDZCQUFhLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUkscUJBQVMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSw2QkFBYSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLCtCQUFjLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksaUNBQWUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSwrQkFBYyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLHFCQUFTLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksMkJBQVksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLHlCQUFXLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksNkJBQWEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSw2QkFBYSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLCtCQUFjLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUkscUNBQWlCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUNEOztPQUVHO0lBQ0ksS0FBSztRQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUN2QyxDQUFDO0NBQ0o7QUFuRUQsd0JBbUVDIn0=