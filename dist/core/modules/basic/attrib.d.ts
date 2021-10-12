/**
 * The `attrib` module has functions for working with attributes in teh model.
 * Note that attributes can also be set and retrieved using the "@" symbol.
 * @module
 */
import { GIModel } from '../../../libs/geo-info/GIModel';
import { TId, TAttribDataTypes } from '../../../libs/geo-info/common';
export declare enum _EEntType {
    POSI = "ps",
    VERT = "_v",
    EDGE = "_e",
    WIRE = "_w",
    FACE = "_f",
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
    FACE = "_f",
    POINT = "pt",
    PLINE = "pl",
    PGON = "pg",
    COLL = "co",
    MOD = "mo"
}
export declare enum _EAttribPushTarget {
    POSI = "ps",
    VERT = "_v",
    EDGE = "_e",
    WIRE = "_w",
    FACE = "_f",
    POINT = "pt",
    PLINE = "pl",
    PGON = "pg",
    COLL = "co",
    COLLP = "cop",
    COLLC = "coc",
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
 * Set an attribute value for one or more entities.
 * \n
 * If entities is null, then model level attributes will be set.
 * \n
 * @param __model__
 * @param entities Entities, the entities to set the attribute value for.
 * @param attrib The attribute. Can be `name`, `[name, index]`, or `[name, key]`.
 * @param value The attribute value, or list of values.
 * @param method Enum
 */
export declare function Set(__model__: GIModel, entities: TId | TId[] | TId[][], attrib: string | [string, number | string], value: TAttribDataTypes | TAttribDataTypes[], method: _ESet): void;
export declare enum _ESet {
    ONE_VALUE = "one_value",
    MANY_VALUES = "many_values"
}
/**
 * Get attribute values for one or more entities.
 * \n
 * If entities is null, then model level attributes will be returned.
 * \n
 * @param __model__
 * @param entities Entities, the entities to get the attribute values for.
 * @param attrib The attribute. Can be `name`, `[name, index]`, or `[name, key]`.
 * @returns One attribute value, or a list of attribute values.
 */
export declare function Get(__model__: GIModel, entities: TId | TId[] | TId[][], attrib: string | [string, number | string]): TAttribDataTypes | TAttribDataTypes[];
/**
 * Add one or more attributes to the model.
 * The attribute will appear as a new column in the attribute table.
 * (At least one entity must have a value for the column to be visible in the attribute table).
 * All attribute values will be set to null.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param data_type_sel Enum, the data type for this attribute
 * @param attribs A single attribute name, or a list of attribute names.
 */
export declare function Add(__model__: GIModel, ent_type_sel: _EEntTypeAndMod, data_type_sel: _EDataType, attribs: string | string[]): void;
/**
 * Delete one or more attributes from the model.
 * The column in the attribute table will be deleted.
 * All values will also be deleted.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param attribs A single attribute name, or a list of attribute names. In 'null' all attributes will be deleted.
 */
export declare function Delete(__model__: GIModel, ent_type_sel: _EEntTypeAndMod, attribs: string | string[]): void;
/**
 * Rename an attribute in the model.
 * The header for column in the attribute table will be renamed.
 * All values will remain the same.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param old_attrib The old attribute name.
 * @param new_attrib The old attribute name.
 */
export declare function Rename(__model__: GIModel, ent_type_sel: _EEntTypeAndMod, old_attrib: string, new_attrib: string): void;
/**
 * Push attributes up or down the hierarchy. The original attribute is not changed.
 * \n
 * @param __model__
 * @param entities Entities, the entities to push the attribute values for.
 * @param attrib The attribute. Can be `name`, `[name, index_or_key]`,
 * `[source_name, source_index_or_key, target_name]` or `[source_name, source_index_or_key, target_name, target_index_or_key]`.
 * @param ent_type_sel Enum, the target entity type where the attribute values should be pushed to.
 * @param method_sel Enum, the method for aggregating attribute values in cases where aggregation is necessary.
 */
export declare function Push(__model__: GIModel, entities: TId | TId[], attrib: string | [string, number | string] | [string, number | string, string] | [string, number | string, string, number | string], ent_type_sel: _EAttribPushTarget, method_sel: _EPushMethodSel): void;
export declare enum _EPushMethodSel {
    FIRST = "first",
    LAST = "last",
    AVERAGE = "average",
    MEDIAN = "median",
    SUM = "sum",
    MIN = "min",
    MAX = "max"
}
