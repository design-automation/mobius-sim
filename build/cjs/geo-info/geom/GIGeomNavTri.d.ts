import { IGeomMaps } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for navigating the triangles in the geometry data structure.
 */
export declare class GIGeomNavTri {
    private modeldata;
    private _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps);
    /**
     * Never none
     * @param tri_i
     */
    navTriToVert(tri_i: number): number[];
    /**
     * Never none
     * @param tri_i
     */
    navTriToPosi(tri_i: number): number[];
    /**
     * Never none
     * @param pgon_i
     */
    navPgonToTri(pgon_i: number): number[];
    /**
     * Returns undefined if none
     * @param vert_i
     */
    navVertToTri(vert_i: number): number[];
    /**
     * Never none
     * @param tri_i
     */
    navTriToPgon(tri_i: number): number;
    /**
     * Never none
     * @param tri_i
     */
    navTriToColl(tri_i: number): number[];
}
