"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIAttribMapBool = void 0;
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
class GIAttribMapBool extends GIAttribMapBase_1.GIAttribMapBase {
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
        if (typeof val !== 'boolean') {
            throw new Error('Error setting attribute value. Attribute is of type "boolean" but the value is not a boolean.');
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
        return [false, true][val_i];
    }
    /**
     * Gets the index for a given value.
     * @param ent_i
     */
    _getValIdx(val) {
        return val ? 1 : 0;
    }
    /**
     * Get the index for a given value, if it does not exist add it.
     * @param ent_i
     */
    _getAddValIdx(val) {
        return val ? 1 : 0;
    }
    /**
     * Convert a value into a map key
     */
    _valToValkey(val) {
        if (val) {
            return 1;
        }
        else {
            return 0;
        }
    }
    //  ===============================================================================================================
    //  Public methods
    //  ===============================================================================================================
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
        if (search_val !== null && typeof search_val !== 'boolean') {
            throw new Error('Query search value "' + search_val + '" is not a boolean.');
        }
        return this._searchBoolVal(ents_i, operator, search_val);
    }
    /**
     * Searches for the boolean value using the operator
     */
    _searchBoolVal(ents_i, operator, search_val) {
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
                throw new Error('Query error: Operator not allowed with boolean values.');
            default:
                throw new Error('Query error: Operator not found.');
        }
    }
}
exports.GIAttribMapBool = GIAttribMapBool;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJNYXBCb29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGlicy9nZW8taW5mby9hdHRyaWJfY2xhc3Nlcy9HSUF0dHJpYk1hcEJvb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0NBQWtHO0FBQ2xHLHVEQUFvRDtBQUdwRDs7Ozs7Ozs7R0FRRztBQUNILE1BQWEsZUFBZ0IsU0FBUSxpQ0FBZTtJQUNoRDs7O09BR0c7SUFDSCxZQUFZLFNBQXNCLEVBQUUsSUFBWSxFQUFFLFFBQWtCLEVBQUUsU0FBOEI7UUFDaEcsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDRCxtSEFBbUg7SUFDbkgscUJBQXFCO0lBQ3JCLG1IQUFtSDtJQUNuSDs7O09BR0c7SUFDTyxhQUFhLENBQUMsR0FBcUI7UUFDekMsSUFBSSxPQUFPLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQywrRkFBK0YsQ0FBQyxDQUFDO1NBQ3BIO0lBQ0wsQ0FBQztJQUNEOzs7T0FHRztJQUNPLE9BQU8sQ0FBQyxLQUFhO1FBQzNCLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUFFLE9BQU8sU0FBUyxDQUFDO1NBQUU7UUFDOUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBQ0Q7OztPQUdHO0lBQ08sVUFBVSxDQUFDLEdBQVk7UUFDN0IsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFDRDs7O09BR0c7SUFDTyxhQUFhLENBQUMsR0FBcUI7UUFDekMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFDRDs7T0FFRztJ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