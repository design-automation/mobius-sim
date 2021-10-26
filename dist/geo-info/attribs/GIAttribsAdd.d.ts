import { EEntType, EAttribDataTypeStrs } from '../common';
import { GIModelData } from '../GIModelData';
import { GIAttribMapBase } from '../attrib_classes/GIAttribMapBase';
/**
 * Class for attributes.
 */
export declare class GIAttribsAdd {
    private modeldata;
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata: GIModelData);
    /**
     * Creates a new attribte, at either the model level or the entity level.
     * This function is call by var@att_name and by @att_name
     *
     * For entity attributes, if an attribute with the same name but different data_type already exists,
     * then an error is thrown.
     *
     * @param ent_type The level at which to create the attribute.
     * @param name The name of the attribute.
     * @param data_type The data type of the attribute.
     */
    addAttrib(ent_type: EEntType, name: string, data_type: EAttribDataTypeStrs): GIAttribMapBase;
    /**
     * Creates a new attribte at the model level
     *
     * @param name The name of the attribute.
     */
    addModelAttrib(name: string): void;
    /**
     * Creates a new attribte at an  entity level.
     *
     * For entity attributes, if an attribute with the same name but different data_type already exists,
     * then an error is thrown.
     *
     * @param ent_type The level at which to create the attribute.
     * @param name The name of the attribute.
     * @param data_type The data type of the attribute.
     */
    addEntAttrib(ent_type: EEntType, name: string, data_type: EAttribDataTypeStrs): GIAttribMapBase;
}
