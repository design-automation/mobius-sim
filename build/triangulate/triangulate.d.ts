import { Txyz } from '../geo-info/common';
/**
 * Triangulate a 4 sided shape
 * @param coords
 */
export declare function triangulateQuad(coords: Txyz[]): number[][];
/**
 * Triangulates a set of coords in 3d with holes
 * If the coords cannot be triangulated, it returns [].
 * @param coords
 */
export declare function triangulate(coords: Txyz[], holes?: Txyz[][]): number[][];
