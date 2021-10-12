/**
 * The `poly2D` module has a set of functions for working with 2D polygons, on the XY plane.
 * @module
 */
import { GIModel } from '../../../libs/geo-info/GIModel';
import { TId } from '../../../libs/geo-info/common';
export declare enum _EClipJointType {
    SQUARE = "jtSquare",
    ROUND = "jtRound",
    MITER = "jtMiter"
}
export declare enum _EClipEndType {
    OPEN_SQUARE = "etOpenSquare",
    OPEN_ROUND = "etOpenRound",
    OPEN_BUTT = "etOpenButt",
    CLOSED_PLINE = "etClosedLine",
    CLOSED_PGON = "etClosedPolygon"
}
export declare enum _EOffset {
    SQUARE_END = "square_end",
    BUTT_END = "butt_end"
}
export declare enum _EOffsetRound {
    SQUARE_END = "square_end",
    BUTT_END = "butt_end",
    ROUND_END = "round_end"
}
export declare enum _EBooleanMethod {
    INTERSECT = "intersect",
    DIFFERENCE = "difference",
    SYMMETRIC = "symmetric"
}
/**
 * Create a voronoi subdivision of one or more polygons.
 * \n
 * @param __model__
 * @param pgons A list of polygons, or entities from which polygons can be extracted.
 * @param entities A list of positions, or entities from which positions can be extracted.
 * @returns A list of new polygons.
 */
export declare function Voronoi(__model__: GIModel, pgons: TId | TId[], entities: TId | TId[]): TId[];
/**
 * Create a delaunay triangulation of set of positions.
 * \n
 * @param __model__
 * @param entities A list of positions, or entities from which positions can be extracted.
 * @returns A list of new polygons.
 */
export declare function Delaunay(__model__: GIModel, entities: TId | TId[]): TId[];
/**
 * Create a voronoi subdivision of a polygon.
 *
 * @param __model__
 * @param entities A list of positions, or entities from which positions can bet extracted.
 * @returns A new polygons, the convex hull of the positions.
 */
export declare function ConvexHull(__model__: GIModel, entities: TId | TId[]): TId;
export declare enum _EBBoxMethod {
    AABB = "aabb",
    OBB = "obb"
}
/**
 * Create a polygon that is a 2D bounding box of the entities.
 * \n
 * For the method, 'aabb' generates an Axis Aligned Bounding Box, and 'obb' generates an Oriented Bounding Box.
 * \n
 *
 * @param __model__
 * @param entities A list of positions, or entities from which positions can bet extracted.
 * @param method Enum, the method for generating the bounding box.
 * @returns A new polygon, the bounding box of the positions.
 */
export declare function BBoxPolygon(__model__: GIModel, entities: TId | TId[], method: _EBBoxMethod): TId;
/**
 * Create the union of a set of polygons.
 *
 * @param __model__
 * @param entities A list of polygons, or entities from which polygons can bet extracted.
 * @returns A list of new polygons.
 */
export declare function Union(__model__: GIModel, entities: TId | TId[]): TId[];
/**
 * Perform a boolean operation on polylines or polygons.
 * \n
 * The entities in A can be either polyline or polygons.
 * The entities in B must be polygons.
 * The polygons in B are first unioned before the operation is performed.
 * The boolean operation is then performed between each polyline or polygon in A, and the unioned B polygons.
 * \n
 * If A is an empty list, then an empty list is returned.
 * If B is an empty list, then the A list is returned.
 * \n
 * @param __model__
 * @param a_entities A list of polyline or polygons, or entities from which polyline or polygons can be extracted.
 * @param b_entities A list of polygons, or entities from which polygons can be extracted.
 * @param method Enum, the boolean operator to apply.
 * @returns A list of new polylines and polygons.
 */
export declare function Boolean(__model__: GIModel, a_entities: TId | TId[], b_entities: TId | TId[], method: _EBooleanMethod): TId[];
/**
 * Offset a polyline or polygon, with mitered joints.
 *
 * @param __model__
 * @param entities A list of pollines or polygons, or entities from which polylines or polygons can be extracted.
 * @param dist Offset distance
 * @param limit Mitre limit
 * @param end_type Enum, the type of end shape for open polylines'.
 * @returns A list of new polygons.
 */
export declare function OffsetMitre(__model__: GIModel, entities: TId | TId[], dist: number, limit: number, end_type: _EOffset): TId[];
/**
 * Offset a polyline or polygon, with chamfered joints.
 *
 * @param __model__
 * @param entities A list of pollines or polygons, or entities from which polylines or polygons can be extracted.
 * @param dist Offset distance
 * @param end_type Enum, the type of end shape for open polylines'.
 * @returns A list of new polygons.
 */
export declare function OffsetChamfer(__model__: GIModel, entities: TId | TId[], dist: number, end_type: _EOffset): TId[];
/**
 * Offset a polyline or polygon, with round joints.
 *
 * @param __model__
 * @param entities A list of pollines or polygons, or entities from which polylines or polygons can be extracted.
 * @param dist Offset distance
 * @param tolerance The tolerance for the rounded corners.
 * @param end_type Enum, the type of end shape for open polylines'.
 * @returns A list of new polygons.
 */
export declare function OffsetRound(__model__: GIModel, entities: TId | TId[], dist: number, tolerance: number, end_type: _EOffsetRound): TId[];
/**
 * Adds vertices to polyline and polygons at all locations where egdes intersect one another.
 * The vertices are welded.
 * This can be useful for creating networks that can be used for shortest path calculations.
 * \n
 * The input polyline and polygons are copied.
 * \n
 * @param __model__
 * @param entities A list polylines or polygons, or entities from which polylines or polygons can be extracted.
 * @param tolerance The tolerance for extending open plines if they are almost intersecting.
 * @returns Copies of the input polyline and polygons, stiched.
 */
export declare function Stitch(__model__: GIModel, entities: TId | TId[], tolerance: number): TId[];
/**
 * Clean a polyline or polygon.
 * \n
 * Vertices that are closer together than the specified tolerance will be merged.
 * Vertices that are colinear within the tolerance distance will be deleted.
 * \n
 * @param __model__
 * @param entities A list of polylines or polygons, or entities from which polylines or polygons can be extracted.
 * @param tolerance The tolerance for deleting vertices from the polyline.
 * @returns A list of new polygons.
 */
export declare function Clean(__model__: GIModel, entities: TId | TId[], tolerance: number): TId[];
