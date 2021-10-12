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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vZ2VvbS9HSUdlb20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkNBQXdDO0FBQ3hDLHFEQUFrRDtBQUNsRCwrQ0FBNEM7QUFDNUMsK0NBQTRDO0FBQzVDLG1EQUFnRDtBQUNoRCx1REFBb0Q7QUFDcEQscURBQWtEO0FBQ2xELDJDQUF3QztBQUN4QyxtREFBZ0Q7QUFFaEQscURBQWtEO0FBQ2xELG1EQUFnRDtBQUNoRCxpREFBOEM7QUFDOUMsaURBQThDO0FBQzlDLDJEQUF3RDtBQUV4RDs7R0FFRztBQUNILE1BQWEsTUFBTTtJQXNDZjs7T0FFRztJQUNILFlBQVksU0FBc0I7UUF0Q2xDLGNBQWM7UUFDUCxlQUFVLEdBQWM7WUFDM0IsY0FBYyxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ3pCLGFBQWEsRUFBRSxJQUFJLEdBQUcsRUFBRTtZQUN4QixjQUFjLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDekIsY0FBYyxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ3pCLGFBQWEsRUFBRSxJQUFJLEdBQUcsRUFBRTtZQUN4QixlQUFlLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDMUIsZUFBZSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQzFCLGNBQWMsRUFBRSxJQUFJLEdBQUcsRUFBRTtZQUN6QixjQUFjLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDekIsYUFBYSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ3hCLGNBQWMsRUFBRSxJQUFJLEdBQUcsRUFBRTtZQUN6QixhQUFhLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDeEIsY0FBYyxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ3pCLGVBQWUsRUFBRSxJQUFJLEdBQUcsRUFBRTtZQUMxQixlQUFlLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDMUIsY0FBYyxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ3pCLEtBQUssRUFBRSxJQUFJLEdBQUcsRUFBRTtTQUNuQixDQUFDO1FBb0JFLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSwyQkFBWSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLHFCQUFTLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksNkJBQWEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSwrQkFBYyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLGlDQUFlLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksK0JBQWMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxxQkFBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLDJCQUFZLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUkseUJBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLDZCQUFhLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksNkJBQWEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSwrQkFBYyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLHFDQUFpQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFDRDs7T0FFRztJQUNJLEtBQUs7UUFDUixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDdkMsQ0FBQztDQUNKO0FBakVELHdCQWlFQyJ9