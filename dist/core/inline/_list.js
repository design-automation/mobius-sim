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
exports.listEq = exports.listZip = exports.listSort = exports.listCull = exports.listRev = exports.listSlice = exports.listRot = exports.listFlat = exports.listJoin = exports.listHas = exports.listFind = exports.listGet = exports.listRep = exports.listCopy = exports.listCount = exports.range = void 0;
/**
 * list functions that obtain and return information from an input list. Does not modify input list.
 */
const lodash_1 = __importDefault(require("lodash"));
const chk = __importStar(require("../_check_types"));
const _check_inline_args_1 = require("../_check_inline_args");
/**
 * Generates a list of integers, from start to end, with a step size of 1
 * Generates a list of integers, from start to end, with a specified step size
 *
 * @param start The start of the range, inclusive.
 * @param end (Optional) The end of the range, exclusive.
 * @param step (Optional) The step size.
 */
function range(debug, start, end, step) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('range', arguments, 3, 1);
        chk.checkArgs('range', 'start', start, [chk.isNum]);
        if (end !== undefined) {
            chk.checkArgs('range', 'end', end, [chk.isNum]);
        }
        if (step !== undefined) {
            chk.checkArgs('range', 'step', step, [chk.isNum]);
        }
    }
    if (start === undefined) {
        throw new Error('Invalid inline arg: min must be defined.');
    }
    if (end === undefined) {
        end = start;
        start = 0;
    }
    if (step === 0) {
        throw new Error('Invalid inline arg: step must not be 0.');
    }
    const len = end - start;
    if (step === undefined) {
        step = len > 0 ? 1 : -1;
    }
    const negStep = step < 0;
    if (len > 0 !== step > 0) {
        return [];
    }
    const list = [];
    let current = start;
    while (current !== end && (current < end) !== negStep) {
        list.push(current);
        current += step;
    }
    return list;
}
exports.range = range;
/**
 * Returns the number of times the value is in the list
 *
 * @param list The list.
 * @param val The value, can be aby type.
 */
function listCount(debug, list, val) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('listCount', arguments, 2);
        chk.checkArgs('listCount', 'list', list, [chk.isList]);
    }
    let count = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i] === val) {
            count += 1;
        }
    }
    return count;
}
exports.listCount = listCount;
/**
 * Returns a shallow copy of the list.
 *
 * @param list The list.
 */
function listCopy(debug, list) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('listCopy', arguments, 1);
        chk.checkArgs('listCopy', 'list', list, [chk.isList]);
    }
    return list.slice();
}
exports.listCopy = listCopy;
/**
 * Returns a new list that repeats the contents of the input list n times.
 *
 * @param list The list.
 * @param n
 */
function listRep(debug, list, n) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('listRep', arguments, 2);
        chk.checkArgs('listRep', 'n', n, [chk.isInt]);
    }
    list = Array.isArray(list) ? list : [list];
    const result = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < list.length; j++) {
            result.push(list[j]);
        }
    }
    return result;
}
exports.listRep = listRep;
/**
 * Returns the item in the list specified by index, either a positive or negative integer.
 *
 * @param list  The list.
 * @param idx The index, an integer or a list of integers.
 */
function listGet(debug, list, idx) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('listGet', arguments, 2);
        chk.checkArgs('listGet', 'list', list, [chk.isList]);
        chk.checkArgs('listGet', 'index', idx, [chk.isInt, chk.isIntL]);
    }
    if (Array.isArray(idx)) {
        return idx.map(a_idx => listGet(debug, list, a_idx));
    }
    if (idx < 0) {
        idx = list.length + idx;
    }
    return list[idx];
}
exports.listGet = listGet;
/**
 * Returns the index of the first occurence of the value in the list.
 *
 * If the value does not exist, returns null.
 *
 * @param list The list.
 * @param val The value, can be of any type.
 */
function listFind(debug, list, val) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('listFind', arguments, 2);
        chk.checkArgs('listFind', 'list', list, [chk.isList]);
    }
    const index = list.indexOf(val);
    if (index === -1) {
        return null;
    }
    return index;
}
exports.listFind = listFind;
/**
 * Returns true if the list contains the value, false otherwise
 *
 * @param list The list.
 * @param val The value, can be any type.
 */
function listHas(debug, list, val) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('listHas', arguments, 2);
        chk.checkArgs('listHas', 'list', list, [chk.isList]);
    }
    return list.indexOf(val) !== -1;
}
exports.listHas = listHas;
/**
 * Joins two or more lists into a single list.
 *
 * If the arguments are not lists, then they will be converted into lists.
 *
 * This functions accepts any number of arguments.
 *
 * @param list1 The first list.
 * @param list2 The second list.
 */
function listJoin(debug, list1, list2) {
    if (debug) {
        // nothing to check
    }
    const new_list = [];
    for (let i = 1; i < arguments.length; i++) {
        const arg = arguments[i];
        if (Array.isArray(arg)) {
            for (const item of arg) {
                new_list.push(item);
            }
        }
        else {
            new_list.push(arg);
        }
    }
    return new_list;
}
exports.listJoin = listJoin;
/**
 * Returns a flattened copy of the list.
 *
 * If no depth is specified, then it is flattened my the maximum amount.
 *
 * @param list The list.
 * @param depth (Optional) The depth to flatten to, an integer.
 */
function listFlat(debug, list, depth) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('listFlat', arguments, 2, 1);
        chk.checkArgs('listFlat', 'list', list, [chk.isList]);
        if (depth !== undefined) {
            chk.checkArgs('listFlat', 'depth', depth, [chk.isInt]);
        }
    }
    if (depth !== undefined) {
        return lodash_1.default.flattenDepth(list);
    }
    return lodash_1.default.flattenDeep(list);
}
exports.listFlat = listFlat;
/**
 * Return a list that is rotated, i.e. items from the end of the list are moved to the start of the list.
 * For a positive rotation, items are move from the end to the start of the list.
 * For a negative rotation, items are moved from the start to the end of the list.
 *
 * @param list The list.
 * @param rot The number of items to rotate, an integer.
 */
function listRot(debug, list, rot) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('listRot', arguments, 2);
        chk.checkArgs('listRot', 'list', list, [chk.isList]);
        chk.checkArgs('listRot', 'rot', rot, [chk.isInt]);
    }
    const len = list.length;
    const split = (len - rot) % len;
    const start = list.slice(split, len);
    const end = list.slice(0, split);
    return start.concat(end);
}
exports.listRot = listRot;
/**
 * Return a sub-list from the list.
 *
 * @param list The list.
 * @param start The start index of the slice operation, an integer.
 * @param end (Optional) The end index of the slice operation, an integer. Defaults to the length of the list.
 */
function listSlice(debug, list, start, end) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('listSlice', arguments, 3, 2);
        chk.checkArgs('listSlice', 'list', list, [chk.isList]);
        chk.checkArgs('listSlice', 'start', start, [chk.isInt]);
        if (end !== undefined) {
            chk.checkArgs('listSlice', 'end', end, [chk.isInt]);
        }
    }
    return list.slice(start, end);
}
exports.listSlice = listSlice;
/**
 * Creates a new list, with the items in reverse order.
 *
 * @param lists  The list to reverse.
 */
function listRev(debug, list) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('listRev', arguments, 1);
        chk.checkArgs('listRev', 'list', list, [chk.isList]);
    }
    return list.slice().reverse();
}
exports.listRev = listRev;
/**
 * Returns a new list of all the values that evaluate to true.
 *
 * If the second argument is provided, then it
 * returns a new list of all the values in list1 that evaluate to true in list2.
 *
 * @param list1 The list.
 * @param list2 (Optional) A list of values, to be used to cull the first list.
 */
function listCull(debug, list1, list2) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('listCull', arguments, 2, 1);
        chk.checkArgs('listCull', 'list1', list1, [chk.isList]);
        if (list2 !== undefined) {
            chk.checkArgs('listCull', 'list2', list2, [chk.isList]);
        }
    }
    list2 = list2 !== undefined ? list2 : list1;
    const result = [];
    const list2_len = list2.length;
    for (let i = 0; i < list1.length; i++) {
        const val = (i < list2_len) ? list2[i] : list2[i % list2_len];
        if (val) {
            result.push(list1[i]);
        }
    }
    return result;
}
exports.listCull = listCull;
/**
 * Creates a new list, with the items in sorted order.
 *
 * If no second argument is provided, then the list is sorted in ascending order.
 *
 * If a second argument is provided, then it should be a list of the same length as the first argument.
 * In this case, the first list is sorted according to ascending order of the values in the second list.
 *
 * @param lists  The list of lists.
 */
function listSort(debug, list1, list2) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('listSort', arguments, 2, 1);
        chk.checkArgs('listSort', 'list1', list1, [chk.isList]);
        if (list2 !== undefined) {
            chk.checkArgs('listSort', 'list2', list1, [chk.isList]);
            (0, _check_inline_args_1.checkListsSameLen)('listSort', arguments);
        }
    }
    if (list2 !== undefined) {
        const zipped = lodash_1.default.zip(list1, list2);
        zipped.sort((a, b) => a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0);
        const unzipped = lodash_1.default.unzip(zipped);
        return unzipped[0];
    }
    return list1.slice().sort((a, b) => a > b ? 1 : a < b ? -1 : 0);
}
exports.listSort = listSort;
/**
 * Converts a set of lists from rows into columns.
 *
 * If no second argument is provided, it assume the the first argument consists of a list of lists.
 *
 * If a second argument is provided, then it should be a list of the same length as the first argument.
 * In this case, the items in the first and second lists are reaarranged to generate a new set of lists.
 *
 * This function also accepts additional lists of arguments.
 *
 * @param list1  The first row list.
 * @param list2  (Optional) The second row list, which must have the same length as the first.
 */
function listZip(debug, list1, list2) {
    if (debug) {
        if (list2 === undefined) {
            chk.checkArgs('listZip', 'list1', list1, [chk.isLList]);
        }
        else {
            chk.checkArgs('listZip', 'list1', list1, [chk.isList]);
            chk.checkArgs('listZip', 'list2', list2, [chk.isList]);
            (0, _check_inline_args_1.checkListsSameLen)('listZip', arguments);
        }
    }
    if (arguments.length === 2) {
        return lodash_1.default.unzip(list1);
    }
    const lists = Array.from(arguments).slice(1);
    return lodash_1.default.zip(...lists);
}
exports.listZip = listZip;
/**
 * Returns true if the values in the two lists are equal.
 *
 * @param list1 The first list.
 * @param list2 The second list.
 */
function listEq(debug, list1, list2) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('listEq', arguments, 2);
        chk.checkArgs('listEq', 'list1', list1, [chk.isList]);
        chk.checkArgs('listEq', 'list2', list2, [chk.isList]);
    }
    return lodash_1.default.isEqual(list1, list2);
}
exports.listEq = listEq;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2xpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29yZS9pbmxpbmUvX2xpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsb0RBQTRCO0FBQzVCLHFEQUF1QztBQUN2Qyw4REFBd0U7QUFDeEU7Ozs7Ozs7R0FPRztBQUNILFNBQWdCLEtBQUssQ0FBQyxLQUFjLEVBQUUsS0FBYSxFQUFFLEdBQVksRUFBRSxJQUFhO0lBQzVFLElBQUksS0FBSyxFQUFFO1FBQ1AsSUFBQSxpQ0FBWSxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FBRTtRQUMzRSxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7WUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FBSztLQUNwRjtJQUNELElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztLQUFFO0lBQ3pGLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtRQUFFLEdBQUcsR0FBRyxLQUFLLENBQUM7UUFBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0tBQUU7SUFDbEQsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQUUs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