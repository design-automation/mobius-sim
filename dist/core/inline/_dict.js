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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dictEq = exports.dictCopy = exports.dictFind = exports.dictHasVal = exports.dictHasKey = exports.dictVals = exports.dictKeys = exports.dictGet = void 0;
/**
 * Functions for working with dictionaries. The functions do not modify input dictionaries.
 */
const lodash_1 = __importDefault(require("lodash"));
const chk = __importStar(require("../_check_types"));
const _check_types_1 = require("../_check_types");
const _check_inline_args_1 = require("../_check_inline_args");
/**
 * Returns the item in the dictionary specified by key.
 * If the key does nto exist, undefined is returned.
 *
 * If a list of keys is provided, then a list of values will be returned.
 *
 * @param dict The dictionary.
 * @param key The key, either a single string or a list of strings.
 */
function dictGet(debug, dict, key) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('dictGet', arguments, 2);
        chk.checkArgs('dictGet', 'dict', dict, [_check_types_1.isDict]);
        chk.checkArgs('dictGet', 'key', key, [_check_types_1.isStr, _check_types_1.isStrL]);
    }
    if (Array.isArray(key)) {
        return key.map(a_key => dict[a_key]);
    }
    return dict[key];
}
exports.dictGet = dictGet;
/**
 * Returns an array of all the keys in a dictionary.
 *
 * @param dict The dictionary.
 */
function dictKeys(debug, dict) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('dictKeys', arguments, 1);
        chk.checkArgs('dictKeys', 'dict', dict, [_check_types_1.isDict]);
    }
    return Object.keys(dict);
}
exports.dictKeys = dictKeys;
/**
 * Returns an array of all the values in a dictionary.
 *
 * @param dict The dictionary.
 */
function dictVals(debug, dict) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('dictVals', arguments, 1);
        chk.checkArgs('dictVals', 'dict', dict, [_check_types_1.isDict]);
    }
    return Object.values(dict);
}
exports.dictVals = dictVals;
/**
 * Returns true if the dictionary contains the given key, false otherwsie.
 *
 * If a list of keys is given, a list of true/false values will be returned.
 *
 * @param dict The dictionary.
 * @param key The key, either a string or a list of strings.
 */
function dictHasKey(debug, dict, key) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('dictHasKey', arguments, 2);
        chk.checkArgs('dictHasKey', 'dict', dict, [_check_types_1.isDict]);
        chk.checkArgs('dictHasKey', 'key', key, [_check_types_1.isStr, _check_types_1.isStrL]);
    }
    if (Array.isArray(key)) {
        return key.map(a_key => dict.hasOwnProperty(a_key));
    }
    return dict.hasOwnProperty(key);
}
exports.dictHasKey = dictHasKey;
/**
 * Returns true if the dictionary contains the given value, false otherwsie.
 *
 * @param dict The dictionary.
 * @param val The value to seach for, can be any type.
 */
function dictHasVal(debug, dict, val) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('dictHasVal', arguments, 2);
        chk.checkArgs('dictHasVal', 'dict', dict, [_check_types_1.isDict]);
    }
    return Object.values(dict).indexOf(val) !== -1;
}
exports.dictHasVal = dictHasVal;
/**
 * Returns the first key in the dictionary that has the given value.
 *
 * If the value does not exist, returns null.
 *
 * @param dict The dictionary.
 * @param val The value, can be any type.
 */
function dictFind(debug, dict, val) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('dictFind', arguments, 2);
        chk.checkArgs('dictFind', 'dict', dict, [_check_types_1.isDict]);
    }
    for (const key of Object.keys(dict)) {
        if (dict[key] === val) {
            return key;
        }
    }
    return null;
}
exports.dictFind = dictFind;
/**
 * Returns a deep copy of the dictionary.
 *
 * A deep copy means that changing values in the copied dictionary will not affect the original dictionary.
 *
 * @param dict The dictionary.
 */
function dictCopy(debug, dict) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('dictCopy', arguments, 1);
        chk.checkArgs('dictCopy', 'dict', dict, [_check_types_1.isDict]);
    }
    return lodash_1.default.cloneDeep(dict);
}
exports.dictCopy = dictCopy;
/**
 * Returns true if the values in the two dictionaries are equal.
 *
 * Performs a deep comparison between values to determine if they are equivalent.
 *
 * @param dict1 The first dictionary.
 * @param dict2 The second dictionary.
 */
function dictEq(debug, dict1, dict2) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('dictEq', arguments, 2);
        chk.checkArgs('dictEq', 'dict1', dict1, [_check_types_1.isDict]);
        chk.checkArgs('dictEq', 'dict2', dict2, [_check_types_1.isDict]);
    }
    return lodash_1.default.isEqual(dict1, dict2);
}
exports.dictEq = dictEq;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2RpY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29yZS9pbmxpbmUvX2RpY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsb0RBQTRCO0FBQzVCLHFEQUF1QztBQUN2QyxrREFBd0Q7QUFDeEQsOERBQXFEO0FBRXJEOzs7Ozs7OztHQVFHO0FBQ0gsU0FBZ0IsT0FBTyxDQUFDLEtBQWMsRUFBRSxJQUFZLEVBQUUsR0FBb0I7SUFDdEUsSUFBSSxLQUFLLEVBQUU7UUFDUCxJQUFBLGlDQUFZLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0QyxHQUFHLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMscUJBQU0sQ0FBQyxDQUFDLENBQUM7UUFDakQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLG9CQUFLLEVBQUUscUJBQU0sQ0FBQyxDQUFDLENBQUM7S0FDekQ7SUFDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQVUsQ0FBQztLQUFFO0lBQzNFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBUSxDQUFDO0FBQzVCLENBQUM7QUFSRCwwQkFRQztBQUNEOzs7O0dBSUc7QUFDSCxTQUFnQixRQUFRLENBQUMsS0FBYyxFQUFFLElBQVk7SUFDakQsSUFBSSxLQUFLLEVBQUU7UUFDUCxJQUFBLGlDQUFZLEVBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2QyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENB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