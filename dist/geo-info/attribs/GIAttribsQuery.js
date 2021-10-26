import { EEntType, ESort, EAttribDataTypeStrs, EEntTypeStr } from '../common';
/**
 * Class for attributes.
 */
export class GIAttribsQuery {
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
        const attribs_maps_key = EEntTypeStr[EEntType.MOD];
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
        const attribs_maps_key = EEntTypeStr[ent_type];
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
        const attribs_maps_key = EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        if (attribs.get(name) === undefined) {
            throw new Error('Attribute does not exist.');
        }
        if (ent_type === EEntType.MOD) {
            const mod_attribs = attribs;
            const value = mod_attribs.get(name);
            if (typeof value === 'number') {
                return EAttribDataTypeStrs.NUMBER;
            }
            else if (typeof value === 'string') {
                return EAttribDataTypeStrs.STRING;
            }
            else if (typeof value === 'boolean') {
                return EAttribDataTypeStrs.BOOLEAN;
            }
            else if (Array.isArray(value)) {
                return EAttribDataTypeStrs.LIST;
            }
            else if (typeof value === 'object') {
                return EAttribDataTypeStrs.DICT;
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
        const attribs_maps_key = EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        if (attribs.get(name) === undefined) {
            throw new Error('Attribute does not exist.');
        }
        if (ent_type === EEntType.MOD) {
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
        const attribs_maps_key = EEntTypeStr[ent_type];
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
        const attribs_maps_key = EEntTypeStr[ent_type];
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
            if (method === ESort.DESCENDING) {
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
            if (method === ESort.DESCENDING) {
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
            if (method === ESort.DESCENDING) {
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
            if (method === ESort.DESCENDING) {
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
            if (method === ESort.DESCENDING) {
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
        if (attrib.getDataType() === EAttribDataTypeStrs.LIST) {
            if (idx_or_key === null || idx_or_key === undefined) {
                ents_i.sort(_sortCompareLists);
            }
            else {
                ents_i.sort(_sortCompareListIdxVals);
            }
        }
        else if (attrib.getDataType() === EAttribDataTypeStrs.DICT) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzUXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWJzL2dlby1pbmZvL2F0dHJpYnMvR0lBdHRyaWJzUXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFvQixRQUFRLEVBQUcsS0FBSyxFQUN2QyxtQkFBbUIsRUFBRSxXQUFXLEVBQXdCLE1BQU0sV0FBVyxDQUFDO0FBSTlFOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGNBQWM7SUFFeEI7OztRQUdJO0lBQ0gsWUFBWSxTQUFzQjtRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksY0FBYyxDQUFDLElBQVk7UUFDOUIsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDaEQsTUFBTSxnQkFBZ0IsR0FBVyxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNELE1BQU0sTUFBTSxHQUFrQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUcsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksWUFBWSxDQUFDLFFBQWtCLEVBQUUsSUFBWTtRQUNoRCxNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxNQUFNLGdCQUFnQixHQUFXLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2RCxNQUFNLE9BQU8sR0FBaUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlHLE9BQU8sT0FBTyxDQUFDLEdBQUcs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