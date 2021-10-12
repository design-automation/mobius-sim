/**
 * Returns the item in the dictionary specified by key.
 * If the key does nto exist, undefined is returned.
 *
 * If a list of keys is provided, then a list of values will be returned.
 *
 * @param dict The dictionary.
 * @param key The key, either a single string or a list of strings.
 */
export declare function dictGet(debug: boolean, dict: object, key: string | string[]): any | any[];
/**
 * Returns an array of all the keys in a dictionary.
 *
 * @param dict The dictionary.
 */
export declare function dictKeys(debug: boolean, dict: object): string[];
/**
 * Returns an array of all the values in a dictionary.
 *
 * @param dict The dictionary.
 */
export declare function dictVals(debug: boolean, dict: object): string[];
/**
 * Returns true if the dictionary contains the given key, false otherwsie.
 *
 * If a list of keys is given, a list of true/false values will be returned.
 *
 * @param dict The dictionary.
 * @param key The key, either a string or a list of strings.
 */
export declare function dictHasKey(debug: boolean, dict: object, key: string | string[]): boolean | boolean[];
/**
 * Returns true if the dictionary contains the given value, false otherwsie.
 *
 * @param dict The dictionary.
 * @param val The value to seach for, can be any type.
 */
export declare function dictHasVal(debug: boolean, dict: object, val: any): boolean;
/**
 * Returns the first key in the dictionary that has the given value.
 *
 * If the value does not exist, returns null.
 *
 * @param dict The dictionary.
 * @param val The value, can be any type.
 */
export declare function dictFind(debug: boolean, dict: object, val: any | any[]): string;
/**
 * Returns a deep copy of the dictionary.
 *
 * A deep copy means that changing values in the copied dictionary will not affect the original dictionary.
 *
 * @param dict The dictionary.
 */
export declare function dictCopy(debug: boolean, dict: object): object;
/**
 * Returns true if the values in the two dictionaries are equal.
 *
 * Performs a deep comparison between values to determine if they are equivalent.
 *
 * @param dict1 The first dictionary.
 * @param dict2 The second dictionary.
 */
export declare function dictEq(debug: boolean, dict1: any[], dict2: any[]): boolean;
