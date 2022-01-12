"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIModel = void 0;
const GIMetaData_1 = require("./GIMetaData");
const GIModelData_1 = require("./GIModelData");
const common_id_funcs_1 = require("./common_id_funcs");
/**
 * Geo-info model class.
 */
class GIModel {
    // public outputSnapshot: number;
    /**
     * Constructor
     */
    constructor(meta_data) {
        this.debug = true;
        if (meta_data === undefined) {
            this.metadata = new GIMetaData_1.GIMetaData();
        }
        else {
            this.metadata = meta_data;
        }
        this.modeldata = new GIModelData_1.GIModelData(this);
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
        const gf_start_ents = (0, common_id_funcs_1.idsBreak)(gf_start_ids);
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
exports.GIModel = GIModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lNb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vR0lNb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw2Q0FBMEM7QUFDMUMsK0NBQTRDO0FBQzVDLHVEQUE2QztBQUc3Qzs7R0FFRztBQUNILE1BQWEsT0FBTztJQUtoQixpQ0FBaUM7SUFFakM7O09BRUc7SUFDSCxZQUFZLFNBQXNCO1FBTjNCLFVBQUssR0FBRyxJQUFJLENBQUM7UUFPaEIsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7U0FDcEM7YUFBTTtZQUNILElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1NBQzdCO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLHlCQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFDRDs7T0FFRztJQUNJLGlCQUFpQjtRQUNwQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO0lBQ3RDLENBQUM7SUFDRDs7O09BR0c7SUFDSSxpQkFBaUIsQ0FBQyxJQUFZO1FBQ2pDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUN0QyxDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLFlBQVksQ0FBQyxPQUFrQjtRQUNsQyx1QkFBdUI7UUFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM5QixpQkFBaUI7UUFDakIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDeEMsZUFBZTtRQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNELHNCQUFzQjtRQUN0QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLHVCQUF1QixDQUFDLFNBQWlCLEVBQUUsSUFBbUI7UUFDakUsV0FBVztRQUNYLE1BQU0sU0FBUyxHQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pGLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLEVBQzNELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN4RCxhQUFhO1FBQ2IsMkZBQTJGO1FBQzNGLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsU0FBUyxFQUM5RCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUNEOzs7T0FHRztJQUNJLG1CQUFtQixDQUFDLElBQVk7UUFDbkMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDRDs7O09BR0c7SUFDSSxZQUFZLENBQUMsS0FBZTtRQUMvQixLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtZQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckQ7SUFDTCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksbUJBQW1CLENBQUMsSUFBbUI7UUFDMUMsS0FBSyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRTtZQUNsQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDL0M7SUFDTCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksY0FBYyxDQUFDLFlBQXVCO1FBQ3pDLFlBQVksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDM0UsYUFBYTtRQUNiLFlBQVksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkMsTUFBTSxhQUFhLEdBQWtCLElBQUEsMEJBQVEsRUFBQyxZQUFZLENBQWtCLENBQUM7UUFDN0UsTUFBTSxPQUFPLEdBQVcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDakQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXBCLDZFQUE2RTtRQUM3RSxJQUFJLENBQUMsdUJBQXVCLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3JELDhGQUE4RjtRQUU5RixPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksY0FBYyxDQUFDLE9BQWU7UUFDakMsTUFBTSxTQUFTLEdBQVcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDbkQsTUFBTSxXQUFXLEdBQWtCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2RSxNQUFNLFNBQVMsR0FBYSxFQUFFLENBQUM7UUFDL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JCO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWhDLGtFQUFrRTtRQUNsRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3JELHNGQUFzRjtRQUV0RixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxNQUFNO0lBQ04sc0NBQXNDO0lBQ3RDLDBEQUEwRDtJQUMxRCxxRUFBcUU7SUFDckUsNkNBQTZDO0lBQzdDLGlCQUFpQjtJQUNqQixNQUFNO0lBQ04sNERBQTREO0lBQzVELGdEQUFnRDtJQUNoRCwwREFBMEQ7SUFDMUQsNkJBQTZCO0lBQzdCLDhDQUE4QztJQUM5Qyw0QkFBNEI7SUFDNUIsMkRBQTJEO0lBQzNELElBQUk7SUFDSixNQUFNO0lBQ04scUNBQXFDO0lBQ3JDLDBEQUEwRDtJQUMxRCxNQUFNO0lBQ04sNENBQTRDO0lBQzVDLGdEQUFnRDtJQUNoRCx3RUFBd0U7SUFDeEUsOEVBQThFO0lBRTlFLGlDQUFpQztJQUNqQyxnQ0FBZ0M7SUFDaEMsaUNBQWlDO0lBQ2pDLFNBQVM7SUFDVCxtQ0FBbUM7SUFDbkMsSUFBSTtJQUNKLE1BQU07SUFDTiw2RUFBNkU7SUFDN0UsZ0RBQWdEO0lBQ2hELDJDQUEyQztJQUMzQyxNQUFNO0lBQ04sOEVBQThFO0lBQzlFLGdEQUFnRDtJQUNoRCxzREFBc0Q7SUFDdEQsSUFBSTtJQUNKLE1BQU07SUFDTiw4REFBOEQ7SUFDOUQsTUFBTTtJQUNOLHNEQUFzRDtJQUN0RCxnREFBZ0Q7SUFDaEQsNENBQTRDO0lBQzVDLElBQUk7SUFDSjs7O09BR0c7SUFDSSxRQUFRLENBQUMsbUJBQTJCO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUNEOztPQUVHO0lBQ0ksUUFBUSxDQUFDLElBQW1CO1FBQy9CLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksV0FBVyxDQUFDLElBQWdCO1FBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFDRDs7O09BR0c7SUFDSSxXQUFXO1FBQ2QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFDRCxNQUFNO0lBQ04seUNBQXlDO0lBQ3pDLHVDQUF1QztJQUN2QyxpQ0FBaUM7SUFDakMsTUFBTTtJQUNOLDRCQUE0QjtJQUM1Qiw2Q0FBNkM7SUFDN0MsK0JBQStCO0lBQy9CLDRDQUE0QztJQUM1QyxzQ0FBc0M7SUFDdEMsb0RBQW9EO0lBQ3BELGdEQUFnRDtJQUNoRCxvQkFBb0I7SUFDcEIsSUFBSTtJQUNKLE1BQU07SUFDTixxRUFBcUU7SUFDckUsMERBQTBEO0lBQzFELDJEQUEyRDtJQUMzRCxpQ0FBaUM7SUFDakMscUNBQXFDO0lBQ3JDLE1BQU07SUFDTix1Q0FBdUM7SUFDdkMsNkNBQTZDO0lBQzdDLCtCQUErQjtJQUMvQixtREFBbUQ7SUFDbkQsSUFBSTtJQUNKLE1BQU07SUFDTixxRUFBcUU7SUFDckUsMERBQTBEO0lBQzFELDJEQUEyRDtJQUMzRCxtREFBbUQ7SUFDbkQscURBQXFEO0lBQ3JELHFDQUFxQztJQUNyQyxNQUFNO0lBQ04scUVBQXFFO0lBQ3JFLGdEQUFnRDtJQUNoRCwyREFBMkQ7SUFDM0QsSUFBSTtJQUNKLE1BQU07SUFDTixzQ0FBc0M7SUFDdEMsTUFBTTtJQUNOLHlCQUF5QjtJQUN6Qiw2Q0FBNkM7SUFDN0MsbURBQW1EO0lBQ25ELElBQUk7SUFDSjs7T0FFRztJQUNJLEtBQUs7UUFDUixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUNEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSSxPQUFPLENBQUMsS0FBYyxFQUFFLFNBQWtCLEVBQUUsbUJBQTRCLEVBQUUscUJBQThCO1FBRTNHLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxtQkFBbUIsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0lBQ2hHLENBQUM7SUFDRDs7T0FFRztJQUNJLFVBQVUsQ0FBQyxJQUFZO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25ELENBQUM7Q0FDSjtBQXJSRCwwQkFxUkMifQ==