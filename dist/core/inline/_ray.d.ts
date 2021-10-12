import { TRay, TPlane, Txyz } from '../../libs/geo-info/common';
/**
 * Creates a ray from an origin "o" and a direction vector "d".
 * Creates a ray from an origin "o", a direction vector "d", and length "l".
 * @param origin
 * @param dir
 * @param len
 */
export declare function rayMake(debug: boolean, origin: Txyz | Txyz[], dir: Txyz | Txyz[], len?: number): TRay | TRay[];
/**
 * Creates a ray between to points.
 * @param xyz1
 * @param xyz2
 */
export declare function rayFromTo(debug: boolean, xyz1: Txyz | Txyz[], xyz2: Txyz | Txyz[]): TRay | TRay[];
/**
 * Make a copy of the ray "r"
 * @param ray
 */
export declare function rayCopy(debug: boolean, ray: TRay | TRay[]): TRay | TRay[];
/**
 * Move the ray "r" relative to the global X, Y, and Z axes, by vector "v".
 * @param ray
 * @param vec
 */
export declare function rayMove(debug: boolean, ray: TRay | TRay[], vec: Txyz | Txyz[]): TRay | TRay[];
/**
 * Rotate the ray "r1" around the ray "r2", by angle "a" (in radians).
 * @param ray1
 * @param ray2
 * @param ang
 */
export declare function rayRot(debug: boolean, ray1: TRay | TRay[], ray2: TRay | TRay[], ang: number | number[]): TRay | TRay[];
/**
 * Move the ray "r" relative to the ray direction vector, by distance "d".
 * @param ray
 * @param dist
 */
export declare function rayLMove(debug: boolean, ray: TRay | TRay[], dist: number | number[]): TRay | TRay[];
/**
 * Create a ray from a plane "p", with the same origin and with a direction along the plane z axis.
 * @param pln
 */
export declare function rayFromPln(debug: boolean, pln: TPlane | TPlane[]): TRay | TRay[];
/**
 * Transforms a ray from a local coordinate system define by plane "p" to the global coordinate system.
 * @param r
 * @param p
 */
export declare function rayLtoG(debug: boolean, r: TRay | TRay[], p: TPlane | TPlane[]): TRay | TRay[];
/**
 * Transforms a ray from the global coordinate system to a local coordinate system define by plane "p".
 * @param r
 * @param p
 */
export declare function rayGtoL(debug: boolean, r: TRay | TRay[], p: TPlane | TPlane[]): TRay | TRay[];
