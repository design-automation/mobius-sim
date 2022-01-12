import { EFilterOperatorTypes } from '../common';
import { GIAttribMapBase } from './GIAttribMapBase';
/**
 * Geo-info attribute class for one attribute.
 * The attributs stores key-value pairs.
 * Multiple keys point to the same value.
 * So for example, [[1,3], "a"],[[0,4], "b"] can be converted into sequential arrays.
 * The values would be ["a", "b"]
 * The keys would be [1,0,,0,1] (Note the undefined value in the middle.)
 *
 */
export class GIAttribMapNum extends GIAttribMapBase {
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
            if (operator !== EFilterOperatorTypes.IS_EQUAL && operator !== EFilterOperatorTypes.IS_NOT_EQUAL) {
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
        if (search_val === null && operator === EFilterOperatorTypes.IS_EQUAL) {
            return this.getEntsWithoutVal(ents_i);
        }
        else if (search_val === null && operator === EFilterOperatorTypes.IS_NOT_EQUAL) {
            return this.getEntsWithVal(ents_i);
        }
        // search
        let found_keys;
        switch (operator) {
            case EFilterOperatorTypes.IS_EQUAL:
                found_keys = this.getEntsFromVal(search_val);
                if (found_keys === undefined) {
                    return [];
                }
                return ents_i.filter(ent_i => found_keys.indexOf(ent_i) !== -1);
            case EFilterOperatorTypes.IS_NOT_EQUAL:
                found_keys = this.getEntsFromVal(search_val);
                if (found_keys === undefined) {
                    return [];
                }
                return ents_i.filter(ent_i => found_keys.indexOf(ent_i) === -1);
            case EFilterOperatorTypes.IS_GREATER:
            case EFilterOperatorTypes.IS_GREATER_OR_EQUAL:
            case EFilterOperatorTypes.IS_LESS:
            case EFilterOperatorTypes.IS_LESS_OR_EQUAL:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJNYXBOdW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWJzL2dlby1pbmZvL2F0dHJpYl9jbGFzc2VzL0dJQXR0cmliTWFwTnVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBbUQsb0JBQW9CLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDbEcsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBR3BEOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxPQUFPLGNBQWUsU0FBUSxlQUFlO0lBQy9DOzs7T0FHRztJQUNILFlBQVksU0FBc0IsRUFBRSxJQUFZLEVBQUUsUUFBa0IsRUFBRSxTQUE4QjtRQUNoRyxLQUFLLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNELG1IQUFtSDtJQUNuSCxxQkFBcUI7SUFDckIsbUhBQW1IO0lBQ25IOzs7T0FHRztJQUNPLGFBQWEsQ0FBQyxHQUFxQjtRQUN6QyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLDZGQUE2RixDQUFDLENBQUM7U0FDbEg7SUFDTCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ08sT0FBTyxDQUFDLEtBQWE7UUFDM0IsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUNEOzs7T0FHRztJQUNPLFVBQVUsQ0FBQyxHQUFxQjtRQUN0QyxPQUFPLEdBQWEsQ0FBQztJQUN6QixDQUFDO0lBQ0Q7OztPQUdHO0lBQ08sYUFBYSxDQUFDLEdBQXFCO1FBQ3pDLE9BQU8sR0FBYSxDQUFDO0lBQ3pCLENBQUM7SUFDRDs7T0FFRztJQUNPLFlBQVksQ0FBQyxHQUFxQjtRQUN4QyxPQUFPLEdBQWEsQ0FBQztJQUN6QixDQUFDO0lBQ0QsK0ZBQStGO0lBQy9GLGtDQUFrQztJQUNsQywrRkFBK0Y7SUFDL0Y7Ozs7Ozs7O09BUUc7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