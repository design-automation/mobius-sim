"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIAttribMapDict = void 0;
const common_1 = require("../common");
const GIAttribMapBase_1 = require("./GIAttribMapBase");
/**
 * Geo-info attribute class for one attribute.
 * The attributs stores key-value pairs.
 * Multiple keys point to the same value.
 * So for example, [[1,3], "a"],[[0,4], "b"] can be converted into sequential arrays.
 * The values would be ["a", "b"]
 * The keys would be [1,0,,0,1] (Note the undefined value in the middle.)
 *
 */
class GIAttribMapDict extends GIAttribMapBase_1.GIAttribMapBase {
    /**
     * Creates an attribute.
     * @param attrib_data
     */
    constructor(modeldata, name, ent_type, data_type) {
        super(modeldata, name, ent_type, data_type);
    }
    //  ===============================================================================================================
    //  Protected methods
    //  ===============================================================================================================
    /**
     * Check that the value is of the correct type for this attribute.
     * @param ent_i
     */
    _checkValType(val) {
        if (typeof val !== 'object') {
            throw new Error('Error setting attribute value. Attribute is of type "dict" but the value is not a dict.');
        }
    }
    /**
     * Gets the value for a given index.
     * @param ent_i
     */
    _getVal(val_i) {
        if (val_i === undefined) {
            return undefined;
        }
        return this.modeldata.model.metadata.getValFromIdx(val_i, this._data_type); // deep copy
    }
    /**
     * Gets the index for a given value.
     * @param ent_i
     */
    _getValIdx(val) {
        return this.modeldata.model.metadata.getIdxFromKey(this._valToValkey(val), this._data_type);
    }
    /**
     * Get the index for a given value, if it does not exist add it.
     * @param ent_i
     */
    _getAddValIdx(val) {
        const val_k = this._valToValkey(val);
        if (this.modeldata.model.metadata.hasKey(val_k, this._data_type)) {
            return this.modeldata.model.metadata.getIdxFromKey(val_k, this._data_type);
        }
        return this.modeldata.model.metadata.addByKeyVal(val_k, val, this._data_type);
    }
    /**
     * Convert a value into a map key
     */
    _valToValkey(val) {
        // if (typeof val !== 'object') {
        //     throw new Error('Value must be of type "object".');
        // }
        return JSON.stringify(val);
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
        // check the null search case
        if (search_val === null) {
            if (operator !== common_1.EFilterOperatorTypes.IS_EQUAL && operator !== common_1.EFilterOperatorTypes.IS_NOT_EQUAL) {
                {
                    throw new Error('Query operator "' + operator + '" and query "null" value are incompatible.');
                }
            }
        }
        // search
        if (search_val !== null && typeof search_val !== 'object') {
            throw new Error('Query search value "' + search_val + '" is not an dictionary.');
        }
        // first deal with null cases
        if (search_val === null && operator === common_1.EFilterOperatorTypes.IS_EQUAL) {
            return this.getEntsWithoutVal(ents_i);
        }
        else if (search_val === null && operator === common_1.EFilterOperatorTypes.IS_NOT_EQUAL) {
            return this.getEntsWithVal(ents_i);
        }
        // search
        let found_keys;
        switch (operator) {
            case common_1.EFilterOperatorTypes.IS_EQUAL:
                found_keys = this.getEntsFromVal(search_val);
                if (found_keys === undefined) {
                    return [];
                }
                return ents_i.filter(ent_i => found_keys.indexOf(ent_i) !== -1);
            case common_1.EFilterOperatorTypes.IS_NOT_EQUAL:
                found_keys = this.getEntsFromVal(search_val);
                if (found_keys === undefined) {
                    return [];
                }
                return ents_i.filter(ent_i => found_keys.indexOf(ent_i) === -1);
            case common_1.EFilterOperatorTypes.IS_GREATER:
            case common_1.EFilterOperatorTypes.IS_GREATER_OR_EQUAL:
            case common_1.EFilterOperatorTypes.IS_LESS:
            case common_1.EFilterOperatorTypes.IS_LESS_OR_EQUAL:
                throw new Error('Query error: Operator not allowed with values of type "dict".');
            default:
                throw new Error('Query error: Operator not found.');
        }
    }
    /**
     * Executes a query for an valued in an object, identified by a key
     * @param ents_i
     * @param key The key of the value in the object
     * @param operator The relational operator, ==, !=, <=, >=, etc
     * @param search_val The value to search, string or number, or any[].
     */
    queryDictKeyVal(ents_i, key, operator, search_val) {
        // check the null search case
        if (search_val === null) {
            if (operator !== common_1.EFilterOperatorTypes.IS_EQUAL && operator !== common_1.EFilterOperatorTypes.IS_NOT_EQUAL) {
                {
                    throw new Error('Query operator "' + operator + '" and query "null" value are incompatible.');
                }
            }
        }
        // check
        if (typeof key !== 'string') {
            throw new Error('Query index "' + key + '" must be of type "string".');
        }
        // search        // do the search
        const found_ents_i = [];
        for (const ent_i of ents_i) {
            const search_value_arr = this.getEntVal(ent_i);
            if (search_value_arr !== undefined) {
                const comp = this._compare(operator, search_value_arr[key], search_val);
                if (comp) {
                    found_ents_i.push(ent_i);
                }
            }
        }
        return found_ents_i;
    }
}
exports.GIAttribMapDict = GIAttribMapDict;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJNYXBEaWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9hdHRyaWJfY2xhc3Nlcy9HSUF0dHJpYk1hcERpY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0NBQWtHO0FBRWxHLHVEQUFvRDtBQUVwRDs7Ozs7Ozs7R0FRRztBQUNILE1BQWEsZUFBaUIsU0FBUSxpQ0FBZTtJQUNqRDs7O09BR0c7SUFDSCxZQUFZLFNBQXNCLEVBQUUsSUFBWSxFQUFFLFFBQWtCLEVBQUUsU0FBOEI7UUFDaEcsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDRCxtSEFBbUg7SUFDbkgscUJBQXFCO0lBQ3JCLG1IQUFtSDtJQUNuSDs7O09BR0c7SUFDTyxhQUFhLENBQUMsR0FBcUI7UUFDekMsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7WUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5RkFBeUYsQ0FBQyxDQUFDO1NBQzlHO0lBQ0wsQ0FBQztJQUNEOzs7T0FHRztJQUNPLE9BQU8sQ0FBQyxLQUFhO1FBQzNCLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUFFLE9BQU8sU0FBUyxDQUFDO1NBQUU7UUFDOUMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxZQUFZO0lBQzVGLENBQUM7SUFDRDs7O09BR0c7SUFDTyxVQUFVLENBQUMsR0FBcUI7UUFDdEMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2hHLENBQUM7SUFD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