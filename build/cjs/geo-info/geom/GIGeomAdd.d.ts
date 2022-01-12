import { Txyz, IGeomMaps } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for geometry.
 */
export declare class GIGeomAdd {
    private modeldata;
    private _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps);
    /**
     * Adds a new position to the model and returns the index to that position.
     */
    addPosi(): number;
    /**
     * Adds a new point entity to the model.
     * @param posi_i The position for the point.
     */
    addPoint(posi_i: number): number;
    /**
     * Adds a new pline entity to the model using numeric indices.
     * @param posis_i
     */
    addPline(posis_i: number[], close?: boolean): number;
    /**
     * Adds a new polygon + hole entity to the model using numeric indices.
     * @param posis_id
     */
    addPgon(posis_i: number[], holes_posis_i?: number[][]): number;
    /**
     * Adds a collection.
     * @param parent_i
     * @param points_i
     * @param plines_i
     * @param pgons_i
     */
    addColl(): number;
    /**
     * Copy positions.
     * @param posis_i
     * @param copy_attribs
     */
    copyMovePosi(posi_i: number, move_vector: Txyz, copy_attribs: boolean): number;
    copyMovePosis(posis_i: number | number[], move_vector: Txyz, copy_attribs: boolean): number | number[];
    /**
     * Copy positions.
     * @param posis_i
     * @param copy_attribs
     */
    copyPosi(posi_i: number, copy_attribs: boolean): number;
    copyPosis(posis_i: number | number[], copy_attribs: boolean): number | number[];
    /**
     * Copy points.
     * TODO copy attribs of topo entities
     * @param index
     * @param copy_attribs
     */
    copyPoint(old_point_i: number, copy_attribs: boolean): number;
    copyPoints(points_i: number | number[], copy_attribs: boolean): number | number[];
    /**
     * Copy plines.
     * TODO copy attribs of topo entities
     * @param index
     * @param copy_attribs
     */
    copyPline(old_pline_i: number, copy_attribs: boolean): number;
    copyPlines(plines_i: number | number[], copy_attribs: boolean): number | number[];
    /**
     * Copy polygon.
     * TODO copy attribs of topo entities
     * @param index
     * @param copy_attribs
     */
    copyPgon(old_pgon_i: number, copy_attribs: boolean): number;
    copyPgons(pgons_i: number | number[], copy_attribs: boolean): number | number[];
    /**
      * Copy a collection
      * Also makes copies of all ents in the collection, and all sub collections.
      * @param ent_type
      * @param index
      * @param copy_posis
      * @param copy_attribs
      */
    copyColl(old_coll_i: number, copy_attribs: boolean): number;
    copyColls(colls_i: number | number[], copy_attribs: boolean): number | number[];
    /**
     * Adds a pgon and updates the arrays.
     * Wires are assumed to be closed!
     * This also calls addTris()
     * @param wire_i
     */
    _addPgonWithoutHoles(wire_i: number): number;
    /**
     * Adds a face with a hole and updates the arrays.
     * Wires are assumed to be closed!
     * This also calls addTris()
     * @param wire_i
     */
    _addPgonWithHoles(wire_i: number, holes_wires_i: number[]): number;
    /**
     * Adds a vertex and updates the arrays.
     * @param posi_i
     */
    _addVertex(posi_i: number): number;
    /**
     * Adds an edge from v1 to v2 and updates the up and down arrays.
     * Each vertex passed into this function can have zero or one edges.
     * The new edge is added to v1 and v2
     * Any existing edges are not affected
     * @param vert_i1
     * @param vert_i2
     */
    _addEdge(vert_i1: number, vert_i2: number): number;
    /**
     * Adds a wire and updates the arrays.
     * Edges are assumed to be sequential!
     * @param edges_i
     */
    _addWire(edges_i: number[], close?: boolean): number;
    /**
     * Adds trangles and updates the arrays.
     * Wires are assumed to be closed!
     * This updates the trie->verts and the verts->tris
     * This does not update the face to which this wire belongs!
     * @param wire_i
     */
    _addTris(wire_i: number, hole_wires_i?: number[]): number[];
}
