import { IGeomMaps, IEntSets, IGeomJSONData, IRenumMaps } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for ...
 */
export declare class GIGeomImpExp {
    private modeldata;
    private _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps);
    /**
     * Import GI data into this model, and renumber teh entities in the process.
     * @param other_geom_maps The data to import
     */
    importGIRenum(gi_data: IGeomJSONData): IRenumMaps;
    /**
     * Import GI data into this model
     * @param other_geom_maps The geom_arrays of the other model.
     */
    importGI(gi_data: IGeomJSONData, renum_maps: IRenumMaps): void;
    /**
     * Export GI data out of this model.
     */
    exportGIRenum(ent_sets: IEntSets): IRenumMaps;
    /**
     * Export GI data out of this model.
     */
    exportGI(ent_sets: IEntSets, renum_maps: IRenumMaps): IGeomJSONData;
}
