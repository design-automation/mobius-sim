import { Txyz, TPlane } from '../../libs/geo-info/common';
/**
 * Add multiple vectors
 * @param v
 */
export declare function vecSum(debug: boolean, ...v: Txyz[]): Txyz;
/**
 * Adds two vectors
 * @param v1
 * @param v2
 * @param norm
 */
export declare function vecAdd(debug: boolean, v1: Txyz | Txyz[], v2: Txyz | Txyz[], norm?: boolean): Txyz | Txyz[];
/**
 * Subtracts v2 from v1
 * @param v1
 * @param v2
 * @param norm
 */
export declare function vecSub(debug: boolean, v1: Txyz | Txyz[], v2: Txyz | Txyz[], norm?: boolean): Txyz | Txyz[];
/**
 * Divides a vector by a numbe
 * @param v
 * @param num
 */
export declare function vecDiv(debug: boolean, v: Txyz | Txyz[], num: number | number[]): Txyz | Txyz[];
/**
 * Multiplies a vector by a number
 * @param v
 * @param num
 */
export declare function vecMult(debug: boolean, v: Txyz | Txyz[], num: number | number[]): Txyz | Txyz[];
/**
 * Sets the magnitude of a vector
 * @param v
 * @param num
 */
export declare function vecSetLen(debug: boolean, v: Txyz | Txyz[], num: number | number[]): Txyz | Txyz[];
/**
 * Calculates the dot product of two vectors
 * @param v1
 * @param v2
 */
export declare function vecDot(debug: boolean, v1: Txyz | Txyz[], v2: Txyz | Txyz[]): number | number[];
/**
 * Calculates the cross product of two vectors
 * @param v1
 * @param v2
 */
export declare function vecCross(debug: boolean, v1: Txyz | Txyz[], v2: Txyz | Txyz[]): Txyz | Txyz[];
/**
 * Calculate the angle (0 to PI) between two vectors.
 * \n
 * The inner (smaller) angle is always returned, which will always be smaller than or equal to PI.
 * @param v1
 * @param v2
 */
export declare function vecAng(debug: boolean, v1: Txyz | Txyz[], v2: Txyz | Txyz[]): number | number[];
/**
 * Creates a vector between two points
 * @param xyz1
 * @param xyz2
 */
export declare function vecFromTo(debug: boolean, xyz1: Txyz | Txyz[], xyz2: Txyz | Txyz[]): Txyz | Txyz[];
/**
 * Returns true if the difference between two vectors is smaller than a specified tolerance
 * @param v1
 * @param v2
 * @param tol
 */
export declare function vecEqual(debug: boolean, v1: Txyz | Txyz[], v2: Txyz | Txyz[], tol: number): boolean | boolean[];
/**
 * Calculate the angle (0 to 2PI) between two vectors, relative to the plane normal.
 * \n
 * Unlike the vecAng() function, this funtion may return an angle larger than PI.
 * \n
 * The function calculates the angle from the first vector to the second vector
 * in a counter-clockwise direction, assuming the normal is pointing up towards the viewer.
 * \n
 * @param v1
 * @param v2
 * @param v3
 */
export declare function vecAng2(debug: boolean, v1: Txyz | Txyz[], v2: Txyz | Txyz[], v3: Txyz | Txyz[]): number | number[];
/**
 * Rotates one vector around another vector.
 * @param v1
 * @param v2
 * @param ang
 */
export declare function vecRot(debug: boolean, v1: Txyz | Txyz[], v2: Txyz | Txyz[], ang: number | number[]): Txyz | Txyz[];
/**
 * Calculates the magnitude of a vector
 * @param v
 */
export declare function vecLen(debug: boolean, v: Txyz | Txyz[]): number | number[];
/**
 * Sets the magnitude of a vector to 1
 * @param v
 */
export declare function vecNorm(debug: boolean, v: Txyz | Txyz[]): Txyz | Txyz[];
/**
 * Reverses the direction of a vector
 * @param v
 */
export declare function vecRev(debug: boolean, v: Txyz | Txyz[]): Txyz | Txyz[];
/**
 * Transforms a vector from a local coordinate system define by plane "p" to the global coordinate system.
 * @param v
 * @param p
 */
export declare function vecLtoG(debug: boolean, v: Txyz | Txyz[], p: TPlane | TPlane[]): Txyz | Txyz[];
/**
 * Transforms a vector from the global coordinate system to a local coordinate system define by plane "p".
 * @param v
 * @param p
 */
export declare function vecGtoL(debug: boolean, v: Txyz | Txyz[], p: TPlane | TPlane[]): Txyz | Txyz[];
