/**
 * Functions to work with strings.
 */
/**
 * Replace all instances of specified search string with a new string. The search string can be a regular expression.
 * @param str
 * @param search_str
 * @param new_str
 */
export declare function strRepl(debug: boolean, str: string | string[], search_str: string, new_str: string): string | string[];
/**
 * Converts all the alphabetic characters in a string to uppercase.
 * @param str
 */
export declare function strUpp(debug: boolean, str: string | string[]): string | string[];
/**
 * Converts all the alphabetic characters in a string to lowercase.
 * @param str
 */
export declare function strLow(debug: boolean, str: string | string[]): string | string[];
/**
 * Removes the leading and trailing white space and line terminator characters from a string.
 * @param str
 */
export declare function strTrim(debug: boolean, str: string | string[]): string | string[];
/**
 * Removes whitespace from the right end of a string.
 * @param str
 */
export declare function strTrimR(debug: boolean, str: string | string[]): string | string[];
/**
 * Removes whitespace from the left end of a string.
 * @param str
 */
export declare function strTrimL(debug: boolean, str: string | string[]): string | string[];
/**
 * Pads the start of the s1 string with white spaces so that the resulting string reaches a given length.
 * Pads the start of the s1 string with the s2 string so that the resulting string reaches a given length.
 * @param str
 * @param max
 * @param fill
 */
export declare function strPadL(debug: boolean, str: string | string[], max: number, fill?: string): string | string[];
/**
 * Pads the end of the s1 string with white spaces so that the resulting string reaches a given length.
 * Pads the end of the s1 string with the s2 string so that the resulting string reaches a given length.
 * @param str
 * @param max
 * @param fill
 */
export declare function strPadR(debug: boolean, str: string | string[], max: number, fill?: string): string | string[];
/**
 * Gets a substring beginning at the specified location.
 * Gets a substring beginning at the specified location and having the specified length.
 * @param str
 * @param from
 * @param length
 */
export declare function strSub(debug: boolean, str: string | string[], from: number, length?: number): string | string[];
/**
 * Returns true if the string s1 starts with s2, false otherwise.
 * @param str
 * @param starts
 */
export declare function strStarts(debug: boolean, str: string | string[], starts: string): boolean | boolean[];
/**
 * Returns true if the string s1 ends with s2, false otherwise.
 * @param str
 * @param ends
 */
export declare function strEnds(debug: boolean, str: string | string[], ends: string): boolean | boolean[];
