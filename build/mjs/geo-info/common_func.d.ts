import { EEntType } from './common';
/**
 * Makes a deep clone of map where keys are integers and values are arrays of integers.
 * @param map
 */
export declare function cloneDeepMapArr(map: Map<number, number[]>): Map<number, number[]>;
/**
 * Used for error messages
 * @param ent_type_str
 */
export declare function getEntTypeStr(ent_type_str: EEntType): string;
export declare function isXYZ(data: any): boolean;
export declare function isRay(data: any): boolean;
export declare function isPlane(data: any): boolean;
export declare function isBBox(data: any): boolean;
export declare function mapSetMerge(source: Map<number, Set<number>>, target: Map<number, Set<number>>, source_keys?: number[] | Set<number>): void;
