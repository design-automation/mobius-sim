import { TAttribDataTypes, EEntType, ESort, EAttribDataTypeStrs, EFilterOperatorTypes } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for attributes.
 */
export declare class GIAttribsQuery {
    private modeldata;
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata: GIModelData);
    /**
     * Checks if an attribute with this name exists.
     * @param name
     */
    hasModelAttrib(name: string): boolean;
    /**
     * Check if attribute exists
     * @param ent_type
     * @param name
     */
    hasEntAttrib(ent_type: EEntType, name: string): boolean;
    /**
     * Get attrib data type. Also works for MOD attribs.
     *
     * @param ent_type
     * @param name
     */
    getAttribDataType(ent_type: EEntType, name: string): EAttribDataTypeStrs;
    /**
     * Get attrib data length. Also works for MOD attribs.
     *
     * @param ent_type
     * @param name
     */
    getAttribDataLength(ent_type: EEntType, name: string): number;
    /**
     * Query the model using a query strings.
     * Returns a list of entities in the model.
     * @param ent_type The type of the entities being quieried.
     * @param ents_i Entites in the model, assumed to be of type ent_type.
     * @param name
     * @param idx_or_key
     * @param value
     */
    filterByAttribs(ent_type: EEntType, ents_i: number[], name: string, idx_or_key: number | string, op_type: EFilterOperatorTypes, value: TAttribDataTypes): number[];
    /**
     * Sort entities in the model based on attribute values.
     * @param ent_type The type of the entities being sorted.
     * @param ents_i Entites in the model, assumed to be of type ent_type.
     * @param name
     * @param idx_or_key
     * @param value
     */
    sortByAttribs(ent_type: EEntType, ents_i: number[], name: string, idx_or_key: number | string, method: ESort): number[];
}
