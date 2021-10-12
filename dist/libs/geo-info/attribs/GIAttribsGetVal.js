"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIAttribsGetVal = void 0;
const common_1 = require("../common");
/**
 * Class for attributes.
 */
class GIAttribsGetVal {
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
     * Get an model attrib value, or an array of values.
     * \n
     * If idx_or_key is null, then this must be a simple attrib.
     * If idx_or_key is a number, then this must be indexing a list attrib.
     * if idx_or_key is a string, then this must be indexing a dict attrib.
     * \n
     * If the attribute does not exist, throw an error
     * \n
     * @param ent_type
     * @param name
     */
    getModelAttribValOrItem(name, idx_or_key) {
        const ssid = this.modeldata.active_ssid;
        if (idx_or_key === null) {
            return this.getModelAttribVal(name);
        }
        switch (typeof idx_or_key) {
            case 'number':
                return this.getModelAttribListIdxVal(name, idx_or_key);
            case 'string':
                return this.getModelAttribDictKeyVal(name, idx_or_key);
        }
    }
    /**
     * Get a model attrib value
     * @param name
     */
    getModelAttribVal(name) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = common_1.EEntTypeStr[common_1.EEntType.MOD];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const value = attribs.get(name);
        if (value === undefined) {
            return null;
        }
        return value;
    }
    /**
     * Get a model attrib list value given an index
     * \n
     * If this attribute is not a list, throw error
     * \n
     * If idx is creater than the length of the list, undefined is returned.
     * \n
     * @param ent_type
     * @param name
     */
    getModelAttribListIdxVal(name, idx) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = common_1.EEntTypeStr[common_1.EEntType.MOD];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const list_value = attribs.get(name);
        if (list_value === undefined) {
            throw new Error('Attribute does not exist.');
        }
        if (!Array.isArray(list_value)) {
            throw new Error('Attribute is not a list.');
        }
        return list_value[idx];
    }
    /**
     * Get a model attrib dict value given a key
     * \n
     * If this attribute is not a dict, throw error
     * \n
     * If key does not exist, throw error
     * \n
     * @param ent_type
     * @param name
     */
    getModelAttribDictKeyVal(name, key) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = common_1.EEntTypeStr[common_1.EEntType.MOD];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const dict_value = attribs.get(name);
        if (dict_value === undefined) {
            throw new Error('Attribute does not exist.');
        }
        if (Array.isArray(dict_value) || typeof dict_value !== 'object') {
            throw new Error('Attribute is not a dict.');
        }
        return dict_value[key];
    }
    // ============================================================================
    // Entity attributes
    // ============================================================================
    /**
     * Get an entity attrib value, or an array of values given an array of entities.
     * \n
     * If idx_or_key is null, then this must be a simple attrib.
     * If idx_or_key is a number, then this must be indexing a list attrib.
     * if idx_or_key is a string, then this must be indexing a dict attrib.
     * \n
     * If the attribute does not exist, throw an error
     * \n
     * @param ent_type
     * @param name
     */
    getEntAttribValOrItem(ent_type, ents_i, name, idx_or_key) {
        if (idx_or_key === null) {
            return this.getEntAttribVal(ent_type, ents_i, name);
        }
        switch (typeof idx_or_key) {
            case 'number':
                return this.getEntAttribListIdxVal(ent_type, ents_i, name, idx_or_key);
            case 'string':
                return this.getEntAttribDictKeyVal(ent_type, ents_i, name, idx_or_key);
        }
    }
    /**
     * Get an entity attrib value, or an array of values given an array of entities.
     * \n
     * If the attribute does not exist, throw an error
     * \n
     * @param ent_type
     * @param name
     */
    getEntAttribVal(ent_type, ents_i, name) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const attrib = attribs.get(name);
        if (attrib === undefined) {
            throw new Error('Attribute does not exist.');
        }
        if (Array.isArray(ents_i)) {
            return ents_i.map(ent_i => attrib.getEntVal(ent_i));
        }
        return attrib.getEntVal(ents_i);
    }
    /**
     * Get an entity attrib value in a list.
     * \n
     * If the attribute does not exist, throw error
     * \n
     * If the index is out of range, return undefined.
     * \n
     * @param ent_type
     * @param name
     */
    getEntAttribListIdxVal(ent_type, ents_i, name, idx) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const attrib = attribs.get(name);
        if (attrib === undefined) {
            throw new Error('Attribute does not exist.');
        }
        if (Array.isArray(ents_i)) {
            return ents_i.map(ent_i => attrib.getEntVal(ent_i)[idx]);
        }
        return attrib.getEntVal(ents_i)[idx];
    }
    /**
     * Get an entity attrib value in a dictionary.
     * \n
     * If the attribute does not exist, throw error
     * \n
     * If the key does not exist, return undefined.
     * \n
     * @param ent_type
     * @param name
     */
    getEntAttribDictKeyVal(ent_type, ents_i, name, key) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const attrib = attribs.get(name);
        if (attrib === undefined) {
            throw new Error('Attribute does not exist.');
        }
        if (Array.isArray(ents_i)) {
            return ents_i.map(ent_i => attrib.getEntVal(ent_i)[key]);
        }
        return attrib.getEntVal(ents_i)[key];
    }
}
exports.GIAttribsGetVal = GIAttribsGetVal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzR2V0VmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vYXR0cmlicy9HSUF0dHJpYnNHZXRWYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0NBQW9FO0FBSXBFOztHQUVHO0FBQ0gsTUFBYSxlQUFlO0lBRXpCOzs7UUFHSTtJQUNILFlBQVksU0FBc0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUNELCtFQUErRTtJQUMvRSxtQkFBbUI7SUFDbkIsK0VBQStFO0lBRS9FOzs7Ozs7Ozs7OztPQVdHO0lBQ0ksdUJBQXVCLENBQUMsSUFBWSxFQUFFLFVBQXlCO1FBQ2xFLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELElBQUksVUFBVSxLQUFLLElBQUksRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQUU7UUFDakUsUUFBUSxPQUFPLFVBQVUsRUFBRTtZQUN2QixLQUFLLFFBQVE7Z0JBQ1QsT0FBTyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLFVBQW9CLENBQUMsQ0FBQztZQUNyRSxLQUFLLFFBQVE7Z0JBQ1QsT0FBTyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLFVBQW9CLENBQUMsQ0FBQztTQUN4RTtJQUNMLENBQUM7SUFDRDs7O09BR0c7SUFDSSxpQkFBaUIsQ0FBQyxJQUFZO1FBQ2pDLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE1BQU0sZ0JBQWdCLEdBQVcsb0JBQVcsQ0FBQyxpQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNELE1BQU0sT0FBTyxHQUFrQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxD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