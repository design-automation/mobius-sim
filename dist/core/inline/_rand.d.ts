/**
 * Returns a random number in the specified range
 * Returns a random number in the specified range, given a numeric seed
 * @param min
 * @param max
 * @param seed
 */
export declare function rand(debug: boolean, min: number, max: number, seed?: number): number;
/**
 * Returns a random integer in the specified range
 * Returns a random integer in the specified range, given a numeric seed
 * @param min
 * @param max
 * @param seed
 */
export declare function randInt(debug: boolean, min: number, max: number, seed?: number): number;
/**
 * Returns a random set of items from the list
 * Returns a random set of items from the list, given a numeric seed
 * @param list
 * @param num
 * @param seed
 */
export declare function randPick(debug: boolean, list: any[], num: number, seed?: number): number | number[];
