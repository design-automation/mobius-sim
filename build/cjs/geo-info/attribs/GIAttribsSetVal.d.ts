import { TAttribDataTypes, EEntType } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for attributes.
 */
export declare class GIAttribsSetVal {
    private modeldata;
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata: GIModelData);
    /**
     * Set a model attrib value
     * @param id
     * @param name
     * @param value
     */
    setModelAttribVal(name: string, value: TAttribDataTypes): void;
    /**
     * Set a model attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setModelAttribListIdxVal(name: string, idx: number, value: any): void;
    /**
     * Set a model attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setModelAttribDictKeyVal(name: string, key: string, value: any): void;
    /**
     * Set an entity attrib value
     * If the attribute does not exist, then it is created.
     * @param id
     * @param name
     * @param value
     */
    setCreateEntsAttribVal(ent_type: EEntType, ents_i: number | number[], name: string, value: TAttribDataTypes): void;
    /**
     * Set an entity attrib value, for just one ent
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setEntAttribVal(ent_type: EEntType, ent_i: number, name: string, value: TAttribDataTypes): void;
    /**
     * Set an entity attrib value, for just one ent
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setEntsAttribVal(ent_type: EEntType, ents_i: number | number[], name: string, value: TAttribDataTypes): void;
    /**
     * Set an entity attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setEntsAttribListIdxVal(ent_type: EEntType, ents_i: number | number[], name: string, idx: number, value: any): void;
    /**
     * Set an entity attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setEntsAttribDictKeyVal(ent_type: EEntType, ents_i: number | number[], name: string, key: string, value: any): void;
    /**
     * Copy all attribs from one entity to another entity
     * @param ent_type
     * @param name
     */
    copyAttribs(ent_type: EEntType, from_ent_i: number, to_ent_i: number): void;
    /**
     * Utility method to check the data type of an attribute.
     * @param value
     */
    private _checkDataType;
}
