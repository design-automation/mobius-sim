import { IGeomMaps } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for geometry.
 */
export declare class GIGeomCheck {
    private modeldata;
    private _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps);
    /**
     * Checks geometry for internal consistency
     */
    check(): string[];
    /**
     * Checks geometry for internal consistency
     */
    private _checkPosis;
    private _checkVerts;
    private _checkEdges;
    private _checkWires;
    private _checkPoints;
    private _checkPlines;
    private _checkPgons;
    private _checkEdgeOrder;
}
