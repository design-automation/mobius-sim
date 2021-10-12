import { TColor } from '../../libs/geo-info/common';
/**
 * Creates a colour from a value in the range between min and max.
 *
 * @param vals
 * @param min
 * @param max
 */
export declare function colFalse(debug: boolean, vals: number | number[], min: number, max: number): TColor | TColor[];
/**
 * Creates a colour from a value in the range between min and max, given a Brewer color scale.
 *
 * @param vals
 * @param min
 * @param max
 * @param scale
 */
export declare function colScale(debug: boolean, vals: number | number[], min: number, max: number, scale: any): TColor | TColor[];
