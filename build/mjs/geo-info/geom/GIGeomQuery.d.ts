import { EEntType, IGeomMaps, Txyz, TEntTypeIdx, EWireType } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for geometry.
 */
export declare class GIGeomQuery {
    private modeldata;
    private _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps);
    /**
     * Returns a list of indices for ents.
     * @param ent_type
     */
    getEnts(ent_type: EEntType): number[];
    /**
     * Returns the number of entities
     */
    numEnts(ent_type: EEntType): number;
    /**
     * Returns the number of entities for [posis, point, polylines, polygons, collections].
     */
    numEntsAll(): number[];
    /**
     * Check if an entity exists
     * @param ent_type
     * @param index
     */
    entExists(ent_type: EEntType, index: number): boolean;
    /**
     * Fill a map of sets of unique indexes
     */
    getEntsMap(ents: TEntTypeIdx[], ent_types: number[]): Map<number, Set<number>>;
    /**
     * Returns true if the first coll is a descendent of the second coll.
     * @param coll_i
     */
    isCollDescendent(coll1_i: number, coll2_i: number): boolean;
    /**
     * Returns true if the first coll is an ancestor of the second coll.
     * @param coll_i
     */
    isCollAncestor(coll1_i: number, coll2_i: number): boolean;
    /**
     * Returns a list of indices for all posis that have no verts
     */
    getUnusedPosis(): number[];
    /**
     * Get two edges that are adjacent to this vertex that are both not zero length.
     * In some cases wires and polygons have edges that are zero length.
     * This causes problems for calculating normals etc.
     * The return value can be either one edge (in open polyline [null, edge_i], [edge_i, null])
     * or two edges (in all other cases) [edge_i, edge_i].
     * If the vert has no non-zero edges, then [null, null] is returned.
     * @param vert_i
     */
    getVertNonZeroEdges(vert_i: number): number[];
    /**
     * Get the next edge in a sequence of edges
     * @param edge_i
     */
    getNextEdge(edge_i: number): number;
    /**
     * Get the previous edge in a sequence of edges
     * @param edge_i
     */
    getPrevEdge(edge_i: number): number;
    /**
     * Get a list of edges that are neighbours ()
     * The list will include the input edge.
     * @param edge_i
     */
    getNeighborEdges(edge_i: number): number[];
    /**
     * Check if a wire is closed.
     * @param wire_i
     */
    isWireClosed(wire_i: number): boolean;
    /**
     * Check if a wire belongs to a pline, a pgon or a pgon hole.
     */
    getWireType(wire_i: number): EWireType;
    /**
     * Returns the vertices.
     * For a closed wire, #vertices = #edges
     * For an open wire, #vertices = #edges + 1
     * @param wire_i
     */
    getWireVerts(wire_i: number): number[];
    /**
     *
     * @param pgon_i
     */
    getPgonBoundary(pgon_i: number): number;
    /**
     *
     * @param pgon_i
     */
    getPgonHoles(pgon_i: number): number[];
    /**
     *
     * @param pgon_i
     */
    getPgonNormal(pgon_i: number): Txyz;
    /**
     *
     * @param ent_i
     */
    getCentroid(ent_type: EEntType, ent_i: number): Txyz;
    /**
     * Gets a normal from a wire.
     *
     * It triangulates the wire and then adds up all the normals of all the triangles.
     * Each edge has equal weight, irrespective of length.
     *
     * In some cases, the triangles may cancel each other out.
     * In such a case, it will choose the side' where the wire edges are the longest.
     *
     * @param wire_i
     */
    getWireNormal(wire_i: number): Txyz;
    /**
     * Given a set of vertices, get the welded neighbour entities.
     * @param ent_type
     * @param verts_i
     */
    neighbor(ent_type: EEntType, verts_i: number[]): number[];
    /**
     * Given a set of edges, get the perimeter entities.
     * @param ent_type
     * @param edges_i
     */
    perimeter(ent_type: EEntType, edges_i: number[]): number[];
    /**
     * Get the object of a topo entity.
     * Returns a point, pline, or pgon. (no posis)
     * @param ent_type
     * @param ent_i
     */
    getTopoObj(ent_type: EEntType, ent_i: number): TEntTypeIdx;
    /**
     * Get the object type of a topo entity.
     * @param ent_type
     * @param ent_i
     */
    getTopoObjType(ent_type: EEntType, ent_i: number): EEntType;
    /**
     * Get the topo entities of an object
     * @param ent_type
     * @param ent_i
     */
    getObjTopo(ent_type: EEntType, ent_i: number): [number[], number[], number[]];
    /**
     * Get the entities under a collection or object.
     * Returns a list of entities in hierarchical order.
     * For polygons and polylines, the list is ordered like this:
     * wire, vert, posi, edge, vert, posi, edge, vert, posi
     * @param ent_type
     * @param ent_i
     */
    getEntSubEnts(ent_type: EEntType, ent_i: number): TEntTypeIdx[];
    private _addtWireSubEnts;
}
