"use strict";
/**
 * The `dict` module has functions for working with dictionaries.
 * These functions have no direct link with the model, the are generic functions for manipulating dictionaries.
 * These functions neither make nor modify anything in the model.
 * In addition to these functions, there are also inline functions available for working with dictionaries.
 * @module
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Replace = exports.Remove = exports.Add = void 0;
const chk = __importStar(require("../../_check_types"));
// ================================================================================================
/**
 * Adds one or more key-value pairs to a dict. Existing keys with the same name will be overwritten.
 * \n
 * @param dict Dictionary to add the key-value pairs to.
 * @param keys A key or list of keys.
 * @param values A value of list of values.
 * @returns void
 */
function Add(dict, keys, values) {
    // --- Error Check ---
    const fn_name = 'dict.Add';
    chk.checkArgs(fn_name, 'keys', keys, [chk.isStr, chk.isStrL]);
    chk.checkArgs(fn_name, 'values', keys, [chk.isAny, chk.isList]);
    keys = Array.isArray(keys) ? keys : [keys];
    values = Array.isArray(values) ? values : [values];
    if (keys.length !== values.length) {
        throw new Error(fn_name + ': The list of keys must be the same length as the list of values.');
    }
    // --- Error Check ---
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = values[i];
        dict[key] = dict[value];
    }
}
exports.Add = Add;
// ================================================================================================
/**
 * Removes keys from a dict. If the key does not exist, no action is taken and no error is thrown.
 * \n
 * @param dict The dict in which to remove keys
 * @param keys The key or list of keys to remove.
 * @returns void
 */
function Remove(dict, keys) {
    // --- Error Check ---
    const fn_name = 'dict.Remove';
    chk.checkArgs(fn_name, 'key', keys, [chk.isStr, chk.isStrL]);
    // --- Error Check ---
    if (!Array.isArray(keys)) {
        keys = [keys];
    }
    keys = keys;
    for (const key of keys) {
        if (typeof key !== 'string') {
            throw new Error('dict.Remove: Keys must be strings; \
                the following key is not valid:"' + key + '".');
        }
        if (key in dict) {
            delete dict[key];
        }
    }
}
exports.Remove = Remove;
// ================================================================================================
/**
 * Replaces keys in a dict. If the key does not exist, no action is taken and no error is thrown.
 * \n
 * @param dict The dict in which to replace keys
 * @param old_keys The old key or list of keys.
 * @param new_keys The new key or list of keys.
 * @returns void
 */
function Replace(dict, old_keys, new_keys) {
    // --- Error Check ---
    const fn_name = 'dict.Replace';
    chk.checkArgs(fn_name, 'old_keys', old_keys, [chk.isStr, chk.isStrL]);
    chk.checkArgs(fn_name, 'new_keys', new_keys, [chk.isStr, chk.isStrL]);
    old_keys = Array.isArray(old_keys) ? old_keys : [old_keys];
    new_keys = Array.isArray(new_keys) ? new_keys : [new_keys];
    if (old_keys.length !== new_keys.length) {
        throw new Error(fn_name + ': The list of new keys must be the same length as the list of old keys.');
    }
    // --- Error Check ---
    for (let i = 0; i < old_keys.length; i++) {
        const old_key = old_keys[i];
        const new_key = new_keys[i];
        if (old_key in dict) {
            dict[new_key] = dict[old_key];
            delete dict[old_key];
        }
    }
}
exports.Replace = Replace;
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGljdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL21vZHVsZXMvYmFzaWMvZGljdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsd0RBQTBDO0FBRTFDLG1HQUFtRztBQUNuRzs7Ozs7OztHQU9HO0FBQ0gsU0FBZ0IsR0FBRyxDQUFDLElBQVksRUFBRSxJQUFxQixFQUFFLE1BQWlCO0lBQ3RFLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUM7SUFDM0IsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDOUQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDaEUsSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25ELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsTUFBTSxFQUFFO1FBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxHQUFHLG1FQUFtRSxDQUFDLENBQUM7S0FDbEc7SUFDRCxzQkFBc0I7SUFDdEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxN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