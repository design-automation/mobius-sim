/**
 * Returns the smallest of the given numbers.
 *
 * If any one or more of the parameters cannot be converted into a number, NaN is returned.
 *
 * If no parameters are provided, Infinity is returned.
 *
 * min([5,3,6,2,4])    // 2
 * min(5,3,6,2,4)    // 2
 *
 * @param list A list of numbers, or a sequence of numbers
 */
export declare function min(debug: boolean, list: any): any;
/**
 * Returns the largest  of the given numbers.
 *
 * If any one or more of the parameters cannot be converted into a number, NaN is returned.
 *
 * max([5,3,6,2,4])    // 6
 * max(5,3,6,2,4)    // 6
 *
 * @param list A list of numbers, or a sequence of numbers.
 */
export declare function max(debug: boolean, list: any): any;
/**
 * Returns a number representing the given base taken to the power of the given exponent.
 *
 * @param base  A number or list of numbers.
 * @param xp The exponent used to raise the base.
 */
export declare function pow(debug: boolean, base: number | number[], xp: number): number | number[];
/**
 * Returns the square root of the given number. If the number is negative, NaN is returned.
 *
 * @param num A number or list of numbers.
 */
export declare function sqrt(debug: boolean, num: number | number[]): number | number[];
/**
 * Returns a number representing e raised to the power of x, where e is Euler's number and x is the argument.
 *
 * @param num A number or list of numbers.
 */
export declare function exp(debug: boolean, num: number | number[]): number | number[];
/**
 * Returns the natural logarithm (base e) of the given number. If the number is negative, NaN is returned.
 *
 * @param base A number or list of numbers.
 */
export declare function log(debug: boolean, base: number | number[]): number | number[];
/**
 * Returns the base 10 logarithm (base e) of the given number. If the number is negative, NaN is returned.
 *
 * @param base A number or list of numbers.
 */
export declare function log10(debug: boolean, base: number | number[]): number | number[];
/**
 * The value of the given number rounded to the nearest integer.
 *
 * @param num A number or list of numbers.
 * @param dec_pla The number of decimal places.
 */
export declare function round(debug: boolean, num: number | number[], dec_pla?: number): number | number[];
/**
 * Returns the value of the given number converted to the specified number of significant figures.
 *
 * @param num A number or list of numbers.
 * @param sig_figs The number of significant figures.
 */
export declare function sigFig(debug: boolean, num: number | number[], sig_figs: number): number | number[];
/**
 * Returns the smallest integer greater than or equal to the given number.
 *
 * ceil(.95);    // 1
 * ceil(4);      // 4
 * ceil(7.004);  // 8
 * ceil(-0.95);  // -0
 * ceil(-4);     // -4
 * ceil(-7.004); // -7
 *
 * @param num A number or list of numbers.
 */
export declare function ceil(debug: boolean, num: number | number[]): number | number[];
/**
 * Returns the largest integer less than or equal to the specified number.
 *
 * floor( 45.95); //  45
 * floor( 45.05); //  45
 * floor(  4   ); //   4
 * floor(-45.05); // -46
 * floor(-45.95); // -46
 *
 * @param num A number or list of numbers.
 */
export declare function floor(debug: boolean, num: number | number[]): number | number[];
/**
 * Returns the absolute value of the given number.
 *
 * abs('-1');     // 1
 * abs(-2);       // 2
 * abs(null);     // 0
 * abs('');       // 0
 * abs([]);       // 0
 * abs([2]);      // [2]
 * abs([1,2]);    // [1,2]]
 * abs({});       // NaN
 * abs('string'); // NaN
 * abs();         // NaN
 *
 * @param num A number or list of numbers.
 */
export declare function abs(debug: boolean, num: number | number[]): number | number[];
/**
 * Returns the sine of the given number.
 *
 * sin(0);           // 0
 * sin(1);           // 0.8414709848078965
 *
 * @param num A number or list of numbers (in radians).
 */
export declare function sin(debug: boolean, num: number | number[]): number | number[];
/**
 * Returns the arcsine (in radians) of the given number if it's between -1 and 1; otherwise, NaN.
 *
 * asin(-2);  // NaN
 * asin(-1);  // -1.5707963267948966 (-pi/2)
 * asin(0);   // 0
 * asin(0.5); // 0.5235987755982989
 * asin(1);   // 1.5707963267948966 (pi/2)
 * asin(2);   // NaN
 *
 * @param num A number or list of numbers between -1 and 1.
 */
export declare function asin(debug: boolean, num: number | number[]): number | number[];
/**
 * Returns the hyperbolic sine (in radians) of the given number.
 *
 * sinh(0); // 0
 * sinh(1); // 1.1752011936438014
 *
 * @param num A number or list of numbers (in radians).
 */
export declare function sinh(debug: boolean, num: number | number[]): number | number[];
/**
 * Returns the hyperbolic arcsine of the given number.
 *
 * asinh(1);  // 0.881373587019543
 * asinh(0);  // 0
 *
 * @param num A number or list of numbers.
 */
export declare function asinh(debug: boolean, num: number | number[]): number | number[];
/**
 * Returns the cosine of the given number.
 *
 * cos(0);           // 1
 * cos(1);           // 0.5403023058681398
 * cos(Math.PI);     // -1
 * cos(2 * PI); // 1
 *
 * @param num A number or list of numbers (in radians).
 */
export declare function cos(debug: boolean, num: number | number[]): number | number[];
/**
 * Returns the arc-cosine (in radians) of the given number between -1 and 1; otherwise, NaN.
 *
 * acos(-2);  // NaN
 * acos(-1);  // 3.141592653589793
 * acos(0);   // 1.5707963267948966
 * acos(0.5); // 1.0471975511965979
 * acos(1);   // 0
 * acos(2);   // NaN
 *
 * @param num A number or list of numbers between -1 and 1.
 */
export declare function acos(debug: boolean, num: number | number[]): number | number[];
/**
 * Returns the hyperbolic sine (in radians) of the given number.
 *
 * sinh(0); // 0
 * sinh(1); // 1.1752011936438014
 *
 * @param num A number or list of numbers (in radians).
 */
export declare function cosh(debug: boolean, num: number | number[]): number | number[];
/**
 * Returns the hyperbolic arc-cosine of the given number. If the number is less than 1, NaN.
 *
 * acosh(-1);  // NaN
 * acosh(0);   // NaN
 * acosh(0.5); // NaN
 * acosh(1);   // 0
 * acosh(2);   // 1.3169578969248166
 *
 * @param num A number or list of numbers.
 */
export declare function acosh(debug: boolean, num: number | number[]): number | number[];
/**
 * Returns the tangent of the given number.
 *
 * tan(1); // 1.5574077246549023
 *
 * @param num A number or list of numbers (in radians).
 */
export declare function tan(debug: boolean, num: number | number[]): number | number[];
/**
 * Returns the arc-tangent (in radians) of the given number.
 *
 * atan(1);   // 0.7853981633974483
 * atan(0);   // 0
 * atan(-0);  // -0
 * atan(Infinity);   //  1.5707963267948966
 * atan(-Infinity);  // -1.5707963267948966
 *
 * // The angle that the line [(0,0);(x,y)] forms with the x-axis in a Cartesian coordinate system
 * atan(y / x);
 *
 * @param num A number or list of numbers between -1 and 1.
 */
export declare function atan(debug: boolean, num: number | number[]): number | number[];
/**
 * Returns the angle in radians (in [-π,π]) between the positive x-axis and the ray from (0,0) to the point
 *
 * atan2([15, 90]]); // 1.4056476493802699
 * atan2([90, 15]]); // 0.16514867741462683
 *
 * @param xy A list of two numbers [x,y] or a list of lists [[x,y], [x,y], [x,y]...].
 */
export declare function atan2(debug: boolean, xy: [number, number] | [number, number][]): number | number[];
/**
 * Returns the hyperbolic tangent of the given number.
 *
 * tanh(0);        // 0
 * tanh(Infinity); // 1
 * tanh(1);        // 0.7615941559557649
 *
 * @param num A number or list of numbers (in radians).
 */
export declare function tanh(debug: boolean, num: number | number[]): number | number[];
/**
 * Returns the hyperbolic arc-tangent of the given number.
 *
 * atanh(-2);  // NaN
 * atanh(-1);  // -Infinity
 * atanh(0);   // 0
 * atanh(0.5); // 0.5493061443340548
 * atanh(1);   // Infinity
 * atanh(2);   // NaN
 *
 * @param num A number or list of numbers.
 */
export declare function atanh(debug: boolean, num: number | number[]): number | number[];
