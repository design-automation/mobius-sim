/**
 * Remove an item from an array
 * Return teh index where the item was removed.
 * Returns -1 if teh item was not found.
 * @param arr
 * @param item
 */
export declare function arrRem(arr: any[], item: any): number;
/**
 * Remove an item from an array
 * Treats array as set of unique items
 * @param arr
 * @param item
 */
export declare function arrAddToSet(arr: any[], item: any): number;
/**
 * Add an item to an array in an array
 * @param arr
 * @param item
 */
export declare function arrIdxAdd(arr: any[], idx: number, item: any): void;
/**
 * Remove an item from an array in an array
 * @param arr
 * @param item
 */
export declare function arrIdxRem(arr: any[], idx: number, item: any, del_empty: boolean): void;
/**
 * Make flat array (depth = 1) from anything.
 * \n
 * If it is not an array, then make it an array
 * \n
 * If it is an array, then make it flat
 * \n
 * @param data
 */
export declare function arrMakeFlat(data: any): any[];
/**
 * Maximum depth of an array
 * @param data
 */
export declare function arrMaxDepth(data: any[]): number;
/**
 * Converts a value to an array of specified length.
 * \n
 * @param data
 */
export declare function arrFill(data: any, length: number): any[];
export declare function getArrDepth(arr: any): number;
export declare function isEmptyArr(arr: any): boolean;
