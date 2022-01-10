"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIAttribsSetVal = void 0;
const common_1 = require("../common");
const lodash_1 = __importDefault(require("lodash"));
/**
 * Class for attributes.
 */
class GIAttribsSetVal {
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata) {
        this.modeldata = modeldata;
    }
    // ============================================================================
    // Model attributes
    // ============================================================================
    /**
     * Set a model attrib value
     * @param id
     * @param name
     * @param value
     */
    setModelAttribVal(name, value) {
        const ssid = this.modeldata.active_ssid;
        this.modeldata.attribs.attribs_maps.get(ssid).mo.set(name, value);
    }
    /**
     * Set a model attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setModelAttribListIdxVal(name, idx, value) {
        const ssid = this.modeldata.active_ssid;
        const list_value = this.modeldata.attribs.attribs_maps.get(ssid).mo.get(name);
        if (list_value === undefined) {
            throw new Error('Attribute with this name does not exist.');
        }
        if (!Array.isArray(list_value)) {
            throw new Error('Attribute is not a list, so indexed values are not allowed.');
        }
        list_value[idx] = value;
    }
    /**
     * Set a model attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setModelAttribDictKeyVal(name, key, value) {
        const ssid = this.modeldata.active_ssid;
        const dict_value = this.modeldata.attribs.attribs_maps.get(ssid).mo.get(name);
        if (dict_value === undefined) {
            throw new Error('Attribute with this name does not exist.');
        }
        if (Array.isArray(dict_value) || typeof dict_value !== 'object') {
            throw new Error('Attribute is not a dictionary, so keyed values are not allowed.');
        }
        dict_value[key] = value;
    }
    // ============================================================================
    // Entity attributes
    // ============================================================================
    /**
     * Set an entity attrib value
     * If the attribute does not exist, then it is created.
     * @param id
     * @param name
     * @param value
     */
    setCreateEntsAttribVal(ent_type, ents_i, name, value) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        // get the attrib
        let attrib = attribs.get(name);
        if (attrib === undefined) {
            const new_data_type = this._checkDataType(value);
            attrib = this.modeldata.attribs.add.addAttrib(ent_type, name, new_data_type);
        }
        // set the data
        ents_i = Array.isArray(ents_i) ? ents_i : [ents_i];
        for (const ent_i of ents_i) {
            attrib.setEntVal(ent_i, value);
        }
    }
    /**
     * Set an entity attrib value, for just one ent
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setEntAttribVal(ent_type, ent_i, name, value) {
        const ssid = this.modeldata.active_ssid;
        const attrib = this.modeldata.attribs.attribs_maps.get(ssid)[common_1.EEntTypeStr[ent_type]].get(name);
        if (attrib === undefined) {
            throw new Error('Attribute does not exist:' + name);
        }
        attrib.setEntVal(ent_i, value);
    }
    /**
     * Set an entity attrib value, for just one ent
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setEntsAttribVal(ent_type, ents_i, name, value) {
        const ssid = this.modeldata.active_ssid;
        const attrib = this.modeldata.attribs.attribs_maps.get(ssid)[common_1.EEntTypeStr[ent_type]].get(name);
        if (attrib === undefined) {
            throw new Error('Attribute does not exist:' + name);
        }
        ents_i = Array.isArray(ents_i) ? ents_i : [ents_i];
        for (const ent_i of ents_i) {
            attrib.setEntVal(ent_i, value);
        }
    }
    /**
     * Set an entity attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setEntsAttribListIdxVal(ent_type, ents_i, name, idx, value) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const attrib = attribs.get(name);
        if (attrib === undefined) {
            throw new Error('Attribute does not exist.');
        }
        if (attrib.getDataType() !== common_1.EAttribDataTypeStrs.LIST) {
            throw new Error('Attribute is not a list, so indexed values are not allowed.');
        }
        // replace the data
        ents_i = Array.isArray(ents_i) ? ents_i : [ents_i];
        for (const ent_i of ents_i) {
            const data = lodash_1.default.cloneDeep(attrib.getEntVal(ent_i)); // this will be a deep copy of the data
            data[idx] = value;
            attrib.setEntVal(ent_i, data);
        }
    }
    /**
     * Set an entity attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setEntsAttribDictKeyVal(ent_type, ents_i, name, key, value) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const attrib = attribs.get(name);
        if (attrib === undefined) {
            throw new Error('Attribute does not exist.');
        }
        if (attrib.getDataType() !== common_1.EAttribDataTypeStrs.DICT) {
            throw new Error('Attribute is not a dictionary, so keyed values are not allowed.');
        }
        // replace the data
        ents_i = Array.isArray(ents_i) ? ents_i : [ents_i];
        for (const ent_i of ents_i) {
            const data = lodash_1.default.cloneDeep(attrib.getEntVal(ent_i)); // this will be a deep copy of the data
            data[key] = value;
            attrib.setEntVal(ent_i, data);
        }
    }
    // ============================================================================
    // Copy entity attributes
    // ============================================================================
    /**
     * Copy all attribs from one entity to another entity
     * @param ent_type
     * @param name
     */
    copyAttribs(ent_type, from_ent_i, to_ent_i) {
        const ssid = this.modeldata.active_ssid;
        // get the attrib names
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const attrib_names = Array.from(attribs.keys());
        // copy each attrib
        for (const attrib_name of attrib_names) {
            if (attrib_name[0] === '_') {
                continue;
            } // skip attrib names that start with underscore
            const attrib = attribs.get(attrib_name);
            const attrib_value = attrib.getEntVal(from_ent_i); // deep copy
            attrib.setEntVal(to_ent_i, attrib_value);
        }
    }
    /**
     * Utility method to check the data type of an attribute.
     * @param value
     */
    _checkDataType(value) {
        if (typeof value === 'string') {
            return common_1.EAttribDataTypeStrs.STRING;
        }
        else if (typeof value === 'number') {
            return common_1.EAttribDataTypeStrs.NUMBER;
        }
        else if (typeof value === 'boolean') {
            return common_1.EAttribDataTypeStrs.BOOLEAN;
        }
        else if (Array.isArray(value)) {
            return common_1.EAttribDataTypeStrs.LIST;
        }
        else if (typeof value === 'object') {
            return common_1.EAttribDataTypeStrs.DICT;
        }
        throw new Error('Data type for new attribute not recognised: ' + value);
    }
}
exports.GIAttribsSetVal = GIAttribsSetVal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzU2V0VmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGlicy9nZW8taW5mby9hdHRyaWJzL0dJQXR0cmlic1NldFZhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzQ0FDbUY7QUFHbkYsb0RBQTRCO0FBRTVCOztHQUVHO0FBQ0gsTUFBYSxlQUFlO0lBRXpCOzs7UUFHSTtJQUNILFlBQVksU0FBc0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUNELCtFQUErRTtJQUMvRSxtQkFBbUI7SUFDbkIsK0VBQStFO0lBQy9FOzs7OztPQUtHO0lBQ0ksaUJBQWlCLENBQUMsSUFBWSxFQUFFLEtBQXVCO1FBQzFELE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUNEOzs7Ozs7T0FNRztJQUNJLHdCQUF3QixDQUFDLElBQVksRUFBRSxHQUFXLEVBQUUsS0FBVTtRQUNqRSxNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxNQUFNLFVBQVUsR0FBcUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hHLElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztTQUFFO1FBQzlGLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFF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