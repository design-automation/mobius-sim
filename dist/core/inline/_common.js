"use strict";
/**
 * Functions shared by lists, dicts, strings.
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.equal = exports.copy = exports.len = void 0;
const lodash_1 = __importDefault(require("lodash"));
const chk = __importStar(require("../_check_types"));
const _check_types_1 = require("../_check_types");
const _check_inline_args_1 = require("../_check_inline_args");
/**
 * Returns the number of items in a list, a dictionary, or a string.
 * @param data
 */
function len(debug, data) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('len', arguments, 1);
        chk.checkArgs('len', 'data', data, [_check_types_1.isStr, _check_types_1.isList, _check_types_1.isDict]);
    }
    return lodash_1.default.size(data);
}
exports.len = len;
/**
 * Makes a deep copy of a list or a dictionary.
 * @param data
 */
function copy(debug, data) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('copy', arguments, 1);
        chk.checkArgs('copy', 'data', data, [_check_types_1.isList, _check_types_1.isDict]);
    }
    return lodash_1.default.cloneDeep(data);
}
exports.copy = copy;
/**
 * Returns true of the two lists or dictionaries are equal.
 * Performs a deep comparison between values to determine if they are equivalent.
 * @param data
 */
function equal(debug, data1, data2) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('copy', arguments, 1);
        chk.checkArgs('copy', 'data1', data1, [_check_types_1.isList, _check_types_1.isDict]);
        chk.checkArgs('copy', 'data2', data2, [_check_types_1.isList, _check_types_1.isDict]);
    }
    return lodash_1.default.isEqual(data1, data2);
}
exports.equal = equal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NvbW1vbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL2lubGluZS9fY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILG9EQUE0QjtBQUM1QixxREFBdUM7QUFDdkMsa0RBQXdEO0FBQ3hELDhEQUFxRDtBQUVyRDs7O0dBR0c7QUFDSCxTQUFnQixHQUFHLENBQUMsS0FBYyxFQUFFLElBQVM7SUFDekMsSUFBSSxLQUFLLEVBQUU7UUFDUCxJQUFBLGlDQUFZLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsb0JBQUssRUFBRSxxQkFBTSxFQUFFLHFCQUFNLENBQUMsQ0FBQyxDQUFDO0tBQy9EO0lBQ0QsT0FBTyxnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QixDQUFDO0FBTkQsa0JBTUM7QUFDRDs7O0dBR0c7QUFDSCxTQUFnQixJQUFJLENBQUMsS0FBYyxFQUFFLElBQVM7SUFDMUMsSUFBSSxLQUFLLEVBQUU7UUFDUCxJQUFBLGlDQUFZLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMscUJBQU0sRUFBRSxxQkFBTSxDQUFDLENBQUMsQ0FBQztLQUN6RDtJQUNELE9BQU8sZ0JBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQU5ELG9CQU1DO0FBQ0Q7Ozs7R0FJRztBQUNILFNBQWdCLEtBQUssQ0FBQyxLQUFjLEVBQUUsS0FBVSxFQUFFLEtBQVU7SUFDeEQsSUFBSSxLQUFLLEVBQUU7UUFDUCxJQUFBLGlDQUFZLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMscUJBQU0sRUFBRSxxQkFBTSxDQUFDLENBQUMsQ0FBQztRQUN4RCxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMscUJBQU0sRUFBRSxxQkFBTSxDQUFDLENBQUMsQ0FBQztLQUMzRDtJQUNELE9BQU8sZ0JBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFQRCxzQkFPQyJ9