"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIAttribsQuery = void 0;
const common_1 = require("../common");
/**
 * Class for attributes.
 */
class GIAttribsQuery {
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata) {
        this.modeldata = modeldata;
    }
    /**
     * Checks if an attribute with this name exists.
     * @param name
     */
    hasModelAttrib(name) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = common_1.EEntTypeStr[common_1.EEntType.MOD];
        const attrib = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        return attrib.has(name);
    }
    /**
     * Check if attribute exists
     * @param ent_type
     * @param name
     */
    hasEntAttrib(ent_type, name) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        return attribs.has(name);
    }
    /**
     * Get attrib data type. Also works for MOD attribs.
     *
     * @param ent_type
     * @param name
     */
    getAttribDataType(ent_type, name) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        if (attribs.get(name) === undefined) {
            throw new Error('Attribute does not exist.');
        }
        if (ent_type === common_1.EEntType.MOD) {
            const mod_attribs = attribs;
            const value = mod_attribs.get(name);
            if (typeof value === 'number') {
                return common_1.EAttribDataTypeStrs.NUMBER;
            }
            else if (typeof value === 'string') {
                return common_1.EAttribDataTypeStrs.STRING;
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
            throw new Error('Datatype of model attribute not recognised.');
        }
        else {
            const ent_attribs = attribs;
            return ent_attribs.get(name).getDataType();
        }
    }
    /**
     * Get attrib data length. Also works for MOD attribs.
     *
     * @param ent_type
     * @param name
     */
    getAttribDataLength(ent_type, name) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        if (attribs.get(name) === undefined) {
            throw new Error('Attribute does not exist.');
        }
        if (ent_type === common_1.EEntType.MOD) {
            const mod_attribs = attribs;
            const value = mod_attribs.get(name);
            if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
                return 1;
            }
            else if (Array.isArray(value)) {
                return value.length;
            }
            else if (typeof value === 'object') {
                return Object.keys(value).length;
            }
            throw new Error('Datatype of model attribute not recognised.');
        }
        else {
            const ent_attribs = attribs;
            return ent_attribs.get(name).getDataLength();
        }
    }
    // ============================================================================
    // Queries on attribute values
    // ============================================================================
    /**
     * Query the model using a query strings.
     * Returns a list of entities in the model.
     * @param ent_type The type of the entities being quieried.
     * @param ents_i Entites in the model, assumed to be of type ent_type.
     * @param name
     * @param idx_or_key
     * @param value
     */
    filterByAttribs(ent_type, ents_i, name, idx_or_key, op_type, value) {
        const ssid = this.modeldata.active_ssid;
        // get the map that contains all the attributes for the ent_type
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        // do the query
        if (attribs && attribs.has(name)) {
            const attrib = attribs.get(name);
            let query_ents_i;
            if (typeof idx_or_key === 'number') {
                query_ents_i = attrib.queryListIdxVal(ents_i, idx_or_key, op_type, value);
            }
            else if (typeof idx_or_key === 'string') {
                query_ents_i = attrib.queryDictKeyVal(ents_i, idx_or_key, op_type, value);
            }
            else {
                query_ents_i = attrib.queryVal(ents_i, op_type, value);
            }
            // return the result
            return query_ents_i;
        }
        else {
            throw new Error('Attribute "' + name + '" does not exist.');
            // query_ents_i = [];
        }
    }
    /**
     * Sort entities in the model based on attribute values.
     * @param ent_type The type of the entities being sorted.
     * @param ents_i Entites in the model, assumed to be of type ent_type.
     * @param name
     * @param idx_or_key
     * @param value
     */
    sortByAttribs(ent_type, ents_i, name, idx_or_key, method) {
        const ssid = this.modeldata.active_ssid;
        // get the map that contains all the ettributes for the ent_type
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        if (!attribs) {
            throw new Error('Bad sort: Entity type does not exist.');
        }
        // get the attribute from the map
        const attrib = attribs.get(name);
        if (attrib === undefined) {
            // if the attribute does not exist then no sort is performed
            return ents_i;
        }
        // create the sort copmapre function
        function _sortCompareVals(ent1_i, ent2_i) {
            const val1 = attrib.getEntVal(ent1_i);
            const val2 = attrib.getEntVal(ent2_i);
            if (method === common_1.ESort.DESCENDING) {
                if (val1 < val2) {
                    return 1;
                }
                if (val1 > val2) {
                    return -1;
                }
            }
            else {
                if (val1 < val2) {
                    return -1;
                }
                if (val1 > val2) {
                    return 1;
                }
            }
            return 0;
        }
        function _sortCompareListIdxVals(ent1_i, ent2_i) {
            const l1 = attrib.getEntVal(ent1_i);
            const l2 = attrib.getEntVal(ent2_i);
            const val1 = (l1 !== undefined && l1 !== null) ? l1[idx_or_key] : null;
            const val2 = (l2 !== undefined && l2 !== null) ? l2[idx_or_key] : null;
            if (method === common_1.ESort.DESCENDING) {
                if (val1 < val2) {
                    return 1;
                }
                if (val1 > val2) {
                    return -1;
                }
            }
            else {
                if (val1 < val2) {
                    return -1;
                }
                if (val1 > val2) {
                    return 1;
                }
            }
            return 0;
        }
        function _sortCompareDictKeyVals(ent1_i, ent2_i) {
            const o1 = attrib.getEntVal(ent1_i);
            const o2 = attrib.getEntVal(ent2_i);
            const val1 = (o1 !== undefined && o1 !== null) ? o1[idx_or_key] : null;
            const val2 = (o2 !== undefined && o2 !== null) ? o2[idx_or_key] : null;
            if (method === common_1.ESort.DESCENDING) {
                if (val1 < val2) {
                    return 1;
                }
                if (val1 > val2) {
                    return -1;
                }
            }
            else {
                if (val1 < val2) {
                    return -1;
                }
                if (val1 > val2) {
                    return 1;
                }
            }
            return 0;
        }
        function _sortCompareLists(ent1_i, ent2_i) {
            const l1 = attrib.getEntVal(ent1_i);
            const l2 = attrib.getEntVal(ent2_i);
            const len = l1.length > l2.length ? l1.length : l2.length;
            if (method === common_1.ESort.DESCENDING) {
                for (let i = 0; i < len; i++) {
                    if (l1[i] < l2[i]) {
                        return 1;
                    }
                    if (l1[i] > l2[i]) {
                        return -1;
                    }
                }
            }
            else {
                for (let i = 0; i < len; i++) {
                    if (l1[i] < l2[i]) {
                        return -1;
                    }
                    if (l1[i] > l2[i]) {
                        return 1;
                    }
                }
            }
            return 0;
        }
        function _sortCompareDicts(ent1_i, ent2_i) {
            const o1 = attrib.getEntVal(ent1_i);
            const o2 = attrib.getEntVal(ent2_i);
            if (method === common_1.ESort.DESCENDING) {
                if (o1 < o2) {
                    return 1;
                }
                if (o1 > o2) {
                    return -1;
                }
            }
            else {
                if (o1 < o2) {
                    return -1;
                }
                if (o1 > o2) {
                    return 1;
                }
            }
            return 0;
        }
        // do the sort
        if (attrib.getDataType() === common_1.EAttribDataTypeStrs.LIST) {
            if (idx_or_key === null || idx_or_key === undefined) {
                ents_i.sort(_sortCompareLists);
            }
            else {
                ents_i.sort(_sortCompareListIdxVals);
            }
        }
        else if (attrib.getDataType() === common_1.EAttribDataTypeStrs.DICT) {
            if (idx_or_key === null || idx_or_key === undefined) {
                ents_i.sort(_sortCompareDicts);
            }
            else {
                ents_i.sort(_sortCompareDictKeyVals);
            }
        }
        else {
            ents_i.sort(_sortCompareVals);
        }
        return ents_i;
    }
}
exports.GIAttribsQuery = GIAttribsQuery;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzUXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWJzL2dlby1pbmZvL2F0dHJpYnMvR0lBdHRyaWJzUXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0NBQzhFO0FBSTlFOztHQUVHO0FBQ0gsTUFBYSxjQUFjO0lBRXhCOzs7UUFHSTtJQUNILFlBQVksU0FBc0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUNEOzs7T0FHRztJQUNJLGNBQWMsQ0FBQyxJQUFZO1FBQzlCLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE1BQU0sZ0JBQWdCLEdBQVcsb0JBQVcsQ0FBQyxpQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNELE1BQU0sTUFBTSxHQUFrQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUcsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksWUFBWSxDQUFDLFFBQWtCLEVBQUUsSUFBWTtRQUNoRCxNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxNQUFNLGdCQUFnQixHQUFXLG9CQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkQsTUFBTSxPQUFPLEdBQWlDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM5RyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNEOzs7OztPQUtHO0lBQ0ksaUJBQWlCLENB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