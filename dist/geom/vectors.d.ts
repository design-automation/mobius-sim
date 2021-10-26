declare type Txyz = [number, number, number];
export declare function vecEqual(v1: Txyz, v2: Txyz, tol: number): boolean;
export declare function vecSub(v1: Txyz, v2: Txyz, norm?: boolean): Txyz;
export declare function vecsSub(vecs: Txyz[], norm?: boolean): Txyz;
export declare function vecAdd(v1: Txyz, v2: Txyz, norm?: boolean): Txyz;
export declare function vecsAdd(vecs: Txyz[], norm?: boolean): Txyz;
export declare function vecSum(vecs: Txyz[], norm?: boolean): Txyz;
export declare function vecAvg(vecs: Txyz[]): Txyz;
export declare function vecDiv(vec: Txyz, divisor: number): Txyz;
export declare function vecMult(vec: Txyz, multiplier: number): Txyz;
export declare function vecCross(v1: Txyz, v2: Txyz, norm?: boolean): Txyz;
export declare function vecDot(v1: Txyz, v2: Txyz): number;
export declare function vecNorm(v: Txyz): Txyz;
export declare function vecRot(vec: Txyz, axis: Txyz, ang: number): Txyz;
export declare function vecAng(v1: Txyz, v2: Txyz): number;
export declare function vecAng2(v1: Txyz, v2: Txyz, n: Txyz): number;
export declare function vecLen(v: Txyz): number;
export declare function vecSetLen(v: Txyz, len: number): Txyz;
export declare function vecRev(v: Txyz): Txyz;
export declare function vecFromTo(v1: Txyz, v2: Txyz): Txyz;
export declare function vecMakeOrtho(v1: Txyz, v2: Txyz): Txyz;
export declare function vecCodir(v1: Txyz, v2: Txyz): boolean;
export declare function dist(p1: Txyz, p2: Txyz): number;
/**
 * Finds the normal to a set of points using Newell's method
 */
export declare function newellNorm(pts: Txyz[]): Txyz;
/**
 * Create new points between two points.
 */
export declare function interpByNum(pt1: Txyz, pt2: Txyz, num_points: number): Txyz[];
export declare function interpByLen(pt1: Txyz, pt2: Txyz, len: number): Txyz[];
export {};
