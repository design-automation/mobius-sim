/**
 * Generates a list of integers, from start to end, with a step size of 1
 * Generates a list of integers, from start to end, with a specified step size
 *
 * @param start The start of the range, inclusive.
 * @param end (Optional) The end of the range, exclusive.
 * @param step (Optional) The step size.
 */
export declare function range(debug: boolean, start: number, end?: number, step?: number): number[];
/**
 * Returns the number of times the value is in the list
 *
 * @param list The list.
 * @param val The value, can be aby type.
 */
export declare function listCount(debug: boolean, list: any[], val: any): number;
/**
 * Returns a shallow copy of the list.
 *
 * @param list The list.
 */
export declare function listCopy(debug: boolean, list: any[]): any[];
/**
 * Returns a new list that repeats the contents of the input list n times.
 *
 * @param list The list.
 * @param n
 */
export declare function listRep(debug: boolean, list: any, n: number): any[];
/**
 * Returns the item in the list specified by index, either a positive or negative integer.
 *
 * @param list  The list.
 * @param idx The index, an integer or a list of integers.
 */
export declare function listGet(debug: boolean, list: any[], idx: number | number[]): any | any[];
/**
 * Returns the index of the first occurence of the value in the list.
 *
 * If the value does not exist, returns null.
 *
 * @param list The list.
 * @param val The value, can be of any type.
 */
export declare function listFind(debug: boolean, list: any[], val: any): number;
/**
 * Returns true if the list contains the value, false otherwise
 *
 * @param list The list.
 * @param val The value, can be any type.
 */
export declare function listHas(debug: boolean, list: any[], val: any): boolean;
/**
 * Joins two or more lists into a single list.
 *
 * If the arguments are not lists, then they will be converted into lists.
 *
 * This functions accepts any number of arguments.
 *
 * @param list1 The first list.
 * @param list2 The second list.
 */
export declare function listJoin(debug: boolean, list1: any[], list2: any[]): any[];
/**
 * Returns a flattened copy of the list.
 *
 * If no depth is specified, then it is flattened my the maximum amount.
 *
 * @param list The list.
 * @param depth (Optional) The depth to flatten to, an integer.
 */
export declare function listFlat(debug: boolean, list: any[], depth?: number): any[];
/**
 * Return a list that is rotated, i.e. items from the end of the list are moved to the start of the list.
 * For a positive rotation, items are move from the end to the start of the list.
 * For a negative rotation, items are moved from the start to the end of the list.
 *
 * @param list The list.
 * @param rot The number of items to rotate, an integer.
 */
export declare function listRot(debug: boolean, list: any[], rot: number): any[];
/**
 * Return a sub-list from the list.
 *
 * @param list The list.
 * @param start The start index of the slice operation, an integer.
 * @param end (Optional) The end index of the slice operation, an integer. Defaults to the length of the list.
 */
export declare function listSlice(debug: boolean, list: any[], start: number, end?: number): any[];
/**
 * Creates a new list, with the items in reverse order.
 *
 * @param lists  The list to reverse.
 */
export declare function listRev(debug: boolean, list: any[]): any[];
/**
 * Returns a new list of all the values that evaluate to true.
 *
 * If the second argument is provided, then it
 * returns a new list of all the values in list1 that evaluate to true in list2.
 *
 * @param list1 The list.
 * @param list2 (Optional) A list of values, to be used to cull the first list.
 */
export declare function listCull(debug: boolean, list1: any[], list2?: any[]): any[];
/**
 * Creates a new list, with the items in sorted order.
 *
 * If no second argument is provided, then the list is sorted in ascending order.
 *
 * If a second argument is provided, then it should be a list of the same length as the first argument.
 * In this case, the first list is sorted according to ascending order of the values in the second list.
 *
 * @param lists  The list of lists.
 */
export declare function listSort(debug: boolean, list1: any[], list2?: any[]): any[];
/**
 * Converts a set of lists from rows into columns.
 *
 * If no second argument is provided, it assume the the first argument consists of a list of lists.
 *
 * If a second argument is provided, then it should be a list of the same length as the first argument.
 * In this case, the items in the first and second lists are reaarranged to generate a new set of lists.
 *
 * This function also accepts additional lists of arguments.
 *
 * @param list1  The first row list.
 * @param list2  (Optional) The second row list, which must have the same length as the first.
 */
export declare function listZip(debug: boolean, list1: any[], list2?: any[]): any[];
/**
 * Returns true if the values in the two lists are equal.
 *
 * @param list1 The first list.
 * @param list2 The second list.
 */
export declare function listEq(debug: boolean, list1: any[], list2: any[]): boolean;
