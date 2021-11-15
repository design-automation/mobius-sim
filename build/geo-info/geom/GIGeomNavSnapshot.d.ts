import { IGeomMaps } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for navigating the geometry.
 */
export declare class GIGeomNavSnapshot {
    private modeldata;
    private _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps);
    /**
     * Returns all points in this collection and in descendent collections.
     * If none, returns []
     * @param coll_i
     */
    navCollToPoint(ssid: number, coll_i: number): number[];
    /**
     * Returns all polylines in this collection and in descendent collections.
     * If none, returns []
     * @param coll_i
     */
    navCollToPline(ssid: number, coll_i: number): number[];
    /**
     * Returns all polygons in this collection and in descendent collections.
     * If none, returns []
     * @param coll_i
     */
    navCollToPgon(ssid: number, coll_i: number): number[];
    /**
     * Returns children of this collection.
     * If none, returns []
     * @param coll_i
     */
    navCollToCollChildren(ssid: number, coll_i: number): number[];
    /**
     * Get the descendent collections of a collection.
     * @param coll_i
     */
    navCollToCollDescendents(ssid: number, coll_i: number): number[];
    private _getCollDescendents;
    /**
     * Returns [] if none
     * @param point_i
     */
    navPosiToVert(ssid: number, posi_i: number): number[];
    /**
     * Returns [] if none
     * @param point_i
     */
    navPointToColl(ssid: number, point_i: number): number[];
    /**
     * Returns [] if none
     * @param pline_i
     */
    navPlineToColl(ssid: number, pline_i: number): number[];
    /**
     * Returns [] if none
     * @param pgon_i
     */
    navPgonToColl(ssid: number, pgon_i: number): number[];
    /**
     * Returns undefined if none
     * @param coll_i
     */
    navCollToCollParent(ssid: number, coll_i: number): number;
    /**
     * Get the ancestor collections of a collection.
     * @param coll_i
     */
    navCollToCollAncestors(ssid: number, coll_i: number): number[];
}
