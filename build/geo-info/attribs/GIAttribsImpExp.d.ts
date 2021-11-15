import { IAttribsJSONData, IEntSets, IRenumMaps } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for attributes. merge dump append
 */
export declare class GIAttribsImpExp {
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
    importGI(gi_attribs_data: IAttribsJSONData, renum_maps: IRenumMaps): void;
    /**
     * Returns the JSON data for this model.
     */
    exportGI(ent_sets: IEntSets, renum_maps: IRenumMaps): IAttribsJSONData;
    /**
     * Renumber the ent indexes in the data, and import the data into this model.
     *
     * @param gi_attrib_data
     * @param ent_type
     * @param renum_map
     */
    private _importEntAttribData;
    /**
     * Renumber the ent indexes in the data.
     *
     * @param gi_attrib_data
     * @param renum_map
     */
    private _remapEntAttribData;
}
