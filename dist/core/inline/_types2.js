"use strict";
/**
 * Functions to check types.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._isWithin = exports._isIn = exports.isUndef = exports.isNull = exports.isNaN = exports.isPln = exports.isRay = exports.isCol = exports.isVec3 = exports.isVec2 = exports.isDict = exports.isList = exports.isStr = exports.isBool = exports.isFlt = exports.isInt = exports.isNum = void 0;
const _check_inline_args_1 = require("../_check_inline_args");
// ['isNum(v)', 'Returns true if the value is a number, false otherwise.'],
// ['isInt(v)', 'Returns true if the value is a integer, false otherwise.'],
// ['isFlt(v)', 'Returns true if the value is a floating point number, false otherwise.'],
// ['isBool(v)', 'Returns true if the value is a boolean, false otherwise.'],
// ['isStr(v)', 'Returns true if the value is a string, false otherwise.'],
// ['isList(v)', 'Returns true if the value is a list, false otherwise.'],
// ['isDict(v)', 'Returns true if the value is a dictionary, false otherwise.'],
// ['isVec2(v)', 'Returns true if the value is a list of two numbers, false otherwise.'],
// ['isVec3(v)', 'Returns true if the value is a list of three numbers, false otherwise.'],
// ['isCol(v)', 'Returns true if the value is a list of three numbers in the range [0, 1], false otherwise.'],
// ['isRay(v)', 'Returns true if the value is a ray, false otherwise.'],
// ['isPln(v)', 'Returns true if the value is a plane, false otherwise.'],
// ['isNaN(v)', 'Returns true is the value is not a number (NaN), false otherwise.'],
// ['isNull(v)', 'Returns true is the value is null, false otherwise.'],
// ['isUndef(v)', 'Returns true is the value is undefined, false otherwise.'],
/**
 * Returns true if the value is a number, false otherwise.
 * @param v
 */
function isNum(debug, v) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('isNum', arguments, 1);
    }
    return typeof v === 'number';
}
exports.isNum = isNum;
/**
 * Returns true if the value is a integer, false otherwise.
 * @param v
 */
function isInt(debug, v) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('isInt', arguments, 1);
    }
    return Number.isInteger(v);
}
exports.isInt = isInt;
/**
 * Returns true if the value is a floating point number, false otherwise.
 * @param v
 */
function isFlt(debug, v) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('isFlt', arguments, 1);
    }
    // return !Number.isNaN(v) && v % 1 > 0;
    return typeof v === 'number';
}
exports.isFlt = isFlt;
/**
 * Returns true if the value is a boolean, false otherwise.
 * @param v
 */
function isBool(debug, v) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('isBool', arguments, 1);
    }
    return typeof v === 'boolean';
}
exports.isBool = isBool;
/**
 * Returns true if the value is a string, false otherwise.
 * @param v
 */
function isStr(debug, v) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('isStr', arguments, 1);
    }
    return typeof v === 'string';
}
exports.isStr = isStr;
/**
 * Returns true if the value is a list, false otherwise.
 * @param v
 */
function isList(debug, v) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('isList', arguments, 1);
    }
    return Array.isArray(v);
}
exports.isList = isList;
/**
 * Returns true if the value is a dictionary, false otherwise.
 * @param v
 */
function isDict(debug, v) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('isDict', arguments, 1);
    }
    // return typeof v === 'object' && !Array.isArray(v);
    return v.constructor === Object;
}
exports.isDict = isDict;
/**
 * Returns true if the value is a list of two numbers, false otherwise.
 * @param v
 */
function isVec2(debug, v) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('isVec2', arguments, 1);
    }
    return Array.isArray(v) && v.length === 2 &&
        typeof v[0] === 'number' && typeof v[1] === 'number';
}
exports.isVec2 = isVec2;
/**
 * Returns true if the value is a list of three numbers, false otherwise.
 * @param v
 */
function isVec3(debug, v) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('isVec3', arguments, 1);
    }
    return Array.isArray(v) && v.length === 3 &&
        typeof v[0] === 'number' && typeof v[1] === 'number' && typeof v[2] === 'number';
}
exports.isVec3 = isVec3;
/**
 * Returns true if the value is a list of three numbers in the range [0, 1], false otherwise.
 * @param v
 */
function isCol(debug, v) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('isCol', arguments, 1);
    }
    return isVec3(debug, v) && _isWithin(0, v[0], 1) && _isWithin(0, v[1], 1) && _isWithin(0, v[2], 1);
}
exports.isCol = isCol;
/**
 * Returns true if the value is a ray, false otherwise.
 * @param v
 */
function isRay(debug, v) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('isRay', arguments, 1);
    }
    return Array.isArray(v) && v.length === 2 && isVec3(debug, v[0]) && isVec3(debug, v[1]);
}
exports.isRay = isRay;
/**
 * Returns true if the value is a plane, false otherwise.
 * @param v
 */
function isPln(debug, v) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('isPln', arguments, 1);
    }
    return Array.isArray(v) && v.length === 3 && isVec3(debug, v[0]) && isVec3(debug, v[1]) && isVec3(debug, v[2]);
}
exports.isPln = isPln;
/**
 * Returns true is the value is not a number (NaN), false otherwise.
 * @param v
 */
function isNaN(debug, v) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('isNaN', arguments, 1);
    }
    return Number.isNaN(v);
}
exports.isNaN = isNaN;
/**
 * Returns true is the value is null, false otherwise.
 * @param v
 */
function isNull(debug, v) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('isNull', arguments, 1);
    }
    return v === null;
}
exports.isNull = isNull;
/**
 * Returns true is the value is undefined, false otherwise.
 * @param v
 */
function isUndef(debug, v) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('isUndef', arguments, 1);
    }
    return v === undefined;
}
exports.isUndef = isUndef;
/**
 * To be completed...
 * @param v1
 * @param v2
 * @param v3
 */
function _isIn(v1, v2, v3) {
    return typeof v1 === 'number' && typeof v2 === 'number' && typeof v3 === 'number' &&
        v1 < v2 && v2 < v3;
}
exports._isIn = _isIn;
/**
 * To be completed...
 * @param v1
 * @param v2
 * @param v3
 */
function _isWithin(v1, v2, v3) {
    return typeof v1 === 'number' && typeof v2 === 'number' && typeof v3 === 'number' &&
        v1 <= v2 && v2 <= v3;
}
exports._isWithin = _isWithin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3R5cGVzMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL2lubGluZS9fdHlwZXMyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7O0FBRUgsOERBQXFEO0FBRXJELDJFQUEyRTtBQUMzRSw0RUFBNEU7QUFDNUUsMEZBQTBGO0FBQzFGLDZFQUE2RTtBQUM3RSwyRUFBMkU7QUFDM0UsMEVBQTBFO0FBQzFFLGdGQUFnRjtBQUNoRix5RkFBeUY7QUFDekYsMkZBQTJGO0FBQzNGLDhHQUE4RztBQUM5Ryx3RUFBd0U7QUFDeEUsMEVBQTBFO0FBQzFFLHFGQUFxRjtBQUNyRix3RUFBd0U7QUFDeEUsOEVBQThFO0FBRTlFOzs7R0FHRztBQUNILFNBQWdCLEtBQUssQ0FBQyxLQUFjLEVBQUUsQ0FBTTtJQUN4QyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUEsaUNBQVksRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3ZDO0lBQ0QsT0FBTyxPQUFPLENBQUMsS0FBSyxRQUFRLENBQUM7QUFDakMsQ0FBQztBQUxELHNCQUtDO0FBQ0Q7OztHQUdHO0FBQ0gsU0FBZ0IsS0FBSyxDQUFDLEtBQWMsRUFBRSxDQUFNO0lBQ3hDLElBQUksS0FBSyxFQUFFO1FBQ1AsSUFBQSxpQ0FBWSxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDdkM7SUFDRCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQUxELHNCQUtDO0FBQ0Q7OztHQUdHO0FBQ0gsU0FBZ0IsS0FBSyxDQUFDLEtBQWMsRUFBRSxDQUFNO0lBQ3hDLElBQUksS0FBSyxFQUFFO1FBQ1AsSUFBQSxpQ0FBWSxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDdkM7SUFDRCx3Q0FBd0M7SUFDeEMsT0FBTyxPQUFPLENBQUMsS0FBSyxR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