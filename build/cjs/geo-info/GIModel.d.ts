import { TEntTypeIdx, TId } from './common';
import { GIMetaData } from './GIMetaData';
import { GIModelData } from './GIModelData';
import { IThreeJS } from './ThreejsJSON';
/**
 * Geo-info model class.
 */
export declare class GIModel {
    metadata: GIMetaData;
    modeldata: GIModelData;
    debug: boolean;
    /**
     * Constructor
     */
    constructor(meta_data?: GIMetaData);
    /**
     * Get the current time stamp
     */
    getActiveSnapshot(): number;
    /**
     * Set the current time stamp backwards to a prevous time stamp.
     * This allows you to roll back in time after executing a global function.
     */
    setActiveSnapshot(ssid: number): void;
    /**
     *
     * @param id Starts a new snapshot with the given ID.
     * @param include The other snapshots to include in the snapshot.
     */
    nextSnapshot(include?: number[]): number;
    /**
     * Add a set of ents from the specified snapshot to the active snapshot.
     * @param from_ssid Snapshot to copy ents from
     * @param ents The list of ents to add.
     */
    addEntsToActiveSnapshot(from_ssid: number, ents: TEntTypeIdx[]): void;
    /**
     * Gets a set of ents from a snapshot.
     * @param ssid
     */
    getEntsFromSnapshot(ssid: number): TEntTypeIdx[];
    /**
     * Deletes a snapshot.
     * @param ssid
     */
    delSnapshots(ssids: number[]): void;
    /**
     * Updates the time stamp of the entities to the current time stamp.
     * @param ents
     */
    updateEntsTimestamp(ents: TEntTypeIdx[]): void;
    /**
     *
     * @param gf_start_ents
     */
    prepGlobalFunc(gf_start_ids: TId | TId[]): number;
    /**
     *
     * @param ssid
     */
    postGlobalFunc(curr_ss: number): void;
    /**
     * Import a GI model.
     * @param meta
     */
    importGI(model_json_data_str: string): TEntTypeIdx[];
    /**
     * Export a GI model.
     */
    exportGI(ents: TEntTypeIdx[]): string;
    /**
     * Import a SIM model.
     * @param meta
     */
    importSIM(model_json_data_str: string): TEntTypeIdx[];
    /**
     * Export a SIM model.
     */
    exportSIM(ents: TEntTypeIdx[]): string;
    /**
     * Set the meta data object.
     * Data is not copied.
     * @param meta
     */
    setMetaData(meta: GIMetaData): void;
    /**
     * Get the meta data object.
     * Data is not copied
     */
    getMetaData(): GIMetaData;
    /**
     * Check model for internal consistency
     */
    check(): string[];
    /**
     * Compares two models.
     * Checks that every entity in this model also exists in the other model.
     * \n
     * Additional entitis in the other model will not affect the score.
     * Attributes at the model level are ignored.
     * \n
     * For grading, this model is assumed to be the answer model, and the other model is assumed to be
     * the model submitted by the student.
     * \n
     * Both models will be modified in the process of cpmparing.
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
     * Get the threejs data for this model.
     */
    get3jsData(ssid: number): IThreeJS;
}
