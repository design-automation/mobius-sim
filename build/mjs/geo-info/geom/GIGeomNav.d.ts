import { EEntType, IGeomMaps } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for navigating the geometry.
 */
export declare class GIGeomNav {
    private modeldata;
    private _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps);
    /**
     * Never none
     * @param vert_i
     */
    navVertToPosi(vert_i: number): number;
    /**
     * Never none, an array of length 2
     * @param edge_i
     */
    navEdgeToVert(edge_i: number): number[];
    /**
     * Never none
     * @param wire_i
     */
    navWireToEdge(wire_i: number): number[];
    /**
     * Never none
     * @param point_i
     */
    navPointToVert(point_i: number): number;
    /**
     * Never none
     * @param line_i
     */
    navPlineToWire(line_i: number): number;
    /**
     * Never none
     * @param pgon_i
     */
    navPgonToWire(pgon_i: number): number[];
    /**
     * If none, returns []
     * @param coll_i
     */
    navCollToPoint(coll_i: number): number[];
    /**
     * If none, returns []
     * @param coll_i
     */
    navCollToPline(coll_i: number): number[];
    /**
     * If none, returns []
     * @param coll_i
     */
    navCollToPgon(coll_i: number): number[];
    /**
     * If none, returns []
     * @param coll_i
     */
    navCollToCollChildren(coll_i: number): number[];
    /**
     * Get the descendent collections of a collection.
     * @param coll_i
     */
    navCollToCollDescendents(coll_i: number): number[];
    /**
     * Returns [] is none
     * @param posi_i
     */
    navPosiToVert(posi_i: number): number[];
    /**
     * Returns undefined if none (consider points)
     * The array of edges wil be length of either one or two, [in_edge, out_edge].
     * If the vertex is at the start or end of a polyline, then length will be one.
     * @param vert_i
     */
    navVertToEdge(vert_i: number): number[];
    /**
     * Returns undefined if none.
     * @param edge_i
     */
    navEdgeToWire(edge_i: number): number;
    /**
     * Returns undefined if none
     * @param vert_i
     */
    navVertToPoint(vert_i: number): number;
    /**
     * Returns undefined if none
     * @param tri_i
     */
    navWireToPline(wire_i: number): number;
    /**
     * Never none
     * @param tri_i
     */
    navTriToPgon(tri_i: number): number;
    /**
     * Never none
     * @param wire_i
     */
    navWireToPgon(wire_i: number): number;
    /**
     * Returns [] if none
     * @param point_i
     */
    navPointToColl(point_i: number): number[];
    /**
     * Returns [] if none
     * @param pline_i
     */
    navPlineToColl(pline_i: number): number[];
    /**
     * Returns [] if none
     * @param pgon_i
     */
    navPgonToColl(pgon_i: number): number[];
    /**
     * Returns undefined if none
     * @param coll_i
     */
    navCollToCollParent(coll_i: number): number;
    /**
     * Get the ancestor collections of a collection.
     * @param coll_i
     */
    navCollToCollAncestors(coll_i: number): number[];
    /**
     * Returns [] if none.
     * @param
     */
    private _navUpAnyToEdge;
    /**
     * Returns [] if none.
     * @param
     */
    private _navUpAnyToWire;
    /**
     * Returns [] if none.
     * @param
     */
    private _navUpAnyToPoint;
    /**
     * Returns [] if none.
     * @param
     */
    private _navUpAnyToPline;
    /**
     * Returns [] if none.
     * @param
     */
    private _navUpAnyToPgon;
    /**
     * Returns [] if none.
     * @param posi_i
     */
    private _navUpAnyToColl;
    /**
     * Returns [] if none.
     * @param
     */
    private _navDnAnyToWire;
    /**
     * Returns [] if none.
     * @param
     */
    private _navDnAnyToEdge;
    /**
     * Returns [] if none.
     * @param
     */
    private _navDnAnyToVert;
    /**
     * Returns [] if none.
     * @param
     */
    private _navDnAnyToPosi;
    navAnyToPosi(ent_type: EEntType, ent_i: number): number[];
    navAnyToVert(ent_type: EEntType, ent_i: number): number[];
    navAnyToEdge(ent_type: EEntType, ent_i: number): number[];
    navAnyToWire(ent_type: EEntType, ent_i: number): number[];
    navAnyToPoint(ent_type: EEntType, ent_i: number): number[];
    navAnyToPline(ent_type: EEntType, ent_i: number): number[];
    navAnyToPgon(ent_type: EEntType, ent_i: number): number[];
    navAnyToColl(ent_type: EEntType, ent_i: number): number[];
    /**
     * Main function used for queries.
     * Includes #ps #_v #_e #_w #pt #pl #pg
     * @param from_ets
     * @param to_ets
     * @param ent_i
     */
    navAnyToAny(from_ets: EEntType, to_ets: EEntType, ent_i: number): number[];
}
