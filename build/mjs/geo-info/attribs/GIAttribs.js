import { GIAttribsAdd } from './GIAttribsAdd';
import { GIAttribsQuery } from './GIAttribsQuery';
import { EEntType, EEntTypeStr } from '../common';
import { GIAttribsMerge } from './GIAttribsMerge';
import { GIAttribsSnapshot } from './GIAttribsSnapshot';
import { GIAttribsThreejs } from './GIAttribsThreejs';
import { GIAttribsImpExp } from './GIAttribsImpExp';
import { GIAttribsDel } from './GIAttribsDel';
import { GIAttribsGetVal } from './GIAttribsGetVal';
import { GIAttribsSetVal } from './GIAttribsSetVal';
import { GIAttribsPosis } from './GIAttribsPosis';
import { GIAttribsPush } from './GIAttribsPush';
import { GIAttribsCompare } from './GIAttribsCompare';
/**
 * Class for attributes.
 */
export class GIAttribs {
    modeldata;
    // maps, the key is the ssid, the value is the attrib map data
    // so to get the specific attibutes for e.g. "xyz" for positions:
    // attrib_maps.get(ssid).ps.get("xyz")
    attribs_maps = new Map();
    // sub classes with methods
    merge;
    imp_exp;
    add;
    del;
    get;
    set;
    push;
    posis;
    query;
    snapshot;
    compare;
    threejs;
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata) {
        this.modeldata = modeldata;
        this.merge = new GIAttribsMerge(modeldata);
        this.imp_exp = new GIAttribsImpExp(modeldata);
        this.add = new GIAttribsAdd(modeldata);
        this.del = new GIAttribsDel(modeldata);
        this.get = new GIAttribsGetVal(modeldata);
        this.set = new GIAttribsSetVal(modeldata);
        this.push = new GIAttribsPush(modeldata);
        this.posis = new GIAttribsPosis(modeldata);
        this.query = new GIAttribsQuery(modeldata);
        this.snapshot = new GIAttribsSnapshot(modeldata);
        this.compare = new GIAttribsCompare(modeldata);
        this.threejs = new GIAttribsThreejs(modeldata);
    }
    /**
     * Get all the attribute names for an entity type
     * @param ent_type
     */
    getAttribNames(ent_type) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = EEntTypeStr[ent_type];
        const attribs_map = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        return Array.from(attribs_map.keys());
    }
    /**
     * Get all the user defined attribute names for an entity type
     * This excludes the built in attribute names, xyz and anything starting with '_'
     * @param ent_type
     */
    getAttribNamesUser(ent_type) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = EEntTypeStr[ent_type];
        const attribs_map = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        let attribs = Array.from(attribs_map.keys());
        if (ent_type === EEntType.POSI) {
            attribs = attribs.filter(attrib => attrib !== 'xyz');
        }
        attribs = attribs.filter(attrib => attrib[0] !== '_');
        return attribs;
    }
    /**
     * Get attrib
     * @param ent_type
     * @param name
     */
    getAttrib(ent_type, name) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        return attribs.get(name);
    }
    /**
     * Rename an existing attribute.
     * Time stamps are not updated.
     *
     * @param ent_type The level at which to create the attribute.
     * @param old_name The name of the old attribute.
     * @param new_name The name of the new attribute.
     * @return True if the attribute was renamed, false otherwise.
     */
    renameAttrib(ent_type, old_name, new_name) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        if (!attribs.has(old_name)) {
            return false;
        }
        if (attribs.has(new_name)) {
            return false;
        }
        if (old_name === new_name) {
            return false;
        }
        // rename
        const attrib = attribs.get(old_name);
        attrib.setName(new_name);
        const result = attribs.set(new_name, attrib);
        return attribs.delete(old_name);
    }
    /**
     * Generate a string for debugging
     */
    toStr(ssid) {
        const ss_attrib_maps = this.attribs_maps.get(ssid);
        const result = [];
        result.push('posis');
        ss_attrib_maps.ps.forEach(attrib => result.push(attrib.toStr()));
        if (ss_attrib_maps._v.size) {
            result.push('verts');
            ss_attrib_maps._v.forEach(attrib => result.push(attrib.toStr()));
        }
        if (ss_attrib_maps._e.size) {
            result.push('edges');
            ss_attrib_maps._e.forEach(attrib => result.push(attrib.toStr()));
        }
        if (ss_attrib_maps._w.size) {
            result.push('wires');
            ss_attrib_maps._w.forEach(attrib => result.push(attrib.toStr()));
        }
        if (ss_attrib_maps.pt.size) {
            result.push('points');
            ss_attrib_maps.pt.forEach(attrib => result.push(attrib.toStr()));
        }
        if (ss_attrib_maps.pl.size) {
            result.push('plines');
            ss_attrib_maps.pl.forEach(attrib => result.push(attrib.toStr()));
        }
        if (ss_attrib_maps.pg.size) {
            result.push('pgons');
            ss_attrib_maps.pg.forEach(attrib => result.push(attrib.toStr()));
        }
        if (ss_attrib_maps.co.size) {
            result.push('colls');
            ss_attrib_maps.co.forEach(attrib => result.push(attrib.toStr()));
        }
        return result.join('\n');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9hdHRyaWJzL0dJQXR0cmlicy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxRQUFRLEVBQXFDLFdBQVcsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNyRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFbEQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDdEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRXBELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDaEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFdEQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8sU0FBUztJQUNWLFNBQVMsQ0FBYztJQUMvQiw4REFBOEQ7SUFDOUQsaUVBQWlFO0lBQ2pFLHNDQUFzQztJQUMvQixZQUFZLEdBQThCLElBQUksR0FBRyxFQUFFLENBQUM7SUFDM0QsMkJBQTJCO0lBQ3BCLEtBQUssQ0FBaUI7SUFDdEIsT0FBTyxDQUFrQjtJQUN6QixHQUFHLENBQWU7SUFDbEIs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QUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUUsQ0FBQztTQUN0RTtRQUNELElBQUksY0FBYyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUU7WUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixjQUFjLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUUsQ0FBQztTQUN0RTtRQUNELElBQUksY0FBYyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUU7WUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixjQUFjLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUUsQ0FBQztTQUN0RTtRQUNELElBQUksY0FBYyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUU7WUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyQixjQUFjLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUUsQ0FBQztTQUN0RTtRQUNELElBQUksY0FBYyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUU7WUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyQixjQUFjLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUUsQ0FBQztTQUN0RTtRQUNELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0NBQ0oifQ==