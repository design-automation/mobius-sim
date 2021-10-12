import { EEntType, EAttribPush } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for attributes.
 */
export declare class GIAttribsPush {
    private modeldata;
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata: GIModelData);
    /**
     * Promotes attrib values up and down the hierarchy.
     */
    pushAttribVals(source_ent_type: EEntType, source_attrib_name: string, source_attrib_idx_key: number | string, source_indices: number[], target: EEntType | string, target_attrib_name: string, target_attrib_idx_key: number | string, method: EAttribPush): void;
    private _aggregateVals;
    /**
     * Utility method to check the data type of an attribute.
     * @param value
     */
    private _checkDataType;
}
