import { IGeomMaps, TEntTypeIdx } from '../common';
import { GIGeomAdd } from './GIGeomAdd';
import { GIGeomEditTopo } from './GIGeomEditTopo';
import { GIGeomQuery } from './GIGeomQuery';
import { GIGeomCheck } from './GIGeomCheck';
import { GIGeomCompare } from './GIGeomCompare';
import { GIGeomEditPline } from './GIGeomEditPline';
import { GIGeomEditPgon } from './GIGeomEditPgon';
import { GIGeomNav } from './GIGeomNav';
import { GIGeomDelVert } from './GIGeomDelVert';
import { GIModelData } from '../GIModelData';
import { GIGeomSnapshot } from './GIGeomSnapshot';
import { GIGeomThreejs } from './GIGeomThreejs';
import { GIGeomImpExp } from './GIGeomImpExp';
import { SIMGeomImpExp } from './SIMGeomImpExp';
import { GIGeomNavTri } from './GIGeomNavTri';
import { GIGeomNavSnapshot } from './GIGeomNavSnapshot';
/**
 * Class for geometry.
 */
export declare class GIGeom {
    modeldata: GIModelData;
    selected: Map<Number, TEntTypeIdx[]>;
    _geom_maps: IGeomMaps;
    imp_exp: GIGeomImpExp;
    sim_imp_exp: SIMGeomImpExp;
    add: GIGeomAdd;
    del_vert: GIGeomDelVert;
    edit_topo: GIGeomEditTopo;
    edit_pline: GIGeomEditPline;
    edit_pgon: GIGeomEditPgon;
    nav: GIGeomNav;
    nav_tri: GIGeomNavTri;
    query: GIGeomQuery;
    check: GIGeomCheck;
    compare: GIGeomCompare;
    threejs: GIGeomThreejs;
    snapshot: GIGeomSnapshot;
    nav_snapshot: GIGeomNavSnapshot;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData);
    /**
     * Generate a string for debugging
     */
    toStr(): string;
}
