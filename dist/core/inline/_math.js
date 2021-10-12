"use strict";
// min = __modules__._math.min;
// max = __modules__._math.max;
// pow = Math.pow;
// sqrt = Math.sqrt;
// exp = Math.exp;
// log = Math.log;
// round = __modules__._math.round;
// sigFig = __modules__._math.sigFig;
// ceil = Math.ceil;
// floor = Math.floor;
// abs = Math.abs;
// sin = Math.sin;
// asin = Math.asin;
// sinh = Math.sinh;
// asinh = Math.asinh;
// cos = Math.cos;
// acos = Math.acos;
// cosh = Math.cosh;
// acosh = Math.acosh;
// tan = Math.tan;
// atan = Math.atan;
// tanh = Math.tanh;
// atanh = Math.atanh;
// atan2 = Math.atan2;
Object.defineProperty(exports, "__esModule", { value: true });
exports.atanh = exports.tanh = exports.atan2 = exports.atan = exports.tan = exports.acosh = exports.cosh = exports.acos = exports.cos = exports.asinh = exports.sinh = exports.asin = exports.sin = exports.abs = exports.floor = exports.ceil = exports.sigFig = exports.round = exports.log10 = exports.log = exports.exp = exports.sqrt = exports.pow = exports.max = exports.min = void 0;
const _check_inline_args_1 = require("../_check_inline_args");
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
function min(debug, list) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('min', arguments, 1);
    }
    const args = Array.prototype.slice.call(arguments, min.length);
    if (args.length === 0) {
        if (list.constructor === [].constructor) {
            return Math.min.apply(Math, list);
        }
        return list;
    }
    args.push(list);
    return Math.min.apply(Math, args);
}
exports.min = min;
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
function max(debug, list) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('max', arguments, 1);
    }
    const args = Array.prototype.slice.call(arguments, min.length);
    if (args.length === 0) {
        if (list.constructor === [].constructor) {
            return Math.max.apply(Math, list);
        }
        return list;
    }
    args.push(list);
    return Math.max.apply(Math, args);
}
exports.max = max;
/**
 * Returns a number representing the given base taken to the power of the given exponent.
 *
 * @param base  A number or list of numbers.
 * @param xp The exponent used to raise the base.
 */
function pow(debug, base, xp) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('pow', arguments, 2);
    }
    if (Array.isArray(base)) {
        return base.map(a_num => Math.pow(a_num, xp));
    }
    return Math.pow(base, xp);
}
exports.pow = pow;
/**
 * Returns the square root of the given number. If the number is negative, NaN is returned.
 *
 * @param num A number or list of numbers.
 */
function sqrt(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('sqrt', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.sqrt(a_num));
    }
    return Math.sqrt(num);
}
exports.sqrt = sqrt;
/**
 * Returns a number representing e raised to the power of x, where e is Euler's number and x is the argument.
 *
 * @param num A number or list of numbers.
 */
function exp(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('exp', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.exp(a_num));
    }
    return Math.exp(num);
}
exports.exp = exp;
/**
 * Returns the natural logarithm (base e) of the given number. If the number is negative, NaN is returned.
 *
 * @param base A number or list of numbers.
 */
function log(debug, base) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('log', arguments, 1);
    }
    if (Array.isArray(base)) {
        return base.map(a_num => Math.log(a_num));
    }
    return Math.log(base);
}
exports.log = log;
/**
 * Returns the base 10 logarithm (base e) of the given number. If the number is negative, NaN is returned.
 *
 * @param base A number or list of numbers.
 */
function log10(debug, base) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('log10', arguments, 1);
    }
    if (Array.isArray(base)) {
        return base.map(a_num => Math.log10(a_num));
    }
    return Math.log10(base);
}
exports.log10 = log10;
/**
 * The value of the given number rounded to the nearest integer.
 *
 * @param num A number or list of numbers.
 * @param dec_pla The number of decimal places.
 */
function round(debug, num, dec_pla = 0) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('round', arguments, 2, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => round(debug, a_num, dec_pla));
    }
    num = num;
    if (dec_pla === 0) {
        return Math.round(num);
    }
    if (dec_pla > 0) {
        const dec = Math.pow(10, dec_pla);
        return Math.round(num * dec) / dec;
    }
    else {
        const dec = Math.pow(10, Math.abs(dec_pla));
        return Math.round(num / dec) * dec;
    }
}
exports.round = round;
/**
 * Returns the value of the given number converted to the specified number of significant figures.
 *
 * @param num A number or list of numbers.
 * @param sig_figs The number of significant figures.
 */
function sigFig(debug, num, sig_figs) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('sigFig', arguments, 2);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => sigFig(debug, a_num, sig_figs));
    }
    if (num === 0) {
        return 0;
    }
    num = num;
    const round_val = sig_figs - 1 - Math.floor(Math.log10(Math.abs(num)));
    return round(debug, num, round_val);
    // return parseFloat(num.toPrecision(sig_figs));
}
exports.sigFig = sigFig;
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
function ceil(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('ceil', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.ceil(a_num));
    }
    return Math.ceil(num);
}
exports.ceil = ceil;
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
function floor(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('floor', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.floor(a_num));
    }
    return Math.floor(num);
}
exports.floor = floor;
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
function abs(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('abs', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.abs(a_num));
    }
    return Math.abs(num);
}
exports.abs = abs;
/**
 * Returns the sine of the given number.
 *
 * sin(0);           // 0
 * sin(1);           // 0.8414709848078965
 *
 * @param num A number or list of numbers (in radians).
 */
function sin(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('sin', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.sin(a_num));
    }
    return Math.sin(num);
}
exports.sin = sin;
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
function asin(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('cos', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.asin(a_num));
    }
    return Math.asin(num);
}
exports.asin = asin;
/**
 * Returns the hyperbolic sine (in radians) of the given number.
 *
 * sinh(0); // 0
 * sinh(1); // 1.1752011936438014
 *
 * @param num A number or list of numbers (in radians).
 */
function sinh(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('sinh', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.sinh(a_num));
    }
    return Math.sinh(num);
}
exports.sinh = sinh;
/**
 * Returns the hyperbolic arcsine of the given number.
 *
 * asinh(1);  // 0.881373587019543
 * asinh(0);  // 0
 *
 * @param num A number or list of numbers.
 */
function asinh(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('asinh', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.asinh(a_num));
    }
    return Math.asinh(num);
}
exports.asinh = asinh;
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
function cos(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('cos', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.cos(a_num));
    }
    return Math.cos(num);
}
exports.cos = cos;
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
function acos(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('acos', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.acos(a_num));
    }
    return Math.acos(num);
}
exports.acos = acos;
/**
 * Returns the hyperbolic sine (in radians) of the given number.
 *
 * sinh(0); // 0
 * sinh(1); // 1.1752011936438014
 *
 * @param num A number or list of numbers (in radians).
 */
function cosh(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('cosh', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.cosh(a_num));
    }
    return Math.cosh(num);
}
exports.cosh = cosh;
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
function acosh(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('acosh', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.acosh(a_num));
    }
    return Math.acosh(num);
}
exports.acosh = acosh;
/**
 * Returns the tangent of the given number.
 *
 * tan(1); // 1.5574077246549023
 *
 * @param num A number or list of numbers (in radians).
 */
function tan(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('tan', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.tan(a_num));
    }
    return Math.tan(num);
}
exports.tan = tan;
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
function atan(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('atan', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.atan(a_num));
    }
    return Math.atan(num);
}
exports.atan = atan;
/**
 * Returns the angle in radians (in [-π,π]) between the positive x-axis and the ray from (0,0) to the point
 *
 * atan2([15, 90]]); // 1.4056476493802699
 * atan2([90, 15]]); // 0.16514867741462683
 *
 * @param xy A list of two numbers [x,y] or a list of lists [[x,y], [x,y], [x,y]...].
 */
function atan2(debug, xy) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('atan2', arguments, 1);
    }
    if (Array.isArray(xy[0])) {
        return xy.map(a_xy => Math.atan2(a_xy[1], a_xy[0]));
    }
    xy = xy;
    return Math.atan2(xy[1], xy[0]);
}
exports.atan2 = atan2;
/**
 * Returns the hyperbolic tangent of the given number.
 *
 * tanh(0);        // 0
 * tanh(Infinity); // 1
 * tanh(1);        // 0.7615941559557649
 *
 * @param num A number or list of numbers (in radians).
 */
function tanh(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('tanh', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.tanh(a_num));
    }
    return Math.tanh(num);
}
exports.tanh = tanh;
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
function atanh(debug, num) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('atanh', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map(a_num => Math.atanh(a_num));
    }
    return Math.atanh(num);
}
exports.atanh = atanh;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX21hdGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29yZS9pbmxpbmUvX21hdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtCQUErQjtBQUMvQiwrQkFBK0I7QUFDL0Isa0JBQWtCO0FBQ2xCLG9CQUFvQjtBQUNwQixrQkFBa0I7QUFDbEIsa0JBQWtCO0FBQ2xCLG1DQUFtQztBQUNuQyxxQ0FBcUM7QUFDckMsb0JBQW9CO0FBQ3BCLHNCQUFzQjtBQUN0QixrQkFBa0I7QUFDbEIsa0JBQWtCO0FBQ2xCLG9CQUFvQjtBQUNwQixvQkFBb0I7QUFDcEIsc0JBQXNCO0FBQ3RCLGtCQUFrQjtBQUNsQixvQkFBb0I7QUFDcEIsb0JBQW9CO0FBQ3BCLHNCQUFzQjtBQUN0QixrQkFBa0I7QUFDbEIsb0JBQW9CO0FBQ3BCLG9CQUFvQjtBQUNwQixzQkFBc0I7QUFDdEIsc0JBQXNCOzs7QUFFdEIsOERBQXFEO0FBRXJEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsU0FBZ0IsR0FBRyxDQUFDLEtBQWMsRUFBRSxJQUFTO0lBQ3pDLElBQUksS0FBSyxFQUFFO1FBQ1AsSUFBQSxpQ0FBWSxFQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDckM7SUFDRCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoRSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ25CLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxFQUFFLENBQUMsV0FBVyxFQUFFO1lBQ3JDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3JDO1FBQ0QsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxD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