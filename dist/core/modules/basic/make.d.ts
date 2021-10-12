/**
 * The `make` module has functions for making new entities in the model.
 * All these functions return the IDs of the entities that are created.
 * @module
 */
import { GIModel } from '../../../libs/geo-info/GIModel';
import { TId, Txyz, TPlane } from '../../../libs/geo-info/common';
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
 * Adds one or more new position to the model.
 *
 * @param __model__
 * @param coords A list of three numbers, or a list of lists of three numbers.
 * @returns A new position, or nested list of new positions.
 * @example position1 = make.Position([1,2,3])
 * @example_info Creates a position with coordinates x=1, y=2, z=3.
 * @example positions = make.Position([[1,2,3],[3,4,5],[5,6,7]])
 * @example_info Creates three positions, with coordinates [1,2,3],[3,4,5] and [5,6,7].
 */
export declare function Position(__model__: GIModel, coords: Txyz | Txyz[] | Txyz[][]): TId | TId[] | TId[][];
/**
 * Adds one or more new points to the model.
 *
 * @param __model__
 * @param entities Position, or list of positions, or entities from which positions can be extracted.
 * @returns Entities, new point or a list of new points.
 * @example point1 = make.Point(position1)
 * @example_info Creates a point at position1.
 */
export declare function Point(__model__: GIModel, entities: TId | TId[] | TId[][]): TId | TId[] | TId[][];
/**
 * Adds one or more new polylines to the model.
 *
 * @param __model__
 * @param entities List or nested lists of positions, or entities from which positions can be extracted.
 * @param close Enum, 'open' or 'close'.
 * @returns Entities, new polyline, or a list of new polylines.
 * @example polyline1 = make.Polyline([position1,position2,position3], close)
 * @example_info Creates a closed polyline with vertices position1, position2, position3 in sequence.
 */
export declare function Polyline(__model__: GIModel, entities: TId | TId[] | TId[][], close: _EClose): TId | TId[];
/**
 * Adds one or more new polygons to the model.
 *
 * @param __model__
 * @param entities List or nested lists of positions, or entities from which positions can be extracted.
 * @returns Entities, new polygon, or a list of new polygons.
 * @example polygon1 = make.Polygon([pos1,pos2,pos3])
 * @example_info Creates a polygon with vertices pos1, pos2, pos3 in sequence.
 * @example polygons = make.Polygon([[pos1,pos2,pos3], [pos3,pos4,pos5]])
 * @example_info Creates two polygons, the first with vertices at [pos1,pos2,pos3], and the second with vertices at [pos3,pos4,pos5].
 */
export declare function Polygon(__model__: GIModel, entities: TId | TId[] | TId[][]): TId | TId[];
/**
 * Lofts between entities.
 *
 * The geometry that is generated depends on the method that is selected.
 * - The 'quads' methods will generate polygons.
 * - The 'stringers' and 'ribs' methods will generate polylines.
 * - The 'copies' method will generate copies of the input geometry type.
 *
 * @param __model__
 * @param entities List of entities, or list of lists of entities.
 * @param method Enum, if 'closed', then close the loft back to the first entity in the list.
 * @returns Entities, a list of new polygons or polylines resulting from the loft.
 * @example quads = make.Loft([polyline1,polyline2,polyline3], 1, 'open_quads')
 * @example_info Creates quad polygons lofting between polyline1, polyline2, polyline3.
 * @example quads = make.Loft([polyline1,polyline2,polyline3], 1, 'closed_quads')
 * @example_info Creates quad polygons lofting between polyline1, polyline2, polyline3, and back to polyline1.
 * @example quads = make.Loft([ [polyline1,polyline2], [polyline3,polyline4] ] , 1, 'open_quads')
 * @example_info Creates quad polygons lofting first between polyline1 and polyline2, and then between polyline3 and polyline4.
 */
export declare function Loft(__model__: GIModel, entities: TId[] | TId[][], divisions: number, method: _ELoftMethod): TId[];
/**
 * Extrudes geometry by distance or by vector.
 * - Extrusion of a position, vertex, or point produces polylines;
 * - Extrusion of an edge, wire, or polyline produces polygons;
 * - Extrusion of a face or polygon produces polygons, capped at the top.
 *
 *
 * The geometry that is generated depends on the method that is selected.
 * - The 'quads' methods will generate polygons.
 * - The 'stringers' and 'ribs' methods will generate polylines.
 * - The 'copies' method will generate copies of the input geometry type.
 *
 * @param __model__
 * @param entities A list of entities, can be any type of entitiy.
 * @param dist Number or vector. If number, assumed to be [0,0,value] (i.e. extrusion distance in z-direction).
 * @param divisions Number of divisions to divide extrusion by. Minimum is 1.
 * @param method Enum, when extruding edges, select quads, stringers, or ribs
 * @returns Entities, a list of new polygons or polylines resulting from the extrude.
 * @example extrusion1 = make.Extrude(point1, 10, 2, 'quads')
 * @example_info Creates a polyline of total length 10 (with two edges of length 5 each) in the z-direction.
 * In this case, the 'quads' setting is ignored.
 * @example extrusion2 = make.Extrude(polygon1, [0,5,0], 1, 'quads')
 * @example_info Extrudes polygon1 by 5 in the y-direction, creating a list of quad surfaces.
 */
export declare function Extrude(__model__: GIModel, entities: TId | TId[], dist: number | Txyz, divisions: number, method: _EExtrudeMethod): TId | TId[];
/**
 * Sweeps a cross section wire along a backbone wire.
 *
 * @param __model__
 * @param entities Wires, or entities from which wires can be extracted.
 * @param xsection Cross section wire to sweep, or entity from which a wire can be extracted.
 * @param divisions Segment length or number of segments.
 * @param method Enum, select the method for sweeping.
 * @returns Entities, a list of new polygons or polylines resulting from the sweep.
 */
export declare function Sweep(__model__: GIModel, entities: TId | TId[], x_section: TId, divisions: number, method: _EExtrudeMethod): TId[];
/**
 * Joins existing polyline or polygons to create new polyline or polygons.
 *
 * In order to be joined, the polylines or polygons must be fused (i.e. share the same positions)
 *
 * The existing polygons are not affected.
 *
 * Note: Joining polylines currently not implemented.
 *
 * @param __model__
 * @param entities Polylines or polygons, or entities from which polylines or polygons can be extracted.
 * @returns Entities, a list of new polylines or polygons resulting from the join.
 */
export declare function Join(__model__: GIModel, entities: TId[]): TId[];
/**
 * Cuts polygons and polylines using a plane.
 *
 * If the 'keep_above' method is selected, then only the part of the cut entities above the plane are kept.
 * If the 'keep_below' method is selected, then only the part of the cut entities below the plane are kept.
 * If the 'keep_both' method is selected, then both the parts of the cut entities are kept.
 *
 * Currently does not support cutting polygons with holes. TODO
 *
 * If 'keep_both' is selected, returns a list of two lists.
 * [[entities above the plane], [entities below the plane]].
 *
 * @param __model__
 * @param entities Polylines or polygons, or entities from which polyline or polygons can be extracted.
 * @param plane The plane to cut with.
 * @param method Enum, select the method for cutting.
 * @returns Entities, a list of three lists of entities resulting from the cut.

 */
export declare function Cut(__model__: GIModel, entities: TId | TId[], plane: TPlane, method: _ECutMethod): TId[] | [TId[], TId[]];
/**
 * Creates a copy of one or more entities.
 * \n
 * Positions, objects, and collections can be copied. Topological entities (vertices, edges, and
 * wires) cannot be copied since they cannot exist without a parent entity.
 * \n
 * When entities are copied, their positions are also copied. The original entities and the copied
 * entities will not be welded (they will not share positions).
 * \n
 * The copy operation includes an option to also move entities, by a specified vector. If the vector
 * is null, then the entities will not be moved.
 * \n
 * The vector argument is overloaded. If you supply a list of vectors, the function will try to find
 * a 1 -to-1 match between the list of entities and the list of vectors. In the overloaded case, if
 * the two lists do not have the same length, then an error will be thrown.
 * \n
 * @param __model__
 * @param entities Entity or lists of entities to be copied. Entities can be positions, points,
 * polylines, polygons and collections.
 * @param vector A vector to move the entities by after copying, can be `null`.
 * @returns Entities, the copied entity or a list of copied entities.
 * @example copies = make.Copy([position1, polyine1, polygon1], [0,0,10])
 * @example_info Creates a copy of position1, polyine1, and polygon1 and moves all three entities 10
 * units in the Z direction.
 */
export declare function Copy(__model__: GIModel, entities: TId | TId[] | TId[][], vector: Txyz | Txyz[]): TId | TId[] | TId[][];
/**
 * Adds a new copy of specified entities to the model, and deletes the original entity.
 *
 * @param __model__
 * @param entities Entity or lists of entities to be copied. Entities can be positions, points, polylines, polygons and collections.
 * @returns Entities, the cloned entity or a list of cloned entities.
 * @example copies = make.Copy([position1,polyine1,polygon1])
 * @example_info Creates a copy of position1, polyine1, and polygon1.
 */
export declare function Clone(__model__: GIModel, entities: TId | TId[] | TId[][]): TId | TId[] | TId[][];
