import { EFilterOperatorTypes, EAttribDataTypeStrs, EEntType } from '../common';
import { getEntTypeStr } from '../common_func';
import { idMake } from '../common_id_funcs';
/**
 * Geo-info attribute class for one attribute.
 * This class is the base from which other classes inherit:
 * - GIAttribMapBool
 * - GIAttribMapDict
 * - GIAttribMapList
 * - GIAttribMapNum
 * - GIAttribMapStr
 * The attributs stores key-value pairs.
 * Multiple keys point to the same value.
 * So for example, [[1,3], "a"],[[0,4], "b"] can be converted into sequential arrays.
 * The values would be ["a", "b"]
 * The keys would be [1,0,,0,1] (Note the undefined value in the middle.)
 *
 */
export class GIAttribMapBase {
    modeldata;
    _name;
    _ent_type;
    _data_type;
    _is_length_variable;
    // the two data maps that store attrib data
    _map_val_i_to_ents_i;
    _map_ent_i_to_val_i;
    /**
     * Creates an attribute.
     * @param attrib_data
     */
    constructor(modeldata, name, ent_type, data_type) {
        this.modeldata = modeldata;
        this._name = name;
        this._ent_type = ent_type;
        this._data_type = data_type;
        // the maps
        this._map_val_i_to_ents_i = new Map();
        this._map_ent_i_to_val_i = new Map();
    }
    /**
     * Returns the JSON data for this attribute.
     * Returns null if there is no data.
     * If entset is null, then all ents are included.
     */
    getJSONData(ent_set) {
        const data = [];
        for (const val_i of this._map_val_i_to_ents_i.keys()) {
            let ents_i;
            if (ent_set === undefined) {
                // all ents
                ents_i = this._mapValToEntsGetArr(val_i);
            }
            else {
                // filter ents
                ents_i = this._mapValToEntsGetArr(val_i).filter(ent_i => ent_set.has(ent_i));
            }
            if (ents_i.length > 0) {
                data.push([this._getVal(val_i), ents_i]);
            }
        }
        if (data.length === 0) {
            return null;
        }
        return {
            name: this._name,
            data_type: this._data_type,
            data: data
        };
    }
    /**
     * Gets the name of this attribute.
     */
    getName() {
        return this._name;
    }
    /**
     * Sets the name of this attribute.
     */
    setName(name) {
        this._name = name;
    }
    /**
     * Returns the data type of this attribute.
     */
    getDataType() {
        return this._data_type;
    }
    /**
     * Returns the length of the data.
     * \n
     * If _data_type is NUMBER, STRING, BOOLEAN, then length = 1
     * \n
     * If _data_type is LIST, length is the list of the longest length, can be 0
     * \n
     * If _data_type is OBJECT, length is the obect with the longest Object.keys, can be 0
     */
    getDataLength() {
        switch (this._data_type) {
            case EAttribDataTypeStrs.NUMBER:
            case EAttribDataTypeStrs.STRING:
            case EAttribDataTypeStrs.BOOLEAN:
                return 1;
            case EAttribDataTypeStrs.LIST:
                let max_len = 0;
                for (const val_i of this._map_val_i_to_ents_i.keys()) {
                    const val_len = this._getVal(val_i).length;
                    if (val_len > max_len) {
                        max_len = val_len;
                    }
                }
                return max_len;
            case EAttribDataTypeStrs.DICT:
                let max_size = 0;
                for (const val_i of this._map_val_i_to_ents_i.keys()) {
                    const val_size = Object.keys(this._getVal(val_i)).length;
                    if (val_size > max_size) {
                        max_size = val_size;
                    }
                }
                return max_size;
            default:
                throw new Error('Attribute datatype not recognised.');
        }
    }
    /**
     * Returns true if there is an entity that has a value (i.e. the value is not undefined).
     */
    hasEnt(ent_i) {
        return this._map_ent_i_to_val_i.has(ent_i);
    }
    /**
     * Returns the number of entities that have a value (i.e. is not undefined).
     */
    numEnts() {
        return this._map_ent_i_to_val_i.size;
    }
    /**
     * Returns the number of values.
     */
    numVals() {
        return this._map_val_i_to_ents_i.size;
    }
    /**
     * Returns the IDs of all ents that have a value.
     * Note that this may include deleted ents.
     */
    getEnts() {
        return Array.from(this._map_ent_i_to_val_i.keys());
    }
    /**
     * Gets the value for a given entity, or an array of values given an array of entities.
     * \n
     * Returns undefined if the entity does not exist in this map.
     * \n
     * If value is a list or dict, it is passed by reference.
     * \n
     * WARNING: The returned dict or list should not be modified, it should be treated as immutable.
     * \n
     * @param ent_i
     */
    getEntVal(ent_i) {
        const val_i = this._map_ent_i_to_val_i.get(ent_i);
        return this._getVal(val_i);
    }
    /**
     * Gets all the keys that have a given value
     * If the value does not exist an empty array is returned
     * The value can be a list or object
     * @param val
     */
    getEntsFromVal(val) {
        const val_i = this._getValIdx(val);
        return this._mapValToEntsGetArr(val_i);
    }
    /**
     * Sets the value for a given entity or entities.
     *
     * If the value is undefined, no action is taken.
     *
     * The value can be null, in which case it is equivalent to deleting the entities from this attrib map.
     *
     * If the ents come from a previous snapshot, then they will be copied.
     *
     * @param ent_i
     * @param val
     */
    setEntVal(ents_i, val, check_type = true) {
        // if indefined, do nothing
        if (val === undefined) {
            this.delEnt(ents_i);
            return;
        }
        // if null, delete
        // if (val === null) { this.delEnt(ents_i); return; }
        // check the type
        if (check_type) {
            this._checkValType(val);
        }
        // get the val idx
        const val_i = this._getAddValIdx(val);
        // an array of ents
        ents_i = (Array.isArray(ents_i)) ? ents_i : [ents_i];
        // loop through all the unique ents, and set _map_ent_i_to_val_i
        ents_i.forEach(ent_i => {
            // keep the old value for later
            const old_val_i = this._map_ent_i_to_val_i.get(ent_i);
            // for each ent_i, set the new val_i
            this._map_ent_i_to_val_i.set(ent_i, val_i);
            // for the value add each ent_i
            this._mapValToEntsAdd(val_i, ent_i);
            // clean up the old val_i
            if (old_val_i !== undefined && old_val_i !== val_i) {
                this._mapValToEntsRem(old_val_i, ent_i);
            }
        });
    }
    /**
     * Delete the entities from this attribute map.
     */
    delEnt(ents_i) {
        ents_i = (Array.isArray(ents_i)) ? ents_i : [ents_i];
        ents_i.forEach(ent_i => {
            // _map_ent_i_to_val_i: Map<number, number>
            const val_i = this._map_ent_i_to_val_i.get(ent_i);
            if (val_i !== undefined) {
                // del the entity from _map_ent_i_to_val_i
                this._map_ent_i_to_val_i.delete(ent_i);
                // del the entity from _map_val_i_to_ents_i
                this._mapValToEntsRem(val_i, ent_i);
            }
        });
    }
    /**
     * Returns an array of entity indices which do not have a value (undefined)
     */
    getEntsWithoutVal(ents_i) {
        return ents_i.filter(ent_i => !this._map_ent_i_to_val_i.has(ent_i));
    }
    /**
     * Returns an array of entity indices which have a value (not undefined)
     */
    getEntsWithVal(ents_i) {
        return ents_i.filter(ent_i => this._map_ent_i_to_val_i.has(ent_i));
    }
    /**
     * Adds all the entity-value pairs in the other attribute map to this attribute map.
     * Conflict detection is performed.
     * This method is used when it is known that this attribute map already contains some data.
     * @param other_attrib_map
     * @param other_ents_i
     */
    mergeAttribMap(other_attrib_map, other_ents_i) {
        for (const other_ent_i of other_ents_i) {
            // get the value in the other map
            const other_val_i = other_attrib_map._map_ent_i_to_val_i.get(other_ent_i);
            // check for conflict
            if (this._map_ent_i_to_val_i.has(other_ent_i) && this._map_ent_i_to_val_i.get(other_ent_i) !== other_val_i) {
                this._mergeConflictError(other_ent_i, other_val_i);
            }
            else {
                this._mapValToEntsAdd(other_val_i, other_ent_i);
                this._map_ent_i_to_val_i.set(other_ent_i, other_val_i);
            }
        }
    }
    /**
     * Adds all the entity-value pairs in the other attribute map to this attribute map.
     * No conflict detection is performed.
     * This method is used when it is known that this attribute map is actually empty.
     * @param other_attrib_map
     * @param other_ents_i
     */
    addAttribMap(other_attrib_map, other_ents_i) {
        for (const other_ent_i of other_ents_i) {
            // get the value in the other map
            const other_val_i = other_attrib_map._map_ent_i_to_val_i.get(other_ent_i);
            this._mapValToEntsAdd(other_val_i, other_ent_i);
            this._map_ent_i_to_val_i.set(other_ent_i, other_val_i);
        }
    }
    /**
     * Generates teh merge conflict error message.
     * @param other_ent_i
     * @param other_val_i
     */
    _mergeConflictError(other_ent_i, other_val_i) {
        const ent_type_str = getEntTypeStr(this._ent_type);
        let err_msg = 'A attribute merge conflict has been detected. ' +
            'This node has two or more incoming links, and as a result the incoming entities will be merged, ' +
            'meaning that entities with the same ID will be merged into a single entity. ' +
            'If two entities have the same ID, but have different attributes, then it will result in a merge conflict. ';
        if (this._ent_type === EEntType.POSI && this._name === 'xyz') {
            const verts_i = this.modeldata.geom.nav.navPosiToVert(other_ent_i);
            const parent_obj_strs = [];
            for (const vert_i of verts_i) {
                const parent_obj = this.modeldata.geom.query.getTopoObj(EEntType.VERT, vert_i);
                const parent_obj_str = idMake(parent_obj[0], parent_obj[1]);
                parent_obj_strs.push(parent_obj_str);
            }
            err_msg = err_msg + '<br><br>' +
                'In this case, the conflict is caused by two positions with same ID but different XYZ coordinates.' +
                '<ul>' +
                '<li>The position causing the merge conflict is: "' + idMake(this._ent_type, other_ent_i) + '". </li>' +
                '<li>The conflicting attribute is: "' + this._name + '". </li>' +
                '<li>The conflicting values are : ' +
                JSON.stringify(this._getVal(this._map_ent_i_to_val_i.get(other_ent_i))) + 'and ' +
                JSON.stringify(this._getVal(other_val_i)) + '. </li>';
            if (parent_obj_strs.length === 1) {
                err_msg = err_msg +
                    '<li>This position is used in the following object: "' + parent_obj_strs[0] + '". </li>' +
                    '</ul>';
                err_msg = err_msg +
                    'This conflict is most likley due to the fact that the "' + parent_obj_strs[0] + '" entity has been modified in one of the upstream nodes, ' +
                    'using one of the modify.XXX() functions. ' +
                    'Possible fixes in one of the upstream nodes: ' +
                    '<ul>' +
                    '<li>One of the two conflicting positions could be deleted before reaching this node. </li>' +
                    '<li>The ' + parent_obj_strs[0] + ' object could be cloned before being modified, using the make.Clone() function. </li>' +
                    '</ul>';
            }
            else if (parent_obj_strs.length > 1) {
                const all_parent_objs_str = JSON.stringify(parent_obj_strs);
                err_msg = err_msg +
                    '<li>This position is used in the following objects: ' + all_parent_objs_str + '. </li>' +
                    '</ul>' +
                    'Possible fixes in one of the upstream nodes: ' +
                    '<ul>' +
                    '<li>One of the two conflicting positions could be deleted before reaching this node. </li>' +
                    '<li>One of the objects ' + all_parent_objs_str + ' could be cloned before being modified, using the make.Clone() function. </li>' +
                    '</ul>';
            }
            else {
                err_msg = err_msg +
                    '<li>The position is not being used in any objects. </li>' +
                    '</ul>' +
                    'Possible fixes in one of the upstream nodes: ' +
                    '<ul>' +
                    '<li>One of the two conflicting positions could be deleted before reaching this node. </li>' +
                    '</ul>';
            }
        }
        else if (this._ent_type > EEntType.POSI && this._ent_type < EEntType.POINT) {
            const parent_obj = this.modeldata.geom.query.getTopoObj(this._ent_type, other_ent_i);
            const parent_obj_str = idMake(parent_obj[0], parent_obj[1]);
            const parent_ent_type_str = getEntTypeStr(parent_obj[0]);
            err_msg = err_msg + '<br><br>' +
                'In this case, the conflict is caused by two ' + ent_type_str + ' with same ID but with different attributes.' +
                '<ul>' +
                '<li>The entity causing the merge conflict is: "' + idMake(this._ent_type, other_ent_i) + '". </li>' +
                '<li>The entity is part of the following object: "' + parent_obj_str + '". </li>' +
                '<li>The conflicting attribute is: "' + this._name + '". </li>' +
                '<li>The conflicting values are : ' +
                JSON.stringify(this._getVal(this._map_ent_i_to_val_i.get(other_ent_i))) + ' and ' +
                JSON.stringify(this._getVal(other_val_i)) + '. </li>' +
                '</ul>' +
                'Possible fixes in one of the upstream nodes: ' +
                '<ul>' +
                '<li>One of the ' + parent_ent_type_str + ' entities causing the conflict could be deleted before reaching this node. </li>' +
                '</ul>';
        }
        else {
            err_msg = err_msg + '<br><br>' +
                'In this case, the conflict is caused by two ' + ent_type_str + ' with same ID but with different attributes.' +
                '<ul>' +
                '<li>The entity causing the merge conflict is: "' + idMake(this._ent_type, other_ent_i) + '". </li>' +
                '<li>The conflicting attribute is: "' + this._name + '". </li>' +
                '<li>The conflicting values are : ' +
                JSON.stringify(this._getVal(this._map_ent_i_to_val_i.get(other_ent_i))) + ' and ' +
                JSON.stringify(this._getVal(other_val_i)) + '. </li>' +
                '</ul>' +
                'Possible fixes in one of the upstream nodes: ' +
                '<ul>' +
                '<li>One of the two conflicting ' + ent_type_str + ' could be deleted deleted before reaching this node. </li>' +
                '</ul>';
        }
        throw new Error(err_msg);
    }
    // ============================================================================
    // Debug
    // ============================================================================
    toStr() {
        const data = this.getJSONData();
        if (data === null) {
            return this._name + ' has no data.';
        }
        return JSON.stringify(data);
    }
    //  ===============================================================================================================
    //  Private methods
    //  ===============================================================================================================
    /**
     * Compare two values with a comparison operator, ==, !=, >, >=, <, <=
     * \n
     * If the values are of different types, then false is returned.
     * \n
     * For arrays, true is returned only if a pairwise comparison between the items in the two arrays all return true.
     * The two arrays must also be of equal length.
     * \n
     * Values may be null.
     * Values that are undefined will be treated as null.
     * \n
     * @param operator
     * @param val1
     * @param val2
     */
    _compare(operator, val1, val2) {
        if (Array.isArray(val1)) {
            if (!Array.isArray(val2)) {
                return false;
            }
            if (val1.length !== val2.length) {
                return false;
            }
            for (let i = 0; i < val1.length; i++) {
                if (!this._compare(operator, val1[i], val2[i])) {
                    return false;
                }
            }
            return true;
        }
        if (val1 === undefined) {
            val1 = null;
        }
        if (val2 === undefined) {
            val2 = null;
        }
        if (typeof val1 !== typeof val2) {
            return false;
        }
        switch (operator) {
            // ==
            case EFilterOperatorTypes.IS_EQUAL:
                return val1 === val2;
            // !=
            case EFilterOperatorTypes.IS_NOT_EQUAL:
                return val1 !== val2;
            // >
            case EFilterOperatorTypes.IS_GREATER:
                return val1 > val2;
            // >=
            case EFilterOperatorTypes.IS_GREATER_OR_EQUAL:
                return val1 >= val2;
            // <
            case EFilterOperatorTypes.IS_LESS:
                return val1 < val2;
            // <=
            case EFilterOperatorTypes.IS_LESS_OR_EQUAL:
                return val1 <= val2;
            default:
                throw new Error('Query operator not found: ' + operator);
        }
    }
    /**
     *
     * @param val_i
     * @param ent_i
     */
    _mapValToEntsAdd(val_i, ent_i) {
        const exist_ents_i = this._map_val_i_to_ents_i.get(val_i);
        if (exist_ents_i === undefined) {
            this._map_val_i_to_ents_i.set(val_i, ent_i);
        }
        else if (typeof exist_ents_i === 'number') {
            this._map_val_i_to_ents_i.set(val_i, new Set([exist_ents_i, ent_i]));
        }
        else {
            exist_ents_i.add(ent_i);
        }
    }
    /**
     *
     * @param val_i
     * @param ent_i
     */
    _mapValToEntsRem(val_i, ent_i) {
        const exist_ents_i = this._map_val_i_to_ents_i.get(val_i);
        if (exist_ents_i === undefined) {
            return;
        }
        if (typeof exist_ents_i === 'number') {
            if (exist_ents_i === ent_i) {
                this._map_val_i_to_ents_i.delete(val_i);
            }
        }
        else {
            const ents_set = exist_ents_i;
            ents_set.delete(ent_i);
            if (ents_set.size === 1) {
                this._map_val_i_to_ents_i.set(val_i, ents_set.keys().next().value);
            }
        }
    }
    /**
     *
     * @param val_i
     */
    _mapValToEntsGetArr(val_i) {
        const exist_ents_i = this._map_val_i_to_ents_i.get(val_i);
        if (exist_ents_i === undefined) {
            return [];
        }
        // just one ent
        if (typeof exist_ents_i === 'number') {
            return [exist_ents_i];
        }
        // an array of ents
        return Array.from(exist_ents_i);
    }
    // ============================================================================================
    // Private methods to be overridden
    // ============================================================================================
    /**
     * Check that the value is of the correct type for this attribute.
     * @param ent_i
     */
    _checkValType(val) {
        throw new Error('Method must be overridden in sub class');
    }
    /**
     * Gets the value for a given index.
     * \n
     * If the value does not exist, it throws an error.
     * \n
     * If value is a list or dict, it is passed by reference.
     * @param ent_i
     */
    _getVal(val_i) {
        throw new Error('Method must be overridden in sub class');
    }
    /**
     * Gets the index for a given value.
     * @param ent_i
     */
    _getValIdx(val) {
        throw new Error('Method must be overridden in sub class');
    }
    /**
     * Get the index for a given value, if it does not exist add it.
     * @param ent_i
     */
    _getAddValIdx(val) {
        throw new Error('Method must be overridden in sub class');
    }
    // ============================================================================================
    // Public methods to be overridden
    // ============================================================================================
    /**
     * Executes a query.
     * \n
     * The value can be NUMBER, STRING, BOOLEAN, LIST or DICT
     * \n
     * @param ents_i
     * @param operator The relational operator, ==, !=, <=, >=, etc
     * @param search_val The value to search, string or number, or any[].
     */
    queryVal(ents_i, operator, search_val) {
        throw new Error('Method must be overridden in sub class');
    }
    // ============================================================================================
    /**
     * Executes a query for an indexed valued in a list
     * @param ents_i
     * @param val_arr_idx The index of the value in the array
     * @param operator The relational operator, ==, !=, <=, >=, etc
     * @param search_val The value to search, string or number, or any[].
     */
    queryListIdxVal(ents_i, val_arr_idx, operator, search_val) {
        throw new Error('Tring to query an indexed attribute, but the attribute data type is not a list: "' + this._name + '".');
    }
    // ============================================================================================
    /**
     * Executes a query for an valued in an object, identified by a key
     * @param ents_i
     * @param key The key of the value in the object
     * @param operator The relational operator, ==, !=, <=, >=, etc
     * @param search_val The value to search, string or number, or any[].
     */
    queryDictKeyVal(ents_i, key, operator, search_val) {
        throw new Error('Tring to query an keyed attribute, but the attribute data type is not a dictionary: "' + this._name + '".');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJNYXBCYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9hdHRyaWJfY2xhc3Nlcy9HSUF0dHJpYk1hcEJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLG9CQUFvQixFQUFFLG1CQUFtQixFQUFxQyxRQUFRLEVBQStELE1BQU0sV0FBVyxDQUFDO0FBQ2hMLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHNUM7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxNQUFNLE9BQU8sZUFBZTtJQUNkLFNBQVMsQ0FBYztJQUN2QixLQUFLLENBQVM7SUFDZCxTQUFTLENBQVc7SUFDcEIsVUFBVSxDQUFzQjtJQUNoQyxtQkFBbUIsQ0FBVTtJQUN2QywyQ0FBMkM7SUFDakMsb0JBQW9CLENBQWtDO0lBQ3RELG1CQUFtQixDQUFzQjtJQUVuRDs7O09BR0c7SUFDSCxZQUFZLFNBQXNCLEVBQUUsSUFBWSxFQUFFLFFBQWtCLEVBQUUsU0FBOEI7UUFDaEcsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFDNUIsV0FBVztRQUNYLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksV0FBVyxDQUFDLE9BQXFCO1FBQ3BDLE1BQU0sSUFBSSxHQUF3QixFQUFFLENBQUM7UUFDckMsS0FBSyxNQUFNLEtBQUssSUFBSSxJQUFJ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