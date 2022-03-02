"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIAttribMapBase = void 0;
const common_1 = require("../common");
const common_func_1 = require("../common_func");
const common_id_funcs_1 = require("../common_id_funcs");
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
class GIAttribMapBase {
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
     * Returns the SIM data for this attribute.
     * Returns null if there is no data.
     * If entset is null, then all ents are included.
     */
    getSIMData(ent_set) {
        const data_vals = [];
        const data_ents = [];
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
                data_vals.push(this._getVal(val_i));
                data_ents.push(ents_i);
            }
        }
        if (data_vals.length === 0) {
            return null;
        }
        return {
            name: this._name,
            data_type: this._data_type,
            data_vals: data_vals,
            data_ents: data_ents
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
            case common_1.EAttribDataTypeStrs.NUMBER:
            case common_1.EAttribDataTypeStrs.STRING:
            case common_1.EAttribDataTypeStrs.BOOLEAN:
                return 1;
            case common_1.EAttribDataTypeStrs.LIST:
                let max_len = 0;
                for (const val_i of this._map_val_i_to_ents_i.keys()) {
                    const val_len = this._getVal(val_i).length;
                    if (val_len > max_len) {
                        max_len = val_len;
                    }
                }
                return max_len;
            case common_1.EAttribDataTypeStrs.DICT:
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
        const ent_type_str = (0, common_func_1.getEntTypeStr)(this._ent_type);
        let err_msg = 'A attribute merge conflict has been detected. ' +
            'This node has two or more incoming links, and as a result the incoming entities will be merged, ' +
            'meaning that entities with the same ID will be merged into a single entity. ' +
            'If two entities have the same ID, but have different attributes, then it will result in a merge conflict. ';
        if (this._ent_type === common_1.EEntType.POSI && this._name === 'xyz') {
            const verts_i = this.modeldata.geom.nav.navPosiToVert(other_ent_i);
            const parent_obj_strs = [];
            for (const vert_i of verts_i) {
                const parent_obj = this.modeldata.geom.query.getTopoObj(common_1.EEntType.VERT, vert_i);
                const parent_obj_str = (0, common_id_funcs_1.idMake)(parent_obj[0], parent_obj[1]);
                parent_obj_strs.push(parent_obj_str);
            }
            err_msg = err_msg + '<br><br>' +
                'In this case, the conflict is caused by two positions with same ID but different XYZ coordinates.' +
                '<ul>' +
                '<li>The position causing the merge conflict is: "' + (0, common_id_funcs_1.idMake)(this._ent_type, other_ent_i) + '". </li>' +
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
        else if (this._ent_type > common_1.EEntType.POSI && this._ent_type < common_1.EEntType.POINT) {
            const parent_obj = this.modeldata.geom.query.getTopoObj(this._ent_type, other_ent_i);
            const parent_obj_str = (0, common_id_funcs_1.idMake)(parent_obj[0], parent_obj[1]);
            const parent_ent_type_str = (0, common_func_1.getEntTypeStr)(parent_obj[0]);
            err_msg = err_msg + '<br><br>' +
                'In this case, the conflict is caused by two ' + ent_type_str + ' with same ID but with different attributes.' +
                '<ul>' +
                '<li>The entity causing the merge conflict is: "' + (0, common_id_funcs_1.idMake)(this._ent_type, other_ent_i) + '". </li>' +
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
                '<li>The entity causing the merge conflict is: "' + (0, common_id_funcs_1.idMake)(this._ent_type, other_ent_i) + '". </li>' +
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
            case common_1.EFilterOperatorTypes.IS_EQUAL:
                return val1 === val2;
            // !=
            case common_1.EFilterOperatorTypes.IS_NOT_EQUAL:
                return val1 !== val2;
            // >
            case common_1.EFilterOperatorTypes.IS_GREATER:
                return val1 > val2;
            // >=
            case common_1.EFilterOperatorTypes.IS_GREATER_OR_EQUAL:
                return val1 >= val2;
            // <
            case common_1.EFilterOperatorTypes.IS_LESS:
                return val1 < val2;
            // <=
            case common_1.EFilterOperatorTypes.IS_LESS_OR_EQUAL:
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
exports.GIAttribMapBase = GIAttribMapBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJNYXBCYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9hdHRyaWJfY2xhc3Nlcy9HSUF0dHJpYk1hcEJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0NBQWtPO0FBQ2xPLGdEQUErQztBQUMvQyx3REFBNEM7QUFHNUM7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxNQUFhLGVBQWU7SUFVeEI7OztPQUdHO0lBQ0gsWUFBWSxTQUFzQixFQUFFLElBQVksRUFBRSxRQUFrQixFQUFFLFNBQThCO1FBQ2hHLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQzVCLFdBQVc7UUFDWCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLFdBQVcsQ0FBQyxPQUFxQjtRQUNwQyxNQUFNLElBQUksR0FBd0IsRUFBRSxDQUFDO1FBQ3JDLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxFQUFFO1lBQ2xELElBQUksTUFBZ0IsQ0FBQztZQUNyQixJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7Z0JBQ3ZCLFdBQVc7Z0JBQ1gsTUFBTSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUM1QztpQkFBTTtnQkFDSCxjQUFjO2dCQUNkLE1BQU0sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFFLEtBQUssQ0FBQyxF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