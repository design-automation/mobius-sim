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
export class GIAttribMapDict extends GIAttribMapBase {
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
            if (operator !== EFilterOperatorTypes.IS_EQUAL && operator !== EFilterOperatorTypes.IS_NOT_EQUAL) {
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
            if (operator !== EFilterOperatorTypes.IS_EQUAL && operator !== EFilterOperatorTypes.IS_NOT_EQUAL) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJNYXBEaWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9hdHRyaWJfY2xhc3Nlcy9HSUF0dHJpYk1hcERpY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFtRCxvQkFBb0IsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUVsRyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFcEQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLE9BQU8sZUFBaUIsU0FBUSxlQUFlO0lBQ2pEOzs7T0FHRztJQUNILFlBQVksU0FBc0IsRUFBRSxJQUFZLEVBQUUsUUFBa0IsRUFBRSxTQUE4QjtRQUNoRyxLQUFLLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNELG1IQUFtSDtJQUNuSCxxQkFBcUI7SUFDckIsbUhBQW1IO0lBQ25IOzs7T0FHRztJQUNPLGFBQWEsQ0FBQyxHQUFxQjtRQUN6QyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLHlGQUF5RixDQUFDLENBQUM7U0FDOUc7SUFDTCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ08sT0FBTyxDQUFDLEtBQWE7UUFDM0IsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQUUsT0FBTyxTQUFTLENBQUM7U0FBRTtRQUM5QyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFlBQVk7SUFDNUYsQ0FBQztJQUNEOzs7T0FHRztJQUNPLFVBQVUsQ0FBQyxHQUFxQjtRQUN0QyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFlB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