"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyArr = exports.getArrDepth = exports.arrFill = exports.arrMaxDepth = exports.arrMakeFlat = exports.arrIdxRem = exports.arrIdxAdd = exports.arrAddToSet = exports.arrRem = void 0;
const lodash_1 = __importDefault(require("lodash"));
/**
 * Remove an item from an array
 * Return teh index where the item was removed.
 * Returns -1 if teh item was not found.
 * @param arr
 * @param item
 */
function arrRem(arr, item) {
    const index = arr.indexOf(item);
    if (index === -1) {
        return -1;
    }
    arr.splice(index, 1);
    return index;
}
exports.arrRem = arrRem;
/**
 * Remove an item from an array
 * Treats array as set of unique items
 * @param arr
 * @param item
 */
function arrAddToSet(arr, item) {
    const index = arr.indexOf(item);
    if (index !== -1) {
        return index;
    }
    return arr.push(item) - 1;
}
exports.arrAddToSet = arrAddToSet;
/**
 * Add an item to an array in an array
 * @param arr
 * @param item
 */
function arrIdxAdd(arr, idx, item) {
    if (arr[idx] === undefined || arr[idx] === null) {
        arr[idx] = [];
    }
    arr[idx].push(item);
}
exports.arrIdxAdd = arrIdxAdd;
/**
 * Remove an item from an array in an array
 * @param arr
 * @param item
 */
function arrIdxRem(arr, idx, item, del_empty) {
    if (arr[idx] === undefined || arr[idx] === null) {
        return;
    }
    const rem_index = arr[idx].indexOf(item);
    if (rem_index === -1) {
        return;
    }
    arr[idx].splice(rem_index, 1);
    if (del_empty && arr[idx].length === 0) {
        delete arr[idx];
    }
}
exports.arrIdxRem = arrIdxRem;
/**
 * Make flat array (depth = 1) from anything.
 * \n
 * If it is not an array, then make it an array
 * \n
 * If it is an array, then make it flat
 * \n
 * @param data
 */
function arrMakeFlat(data) {
    if (!Array.isArray(data)) {
        return [data];
    }
    return lodash_1.default.flattenDeep(data);
    // const depth = arrMaxDepth(data);
    // // @ts-ignore
    // const new_array = data.flat(depth - 1);
    // return new_array;
    // const flattend = [];
    // function flat(data2: any) {
    //     data2.forEach(function(el: any) {
    //         if (Array.isArray(el)) {
    //             flat(el);
    //         } else {
    //             flattend.push(el);
    //         }
    //     });
    // }
    // flat(data);
    // return flattend;
}
exports.arrMakeFlat = arrMakeFlat;
/**
 * Maximum depth of an array
 * @param data
 */
function arrMaxDepth(data) {
    let d1 = 0;
    if (Array.isArray(data)) {
        d1 = 1;
        let max = 0;
        for (const item of data) {
            if (Array.isArray(data)) {
                const d2 = arrMaxDepth(item);
                if (d2 > max) {
                    max = d2;
                }
            }
        }
        d1 += max;
    }
    return d1;
}
exports.arrMaxDepth = arrMaxDepth;
/**
 * Converts a value to an array of specified length.
 * \n
 * @param data
 */
function arrFill(data, length) {
    if (!Array.isArray(data)) {
        data = [data];
    }
    data = data;
    const last = data[data.length - 1];
    for (let i = data.length; i < length; i++) {
        data[i] = last;
    }
    if (data.length > length) {
        data = data.slice(0, length);
    }
    return data;
}
exports.arrFill = arrFill;
function getArrDepth(arr) {
    if (Array.isArray(arr)) {
        return 1 + getArrDepth(arr[0]);
    }
    return 0;
}
exports.getArrDepth = getArrDepth;
function isEmptyArr(arr) {
    if (Array.isArray(arr) && !arr.length) {
        return true;
    }
    return false;
}
exports.isEmptyArr = isEmptyArr;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYnMvdXRpbC9hcnJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQUE0QjtBQUM1Qjs7Ozs7O0dBTUc7QUFDSCxTQUFnQixNQUFNLENBQUMsR0FBVSxFQUFFLElBQVM7SUFDeEMsTUFBTSxLQUFLLEdBQVcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtRQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FBRTtJQUNoQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyQixPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBTEQsd0JBS0M7QUFDRDs7Ozs7R0FLRztBQUNILFNBQWdCLFdBQVcsQ0FBQyxHQUFVLEVBQUUsSUFBUztJQUM3QyxNQUFNLEtBQUssR0FBVyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQUUsT0FBTyxLQUFLLENBQUM7S0FBRTtJQUNuQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFKRCxrQ0FJQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixTQUFTLENBQUMsR0FBVSxFQUFFLEdBQVcsRUFBRSxJQUFTO0lBQ3hELElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQzdDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDakI7SUFDRCxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFMRCw4QkFL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