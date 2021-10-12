import { IGeomMaps } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for geometry.
 */
export declare class GIGeomEditPgon {
    private modeldata;
    private _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps);
    /**
     * Creates one or more holes in a polygon.
     * Updates time stamp for the polygon.
     * \n
     */
    cutPgonHoles(pgon_i: number, posis_i_arr: number[][]): number[];
    /**
     * Retriangulate the polygons.
     * Updates time stamp for the polygons.
     * \n
     */
    triPgons(pgons_i: number | number[]): void;
    /**
     * Adds a hole to a face and updates the arrays.
     * Wires are assumed to be closed!
     * This also calls addTris()
     * @param wire_i
     */
    private _cutPgonHoles;
    /**
     * Updates the tris in a face
     * @param pgon_i
     */
    private _updatePgonTris;
}
