import { Txyz, TEntTypeIdx, TPlane } from '../common';
import { GIModelData } from '../GIModelData';
export declare enum _EClose {
    OPEN = "open",
    CLOSE = "close"
}
export declare enum _ELoftMethod {
    OPEN_QUADS = "open_quads",
    CLOSED_QUADS = "closed_quads",
    OPEN_STRINGERS = "open_stringers",
    CLOSED_STRINGERS = "closed_stringers",
    OPEN_RIBS = "open_ribs",
    CLOSED_RIBS = "closed_ribs",
    COPIES = "copies"
}
export declare enum _EExtrudeMethod {
    QUADS = "quads",
    STRINGERS = "stringers",
    RIBS = "ribs",
    COPIES = "copies"
}
export declare enum _ECutMethod {
    KEEP_ABOVE = "keep_above",
    KEEP_BELOW = "keep_below",
    KEEP_BOTH = "keep_both"
}
/**
 * Class for editing geometry.
 */
export declare class GIFuncsMake {
    private modeldata;
    /**
     * Constructor
     */
    constructor(model: GIModelData);
    /**
     *
     * @param coords
     */
    position(coords: Txyz | Txyz[] | Txyz[][]): TEntTypeIdx | TEntTypeIdx[] | TEntTypeIdx[][];
    /**
     *
     * @param ents_arr
     */
    point(ents_arr: TEntTypeIdx | TEntTypeIdx[] | TEntTypeIdx[][]): TEntTypeIdx | TEntTypeIdx[] | TEntTypeIdx[][];
    /**
     *
     * @param ents_arr
     * @param close
     */
    polyline(ents_arr: TEntTypeIdx[] | TEntTypeIdx[][], close: _EClose): TEntTypeIdx | TEntTypeIdx[];
    private _polyline;
    private _getPlinePosisFromEnts;
    /**
     *
     * @param ents_arr
     */
    polygon(ents_arr: TEntTypeIdx[] | TEntTypeIdx[][]): TEntTypeIdx | TEntTypeIdx[];
    private _polygon;
    private _getPgonPosisFromEnts;
    /**
     *
     * @param ents_arr
     */
    tin(ents_arr: TEntTypeIdx[] | TEntTypeIdx[][]): TEntTypeIdx | TEntTypeIdx[];
    /**
     *
     * @param ents_arrs
     * @param divisions
     * @param method
     */
    loft(ents_arrs: TEntTypeIdx[] | TEntTypeIdx[][], divisions: number, method: _ELoftMethod): TEntTypeIdx[];
    private _loftQuads;
    private _loftStringers;
    private _loftRibs;
    private _loftCopies;
    /**
     *
     * @param ents_arr
     * @param dist
     * @param divisions
     * @param method
     */
    extrude(ents_arr: TEntTypeIdx | TEntTypeIdx[], dist: number | Txyz, divisions: number, method: _EExtrudeMethod): TEntTypeIdx[];
    private _extrudeEdges;
    private _extrudeCopies;
    private _extrudeColl;
    private _extrudeDim0;
    private _extrudeQuads;
    private _extrudeStringers;
    private _extrudeRibs;
    private _extrudeCap;
    /**
     *
     * @param backbone_ents
     * @param xsection_ent
     * @param divisions
     * @param method
     */
    sweep(backbone_ents: TEntTypeIdx[], xsection_ent: TEntTypeIdx, divisions: number, method: _EExtrudeMethod): TEntTypeIdx[];
    private _sweep;
    private _sweepQuads;
    private _sweepStringers;
    private _sweepRibs;
    private _sweepCopies;
    private _sweepPosis;
    /**
     * Makes new polyline and polygons by joining existing polylines or polygons
     * @param ents_arr
     * @param plane
     * @param method
     */
    join(ents_arr: TEntTypeIdx[]): TEntTypeIdx[];
    private _edgeKeys;
    private _joinPlines;
    private _joinPgons;
    /**
     *
     * @param ents_arr
     * @param plane
     * @param method
     */
    cut(ents_arr: TEntTypeIdx[], plane: TPlane, method: _ECutMethod): [TEntTypeIdx[], TEntTypeIdx[]];
    private _cutEdges;
    private _cutCreatePosi;
    private _cutStartVertexIsV;
    private _cutEndVertexIsV;
    private _cutGetTjsDistToPlane;
    private _cutGetPosi;
    private _cutGetPosis;
    private _cutCopyEnt;
    private _cutCreateEnts;
    private _cutFilterShortEdges;
    private _cutCreateEnt;
}
