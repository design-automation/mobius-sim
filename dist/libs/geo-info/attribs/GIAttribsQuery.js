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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzUXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9hdHRyaWJzL0dJQXR0cmlic1F1ZXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUM4RTtBQUk5RTs7R0FFRztBQUNILE1BQWEsY0FBYztJQUV4Qjs7O1FBR0k7SUFDSCxZQUFZLFNBQXNCO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFDRDs7O09BR0c7SUFDSSxjQUFjLENBQUMsSUFBWTtRQUM5QixNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxNQUFNLGdCQUFnQixHQUFXLG9CQUFXLENBQUMsaUJBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzRCxNQUFNLE1BQU0sR0FBa0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlHLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLFlBQVksQ0FBQyxRQUFrQixFQUFFLElBQVk7UUFDaEQsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDaEQsTUFBTSxnQkFBZ0IsR0FBVyxvQkFBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sT0FBTyxHQUFpQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUcsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFDRDs7Ozs7T0FLRztJQUNJLGlCQUFp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