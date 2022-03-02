"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIAttribs = void 0;
const GIAttribsAdd_1 = require("./GIAttribsAdd");
const GIAttribsQuery_1 = require("./GIAttribsQuery");
const common_1 = require("../common");
const GIAttribsMerge_1 = require("./GIAttribsMerge");
const GIAttribsSnapshot_1 = require("./GIAttribsSnapshot");
const GIAttribsThreejs_1 = require("./GIAttribsThreejs");
const GIAttribsImpExp_1 = require("./GIAttribsImpExp");
const SIMAttribsImpExp_1 = require("./SIMAttribsImpExp");
const GIAttribsDel_1 = require("./GIAttribsDel");
const GIAttribsGetVal_1 = require("./GIAttribsGetVal");
const GIAttribsSetVal_1 = require("./GIAttribsSetVal");
const GIAttribsPosis_1 = require("./GIAttribsPosis");
const GIAttribsPush_1 = require("./GIAttribsPush");
const GIAttribsCompare_1 = require("./GIAttribsCompare");
/**
 * Class for attributes.
 */
class GIAttribs {
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata) {
        // maps, the key is the ssid, the value is the attrib map data
        // so to get the specific attibutes for e.g. "xyz" for positions:
        // attrib_maps.get(ssid).ps.get("xyz")
        this.attribs_maps = new Map();
        this.modeldata = modeldata;
        this.merge = new GIAttribsMerge_1.GIAttribsMerge(modeldata);
        this.imp_exp = new GIAttribsImpExp_1.GIAttribsImpExp(modeldata);
        this.sim_imp_exp = new SIMAttribsImpExp_1.SIMAttribsImpExp(modeldata);
        this.add = new GIAttribsAdd_1.GIAttribsAdd(modeldata);
        this.del = new GIAttribsDel_1.GIAttribsDel(modeldata);
        this.get = new GIAttribsGetVal_1.GIAttribsGetVal(modeldata);
        this.set = new GIAttribsSetVal_1.GIAttribsSetVal(modeldata);
        this.push = new GIAttribsPush_1.GIAttribsPush(modeldata);
        this.posis = new GIAttribsPosis_1.GIAttribsPosis(modeldata);
        this.query = new GIAttribsQuery_1.GIAttribsQuery(modeldata);
        this.snapshot = new GIAttribsSnapshot_1.GIAttribsSnapshot(modeldata);
        this.compare = new GIAttribsCompare_1.GIAttribsCompare(modeldata);
        this.threejs = new GIAttribsThreejs_1.GIAttribsThreejs(modeldata);
    }
    /**
     * Get all the attribute names for an entity type
     * @param ent_type
     */
    getAttribNames(ent_type) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
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
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs_map = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        let attribs = Array.from(attribs_map.keys());
        if (ent_type === common_1.EEntType.POSI) {
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
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
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
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
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
exports.GIAttribs = GIAttribs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9hdHRyaWJzL0dJQXR0cmlicy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpREFBOEM7QUFDOUMscURBQWtEO0FBQ2xELHNDQUFxRjtBQUNyRixxREFBa0Q7QUFFbEQsMkRBQXdEO0FBQ3hELHlEQUFzRDtBQUN0RCx1REFBb0Q7QUFDcEQseURBQXNEO0FBRXRELGlEQUE4QztBQUM5Qyx1REFBb0Q7QUFDcEQsdURBQW9EO0FBQ3BELHFEQUFrRDtBQUNsRCxtREFBZ0Q7QUFDaEQseURBQXNEO0FBRXREOztHQUVHO0FBQ0gsTUFBYSxTQUFTO0lBb0JuQjs7O1FBR0k7SUFDSCxZQUFZLFNBQXNCO1FBdEJsQyw4REFBOEQ7UUFDOUQsaUVBQWlFO1FBQ2pFLHNDQUFzQztRQUMvQixpQkFBWSxHQUE4QixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBb0J2RCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksK0JBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksaUNBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksbUNBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLDJCQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLDJCQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLGlDQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLGlDQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUMsSUFB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U0FDdEU7UUFDRCxJQUFJLGNBQWMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckIsY0FBYyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFFLENBQUM7U0FDdEU7UUFDRCxJQUFJLGNBQWMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckIsY0FBYyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFFLENBQUM7U0FDdEU7UUFDRCxJQUFJLGNBQWMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEIsY0FBYyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFFLENBQUM7U0FDdEU7UUFDRCxJQUFJLGNBQWMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEIsY0FBYyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFFLENBQUM7U0FDdEU7UUFDRCxJQUFJLGNBQWMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckIsY0FBYyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFFLENBQUM7U0FDdEU7UUFDRCxJQUFJLGNBQWMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckIsY0FBYyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFFLENBQUM7U0FDdEU7UUFDRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FBQztDQUNKO0FBeklELDhCQXlJQyJ9