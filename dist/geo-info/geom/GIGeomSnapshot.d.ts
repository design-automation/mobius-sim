import { EEntType, IEntSets, IGeomMaps, TEntTypeIdx, Txyz } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for modifying plines.
 */
export declare class GIGeomSnapshot {
    private modeldata;
    private _geom_maps;
    private ss_data;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps);
    /**
     * Create a new snapshot.
     * @param id Starts a new snapshot with the given ID.
     * @param include
     */
    addSnapshot(ssid: number, include?: number[]): void;
    /**
     * Delete a snapshot.
     * @param ssid Snapshot ID.
     */
    delSnapshot(ssid: number): void;
    /**
     * Adds the ents to the active snapshot.
     * Called when executing a global function.
     * @param ent_type
     */
    copyEntsToActiveSnapshot(from_ssid: number, ents: TEntTypeIdx[]): void;
    /**
     * Add a new ent.
     * If the ent is a collection, then it is assumed that this is a new empty collection.
     * @param ent_type
     * @param ent_i
     */
    addNewEnt(ssid: number, ent_type: EEntType, ent_i: number): void;
    /**
     *
     * @param ent_type
     * @param ent_i
     */
    hasEnt(ssid: number, ent_type: EEntType, ent_i: number): boolean;
    /**
     * Takes in a list of ents and filters out ents that do no exist in the snapshot specified by SSID.
     * Used by nav any to any
     *
     * @param ent_type
     * @param ents_i
     */
    filterEnts(ssid: number, ent_type: EEntType, ents_i: number[]): number[];
    /**
     *
     * @param ent_type
     */
    numEnts(ssid: number, ent_type: EEntType): number;
    /**
     * Get sets of all the ps, pt, pl, pg, co in a snapshot.
     * @param ent_type
     */
    getAllEntSets(ssid: number): IEntSets;
    /**
     * Get an array of all the ps, pt, pl, pg, co in a snapshot.
     * @param ssid
     */
    getAllEnts(ssid: number): TEntTypeIdx[];
    /**
     * Get an array of ent indexes in the snapshot.
     * @param ent_type
     */
    getEnts(ssid: number, ent_type: EEntType): number[];
    /**
     * Get an array of sub ents given an set of ents.
     * This can include topology.
     * @param ents
     */
    getSubEnts(ents_sets: IEntSets): TEntTypeIdx[];
    /**
     * Returns sets of unique entity indexes, given an array of TEntTypeIdx.
     * \n
     * Used for deleting all entities and for adding global function entities to a snapshot.
     */
    getSubEntsSets(ssid: number, ents: TEntTypeIdx[]): IEntSets;
    /**
     * Given sets of [ps, pt, pl, pg, co], get the sub ents and add create additional sets.
     * @param ent_sets
     */
    addTopoToSubEntsSets(ent_sets: IEntSets): void;
    /**
     *
     * @param ent_type
     * @param ent_i
     */
    delAllEnts(ssid: number): void;
    /**
    * Delete ents
    * @param ent_sets
    */
    delEntSets(ssid: number, ent_sets: IEntSets): void;
    /**
     * Invert ent sets
     * @param ent_sets
     */
    invertEntSets(ssid: number, ent_sets: IEntSets): void;
    /**
     * Del unused posis, i.e posis that are not linked to any vertices.
     * @param posis_i
     */
    delUnusedPosis(ssid: number, posis_i: number | number[]): void;
    /**
     * Del posis.
     * This will delete any geometry connected to these posis, starting with the vertices
     * and working up the hierarchy.
     * @param posis_i
     */
    delPosis(ssid: number, posis_i: number | number[]): void;
    /**
     * Del points.
     * Point attributes will also be deleted.
     * @param points_i
     */
    delPoints(ssid: number, points_i: number | number[]): void;
    /**
     * Del plines.
     * @param plines_i
     */
    delPlines(ssid: number, plines_i: number | number[]): void;
    /**
     * Del pgons.
     * @param pgons_i
     */
    delPgons(ssid: number, pgons_i: number | number[], invert?: boolean): void;
    /**
     * Delete a collection.
     * This does not delete any of the object in the collection.
     * Also, does not delete any positions.
     * @param colls_i The collections to delete
     */
    delColls(ssid: number, colls_i: number | number[]): void;
    /**
     * Get the collections of a point.
     * @param point_i
     */
    getPointColls(ssid: number, point_i: number): number[];
    /**
     * Get the collections of a pline.
     * @param pline_i
     */
    getPlineColls(ssid: number, pline_i: number): number[];
    /**
     * Get the collections of a pgon
     * @param pgon_i
     */
    getPgonColls(ssid: number, pgon_i: number): number[];
    /**
     * Get the points of a collection.
     * Array is passed as copy.
     * @param coll_i
     */
    getCollPoints(ssid: number, coll_i: number): number[];
    /**
     * Get the plines of a collection.
     * Array is passed as copy.
     * @param coll_i
     */
    getCollPlines(ssid: number, coll_i: number): number[];
    /**
     * Get the pgons of a collection.
     * Array is passed as copy.
     * @param coll_i
     */
    getCollPgons(ssid: number, coll_i: number): number[];
    /**
     * Get the children collections of a collection.
     * Array is passed as copy.
     * @param coll_i
     */
    getCollChildren(ssid: number, coll_i: number): number[];
    /**
     * Get the parent.
     * Undefined if there is no parent.
     * @param coll_i
     */
    getCollParent(ssid: number, coll_i: number): number;
    /**
     * Set the parent for a collection
     * @param coll_i The index of the collection
     * @param parent_coll_i The index of the parent collection
     */
    setCollParent(ssid: number, coll_i: number, parent_coll_i: number): void;
    /**
     * Set the points in a collection
     * @param coll_i The index of the collection
     * @param points_i
     */
    addCollPoints(ssid: number, coll_i: number, points_i: number | number[]): void;
    /**
     * Set the plines in a collection
     * @param coll_i The index of the collection
     * @param plines_i
     */
    addCollPlines(ssid: number, coll_i: number, plines_i: number | number[]): void;
    /**
     * Set the pgons in a collection
     * @param coll_i The index of the collection
     * @param pgons_i
     */
    addCollPgons(ssid: number, coll_i: number, pgons_i: number | number[]): void;
    /**
     * Set the child collections in a collection
     * @param coll_i The index of the collection
     * @param parent_coll_i The indicies of the child collections
     */
    addCollChildren(ssid: number, coll_i: number, childs_i: number | number[]): void;
    /**
     * Remove objects from a collection.
     * If the objects are not in the collection, then no error is thrown.
     * Time stamp is not updated.
     * @param coll_i
     * @param points_i
     */
    remCollPoints(ssid: number, coll_i: number, points_i: number | number[]): void;
    /**
     * Remove objects from a collection.
     * If the objects are not in the collection, then no error is thrown.
     * Time stamp is not updated.
     * @param coll_i
     * @param plines_i
     */
    remCollPlines(ssid: number, coll_i: number, plines_i: number[]): void;
    /**
     * Remove objects from a collection.
     * If the objects are not in the collection, then no error is thrown.
     * Time stamp is not updated.
     * @param coll_i
     * @param pgons_i
     */
    remCollPgons(ssid: number, coll_i: number, pgons_i: number[]): void;
    /**
     * Remove objects from a collection.
     * If the objects are not in the collection, then no error is thrown.
     * Time stamp is not updated.
     * @param coll_i
     * @param child_colls_i
     */
    remCollChildren(ssid: number, coll_i: number, childs_i: number[]): void;
    /**
     *
     * @param pgon_i
     */
    getPgonNormal(ssid: number, pgon_i: number): Txyz;
    /**
     * Returns true if posis is used
     * @param point_i
     */
    isPosiUnused(ssid: number, posi_i: number): boolean;
    private _invertSet;
    toStr(ssid: number): string;
    private _mapSetToStr;
}
