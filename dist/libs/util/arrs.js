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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWJzL3V0aWwvYXJycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxvREFBNEI7QUFDNUI7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsTUFBTSxDQUFDLEdBQVUsRUFBRSxJQUFTO0lBQ3hDLE1BQU0sS0FBSyxHQUFXLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQUU7SUFDaEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDckIsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQztBQUxELHdCQUtDO0FBQ0Q7Ozs7O0dBS0c7QUFDSCxTQUFnQixXQUFXLENBQUMsR0FBVSxFQUFFLElBQVM7SUFDN0MsTUFBTSxLQUFLLEdBQVcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtRQUFFLE9BQU8sS0FBSyxDQUFDO0tBQUU7SUFDbkMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBSkQsa0NBSUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsU0FBUyxDQUFDLEdBQVUsRUFBRSxHQUFXLEVBQUUsSUFBUztJQUN4RCxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUM3QyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQ2pCO0lBQ0QsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QixDQUFDO0FB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