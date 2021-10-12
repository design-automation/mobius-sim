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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJNYXBCb29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vYXR0cmliX2NsYXNzZXMvR0lBdHRyaWJNYXBCb29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUFrRztBQUNsRyx1REFBb0Q7QUFHcEQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFhLGVBQWdCLFNBQVEsaUNBQWU7SUFDaEQ7OztPQUdHO0lBQ0gsWUFBWSxTQUFzQixFQUFFLElBQVksRUFBRSxRQUFrQixFQUFFLFNBQThCO1FBQ2hHLEtBQUssQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsbUhBQW1IO0lBQ25ILHFCQUFxQjtJQUNyQixtSEFBbUg7SUFDbkg7OztPQUdHO0lBQ08sYUFBYSxDQUFDLEdBQXFCO1FBQ3pDLElBQUksT0FBTyxHQUFHLEtBQUssU0FBUyxFQUFFO1lBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0ZBQStGLENBQUMsQ0FBQztTQUNwSDtJQUNMLENBQUM7SUFDRDs7O09BR0c7SUFDTyxPQUFPLENBQUMsS0FBYTtRQUMzQixJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFBRSxPQUFPLFNBQVMsQ0FBQztTQUFFO1FBQzlDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNEOzs7T0FHRztJQUNPLFVBQVUsQ0FBQyxHQUFZO1FBQzdCLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQ0Q7OztPQUdHO0lBQ08sYUFBYSxDQUFDLEdBQXFCO1FBQ3pDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQ0Q7O09BRUc7SUFDTyxZQUFZLENBQUMsR0FBcUI7UUFDeEMsSUFBSSxHQUFHLEVBQUU7WUFDTCxPQUFPLENBQUMsQ0FBQztTQUNaO2FBQU07WUFDSCxPQUFPLENBQUMsQ0FBQztTQUNaO0lBQ0wsQ0FBQztJQUNELG1IQUFtSDtJQUNuSCxrQkFBa0I7SUFDbEIsbUhBQW1IO0lBQ25IOzs7Ozs7OztPQVFHO0lBQ0ksUUFBUSxDQUFDLE1BQWdCLEVBQUUsUUFBOEIsRUFBRSxVQUE0QjtRQUMxRiw2QkFBNkI7UUFDN0IsSUFBSSxVQUFVLEtBQUssSUFBSSxFQUFFO1lBQ3JCLElBQUksUUFBUSxLQUFLLDZCQUFvQixDQUFDLFFBQVEsSUFBSSxRQUFRLEtBQUssNkJBQW9CLENBQUMsWUFBWSxFQUFFO2dCQUM5RjtvQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixHQUFHLFFBQVEsR0FBRyw0Q0FBNEMsQ0FBQyxDQUFDO2lCQUFFO2FBQ3JHO1NBQ0o7UUFDRCxTQUFTO1FBQ1QsSUFBSSxVQUFVLEtBQUssSUFBSSxJQUFJLE9BQU8sVUFBVSxLQUFLLFNBQVMsRUFBRTtZQUN4RCxNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixHQUFHLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQyxDQUFDO1NBQ2hGO1FBQ0QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsVUFBcUIsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDRDs7T0FFRztJQUNPLGNBQWMsQ0FBQyxNQUFnQixFQUFFLFFBQThCLEVBQUUsVUFBbUI7UUFDMUYsNkJBQTZCO1FBQzdCLElBQUksVUFBVSxLQUFLLElBQUksSUFBSSxRQUFRLEtBQUssNkJBQW9CLENBQUMsUUFBUSxFQUFHO1lBQ3BFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3pDO2FBQU0sSUFBSSxVQUFVLEtBQUssSUFBSSxJQUFJLFFBQVEsS0FBSyw2QkFBb0IsQ0FBQyxZQUFZLEVBQUc7WUFDL0UsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3RDO1FBQ0QsU0FBUztRQUNULElBQUksVUFBb0IsQ0FBQztRQUN6QixRQUFRLFFBQVEsRUFBRTtZQUNkLEtBQUssNkJBQW9CLENBQUMsUUFBUTtnQkFDOUIsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzdDLElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtvQkFBRSxPQUFPLEVBQUUsQ0FBQztpQkFBRTtnQkFDNUMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLEtBQUssNkJBQW9CLENBQUMsWUFBWTtnQkFDbEMsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzdDLElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtvQkFBRSxPQUFPLEVBQUUsQ0FBQztpQkFBRTtnQkFDNUMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLEtBQUssNkJBQW9CLENBQUMsVUFBVSxDQUFDO1lBQ3JDLEtBQUssNkJBQW9CLENBQUMsbUJBQW1CLENBQUM7WUFDOUMsS0FBSyw2QkFBb0IsQ0FBQyxPQUFPLENBQUM7WUFDbEMsS0FBSyw2QkFBb0IsQ0FBQyxnQkFBZ0I7Z0JBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsd0RBQXdELENBQUMsQ0FBQztZQUM5RTtnQkFDSSxNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7U0FDM0Q7SUFDTCxDQUFDO0NBQ0o7QUEzR0QsMENBMkdDIn0=