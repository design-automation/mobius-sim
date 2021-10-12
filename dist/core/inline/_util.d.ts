/**
 * Returns true if the absolute difference between the two numbers is less than the tolerance, t
 * @param n1
 * @param n2
 * @param t
 */
export declare function isApprox(debug: boolean, n1: number, n2: number, t: number): boolean;
/**
 * Returns v1 < v2 < v3.
 * @param v1
 * @param v2
 * @param v3
 */
export declare function isIn(debug: boolean, v1: any, v2: any, v3: any): boolean;
/**
 * Returns v1 <= v2 <= v3.
 * @param v1
 * @param v2
 * @param v3
 */
export declare function isWithin(debug: boolean, v1: any, v2: any, v3: any): boolean;
