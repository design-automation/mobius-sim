import { IGeomMaps, IEntSets, IGeomSIMData, ISIMRenumMaps, IGeomData } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for ...
 */
export declare class SIMGeomImpExp {
    private modeldata;
    private _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps);
    /**
     * Reconstruct the topology data, adding vertsm edges, wires.
     * @param geom_data The data from the SIM file
     */
    importReconstructTopo(geom_data: IGeomSIMData): IGeomData;
    /**
     * Import GI data into this model, and renumber teh entities in the process.
     * @param other_geom_maps The data to import
     */
    importSIMRenum(geom_data: IGeomData): ISIMRenumMaps;
    /**
     * Import GI data into this model
     * @param other_geom_maps The geom_arrays of the other model.
     */
    importSIM(geom_data: IGeomData, renum_maps: ISIMRenumMaps): void;
    /**
     * Export GI data out of this model.
     */
    exportSIMRenum(ent_sets: IEntSets): ISIMRenumMaps;
    /**
     * Export SIM data out of this model.
     */
    exportSIM(ent_sets: IEntSets, renum_maps: ISIMRenumMaps): IGeomSIMData;
}
