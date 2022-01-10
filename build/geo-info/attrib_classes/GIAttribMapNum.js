"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIAttribMapNum = void 0;
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
class GIAttribMapNum extends GIAttribMapBase_1.GIAttribMapBase {
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
        if (typeof val !== 'number') {
            throw new Error('Error setting attribute value. Attribute is of type "number" but the value is not a number.');
        }
    }
    /**
     * Gets the value for a given index.
     * @param ent_i
     */
    _getVal(val_i) {
        return val_i;
    }
    /**
     * Gets the index for a given value.
     * @param ent_i
     */
    _getValIdx(val) {
        return val;
    }
    /**
     * Get the index for a given value, if it does not exist add it.
     * @param ent_i
     */
    _getAddValIdx(val) {
        return val;
    }
    /**
     * Convert a value into a map key
     */
    _valToValkey(val) {
        return val;
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
        if (search_val !== null && typeof search_val !== 'number') {
            throw new Error('Query search value "' + search_val + '" is not a number.');
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
                found_keys = [];
                for (const ent_i of ents_i) {
                    const val = this.getEntVal(ent_i);
                    if ((val !== null && val !== undefined) && this._compare(operator, val, search_val)) {
                        found_keys.push(ent_i);
                    }
                }
                return found_keys;
            default:
                throw new Error('Query error: Operator not found.');
        }
    }
}
exports.GIAttribMapNum = GIAttribMapNum;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJNYXBOdW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWJzL2dlby1pbmZvL2F0dHJpYl9jbGFzc2VzL0dJQXR0cmliTWFwTnVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUFrRztBQUNsRyx1REFBb0Q7QUFHcEQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFhLGNBQWUsU0FBUSxpQ0FBZTtJQUMvQzs7O09BR0c7SUFDSCxZQUFZLFNBQXNCLEVBQUUsSUFBWSxFQUFFLFFBQWtCLEVBQUUsU0FBOEI7UUFDaEcsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDRCxtSEFBbUg7SUFDbkgscUJBQXFCO0lBQ3JCLG1IQUFtSDtJQUNuSDs7O09BR0c7SUFDTyxhQUFhLENBQUMsR0FBcUI7UUFDekMsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7WUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2RkFBNkYsQ0FBQyxDQUFDO1NBQ2xIO0lBQ0wsQ0FBQztJQUNEOzs7T0FHRztJQUNPLE9BQU8sQ0FBQyxLQUFhO1FBQzNCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDRDs7O09BR0c7SUFDTyxVQUFVLENBQUMsR0FBcUI7UUFDdEMsT0FBTyxHQUFhLENBQUM7SUFDekIsQ0FBQztJQUNEOzs7T0FHRztJQUNPLGFBQWEsQ0FBQyxHQUFxQjtRQUN6QyxPQUFPLEdBQWEsQ0FBQztJQUN6QixDQUFDO0lBQ0Q7O09BRUc7SUFDTyxZQUFZLENBQUMsR0FBcUI7UUFDeEMsT0FBTyxHQUFhLENBQUM7SUFDekIsQ0FBQztJQUNELCtGQUErRjtJQUMvRixrQ0FBa0M7SUFDbEMsK0ZBQStGO0lBQy9GOzs7Ozs7OztPQVFHO0lBQ0ksUUFBUSxDQUFDLE1BQWdCLEVBQUUsUUFBOEIsRUFBRSxVQUE0QjtRQUMxRiw2QkFBNkI7UUFDN0IsSUFB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