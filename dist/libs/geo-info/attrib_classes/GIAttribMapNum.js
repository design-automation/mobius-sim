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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJNYXBOdW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9hdHRyaWJfY2xhc3Nlcy9HSUF0dHJpYk1hcE51bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQ0FBa0c7QUFDbEcsdURBQW9EO0FBR3BEOzs7Ozs7OztHQVFHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsaUNBQWU7SUFDL0M7OztPQUdHO0lBQ0gsWUFBWSxTQUFzQixFQUFFLElBQVksRUFBRSxRQUFrQixFQUFFLFNBQThCO1FBQ2hHLEtBQUssQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsbUhBQW1IO0lBQ25ILHFCQUFxQjtJQUNyQixtSEFBbUg7SUFDbkg7OztPQUdHO0lBQ08sYUFBYSxDQUFDLEdBQXFCO1FBQ3pDLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkZBQTZGLENBQUMsQ0FBQztTQUNsSDtJQUNMLENBQUM7SUFDRDs7O09BR0c7SUFDTyxPQUFPLENBQUMsS0FBYTtRQUMzQixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBQ0Q7OztPQUdHO0lBQ08sVUFBVSxDQUFDLEdBQXFCO1FBQ3RDLE9BQU8sR0FBYSxDQUFDO0lBQ3pCLENBQUM7SUFDRDs7O09BR0c7SUFDTyxhQUFhLENBQUMsR0FBcUI7UUFDekMsT0FBTyxHQUFhLENBQUM7SUFDekIsQ0FBQztJQUNEOztPQUVHO0lBQ08sWUFBWSxDQUFDLEdBQXFCO1FBQ3hDLE9BQU8sR0FBYSxDQUFDO0lBQ3pCLENBQUM7SUFDRCwrRkFBK0Y7SUFDL0Ysa0NBQWtDO0lBQ2xDLCtGQUErRjtJQUMvRjs7Ozs7Ozs7T0FRRztJQUNJLFFBQVEsQ0FBQyxNQUFnQixFQUFFLFFBQThCLEVBQUUsVUFBNEI7UUFDMUYsNkJBQTZCO1FB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