import { EEntType, IGeomMaps } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for geometry.
 */
export declare class GIGeomEditTopo {
    private modeldata;
    private _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps);
    /**
     * Insert a vertex into an edge and updates the wire with the new edge
     * \n
     * Applies to both plines and pgons.
     * \n
     * Plines can be open or closed.
     * \n
     */
    insertVertIntoWire(edge_i: number, posi_i: number): number;
    /**
         * Insert multiple vertices into an edge and updates the wire with the new edges
         * \n
         * Applies to both plines and pgons.
         * \n
         * Plines can be open or closed.
         * \n
         */
    insertVertsIntoWire(edge_i: number, posis_i: number[]): number[];
    /**
     * Replace all positions in an entity with a new set of positions.
     * \n
     */
    replacePosis(ent_type: EEntType, ent_i: number, new_posis_i: number[]): void;
    /**
     * Replace the position of a vertex with a new position.
     * \n
     * If the result is an edge with two same posis, then the vertex will be deleted if del_if_invalid = true.
     * If del_if_invalid = false, no action will be taken.
     * \n
     * Called by modify.Fuse() and poly2d.Stitch().
     */
    replaceVertPosi(vert_i: number, new_posi_i: number, del_if_invalid?: boolean): void;
    /**
     * Unweld the vertices on naked edges.
     * \n
     */
    unweldVertsShallow(verts_i: number[]): number[];
    /**
     * Unweld all vertices by cloning the positions that are shared.
     * \n
     * Attributes on the positions are copied.
     * \n
     * @param verts_i
     */
    cloneVertPositions(verts_i: number[]): number[];
    /**
     * Weld all vertices by merging the positions that are equal, so that they become shared.
     * \n
     * The old positions are deleted if unused. Attributes on those positions are discarded.
     * \n
     * @param verts_i
     */
    mergeVertPositions(verts_i: number[]): number;
    /**
     * Reverse the edges of a wire.
     * This lists the edges in reverse order, and flips each edge.
     * \n
     * The attributes will not be affected. So the order of edge attribtes will also become reversed.
     *
     * TODO
     * This does not reverse the order of the edges.
     * The method, getWireVertices() in GeomQuery returns the correct vertices.
     * However, you need to be careful with edge order.
     * The next edge after edge 0 may not be edge 1.
     * If reversed it will instead be the last edge.
     */
    reverse(wire_i: number): void;
    /**
     * Shifts the edges of a wire.
     * \n
     * The attributes will not be affected. For example, lets say a polygon has three edges
     * e1, e2, e3, with attribute values 5, 6, 7
     * If teh edges are shifted by 1, the edges will now be
     * e2, e3, e1, withh attribute values 6, 7, 5
     */
    shift(wire_i: number, offset: number): void;
}
