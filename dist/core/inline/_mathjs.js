"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cube = exports.square = exports.norm = exports.hypot = exports.sum = exports.vari = exports.std = exports.prod = exports.mode = exports.median = exports.mean = exports.mad = exports.string = exports.number = exports.boolean = void 0;
const Mathjs = __importStar(require("mathjs"));
const _check_inline_args_1 = require("../_check_inline_args");
/**
 * To be completed...
 * @param val
 */
function boolean(debug, val) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('boolean', arguments, 1);
    }
    return Mathjs.boolean(val);
}
exports.boolean = boolean;
/**
 * To be completed...
 * @param val
 */
function number(debug, val) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('number', arguments, 1);
    }
    return Mathjs.number(val);
}
exports.number = number;
/**
 * To be completed...
 * @param val
 */
function string(debug, val) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('string', arguments, 1);
    }
    return Mathjs.string(val);
}
exports.string = string;
/**
 * Returns the median absolute deviation of the list
 * @param list
 */
function mad(debug, list) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('mad', arguments, 1);
    }
    return Mathjs.mad(list);
}
exports.mad = mad;
/**
 * Returns the mean value of the list
 * @param list
 */
function mean(debug, list) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('mean', arguments, 1);
    }
    return Mathjs.mean(list);
}
exports.mean = mean;
/**
 * Returns the median of the list
 * @param list
 */
function median(debug, list) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('median', arguments, 1);
    }
    return Mathjs.median(list);
}
exports.median = median;
/**
 * Returns the mode of the list
 * @param list
 */
function mode(debug, list) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('mode', arguments, 1);
    }
    return Mathjs.mode(list);
}
exports.mode = mode;
/**
 * Returns the product of all values in a list
 * @param list
 */
function prod(debug, list) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('prod', arguments, 1);
    }
    return Mathjs.prod(list);
}
exports.prod = prod;
/**
 * Returns the standard deviation of the list
 * @param list
 */
function std(debug, list) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('std', arguments, 1);
    }
    return Mathjs.std(list);
}
exports.std = std;
/**
 * Returns the variance of the list
 * @param list
 */
function vari(debug, list) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('vari', arguments, 1);
    }
    return Mathjs.variance(list);
}
exports.vari = vari;
/**
 * Returns the sum of all values in a list
 * @param list
 */
function sum(debug, list) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('sum', arguments, 1);
    }
    return Mathjs.sum(list);
}
exports.sum = sum;
/**
 * Returns the hypotenuse of all values in a list
 * @param list
 */
function hypot(debug, list) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('hypot', arguments, 1);
    }
    return Mathjs.hypot(list);
}
exports.hypot = hypot;
/**
 * Returns the norm of a list
 * @param list
 */
function norm(debug, list) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('norm', arguments, 1);
    }
    return Mathjs.norm(list);
}
exports.norm = norm;
/**
 * Returns the square of the number
 * @param list
 */
function square(debug, list) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('square', arguments, 1);
    }
    return Mathjs.square(list);
}
exports.square = square;
/**
 * Returns the cube of the number
 * @param list
 */
function cube(debug, list) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('cube', arguments, 1);
    }
    return Mathjs.cube(list);
}
exports.cube = cube;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX21hdGhqcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL2lubGluZS9fbWF0aGpzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQ0FBaUM7QUFDakMsOERBQXFEO0FBQ3JEOzs7R0FHRztBQUNILFNBQWdCLE9BQU8sQ0FBQyxLQUFjLEVBQUUsR0FBVztJQUMvQyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUEsaUNBQVksRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3pDO0lBQ0QsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFMRCwwQkFLQztBQUNEOzs7R0FHRztBQUNILFNBQWdCLE1BQU0sQ0FBQyxLQUFjLEVBQUUsR0FBVztJQUM5QyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUEsaUNBQVksRUFBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3hDO0lBQ0QsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFMRCx3QkFLQztBQUNEOzs7R0FHRztBQUNILFNBQWdCLE1BQU0sQ0FBQyxLQUFjLEVBQUUsR0FBVztJQUM5QyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUEsaUNBQVksRUFBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3hDO0lBQ0QsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFMRCx3QkFLQztBQUNEOzs7R0FHRztBQUNILFNBQWdCLEdBQUcsQ0FBQyxLQUFjLEVBQUUsSUFBYztJQUM5QyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUEsaUNBQVksRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3JDO0lBQ0QsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFMRCxrQkFLQztBQUNEOzs7R0FHRztBQUNILFNBQWdCLElBQUksQ0FBQyxLQUFjLEVBQUUsSUFBWTtJQUM3QyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUEsaUNBQVksRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3RDO0lBQ0QsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFMRCxvQkFLQztBQUNEOzs7R0FHRztBQUNILFNBQWdCLE1BQU0sQ0FBQyxLQUFjLEVBQUUsSUFBWTtJQUMvQyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUEsaUNBQVksRUFBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3hDO0lBQ0QsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFMRCx3QkFLQztBQUNEOzs7R0FHRztBQUNILFNBQWdCLElBQUksQ0FBQyxLQUFjLEVBQUUsSUFBWTtJQUM3QyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUEsaUNBQVksRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3RDO0lBQ0QsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFMRCxvQkFLQztBQUNEOzs7R0FHRztBQUNILFNBQWdCLElBQUksQ0FBQyxLQUFjLEVBQUUsSUFBWTtJQUM3QyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUEsaUNBQVksRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3RDO0lBQ0QsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFMRCxvQkFLQztBQUNEOzs7R0FHRztBQUNILFNBQWdCLEdBQUcsQ0FBQyxLQUFjLEVBQUUsSUFBYztJQUM5QyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUEsaUNBQVksRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3JDO0lBQ0QsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFMRCxrQkFLQztBQUNEOzs7R0FHRztBQUNILFNBQWdCLElBQUksQ0FBQyxLQUFjLEVBQUUsSUFBWTtJQUM3QyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUEsaUNBQVksRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3RDO0lBQ0QsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFMRCxvQkFLQztBQUNEOzs7R0FHRztBQUNILFNBQWdCLEdBQUcsQ0FBQyxLQUFjLEVBQUUsSUFBWTtJQUM1QyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUEsaUNBQVksRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3JDO0lBQ0QsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFMRCxrQkFLQztBQUNEOzs7R0FHRztBQUNILFNBQWdCLEtBQUssQ0FBQyxLQUFjLEVBQUUsSUFBWTtJQUM5QyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUEsaUNBQVksRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3ZDO0lBQ0QsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFMRCxzQkFLQztBQUNEOzs7R0FHRztBQUNILFNBQWdCLElBQUksQ0FBQyxLQUFjLEVBQUUsSUFBWTtJQUM3QyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUEsaUNBQVksRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3RDO0lBQ0QsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFMRCxvQkFLQztBQUNEOzs7R0FHRztBQUNILFNBQWdCLE1BQU0sQ0FBQyxLQUFjLEVBQUUsSUFBWTtJQUMvQyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUEsaUNBQVksRUFBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3hDO0lBQ0QsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFMRCx3QkFLQztBQUNEOzs7R0FHRztBQUNILFNBQWdCLElBQUksQ0FBQyxLQUFjLEVBQUUsSUFBWTtJQUM3QyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUEsaUNBQVksRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3RDO0lBQ0QsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFMRCxvQkFLQyJ9