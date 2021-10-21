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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzUXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9hdHRyaWJzL0dJQXR0cmlic1F1ZXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBb0IsUUFBUSxFQUFHLEtBQUssRUFDdkMsbUJBQW1CLEVBQUUsV0FBVyxFQUF3QixNQUFNLFdBQVcsQ0FBQztBQUk5RTs7R0FFRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBRXhCOzs7UUFHSTtJQUNILFlBQVksU0FBc0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUNEOzs7T0FHRztJQUNJLGNBQWMsQ0FBQyxJQUFZO1FBQzlCLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE1BQU0sZ0JBQWdCLEdBQVcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzRCxNQUFNLE1BQU0sR0FBa0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlHLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLFlBQVksQ0FBQyxRQUFrQixFQUFFLElBQVk7UUFDaEQsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDaEQsTUFBTSxnQkFBZ0IsR0FBVyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkQsTUFBTSxPQUFPLEdBQWlDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM5RyxPQUFPLE9BQU8sQ0FB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