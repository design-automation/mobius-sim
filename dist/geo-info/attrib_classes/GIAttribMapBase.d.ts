import { EFilterOperatorTypes, EAttribDataTypeStrs, TAttribDataTypes, IAttribJSONData, EEntType } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Geo-info attribute class for one attribute.
 * This class is the base from which other classes inherit:
 * - GIAttribMapBool
 * - GIAttribMapDict
 * - GIAttribMapList
 * - GIAttribMapNum
 * - GIAttribMapStr
 * The attributs stores key-value pairs.
 * Multiple keys point to the same value.
 * So for example, [[1,3], "a"],[[0,4], "b"] can be converted into sequential arrays.
 * The values would be ["a", "b"]
 * The keys would be [1,0,,0,1] (Note the undefined value in the middle.)
 *
 */
export declare class GIAttribMapBase {
    protected modeldata: GIModelData;
    protected _name: string;
    protected _ent_type: EEntType;
    protected _data_type: EAttribDataTypeStrs;
    protected _is_length_variable: boolean;
    protected _map_val_i_to_ents_i: Map<number, number | Set<number>>;
    protected _map_ent_i_to_val_i: Map<number, number>;
    /**
     * Creates an attribute.
     * @param attrib_data
     */
    constructor(modeldata: GIModelData, name: string, ent_type: EEntType, data_type: EAttribDataTypeStrs);
    /**
     * Returns the JSON data for this attribute.
     * Returns null if there is no data.
     * If entset is null, then all ents are included.
     */
    getJSONData(ent_set?: Set<number>): IAttribJSONData;
    /**
     * Gets the name of this attribute.
     */
    getName(): string;
    /**
     * Sets the name of this attribute.
     */
    setName(name: string): void;
    /**
     * Returns the data type of this attribute.
     */
    getDataType(): EAttribDataTypeStrs;
    /**
     * Returns the length of the data.
     * \n
     * If _data_type is NUMBER, STRING, BOOLEAN, then length = 1
     * \n
     * If _data_type is LIST, length is the list of the longest length, can be 0
     * \n
     * If _data_type is OBJECT, length is the obect with the longest Object.keys, can be 0
     */
    getDataLength(): number;
    /**
     * Returns true if there is an entity that has a value (i.e. the value is not undefined).
     */
    hasEnt(ent_i: number): boolean;
    /**
     * Returns the number of entities that have a value (i.e. is not undefined).
     */
    numEnts(): number;
    /**
     * Returns the number of values.
     */
    numVals(): number;
    /**
     * Returns the IDs of all ents that have a value.
     * Note that this may include deleted ents.
     */
    getEnts(): number[];
    /**
     * Gets the value for a given entity, or an array of values given an array of entities.
     * \n
     * Returns undefined if the entity does not exist in this map.
     * \n
     * If value is a list or dict, it is passed by reference.
     * \n
     * WARNING: The returned dict or list should not be modified, it should be treated as immutable.
     * \n
     * @param ent_i
     */
    getEntVal(ent_i: number): TAttribDataTypes;
    /**
     * Gets all the keys that have a given value
     * If the value does not exist an empty array is returned
     * The value can be a list or object
     * @param val
     */
    getEntsFromVal(val: TAttribDataTypes): number[];
    /**
     * Sets the value for a given entity or entities.
     *
     * If the value is undefined, no action is taken.
     *
     * The value can be null, in which case it is equivalent to deleting the entities from this attrib map.
     *
     * If the ents come from a previous snapshot, then they will be copied.
     *
     * @param ent_i
     * @param val
     */
    setEntVal(ents_i: number | number[], val: TAttribDataTypes, check_type?: boolean): void;
    /**
     * Delete the entities from this attribute map.
     */
    delEnt(ents_i: number | number[]): void;
    /**
     * Returns an array of entity indices which do not have a value (undefined)
     */
    getEntsWithoutVal(ents_i: number[]): number[];
    /**
     * Returns an array of entity indices which have a value (not undefined)
     */
    getEntsWithVal(ents_i: number[]): number[];
    /**
     * Adds all the entity-value pairs in the other attribute map to this attribute map.
     * Conflict detection is performed.
     * This method is used when it is known that this attribute map already contains some data.
     * @param other_attrib_map
     * @param other_ents_i
     */
    mergeAttribMap(other_attrib_map: GIAttribMapBase, other_ents_i: number[]): void;
    /**
     * Adds all the entity-value pairs in the other attribute map to this attribute map.
     * No conflict detection is performed.
     * This method is used when it is known that this attribute map is actually empty.
     * @param other_attrib_map
     * @param other_ents_i
     */
    addAttribMap(other_attrib_map: GIAttribMapBase, other_ents_i: number[]): void;
    /**
     * Generates teh merge conflict error message.
     * @param other_ent_i
     * @param other_val_i
     */
    _mergeConflictError(other_ent_i: number, other_val_i: number): void;
    toStr(): string;
    /**
     * Compare two values with a comparison operator, ==, !=, >, >=, <, <=
     * \n
     * If the values are of different types, then false is returned.
     * \n
     * For arrays, true is returned only if a pairwise comparison between the items in the two arrays all return true.
     * The two arrays must also be of equal length.
     * \n
     * Values may be null.
     * Values that are undefined will be treated as null.
     * \n
     * @param operator
     * @param val1
     * @param val2
     */
    protected _compare(operator: EFilterOperatorTypes, val1: any, val2: any): boolean;
    /**
     *
     * @param val_i
     * @param ent_i
     */
    protected _mapValToEntsAdd(val_i: number, ent_i: number): void;
    /**
     *
     * @param val_i
     * @param ent_i
     */
    protected _mapValToEntsRem(val_i: number, ent_i: number): void;
    /**
     *
     * @param val_i
     */
    protected _mapValToEntsGetArr(val_i: number): number[];
    /**
     * Check that the value is of the correct type for this attribute.
     * @param ent_i
     */
    protected _checkValType(val: TAttribDataTypes): void;
    /**
     * Gets the value for a given index.
     * \n
     * If the value does not exist, it throws an error.
     * \n
     * If value is a list or dict, it is passed by reference.
     * @param ent_i
     */
    protected _getVal(val_i: number): TAttribDataTypes;
    /**
     * Gets the index for a given value.
     * @param ent_i
     */
    protected _getValIdx(val: TAttribDataTypes): number;
    /**
     * Get the index for a given value, if it does not exist add it.
     * @param ent_i
     */
    protected _getAddValIdx(val: TAttribDataTypes): number;
    /**
     * Executes a query.
     * \n
     * The value can be NUMBER, STRING, BOOLEAN, LIST or DICT
     * \n
     * @param ents_i
     * @param operator The relational operator, ==, !=, <=, >=, etc
     * @param search_val The value to search, string or number, or any[].
     */
    queryVal(ents_i: number[], operator: EFilterOperatorTypes, search_val: TAttribDataTypes): number[];
    /**
     * Executes a query for an indexed valued in a list
     * @param ents_i
     * @param val_arr_idx The index of the value in the array
     * @param operator The relational operator, ==, !=, <=, >=, etc
     * @param search_val The value to search, string or number, or any[].
     */
    queryListIdxVal(ents_i: number[], val_arr_idx: number, operator: EFilterOperatorTypes, search_val: TAttribDataTypes): number[];
    /**
     * Executes a query for an valued in an object, identified by a key
     * @param ents_i
     * @param key The key of the value in the object
     * @param operator The relational operator, ==, !=, <=, >=, etc
     * @param search_val The value to search, string or number, or any[].
     */
    queryDictKeyVal(ents_i: number[], key: string, operator: EFilterOperatorTypes, search_val: TAttribDataTypes): number[];
}
