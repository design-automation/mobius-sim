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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJNYXBEaWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vYXR0cmliX2NsYXNzZXMvR0lBdHRyaWJNYXBEaWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUFrRztBQUVsRyx1REFBb0Q7QUFFcEQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFhLGVBQWlCLFNBQVEsaUNBQWU7SUFDakQ7OztPQUdHO0lBQ0gsWUFBWSxTQUFzQixFQUFFLElBQVksRUFBRSxRQUFrQixFQUFFLFNBQThCO1FBQ2hHLEtBQUssQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsbUhBQW1IO0lBQ25ILHFCQUFxQjtJQUNyQixtSEFBbUg7SUFDbkg7OztPQUdHO0lBQ08sYUFBYSxDQUFDLEdBQXFCO1FBQ3pDLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMseUZBQXlGLENBQUMsQ0FBQztTQUM5RztJQUNMLENBQUM7SUFDRDs7O09BR0c7SUFDTyxPQUFPLENBQUMsS0FBYTtRQUMzQixJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFBRSxPQUFPLFNBQVMsQ0FBQztTQUFFO1FBQzlDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsWUFBWTtJQUM1RixDQUFDO0lBQ0Q7OztPQUdHO0lBQ08sVUFBVSxDQUFDLEdBQXFCO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBQ0Q7OztPQUdHO0lBQ08sYUFBYSxDQUFDLEdBQXFCO1FBQ3pDLE1BQU0sS0FBSyxHQUFvQixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQzlELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzlFO1FBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFDRDs7T0FFRztJQUNPLFlBQVksQ0FBQyxHQUFxQjtRQUN4QyxpQ0FBaUM7UUFDakMsMERBQTBEO1FBQzFELElBQUk7UUFDSixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELCtGQUErRjtJQUMvRixrQ0FBa0M7SUFDbEMsK0ZBQStGO0lBQy9GOzs7Ozs7OztPQVFHO0lBQ0ksUUFBUSxDQUFDLE1BQWdCLEVBQUUsUUFBOEIsRUFBRSxVQUE0QjtRQUMxRiw2QkFBNkI7UUFDN0IsSUFBSSxVQUFVLEtBQUssSUFBSSxFQUFFO1lBQ3JCLElBQUksUUFBUSxLQUFLLDZCQUFvQixDQUFDLFFBQVEsSUFBSSxRQUFRLEtBQUssNkJBQW9CLENBQUMsWUFBWSxFQUFFO2dCQUM5RjtvQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixHQUFHLFFBQVEsR0FBRyw0Q0FBNEMsQ0FBQyxDQUFDO2lCQUFFO2FBQ3JHO1NBQ0o7UUFDRCxTQUFTO1FBQ1QsSUFBSSxVQUFVLEtBQUssSUFBSSxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtZQUN2RCxNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixHQUFHLFVBQVUsR0FBRyx5QkFBeUIsQ0FBQyxDQUFDO1NBQ3BGO1FBQ0QsNkJBQTZCO1FBQzdCLElBQUksVUFBVSxLQUFLLElBQUksSUFBSSxRQUFRLEtBQUssNkJBQW9CLENBQUMsUUFBUSxFQUFHO1lBQ3BFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3pDO2FBQU0sSUFBSSxVQUFVLEtBQUssSUFBSSxJQUFJLFFBQVEsS0FBSyw2QkFBb0IsQ0FBQyxZQUFZLEVBQUc7WUFDL0UsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3RDO1FBQ0QsU0FBUztRQUNULElBQUksVUFBb0IsQ0FBQztRQUN6QixRQUFRLFFBQVEsRUFBRTtZQUNkLEtBQUssNkJBQW9CLENBQUMsUUFBUTtnQkFDOUIsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzdDLElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtvQkFBRSxPQUFPLEVBQUUsQ0FBQztpQkFBRTtnQkFDNUMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLEtBQUssNkJBQW9CLENBQUMsWUFBWTtnQkFDbEMsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzdDLElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtvQkFBRSxPQUFPLEVBQUUsQ0FBQztpQkFBRTtnQkFDNUMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLEtBQUssNkJBQW9CLENBQUMsVUFBVSxDQUFDO1lBQ3JDLEtBQUssNkJBQW9CLENBQUMsbUJBQW1CLENBQUM7WUFDOUMsS0FBSyw2QkFBb0IsQ0FBQyxPQUFPLENBQUM7WUFDbEMsS0FBSyw2QkFBb0IsQ0FBQyxnQkFBZ0I7Z0JBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQztZQUNyRjtnQkFDSSxNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7U0FDM0Q7SUFDTCxDQUFDO0lBQ0Q7Ozs7OztPQU1HO0lBQ0ksZUFBZSxDQUFDLE1BQWdCLEVBQUUsR0FBVyxFQUNoRCxRQUE4QixFQUFFLFVBQTRCO1FBQzVELDZCQUE2QjtRQUM3QixJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUU7WUFDckIsSUFBSSxRQUFRLEtBQUssNkJBQW9CLENBQUMsUUFBUSxJQUFJLFFBQVEsS0FBSyw2QkFBb0IsQ0FBQyxZQUFZLEVBQUU7Z0JBQzlGO29CQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLEdBQUcsUUFBUSxHQUFHLDRDQUE0QyxDQUFDLENBQUM7aUJBQUU7YUFDckc7U0FDSjtRQUNELFFBQVE7UUFDUixJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsR0FBRyxHQUFHLEdBQUcsNkJBQTZCLENBQUMsQ0FBQztTQUMxRTtRQUNELGlDQUFpQztRQUNqQyxNQUFNLFlBQVksR0FBYSxFQUFFLENBQUM7UUFDbEMsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7WUFDeEIsTUFBTSxnQkFBZ0IsR0FBcUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQXFCLENBQUM7WUFDckYsSUFBSSxnQkFBZ0IsS0FBSyxTQUFTLEVBQUU7Z0JBQ2hDLE1BQU0sSUFBSSxHQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUNqRixJQUFLLElBQUksRUFBRztvQkFDUixZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUM1QjthQUNKO1NBQ0o7UUFDRCxPQUFPLFlBQVksQ0FBQztJQUN4QixDQUFDO0NBQ0o7QUF4SUQsMENBd0lDIn0=