import { TAttribDataTypes, EEntType } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for attributes.
 */
export declare class GIAttribsGetVal {
    private modeldata;
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata: GIModelData);
    /**
     * Get an model attrib value, or an array of values.
     * \n
     * If idx_or_key is null, then this must be a simple attrib.
     * If idx_or_key is a number, then this must be indexing a list attrib.
     * if idx_or_key is a string, then this must be indexing a dict attrib.
     * \n
     * If the attribute does not exist, throw an error
     * \n
     * @param ent_type
     * @param name
     */
    getModelAttribValOrItem(name: string, idx_or_key: number | string): any;
    /**
     * Get a model attrib value
     * @param name
     */
    getModelAttribVal(name: string): TAttribDataTypes;
    /**
     * Get a model attrib list value given an index
     * \n
     * If this attribute is not a list, throw error
     * \n
     * If idx is creater than the length of the list, undefined is returned.
     * \n
     * @param ent_type
     * @param name
     */
    getModelAttribListIdxVal(name: string, idx: number): number | string;
    /**
     * Get a model attrib dict value given a key
     * \n
     * If this attribute is not a dict, throw error
     * \n
     * If key does not exist, throw error
     * \n
     * @param ent_type
     * @param name
     */
    getModelAttribDictKeyVal(name: string, key: string): number | string;
    /**
     * Get an entity attrib value, or an array of values given an array of entities.
     * \n
     * If idx_or_key is null, then this must be a simple attrib.
     * If idx_or_key is a number, then this must be indexing a list attrib.
     * if idx_or_key is a string, then this must be indexing a dict attrib.
     * \n
     * If the attribute does not exist, throw an error
     * \n
     * @param ent_type
     * @param name
     */
    getEntAttribValOrItem(ent_type: EEntType, ents_i: number | number[], name: string, idx_or_key: number | string): any;
    /**
     * Get an entity attrib value, or an array of values given an array of entities.
     * \n
     * If the attribute does not exist, throw an error
     * \n
     * @param ent_type
     * @param name
     */
    getEntAttribVal(ent_type: EEntType, ents_i: number | number[], name: string): TAttribDataTypes | TAttribDataTypes[];
    /**
     * Get an entity attrib value in a list.
     * \n
     * If the attribute does not exist, throw error
     * \n
     * If the index is out of range, return undefined.
     * \n
     * @param ent_type
     * @param name
     */
    getEntAttribListIdxVal(ent_type: EEntType, ents_i: number | number[], name: string, idx: number): any;
    /**
     * Get an entity attrib value in a dictionary.
     * \n
     * If the attribute does not exist, throw error
     * \n
     * If the key does not exist, return undefined.
     * \n
     * @param ent_type
     * @param name
     */
    getEntAttribDictKeyVal(ent_type: EEntType, ents_i: number | number[], name: string, key: string): any;
}
