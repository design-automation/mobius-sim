/**
 * Converts radians to degrees.
 *
 * @param rad
 */
export declare function radToDeg(debug: boolean, rad: number | number[]): number | number[];
/**
 * Converts degrees to radians.
 *
 * @param deg
 */
export declare function degToRad(debug: boolean, deg: number | number[]): number | number[];
/**
 * Converts the number to a string, with commas, e.g. 1,234,567
 * Converts the number to a string, with commas, where "d" specifies the number of fraction digits, e.g. 1,234.00.
 * Converts the number to a string, where "d" specifies the number of fraction digits, and "l" specifies the locale, e.g. "en-GB", "fi-FI", "in-IN", "pt-BR", etc'
 *
 * @param num
 * @param frac_digits
 * @param locale
 */
export declare function numToStr(debug: boolean, num: number | number[], frac_digits?: number, locale?: string): string | string[];
/**
 * Converts the number to a string representing currency.
 *
 * @param num
 * @param currency
 * @param locale
 */
export declare function numToCurr(debug: boolean, num: number | number[], currency: string, locale?: string): string | string[];
