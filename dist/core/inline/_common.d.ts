/**
 * Functions shared by lists, dicts, strings.
 */
/**
 * Returns the number of items in a list, a dictionary, or a string.
 * @param data
 */
export declare function len(debug: boolean, data: any): number;
/**
 * Makes a deep copy of a list or a dictionary.
 * @param data
 */
export declare function copy(debug: boolean, data: any): any;
/**
 * Returns true of the two lists or dictionaries are equal.
 * Performs a deep comparison between values to determine if they are equivalent.
 * @param data
 */
export declare function equal(debug: boolean, data1: any, data2: any): boolean;
