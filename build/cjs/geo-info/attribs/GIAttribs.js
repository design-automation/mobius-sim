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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9hdHRyaWJzL0dJQXR0cmlicy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpREFBOEM7QUFDOUMscURBQWtEO0FBQ2xELHNDQUFxRjtBQUNyRixxREFBa0Q7QUFFbEQsMkRBQXdEO0FBQ3hELHlEQUFzRDtBQUN0RCx1REFBb0Q7QUFFcEQsaURBQThDO0FBQzlDLHVEQUFvRDtBQUNwRCx1REFBb0Q7QUFDcEQscURBQWtEO0FBQ2xELG1EQUFnRDtBQUNoRCx5REFBc0Q7QUFFdEQ7O0dBRUc7QUFDSCxNQUFhLFNBQVM7SUFtQm5COzs7UUFHSTtJQUNILFlBQVksU0FBc0I7UUFyQmxDLDhEQUE4RDtRQUM5RCxpRUFBaUU7UUFDakUsc0NBQXNDO1FBQy9CLGlCQUFZLEdBQThCLElBQUksR0FBRyxFQUFFLENBQUM7UUFtQnZELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSwrQkFBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSwyQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSwyQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSw2QkFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxLQUFLLEdB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