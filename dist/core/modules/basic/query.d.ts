/**
 * The `query` module has functions for querying entities in the the model.
 * Most of these functions all return a list of IDs of entities in the model.
 * @module
 */
import { GIModel } from '../../../libs/geo-info/GIModel';
import { TId, EEntType, TEntTypeIdx, TAttribDataTypes } from '../../../libs/geo-info/common';
export declare enum _EEntType {
    POSI = "ps",
    VERT = "_v",
    EDGE = "_e",
    WIRE = "_w",
    POINT = "pt",
    PLINE = "pl",
    PGON = "pg",
    COLL = "co"
}
export declare enum _EEntTypeAndMod {
    POSI = "ps",
    VERT = "_v",
    EDGE = "_e",
    WIRE = "_w",
    POINT = "pt",
    PLINE = "pl",
    PGON = "pg",
    COLL = "co",
    MOD = "mo"
}
export declare enum _EDataType {
    NUMBER = "number",
    STRING = "string",
    BOOLEAN = "boolean",
    LIST = "list",
    DICT = "dict"
}
/**
 * Get entities from a list of entities.
 * For example, you can get the position entities from a list of polygon entities.
 * \n
 * The result will always be a list of entities, even if there is only one entity.
 * In a case where you want only one entity, remember to get the first item in the list.
 * \n
 * The resulting list of entities will not contain duplicate entities.
 * \n
 * @param __model__
 * @param ent_type_enum Enum, the type of entity to get.
 * @param entities Optional, list of entities to get entities from, or null to get all entities in the model.
 * @returns Entities, a list of entities.
 * @example positions = query.Get('positions', [polyline1, polyline2])
 * @example_info Returns a list of positions that are part of polyline1 and polyline2.
 */
export declare function Get(__model__: GIModel, ent_type_enum: _EEntType, entities: TId | TId[]): TId[] | TId[][];
/**
 * Filter a list of entities based on an attribute value.
 * \n
 * The result will always be a list of entities, even if there is only one entity.
 * In a case where you want only one entity, remember to get the first item in the list.
 * \n
 * @param __model__
 * @param entities List of entities to filter. The entities must all be of the same type
 * @param attrib The attribute to use for filtering. Can be `name`, `[name, index]`, or `[name, key]`.
 * @param operator_enum Enum, the operator to use for filtering
 * @param value The attribute value to use for filtering.
 * @returns Entities, a list of entities that match the conditions specified in 'expr'.
 */
export declare function Filter(__model__: GIModel, entities: TId | TId[], attrib: string | [string, number | string], operator_enum: _EFilterOperator, value: TAttribDataTypes): TId[] | TId[][];
export declare enum _EFilterOperator {
    IS_EQUAL = "==",
    IS_NOT_EQUAL = "!=",
    IS_GREATER_OR_EQUAL = ">=",
    IS_LESS_OR_EQUAL = "<=",
    IS_GREATER = ">",
    IS_LESS = "<",
    EQUAL = "="
}
/**
 * Returns a list of entities that are not part of the specified entities.
 * For example, you can get the position entities that are not part of a list of polygon entities.
 * \n
 * This function does the opposite of query.Get().
 * While query.Get() gets entities that are part of of the list of entities,
 * this function gets the entities that are not part of the list of entities.
 * \n
 * @param __model__
 * @param ent_type_enum Enum, specifies what type of entities will be returned.
 * @param entities List of entities to be excluded.
 * @returns Entities, a list of entities that match the type specified in 'ent_type_enum', and that are not in entities.
 * @example positions = query.Invert('positions', [polyline1, polyline2])
 * @example_info Returns a list of positions that are not part of polyline1 and polyline2.
 */
export declare function Invert(__model__: GIModel, ent_type_enum: _EEntType, entities: TId | TId[]): TId[];
export declare enum _ESortMethod {
    DESCENDING = "descending",
    ASCENDING = "ascending"
}
/**
 * Sorts entities based on an attribute.
 * \n
 * If the attribute is a list, and index can also be specified as follows: #@name1[index].
 * \n
 * @param __model__
 * @param entities List of two or more entities to be sorted, all of the same entity type.
 * @param attrib Attribute name to use for sorting. Can be `name`, `[name, index]`, or `[name, key]`.
 * @param method_enum Enum, sort descending or ascending.
 * @returns Entities, a list of sorted entities.
 * @example sorted_list = query.Sort( [pos1, pos2, pos3], #@xyz[2], descending)
 * @example_info Returns a list of three positions, sorted according to the descending z value.
 */
export declare function Sort(__model__: GIModel, entities: TId[], attrib: string | [string, number | string], method_enum: _ESortMethod): TId[];
/**
* Returns a list of perimeter entities. In order to qualify as a perimeter entity,
* entities must be part of the set of input entities and must have naked edges.
* \n
* @param __model__
* @param ent_type Enum, select the type of perimeter entities to return
* @param entities List of entities.
* @returns Entities, a list of perimeter entities.
* @example query.Perimeter('edges', [polygon1,polygon2,polygon])
* @example_info Returns list of edges that are at the perimeter of polygon1, polygon2, or polygon3.
*/
export declare function Perimeter(__model__: GIModel, ent_type: _EEntType, entities: TId | TId[]): TId[];
export declare function _perimeter(__model__: GIModel, select_ent_type: EEntType, ents_arr: TEntTypeIdx[]): TEntTypeIdx[];
/**
* Returns a list of neighboring entities. In order to qualify as a neighbor,
* entities must not be part of the set of input entities, but must be welded to one or more entities in the input.
* \n
* @param __model__
* @param ent_type_enum Enum, select the types of neighbors to return
* @param entities List of entities.
* @returns Entities, a list of welded neighbors
* @example query.neighbor('edges', [polyline1,polyline2,polyline3])
* @example_info Returns list of edges that are welded to polyline1, polyline2, or polyline3.
*/
export declare function Neighbor(__model__: GIModel, ent_type_enum: _EEntType, entities: TId | TId[]): TId[];
export declare function _neighbors(__model__: GIModel, select_ent_type: EEntType, ents_arr: TEntTypeIdx[]): TEntTypeIdx[];
export declare enum _EEdgeMethod {
    PREV = "previous",
    NEXT = "next",
    PREV_NEXT = "both",
    TOUCH = "touching"
}
/**
* Given an edge, returns other edges.
* - If "previous" is selected, it returns the previous edge in the wire or null if there is no previous edge.
* - If "next" is selected, it returns the next edge in the wire or null if there is no next edge.
* - If "both" is selected, it returns a list of two edges, [previous, next]. Either can be null.
* - If "touching" is selected, it returns a list of edges from other wires that share the same start and end positions (in any order).
* @param __model__
* @param entities An edge or list of edges.
* @param edge_query_enum Enum, select the types of edges to return.
* @returns Entities, an edge or list of edges
*/
export declare function Edge(__model__: GIModel, entities: TId | TId[], edge_query_enum: _EEdgeMethod): TId | TId[];
/**
 * Checks the type of an entity.
 * \n
 * - For is\_used\_posi, returns true if the entity is a posi, and it is used by at least one vertex.
 * - For is\_unused\_posi, it returns the opposite of is\_used\_posi.
 * - For is\_object, returns true if the entity is a point, a polyline, or a polygon.
 * - For is\_topology, returns true if the entity is a vertex, an edge, a wire, or a face.
 * - For is\_point\_topology, is\_polyline\_topology, and is\_polygon\_topology, returns true.
 * if the entity is a topological entity, and it is part of an object of the specified type.
 * - For is\_open, returns true if the entity is a wire or polyline and is open. For is\_closed, it returns the opposite of is\_open.
 * - For is\_hole, returns true if the entity is a wire, and it defines a hole in a face.
 * - For has\_holes, returns true if the entity is a face or polygon, and it has holes.
 * - For has\_no\_holes, it returns the opposite of has\_holes.
 *
 * @param __model__
 * @param entities An entity, or a list of entities.
 * @param type_query_enum Enum, select the conditions to test agains.
 * @returns Boolean or list of boolean in input sequence.
 * @example query.Type([polyline1, polyline2, polygon1], is\_polyline )
 * @example_info Returns a list [true, true, false] if polyline1 and polyline2 are polylines but polygon1 is not a polyline.
 */
export declare function Type(__model__: GIModel, entities: TId | TId[], type_query_enum: _ETypeQueryEnum): boolean | boolean[];
export declare enum _ETypeQueryEnum {
    EXISTS = "exists",
    IS_POSI = "is_position",
    IS_USED_POSI = "is_used_posi",
    IS_UNUSED_POSI = "is_unused_posi",
    IS_VERT = "is_vertex",
    IS_EDGE = "is_edge",
    IS_WIRE = "is_wire",
    IS_POINT = "is_point",
    IS_PLINE = "is_polyline",
    IS_PGON = "is_polygon",
    IS_COLL = "is_collection",
    IS_OBJ = "is_object",
    IS_TOPO = "is_topology",
    IS_POINT_TOPO = "is_point_topology",
    IS_PLINE_TOPO = "is_polyline_topology",
    IS_PGON_TOPO = "is_polygon_topology",
    IS_OPEN = "is_open",
    IS_CLOSED = "is_closed",
    IS_HOLE = "is_hole",
    HAS_HOLES = "has_holes",
    HAS_NO_HOLES = "has_no_holes"
}
