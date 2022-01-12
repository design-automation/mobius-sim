import { IGeomMaps } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for modifying plines.
 */
export declare class GIGeomEditPline {
    private modeldata;
    private _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps);
    /**
     * Close a polyline.
     * \n
     * If the pline is already closed, do nothing.
     * \n
     */
    closePline(pline_i: number): number;
    /**
     * Open a wire, by deleting the last edge.
     * \n
     * If the wire is already open, do nothing.
     * \n
     * If the wire does not belong to a pline, then do nothing.
     * @param wire_i The wire to close.
     */
    openPline(pline_i: number): void;
    /**
     *
     * @param pline_i
     * @param posi_i
     * @param to_end
     */
    appendVertToOpenPline(pline_i: number, posi_i: number, to_end: boolean): number;
}
