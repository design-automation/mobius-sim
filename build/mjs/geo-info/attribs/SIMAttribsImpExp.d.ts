import { IAttribsSIMData, IEntSets, ISIMRenumMaps } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for attributes. merge dump append
 */
export declare class SIMAttribsImpExp {
    private modeldata;
    /**
      * Creates the object.
      * @param modeldata The JSON data
      */
    constructor(modeldata: GIModelData);
    /**
     * Imports JSON data from another model.
     * @param model_data Attribute data from the other model.
     */
    importSIM(attribs_data: IAttribsSIMData, renum_maps: ISIMRenumMaps): void;
    /**
     * Returns the JSON data for this model.
     */
    exportSIM(ent_sets: IEntSets, renum_maps: ISIMRenumMaps): IAttribsSIMData;
    /**
     * Renumber the ent indexes in the data, and import the data into this model.
     *
     * @param attrib_data
     * @param ent_type
     * @param renum_map
     */
    private _importEntAttribData;
    /**
     * Renumber the ent indexes in the data.
     *
     * @param attrib_data
     * @param renum_map
     */
    private _remapEntAttribData;
}
