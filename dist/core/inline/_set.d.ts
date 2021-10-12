/**
 * Set functions for working with sets, using lists as a data structure. Does not modify input list.
 */
/**
 * Generates a list of unique items.
 * @param list
 */
export declare function setMake(debug: boolean, list: any[]): any[];
/**
 * Generates a list of unique items from the union of the two input lists.
 * @param list1
 * @param list2
 */
export declare function setUni(debug: boolean, list1: any[], list2: any[]): any[];
/**
 * Generates a list of unique items from the intersection of the two input lists.
 * @param list1
 * @param list2
 */
export declare function setInt(debug: boolean, list1: any[], list2: any[]): any[];
/**
 * Generates a list of unique items from the difference of the two input lists.
 * @param list1
 * @param list2
 */
export declare function setDif(debug: boolean, list1: any[], list2: any[]): any[];
