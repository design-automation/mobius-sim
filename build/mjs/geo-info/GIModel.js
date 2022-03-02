import { GIMetaData } from './GIMetaData';
import { GIModelData } from './GIModelData';
import { idsBreak } from './common_id_funcs';
/**
 * Geo-info model class.
 */
export class GIModel {
    // [x: string]: any; // TODO: What is this???
    metadata;
    modeldata;
    debug = true;
    // public outputSnapshot: number;
    /**
     * Constructor
     */
    constructor(meta_data) {
        if (meta_data === undefined) {
            this.metadata = new GIMetaData();
        }
        else {
            this.metadata = meta_data;
        }
        this.modeldata = new GIModelData(this);
        this.nextSnapshot();
    }
    /**
     * Get the current time stamp
     */
    getActiveSnapshot() {
        return this.modeldata.active_ssid;
    }
    /**
     * Set the current time stamp backwards to a prevous time stamp.
     * This allows you to roll back in time after executing a global function.
     */
    setActiveSnapshot(ssid) {
        this.modeldata.active_ssid = ssid;
    }
    /**
     *
     * @param id Starts a new snapshot with the given ID.
     * @param include The other snapshots to include in the snapshot.
     */
    nextSnapshot(include) {
        // increment time stamp
        this.modeldata.nextSnapshot();
        // get time stamp
        const ssid = this.modeldata.active_ssid;
        // add snapshot
        this.modeldata.geom.snapshot.addSnapshot(ssid, include);
        this.modeldata.attribs.snapshot.addSnapshot(ssid, include);
        // return the new ssid
        return ssid;
    }
    /**
     * Add a set of ents from the specified snapshot to the active snapshot.
     * @param from_ssid Snapshot to copy ents from
     * @param ents The list of ents to add.
     */
    addEntsToActiveSnapshot(from_ssid, ents) {
        // geometry
        const ents_sets = this.modeldata.geom.snapshot.getSubEntsSets(from_ssid, ents);
        this.modeldata.geom.snapshot.copyEntsToActiveSnapshot(from_ssid, this.modeldata.geom.snapshot.getSubEnts(ents_sets));
        // attributes
        // TODO needs to be optimized, we should iterate over the sets directly - it will be faster
        this.modeldata.geom.snapshot.addTopoToSubEntsSets(ents_sets);
        this.modeldata.attribs.snapshot.copyEntsToActiveSnapshot(from_ssid, this.modeldata.geom.snapshot.getSubEnts(ents_sets));
    }
    /**
     * Gets a set of ents from a snapshot.
     * @param ssid
     */
    getEntsFromSnapshot(ssid) {
        return this.modeldata.geom.snapshot.getAllEnts(ssid);
    }
    /**
     * Deletes a snapshot.
     * @param ssid
     */
    delSnapshots(ssids) {
        for (const ssid of ssids) {
            this.modeldata.geom.snapshot.delSnapshot(ssid);
            this.modeldata.attribs.snapshot.delSnapshot(ssid);
        }
    }
    /**
     * Updates the time stamp of the entities to the current time stamp.
     * @param ents
     */
    updateEntsTimestamp(ents) {
        for (const [ent_type, ent_i] of ents) {
            this.modeldata.updateEntTs(ent_type, ent_i);
        }
    }
    /**
     *
     * @param gf_start_ents
     */
    prepGlobalFunc(gf_start_ids) {
        gf_start_ids = Array.isArray(gf_start_ids) ? gf_start_ids : [gf_start_ids];
        // @ts-ignore
        gf_start_ids = gf_start_ids.flat();
        const gf_start_ents = idsBreak(gf_start_ids);
        const curr_ss = this.getActiveSnapshot();
        this.nextSnapshot();
        // console.log('>>> ents to be added to gf_start_ss:\n', gf_start_ents_tree);
        this.addEntsToActiveSnapshot(curr_ss, gf_start_ents);
        // console.log('>>> gf_start_ss ents after adding:\n', this.getEntsFromSnapshot(gf_start_ss));
        return curr_ss;
    }
    /**
     *
     * @param ssid
     */
    postGlobalFunc(curr_ss) {
        const gf_end_ss = this.getActiveSnapshot();
        const gf_end_ents = this.getEntsFromSnapshot(gf_end_ss);
        const gf_all_ss = [];
        for (let i = gf_end_ss; i > curr_ss; i--) {
            gf_all_ss.push(i);
        }
        this.setActiveSnapshot(curr_ss);
        // console.log('>>> ents to be added to curr_ss:\n', gf_end_ents);
        this.addEntsToActiveSnapshot(gf_end_ss, gf_end_ents);
        // console.log('>>> curr_ss ents after adding:\n', this.getEntsFromSnapshot(curr_ss));
        this.delSnapshots(gf_all_ss);
    }
    // /**
    //  * Set all data from a JSON string.
    //  * This includes both the meta data and the model data.
    //  * Any existing metadata will be kept, the new data gets appended.
    //  * Any existing model data wil be deleted.
    //  * @param meta
    //  */
    // public setJSONStr(ssid: number, json_str: string): void {
    //     // const ssid = this.modeldata.timestamp;
    //     const json_data: IModelJSON = JSON.parse(json_str);
    //     // merge the meta data
    //     this.metadata.mergeJSONData(json_data);
    //     // set the model data
    //     this.modeldata.importGI(ssid, json_data.model_data);
    // }
    // /**
    //  * Gets all data as a JSON string.
    //  * This includes both the meta data and the model data.
    //  */
    // public getJSONStr(ssid: number): string {
    //     // const ssid = this.modeldata.timestamp;
    //     const model_data: IModelJSONData = this.modeldata.exportGI(ssid);
    //     const meta_data: IMetaJSONData = this.metadata.getJSONData(model_data);
    //     const data: IModelJSON = {
    //         meta_data: meta_data,
    //         model_data: model_data
    //     };
    //     return JSON.stringify(data);
    // }
    // /**
    //  * Sets the data in this model from a JSON data object using shallow copy.
    //  * Any existing data in the model is deleted.
    //  * @param model_json_data The JSON data.
    //  */
    // public setModelData (ssid: number, model_json_data: IModelJSONData): void {
    //     // const ssid = this.modeldata.timestamp;
    //     this.modeldata.importGI(ssid, model_json_data);
    // }
    // /**
    //  * Returns the JSON data for this model using shallow copy.
    //  */
    // public getModelData(ssid: number): IModelJSONData {
    //     // const ssid = this.modeldata.timestamp;
    //     return this.modeldata.exportGI(ssid);
    // }
    /**
     * Import a GI model.
     * @param meta
     */
    importGI(model_json_data_str) {
        return this.modeldata.importGI(JSON.parse(model_json_data_str));
    }
    /**
     * Export a GI model.
     */
    exportGI(ents) {
        return JSON.stringify(this.modeldata.exportGI(ents));
    }
    /**
     * Import a SIM model.
     * @param meta
     */
    importSIM(model_json_data_str) {
        return this.modeldata.importSIM(JSON.parse(model_json_data_str));
    }
    /**
     * Export a SIM model.
     */
    exportSIM(ents) {
        return JSON.stringify(this.modeldata.exportSIM(ents));
    }
    /**
     * Set the meta data object.
     * Data is not copied.
     * @param meta
     */
    setMetaData(meta) {
        this.metadata = meta;
    }
    /**
     * Get the meta data object.
     * Data is not copied
     */
    getMetaData() {
        return this.metadata;
    }
    // /**
    //  * Returns a deep clone of this model.
    //  * Any deleted entities will remain.
    //  * Entity IDs will not change.
    //  */
    // public clone(): GIModel {
    //     const ssid = this.modeldata.timestamp;
    //     // console.log("CLONE");
    //     const clone: GIModel = new GIModel();
    //     clone.metadata = this.metadata;
    //     clone.modeldata = this.modeldata.clone(ssid);
    //     // clone.modeldata.merge(this.modeldata);
    //     return clone;
    // }
    // /**
    //  * Deep copies the model data from a second model into this model.
    //  * Meta data is assumed to be the same for both models.
    //  * The existing model data in this model is not deleted.
    //  * Entity IDs will not change.
    //  * @param model_data The GI model.
    //  */
    // public merge(model: GIModel): void {
    //     const ssid = this.modeldata.timestamp;
    //     // console.log("MERGE");
    //     this.modeldata.merge(ssid, model.modeldata);
    // }
    // /**
    //  * Deep copies the model data from a second model into this model.
    //  * Meta data is assumed to be the same for both models.
    //  * The existing model data in this model is not deleted.
    //  * The Entity IDs in this model will not change.
    //  * The Entity IDs in the second model will change.
    //  * @param model_data The GI model.
    //  */
    // public append(ssid: number, ssid2: number, model: GIModel): void {
    //     // const ssid = this.modeldata.timestamp;
    //     this.modeldata.append(ssid, ssid2, model.modeldata);
    // }
    // /**
    //  * Renumber entities in this model.
    //  */
    // public purge(): void {
    //     const ssid = this.modeldata.timestamp;
    //     this.modeldata = this.modeldata.purge(ssid);
    // }
    /**
     * Check model for internal consistency
     */
    check() {
        return this.modeldata.check();
    }
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
    compare(model, normalize, check_geom_equality, check_attrib_equality) {
        return this.modeldata.compare(model, normalize, check_geom_equality, check_attrib_equality);
    }
    /**
     * Get the threejs data for this model.
     */
    get3jsData(ssid) {
        return this.modeldata.threejs.get3jsData(ssid);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lNb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vR0lNb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRzdDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLE9BQU87SUFDaEIsNkNBQTZDO0lBQ3RDLFFBQVEsQ0FBYTtJQUNyQixTQUFTLENBQWM7SUFDdkIsS0FBSyxHQUFHLElBQUksQ0FBQztJQUNwQixpQ0FBaUM7SUFFakM7O09BRUc7SUFDSCxZQUFZLFNBQXNCO1FBQzlCLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7U0FDcEM7YUFBTTtZQUNILElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1NBQzdCO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUNEOztPQUVHO0lBQ0ksaUJBQWlCO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7SUFDdEMsQ0FBQztJQUNEOzs7T0FHRztJQUNJLGlCQUFpQixDQUFDLElBQVk7UUFDakMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ3RDLENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksWUFBWSxDQUFDLE9BQWtCO1FBQ2xDLHVCQUF1QjtRQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzlCLGlCQUFpQjtRQUNqQixNQUFNLElBQUksR0FB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