import { EAttribDataTypeStrs, TAttribDataTypes, EEntType, EFilterOperatorTypes } from '../common';
import { GIModelData } from '../GIModelData';
import { GIAttribMapBase } from './GIAttribMapBase';
/**
 * Geo-info attribute class for one attribute.
 * The attributs stores key-value pairs.
 * Multiple keys point to the same value.
 * So for example, [[1,3], "a"],[[0,4], "b"] can be converted into sequential arrays.
 * The values would be ["a", "b"]
 * The keys would be [1,0,,0,1] (Note the undefined value in the middle.)
 *
 */
export declare class GIAttribMapList extends GIAttribMapBase {
    /**
     * Creates an attribute.
     * @param attrib_data
     */
    constructor(modeldata: GIModelData, name: string, ent_type: EEntType, data_type: EAttribDataTypeStrs);
    /**
     * Check that the value is of the correct type for this attribute.
     * @param ent_i
     */
    protected _checkValType(val: TAttribDataTypes): void;
    /**
     * Gets the value for a given index.
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
     * Convert a value into a map key
     */
    protected _valToValkey(val: TAttribDataTypes): string | number;
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
}
