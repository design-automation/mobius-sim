/**
 * The `edit` module has functions for editing entities in the model.
 * These function modify the topology of objects: vertices, edges, wires and faces.
 * Some functions return the IDs of the entities that are created or modified.
 * @module
 */
import { GIModel } from '../../../libs/geo-info/GIModel';
import { TId } from '../../../libs/geo-info/common';
export declare enum _EDivisorMethod {
    BY_NUMBER = "by_number",
    BY_LENGTH = "by_length",
    BY_MAX_LENGTH = "by_max_length",
    BY_MIN_LENGTH = "by_min_length"
}
export declare enum _EWeldMethod {
    MAKE_WELD = "make_weld",
    BREAK_WELD = "break_weld"
}
export declare enum _ERingMethod {
    OPEN = "open",
    CLOSE = "close"
}
export declare enum _EDeleteMethod {
    DELETE_SELECTED = "delete_selected",
    KEEP_SELECTED = "keep_selected"
}
/**
 * Divides edges into a set of shorter edges.
 * \n
 * - If the `by_number` method is selected, then each edge is divided into
 * a fixed number of equal length shorter edges.
 * - If the `by_length` method is selected, then each edge is divided into
 * shorter edges of the specified length.
 * - The length of the last segment will be the remainder.
 * - If the `by_min_length` method is selected,
 * then the edge is divided into the number of shorter edges
 * with lengths equal to or greater than the minimum length specified.
 * - If the `by_max_length` method is selected,
 * then the edge is divided into the number of shorter edges
 * with lengths equal to or less than the maximum length specified.
 * \n
 * @param __model__
 * @param entities Edges, or entities from which edges can be extracted.
 * @param divisor Segment length or number of segments.
 * @param method Enum, select the method for dividing edges.
 * @returns Entities, a list of new edges resulting from the divide operation.
 * @example `segments1 = make.Divide(edge1, 5, by_number)`
 * @example_info Creates a list of 5 equal length edges from edge1.
 * @example `segments2 = make.Divide(edge1, 5, by_length)`
 * @example_info If edge1 has length 13, creates two new edges of length 5 and one new edge of length 3.
 */
export declare function Divide(__model__: GIModel, entities: TId | TId[], divisor: number, method: _EDivisorMethod): TId[];
/**
 * Makes one or more holes in a polygon.
 * \n
 * The holes are specified by lists of positions.
 * The positions must be on the polygon, i.e. they must be co-planar with the polygon and
 * they must be within the boundary of the polygon. (Even positions touching the edge of the polygon
 * can result in no hole being generated.)
 * \n
 * Multiple holes can be created.
 * - If the positions is a single list, then a single hole will be generated.
 * - If the positions is a list of lists, then multiple holes will be generated.
 * \n
 * @param __model__
 * @param pgon A polygon to make holes in.
 * @param entities List of positions, or nested lists of positions, or entities from which positions
 * can be extracted.
 * @returns Entities, a list of wires resulting from the hole(s).
 */
export declare function Hole(__model__: GIModel, pgon: TId, entities: TId | TId[] | TId[][]): TId[];
/**
 * Make or break welds between vertices.
 * If two vertices are welded, then they share the same position.
 * \n
 * - When making a weld between vertices, a new position is created. The new position is calculate
 * as the average of all the existing positions of the vertices. The vertices will then be linked
 * to the new position. This means that if the position is later moved, then all vertices will be
 * affected. The new position is returned. The positions that become shared are returned.
 * - When breaking a weld between vetices, existing positions are duplicated. Each vertex is then
 * linked to one of these duplicate positions. If these positions are later moved, then only one
 * vertex will be affected.  The new positions that get generated are returned.
 * \n
 * @param __model__
 * @param entities Entities, a list of vertices, or entities from which vertices can be extracted.
 * @param method Enum; the method to use, either `make_weld` or `break_weld`.
 * @returns void
 */
export declare function Weld(__model__: GIModel, entities: TId | TId[], method: _EWeldMethod): TId[];
/**
 * Fuse positions that lie within a certain tolerance of one another.
 * New positions will be created.
 * \n
 * The existing positions are analysed and clustered into groups of positions that lie with the
 * tolerance distance from one another. For each cluster, a new position is created at the centre
 * of the cluster. The xyz coordinates of the new position will be calculated as the average of all
 * the existing positions in the cluster.
 * \n
 * If the positions that are fuse have vertices attached, then the vertices will become welded.
 * (Note that when using the `edit.Weld()` function, there is no threshold tolerance. Even vertices
 * that are far apart can be welded together. Fusing allows only vertices that are close together
 * to be welded.)
 * \n
 * In some cases, if edges are shorter than the tolerance, this can result in edges being deleted.
 * The deletion of edges may also result in polylines or polygons being deleted. (It is therefore
 * advisable to filter out deleted entities after applying the `edit.Fuse()` function. For example,
 * if you have a list of polygons, after fusing, you can filter the list like this:
 * `pgons = pgons#pg`.)
 * \n
 * The new positions that get generated are returned.
 * \n
 * @param __model__
 * @param entities Entities, a list of positions, or entities from which positions can be extracted.
 * @param tolerance The distance tolerance for fusing positions.
 * @returns void
 */
export declare function Fuse(__model__: GIModel, entities: TId | TId[], tolerance: number): TId[];
/**
 * Opens or closes a polyline.
 * \n
 * A polyline can be open or closed. A polyline consists of a sequence of vertices and edges.
 * Edges connect pairs of vertices.
 * - An open polyline has no edge connecting the first and last vertices. Closing a polyline
 * adds this edge.
 * - A closed polyline has an edge connecting the first and last vertices. Opening a polyline
 * deletes this edge.
 * \n
 * @param __model__
 * @param entities Polyline(s).
 * @param method Enum; the method to use, either `open` or `close`.
 * @returns void
 * @example `edit.Ring([polyline1,polyline2,...], method='close')`
 * @example_info If open, polylines are changed to closed; if already closed, nothing happens.
 */
export declare function Ring(__model__: GIModel, entities: TId | TId[], method: _ERingMethod): void;
/**
 * Shifts the order of the edges in a closed wire.
 * \n
 * In a closed wire (either a closed polyline or polygon), the edges form a closed ring. Any edge
 * (or vertex) could be the first edge of the ring. In some cases, it is useful to have an edge in
 * a particular position in a ring. This function allows the edges to be shifted either forwards or
 * backwards around the ring. The order of the edges in the ring will remain unchanged.
 * \n
 * - An offset of zero has no effect.
 * - An offset of 1 will shift the edges so that the second edge becomes the first edge.
 * - An offset of 2 will shift the edges so that the third edge becomes the first edge.
 * - An offset of -1 will shift the edges so that the last edge becomes the first edge.
 * \n
 * @param __model__
 * @param entities Wire, face, polyline, polygon.
 * @param offset The offset, a positive or negative integer.
 * @returns void
 * @example `modify.Shift(polygon1, 1)`
 * @example_info Shifts the edges in the polygon wire, so that the every edge moves back by one position
 * in the ring. The first edge will become the last edge.
 * @example `edit.Shift(polyline1, -1)`
 * @example_info Shifts the edges in the closed polyline wire, so that every edge moves up by one position
 * in the ring. The last edge will become the first edge.
 */
export declare function Shift(__model__: GIModel, entities: TId | TId[], offset: number): void;
/**
 * Reverses direction of wires, polylines or polygons.
 * \n
 * The order of vertices and edges in the wires will be reversed.
 * \n
 * For polygons this also means that they will face in the opposite direction. The back face and
 * front face will be flipped. If the normal is calculated, it will face in the opposite direction.
 * \n
 * @param __model__
 * @param entities Wire,polyline, polygon.
 * @returns void
 * @example `modify.Reverse(polygon1)`
 * @example_info Flips polygon and reverses its normal.
 * @example `edit.Reverse(polyline1)`
 * @example_info Reverses the order of vertices and edges in the polyline.
 */
export declare function Reverse(__model__: GIModel, entities: TId | TId[]): void;
/**
 * Deletes geometric entities: positions, points, polylines, polygons, and collections.
 * \n
 * - When deleting positions, any topology that requires those positions will also be deleted.
 * (For example, any vertices linked to the deleted position will also be deleted,
 * which may in turn result in some edges being deleted, and so forth.)
 * - When deleting objects (points, polylines, and polygons), topology is also deleted.
 * - When deleting collections, the objects and other collections in the collection are also deleted.
 * \n
 * Topological entities inside objects  (wires, edges, vertices) cannot be deleted.
 * If a topological entity needs to be deleted, then the current approach is create a new object
 * with the desired topology, and then to delete the original object.
 * \n
 * @param __model__
 * @param entities Positions, points, polylines, polygons, collections.
 * @param method Enum, delete or keep unused positions.
 * @returns void
 * @example `edit.Delete(polygon1, 'delete_selected')`
 * @example_info Deletes `polygon1` from the model. The topology for
 * `polygon1` will be deleted. In addition, any positions being used by `polygon1` will be deleted
 * only if they are not being used by other objects.
 * @example `edit.Delete(polygon1, 'keep_selected')`
 * @example_info Deletes everything except `polygon1` from the model. The topology and positions for
 * `polygon1` will not be deleted.
 */
export declare function Delete(__model__: GIModel, entities: TId | TId[], method: _EDeleteMethod): void;
