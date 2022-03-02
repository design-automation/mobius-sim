import { GIGeom } from './geom/GIGeom';
import { GIAttribs } from './attribs/GIAttribs';
import { IModelJSONData, EEntType, TEntTypeIdx } from './common';
import { IModelSIMData } from './common';
import { GIModelComparator } from './GIModelComparator';
import { GIModel } from './GIModel';
import { GIModelThreejs } from './GIModelThreejs';
import { GIFuncsCommon } from './funcs/GIFuncsCommon';
import { GIFuncsMake } from './funcs/GIFuncsMake';
import { GIFuncsEdit } from './funcs/GIFuncsEdit';
import { GIFuncsModify } from './funcs/GIFuncsModify';
/**
 * Geo-info model class.
 */
export declare class GIModelData {
    active_ssid: number;
    private _max_timestamp;
    model: GIModel;
    geom: GIGeom;
    attribs: GIAttribs;
    comparator: GIModelComparator;
    threejs: GIModelThreejs;
    debug: boolean;
    funcs_common: GIFuncsCommon;
    funcs_make: GIFuncsMake;
    funcs_edit: GIFuncsEdit;
    funcs_modify: GIFuncsModify;
    /**
     * Constructor
     */
    constructor(model: GIModel);
    /**
     * Imports JSOn data into this model.
     * Eexisting data in the model is not affected.
     * @param model_data The JSON data.
     */
    importGI(model_data: IModelJSONData): TEntTypeIdx[];
    /**
     * Exports the JSON data for this model.
     */
    exportGI(ents: TEntTypeIdx[]): IModelJSONData;
    /**
     * Imports a model in the SIM format
     * Existing data in the model is not affected.
     * @param model_data The SIM JSON data.
     */
    importSIM(model_data: IModelSIMData): TEntTypeIdx[];
    /**
     * Exports the model in the SIM format.
     */
    exportSIM(ents: TEntTypeIdx[]): IModelSIMData;
    /**
     * Check model for internal consistency
     */
    check(): string[];
    /**
     * Compares two models.
     * Checks that every entity in this model also exists in the other model.
     * \n
     * This is the answer model.
     * The other model is the submitted model.
     * \n
     * Both models will be modified in the process.
     * \n
     * @param model The model to compare with.
     */
    compare(model: GIModel, normalize: boolean, check_geom_equality: boolean, check_attrib_equality: boolean): {
        percent: number;
        score: number;
        total: number;
        comment: string;
    };
    /**
     * Update time stamp of an object (point, pline, pgon)
     * If the input entity is a topo entity or collection, then objects will be retrieved.
     * @param ent_type
     * @param ent_i
     */
    getObjsUpdateTs(ent_type: EEntType, ent_i: number): void;
    /**
     * Check time stamp of an object (point, pline, pgon) is same as current time stamp
     * If the input entity is a topo entity or collection, then objects will be retrieved.
     * @param ent_type
     * @param ent_i
     */
    getObjsCheckTs(ent_type: EEntType, ent_i: number): void;
    /**
     * Update time stamp of a object, or collection
     * Topo ents will throw an error
     * @param point_i
     */
    updateEntTs(ent_type: EEntType, ent_i: number): void;
    /**
     * Get the timestamp of an entity.
     * @param posi_i
     */
    getEntTs(ent_type: EEntType, ent_i: number): number;
    /**
     * Get the ID (integer) of the next snapshot.
     */
    nextSnapshot(): void;
    /**
     *
     */
    toStr(ssid: number): string;
}
