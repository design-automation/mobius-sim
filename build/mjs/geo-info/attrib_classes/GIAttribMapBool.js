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
export class GIAttribMapBool extends GIAttribMapBase {
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
            if (operator !== EFilterOperatorTypes.IS_EQUAL && operator !== EFilterOperatorTypes.IS_NOT_EQUAL) {
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
                throw new Error('Query error: Operator not allowed with boolean values.');
            default:
                throw new Error('Query error: Operator not found.');
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJNYXBCb29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9hdHRyaWJfY2xhc3Nlcy9HSUF0dHJpYk1hcEJvb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFtRCxvQkFBb0IsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNsRyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHcEQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLE9BQU8sZUFBZ0IsU0FBUSxlQUFlO0lBQ2hEOzs7T0FHRztJQUNILFlBQVksU0FBc0IsRUFBRSxJQUFZLEVBQUUsUUFBa0IsRUFBRSxTQUE4QjtRQUNoRyxLQUFLLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNELG1IQUFtSDtJQUNuSCxxQkFBcUI7SUFDckIsbUhBQW1IO0lBQ25IOzs7T0FHRztJQUNPLGFBQWEsQ0FBQyxHQUFxQjtRQUN6QyxJQUFJLE9BQU8sR0FBRyxLQUFLLFNBQVMsRUFBRTtZQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLCtGQUErRixDQUFDLENBQUM7U0FDcEg7SUFDTCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ08sT0FBTyxDQUFDLEtBQWE7UUFDM0IsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQUUsT0FBTyxTQUFTLENBQUM7U0FBRTtRQUM5QyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFDRDs7O09BR0c7SUFDTyxVQUFVLENBQUMsR0FBWTtRQUM3QixPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUNEOzs7T0FHRztJQUNPLGFBQWEsQ0FBQyxHQUFxQjtRQUN6QyxPQUFPLEdBQUcsQ0FB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