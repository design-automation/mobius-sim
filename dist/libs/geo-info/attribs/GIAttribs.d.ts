import { GIAttribsAdd } from './GIAttribsAdd';
import { GIAttribsQuery } from './GIAttribsQuery';
import { EEntType, IAttribsMaps } from '../common';
import { GIAttribsMerge } from './GIAttribsMerge';
import { GIModelData } from '../GIModelData';
import { GIAttribsSnapshot } from './GIAttribsSnapshot';
import { GIAttribsThreejs } from './GIAttribsThreejs';
import { GIAttribsImpExp } from './GIAttribsImpExp';
import { GIAttribMapBase } from '../attrib_classes/GIAttribMapBase';
import { GIAttribsDel } from './GIAttribsDel';
import { GIAttribsGetVal } from './GIAttribsGetVal';
import { GIAttribsSetVal } from './GIAttribsSetVal';
import { GIAttribsPosis } from './GIAttribsPosis';
import { GIAttribsPush } from './GIAttribsPush';
import { GIAttribsCompare } from './GIAttribsCompare';
/**
 * Class for attributes.
 */
export declare class GIAttribs {
    private modeldata;
    attribs_maps: Map<number, IAttribsMaps>;
    merge: GIAttribsMerge;
    imp_exp: GIAttribsImpExp;
    add: GIAttribsAdd;
    del: GIAttribsDel;
    get: GIAttribsGetVal;
    set: GIAttribsSetVal;
    push: GIAttribsPush;
    posis: GIAttribsPosis;
    query: GIAttribsQuery;
    snapshot: GIAttribsSnapshot;
    compare: GIAttribsCompare;
    threejs: GIAttribsThreejs;
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata: GIModelData);
    /**
     * Get all the attribute names for an entity type
     * @param ent_type
     */
    getAttribNames(ent_type: EEntType): string[];
    /**
     * Get all the user defined attribute names for an entity type
     * This excludes the built in attribute names, xyz and anything starting with '_'
     * @param ent_type
     */
    getAttribNamesUser(ent_type: EEntType): string[];
    /**
     * Get attrib
     * @param ent_type
     * @param name
     */
    getAttrib(ent_type: EEntType, name: string): GIAttribMapBase;
    /**
     * Rename an existing attribute.
     * Time stamps are not updated.
     *
     * @param ent_type The level at which to create the attribute.
     * @param old_name The name of the old attribute.
     * @param new_name The name of the new attribute.
     * @return True if the attribute was renamed, false otherwise.
     */
    renameAttrib(ent_type: EEntType, old_name: string, new_name: string): boolean;
    /**
     * Generate a string for debugging
     */
    toStr(ssid: number): string;
}
