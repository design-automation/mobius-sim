import { GIModelData } from '../GIModelData';
/**
 * Class for mering attributes.
 */
export declare class GIAttribsMerge {
    private modeldata;
    /**
      * Creates an object...
      * @param modeldata The JSON data
      */
    constructor(modeldata: GIModelData);
    /**
     * Adds data to this model from another model.
     * The existing data in the model is not deleted - checks for conflicts.
     * @param model_data Attribute data from the other model.
     */
    merge(ssid: number, exist_ssid: number): void;
    /**
     * Adds data to this model from another model.
     * The existing data in the model is not deleted - checks for conflicts.
     * @param model_data Attribute data from the other model.
     */
    add(ssid: number, exist_ssid: number): void;
    /**
     * From another model
     * The existing attributes are not deleted
     * Deep copy of attrib values
     * @param attribs_maps
     */
    private _mergeModelAttribs;
    /**
     * Merge attributes from another attribute map into this attribute map.
     * Conflict detection is performed.
     */
    private _mergeEntAttribs;
    /**
     * Add attributes from another attribute map into this attribute map.
     * No conflict detection is performed.
     * This attribute map is assumed to be empty.
     * @param ssid
     * @param other_ssid
     * @param ent_type
     */
    private _addEntAttribs;
}
