"use strict";
// =====================================================================================================================
// util - check type
// =====================================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataTypeStrFromValue = exports.isLLen = exports.isRayLL = exports.isRayL = exports.isRay = exports.isBBoxL = exports.isBBox = exports.isPlnL = exports.isPln = exports.isXYZLL = exports.isXYZL = exports.isXYZ = exports.isColor = exports.isXYInt = exports.isXY = exports.isStrNum = exports.isStrStr = exports.isIntL = exports.isInt = exports.isNum01L = exports.isNum01 = exports.isNumL = exports.isNum = exports.isStrL = exports.isStr = exports.isBoolL = exports.isBool = exports.isNullL = exports.isNull = exports.isAnyL = exports.isAny = exports.isLList = exports.isList = exports.isDict = exports.checkArgs = void 0;
/**
 *
 * @param fn_name
 * @param arg_name
 * @param arg
 * @param check_fns
 */
function checkArgs(fn_name, arg_name, arg, check_fns) {
    let pass = false;
    const err_arr = [];
    let ret;
    if (arg === undefined) {
        throw new Error(fn_name + ': ' + arg_name + ' is undefined' + '<br>');
    }
    for (let i = 0; i < check_fns.length; i++) {
        try {
            ret = check_fns[i](arg);
        }
        catch (err) {
            err_arr.push(err.message + '<br>');
            continue;
        }
        pass = true;
        break; // passed
    }
    if (pass === false) { // Failed all tests: argument does not fall into any valid types
        // const ret_msg = fn_name + ': ' + arg_name + ' failed the following tests:<br>';
        // throw new Error(ret_msg + err_arr.join(''));
        let err_msg = 'One of the arguments passed to the ' + fn_name + ' function is invalid. ' +
            '<ul>' +
            '<li>Function name: "' + fn_name + '" </li>' +
            '<li>Parameter name: "' + arg_name + '" </li>' +
            '<li>Argument value: ' + _getSampleStr(arg) + ' </li>' +
            '<li>Argument value data type: ' + getDataTypeStrFromValue(arg) + ' </li>' +
            '</ul>' +
            'The "' + arg_name + '" parameter accepts the following data types:' +
            '<ul>';
        for (const check_fn of check_fns) {
            err_msg = err_msg + '<li>' + _getDataTypeStrFromFunc(check_fn) + ' </li>';
        }
        err_msg = err_msg +
            '</ul>' +
            ' Make sure that the agument passed to the "' + arg_name + '" parameter matches one of the above perimtted data types.';
        throw new Error(err_msg);
    }
    return ret;
}
exports.checkArgs = checkArgs;
function _getSampleStr(arg) {
    let str;
    if (Array.isArray(arg)) {
        if (arg.length > 20) {
            str = JSON.stringify(arg.slice(0, 20)) + '...array items truncated';
        }
        else {
            str = JSON.stringify(arg);
        }
    }
    else {
        str = JSON.stringify(arg);
    }
    if (str.length > 1000) {
        return str.substring(0, 1000) + ' ...data truncated';
    }
    return str;
}
// Dict
function isDict(arg) {
    if (Array.isArray(arg) || typeof arg === 'string' || arg === null || typeof arg !== 'object') {
        throw new Error();
    }
}
exports.isDict = isDict;
// List
function isList(arg) {
    if (!Array.isArray(arg)) {
        throw new Error();
    }
}
exports.isList = isList;
// List
function isLList(arg) {
    if (!Array.isArray(arg) || !Array.isArray(arg[0])) {
        throw new Error();
    }
}
exports.isLList = isLList;
// Any
function isAny(arg) {
    if (arg === undefined) {
        throw new Error();
    }
}
exports.isAny = isAny;
// Any list
function isAnyL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isAny(arg[i]);
    }
}
exports.isAnyL = isAnyL;
// Null
function isNull(arg) {
    if (arg !== null) {
        throw new Error();
    }
}
exports.isNull = isNull;
// Null list
function isNullL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isNull(arg[i]);
    }
}
exports.isNullL = isNullL;
// Boolean
function isBool(arg) {
    if (typeof arg !== 'boolean') {
        throw new Error();
    }
}
exports.isBool = isBool;
// Boolean list
function isBoolL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isBool(arg[i]);
    }
}
exports.isBoolL = isBoolL;
// String
function isStr(arg) {
    if (typeof arg !== 'string') {
        throw new Error();
    }
}
exports.isStr = isStr;
// String list
function isStrL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isStr(arg[i]);
    }
}
exports.isStrL = isStrL;
// Numbers
function isNum(arg) {
    if (isNaN(arg)) { // } || isNaN(parseInt(arg, 10))) {
        throw new Error();
    }
}
exports.isNum = isNum;
// Number list
function isNumL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isNum(arg[i]);
    }
}
exports.isNumL = isNumL;
// Number between 0 and 1
function isNum01(arg) {
    isNum(arg);
    if (arg < 0 || arg > 1) {
        throw new Error();
    }
}
exports.isNum01 = isNum01;
// Number list between 0 and 1
function isNum01L(arg) {
    isNumL(arg);
    for (let i = 0; i < arg.length; i++) {
        isNum01(arg[i]);
    }
}
exports.isNum01L = isNum01L;
// Integer
function isInt(arg) {
    if (!Number.isInteger(arg)) {
        throw new Error();
    }
}
exports.isInt = isInt;
// List Integers
function isIntL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isInt(arg[i]);
    }
}
exports.isIntL = isIntL;
// List Two strings
function isStrStr(arg) {
    isStrL(arg);
    isLLen(arg, 2);
}
exports.isStrStr = isStrStr;
// List String and number
function isStrNum(arg) {
    isLLen(arg, 2);
    isStr(arg[0]);
    isNum(arg[1]);
}
exports.isStrNum = isStrNum;
// List Two numbers
function isXY(arg) {
    isNumL(arg);
    isLLen(arg, 2);
}
exports.isXY = isXY;
// List Number and Int
function isXYInt(arg) {
    isIntL(arg);
    isLLen(arg, 2);
}
exports.isXYInt = isXYInt;
// List Colour - three numbers between 0 and 1
function isColor(arg) {
    isNumL(arg);
    isLLen(arg, 3);
    isNum01L(arg);
    return;
}
exports.isColor = isColor;
// List Three Numbers
function isXYZ(arg) {
    isNumL(arg);
    isLLen(arg, 3);
}
exports.isXYZ = isXYZ;
// List of Lists Three numbers
function isXYZL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isXYZ(arg[i]);
    }
}
exports.isXYZL = isXYZL;
function isXYZLL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isXYZL(arg[i]);
    }
}
exports.isXYZLL = isXYZLL;
function isPln(arg) {
    isXYZL(arg);
    isLLen(arg, 3);
}
exports.isPln = isPln;
function isPlnL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isPln(arg[i]);
    }
}
exports.isPlnL = isPlnL;
function isBBox(arg) {
    isXYZL(arg);
    isLLen(arg, 4);
}
exports.isBBox = isBBox;
function isBBoxL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isBBox(arg[i]);
    }
}
exports.isBBoxL = isBBoxL;
function isRay(arg) {
    isXYZL(arg);
    isLLen(arg, 2);
}
exports.isRay = isRay;
function isRayL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isRay(arg[i]);
    }
}
exports.isRayL = isRayL;
function isRayLL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isRayL(arg[i]);
    }
}
exports.isRayLL = isRayLL;
// List of specified length
function isLLen(arg, len) {
    if (arg.length !== len) {
        throw new Error();
    }
}
exports.isLLen = isLLen;
/**
 *
 * @param check_fn
 */
function _getDataTypeStrFromFunc(check_fn) {
    switch (check_fn) {
        case isAny:
            return 'anything';
        case isNull:
            return 'a null value';
        case isNullL:
            return 'a list of null values';
        case isList:
            return 'a list of values';
        case isLList:
            return 'a list of lists of values';
        case isDict:
            return 'a dictionary of values';
        case isBool:
            return 'a boolean value';
        case isBoolL:
            return 'a list of booleans';
        case isStr:
            return 'a string';
        case isStrL:
            return 'a list of strings';
        case isStrStr:
            return 'a list containing two strings';
        case isStrNum:
            return 'a list containg one string and one number';
        case isNum:
            return 'a number';
        case isNumL:
            return 'a list of numbers';
        case isInt:
            return 'an integer';
        case isXY:
            return 'a list containing two numbers';
        case isXYInt:
            return 'a list containing two integers';
        case isColor:
            return 'a list containing three numbers between 0 and 1';
        case isXYZ:
            return 'a list containing three numbers';
        case isXYZL:
            return 'a list of lists conatining three numbers';
        case isXYZLL:
            return 'a nested list of lists conatining three numbers';
        case isPln:
            return 'a plane, defined by a list of three lists, each conatining three numbers';
        case isPlnL:
            return 'a list of planes, each defined by a list of three lists, each conatining three numbers';
        case isBBox:
            return 'a bounding box, defined by a list of four lists, each conatining three numbers';
        case isBBoxL:
            return 'a list of bounding boxes, each defined by a list of four lists, each conatining three numbers';
        case isRay:
            return 'a ray, defined by a list of two lists, each conatining three numbers';
        case isRayL:
            return 'a list of rays, each defined by a list of two lists, each conatining three numbers';
        case isRayLL:
            return 'a nested list of rays, each defined by a list of two lists, each conatining three numbers';
        default:
            return 'sorry... arg type not found';
    }
}
/**
 *
 * @param arg
 */
function getDataTypeStrFromValue(arg) {
    if (Array.isArray(arg)) {
        if (arg.length === 0) {
            return 'empty list';
        }
        const types_set = new Set();
        for (const a_arg of arg) {
            types_set.add(_typeOf(a_arg));
        }
        const types_arr = Array.from(types_set.values());
        if (types_arr.length === 1) {
            return 'a list of ' + arg.length + ' ' + types_arr[0] + 's';
        }
        else {
            let str = 'a list of length ' + arg.length + ', containing ';
            for (let i = 0; i < types_arr.length; i++) {
                if (i < types_arr.length - 2) {
                    str += types_arr[i] + 's, ';
                }
                else if (i < types_arr.length - 1) {
                    str += types_arr[i] + 's and ';
                }
                else {
                    str += types_arr[i] + 's';
                }
            }
            return str;
        }
    }
    return _typeOf(arg);
}
exports.getDataTypeStrFromValue = getDataTypeStrFromValue;
function _typeOf(arg) {
    if (arg === undefined) {
        return 'undefined';
    }
    if (arg === null) {
        return 'null';
    }
    if (Array.isArray(arg)) {
        return 'list';
    }
    if (typeof arg === 'object') {
        return 'dict';
    }
    return typeof arg;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NoZWNrX3R5cGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvcmUvX2NoZWNrX3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx3SEFBd0g7QUFDeEgsb0JBQW9CO0FBQ3BCLHdIQUF3SDs7O0FBSXhIOzs7Ozs7R0FNRztBQUNILFNBQWdCLFNBQVMsQ0FBQyxPQUFlLEVBQUUsUUFBZ0IsRUFBRSxHQUFRLEVBQUUsU0FBcUI7SUFFeEYsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ2pCLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNuQixJQUFJLEdBQUcsQ0FBQztJQUNSLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtRQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsUUFBUSxHQUFHLGVBQWUsR0FBRyxNQUFNLENBQUMsQ0FBQztLQUN6RTtJQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3ZDLElBQUk7WUFDQSxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzNCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDbkMsU0FBUztTQUNaO1FBQ0QsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNaLE1BQU0sQ0FBQyxTQUFTO0tBQ25CO0lBQ0QsSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUUsZ0VBQWdFO1FBQ2xGLGtGQUFrRjtRQUNsRiwrQ0FBK0M7UUFDL0MsSUFBSSxPQUFPLEdBQ1AscUNBQXFDLEdBQUcsT0FBTyxHQUFHLHdCQUF3QjtZQUMxRSxNQUFNO1lBQ04sc0JBQXNCLEdBQUcsT0FBTyxHQUFHLFNBQVM7WUFDNUMsdUJBQXVCLEdBQUcsUUFBUSxHQUFHLFNBQVM7WUFDOUMsc0JBQXNCLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVE7WUFDdEQsZ0NBQWdDLEdBQUcsdUJBQXVCLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUTtZQUMxRSxPQUFPO1lBQ1AsT0FBTyxHQUFHLFFBQVEsR0FBRywrQ0FBK0M7WUFDcEUsTUFBTSxDQUFDO1FBQ1gsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUU7WUFDOUIsT0FBTyxHQUFHLE9BQU8sR0FBRyxNQUFNLEdBQUcsdUJBQXVCLENBQUMsUUFBUSxDQUFDLEdBQUcsUUFBUSxDQUFDO1NBQzdFO1FBQ0QsT0FBTyxHQUFHLE9BQU87WUFDYixPQUFPO1lBQ1AsNkNBQTZDLEdBQUcsUUFBUSxHQUFHLDREQUE0RCxDQUFDO1FBQzVILE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDNUI7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUF4Q0QsOEJBd0NDO0FBQ0QsU0FBUyxhQUFhLENBQUMsR0FBUTtJQUMzQixJQUFJLEdBQVcsQ0FBQztJQUNoQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDcEIsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtZQUNqQixHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLDBCQUEwQixDQUFDO1NBQ3ZFO2FBQU07WUFDSCxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM3QjtLQUNKO1NBQU07UUFDSCxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUM3QjtJQUNELElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUU7UUFDbkIsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxvQkFBb0IsQ0FBQztLQUN4RDtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUdELE9BQU87QUFDUCxTQUFnQixNQUFNLENBQUMsR0FBUTtJQUMzQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLEdBQUcsS0FBSyxJQUFJLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1FBQzFGLE1BQU0sSUFBSSxLQUFLLEVBQUcsQ0FBQztLQUN0QjtBQUNMLENBQUM7QUFKRCx3QkFJQztBQUNELE9BQU87QUFDUCxTQUFnQixNQUFNLENBQUMsR0FBUTtJQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNyQixNQUFNLElBQUksS0FBSyxFQUFHLENBQUM7S0FDdEI7QUFDTCxDQUFDO0FBSkQsd0JBSUM7QUFDRCxPQUFPO0FBQ1AsU0FBZ0IsT0FBTyxDQUFDLEdBQVE7SUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQy9DLE1BQU0sSUFBSSxLQUFLLEVBQUcsQ0FBQztLQUN0QjtBQUNMLENBQUM7QUFKRCwwQkFJQztBQUNELE1BQU07QUFDTixTQUFnQixLQUFLLENBQUMsR0FBUTtJQUMxQixJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7UUFDbkIsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO0tBQ3JCO0FBQ0wsQ0FBQztBQUpELHNCQUlDO0FBQ0QsV0FBVztBQUNYLFNBQWdCLE1BQU0sQ0FBQyxHQUFRO0lBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2pDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQjtBQUNMLENBQUM7QUFMRCx3QkFLQztBQUNELE9BQU87QUFDUCxTQUFnQixNQUFNLENBQUMsR0FBUTtJQUMzQixJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7UUFDZCxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7S0FDckI7QUFDTCxDQUFDO0FBSkQsd0JBSUM7QUFDRCxZQUFZO0FBQ1osU0FBZ0IsT0FBTyxDQUFDLEdBQVE7SUFDNUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDakMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xCO0FBQ0wsQ0FBQztBQUxELDBCQUtDO0FBQ0QsVUFBVTtBQUNWLFNBQWdCLE1BQU0sQ0FBQyxHQUFZO0lBQy9CLElBQUksT0FBTyxHQUFHLEtBQUssU0FBUyxFQUFFO1FBQzFCLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztLQUNyQjtBQUNMLENBQUM7QUFKRCx3QkFJQztBQUNELGVBQWU7QUFDZixTQUFnQixPQUFPLENBQUMsR0FBYztJQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7QUFDTCxDQUFDO0FBTEQsMEJBS0M7QUFDRCxTQUFTO0FBQ1QsU0FBZ0IsS0FBSyxDQUFDLEdBQVc7SUFDN0IsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7UUFDekIsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO0tBQ3JCO0FBQ0wsQ0FBQztBQUpELHNCQUlDO0FBQ0QsY0FBYztBQUNkLFNBQWdCLE1BQU0sQ0FBQyxHQUFhO0lBQ2hDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2pDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQjtBQUNMLENBQUM7QUFMRCx3QkFLQztBQUNELFVBQVU7QUFDVixTQUFnQixLQUFLLENBQUMsR0FBVztJQUM3QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLG1DQUFtQztRQUNqRCxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7S0FDckI7QUFDTCxDQUFDO0FBSkQsc0JBSUM7QUFDRCxjQUFjO0FBQ2QsU0FBZ0IsTUFBTSxDQUFDLEdBQWE7SUFDaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDakMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2pCO0FBQ0wsQ0FBQztBQUxELHdCQUtDO0FBQ0QseUJBQXlCO0FBQ3pCLFNBQWdCLE9BQU8sQ0FBQyxHQUFRO0lBQzVCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNYLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO1FBQ3BCLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztLQUNyQjtBQUNMLENBQUM7QUFMRCwwQkFLQztBQUNELDhCQUE4QjtBQUM5QixTQUFnQixRQUFRLENBQUMsR0FBUTtJQUM3QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkI7QUFDTCxDQUFDO0FBTEQsNEJBS0M7QUFDRCxVQUFVO0FBQ1YsU0FBZ0IsS0FBSyxDQUFDLEdBQVE7SUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDeEIsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO0tBQ3JCO0FBQ0wsQ0FBQztBQUpELHNCQUlDO0FBQ0QsZ0JBQWdCO0FBQ2hCLFNBQWdCLE1BQU0sQ0FBQyxHQUFVO0lBQzdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2pDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQjtBQUNMLENBQUM7QUFMRCx3QkFLQztBQUNELG1CQUFtQjtBQUNuQixTQUFnQixRQUFRLENBQUMsR0FBcUI7SUFDMUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1osTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBSEQsNEJBR0M7QUFDRCx5QkFBeUI7QUFDekIsU0FBZ0IsUUFBUSxDQUFDLEdBQXFCO0lBQzFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDZixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZCxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsQ0FBQztBQUpELDRCQUlDO0FBQ0QsbUJBQW1CO0FBQ25CLFNBQWdCLElBQUksQ0FBQyxHQUFRO0lBQ3pCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQUhELG9CQUdDO0FBQ0Qsc0JBQXNCO0FBQ3RCLFNBQWdCLE9BQU8sQ0FBQyxHQUFRO0lBQzVCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQUhELDBCQUdDO0FBQ0QsOENBQThDO0FBQzlDLFNBQWdCLE9BQU8sQ0FBQyxHQUFXO0lBQy9CLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDZixRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZCxPQUFPO0FBQ1gsQ0FBQztBQUxELDBCQUtDO0FBQ0QscUJBQXFCO0FBQ3JCLFNBQWdCLEtBQUssQ0FBQyxHQUFTO0lBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQUhELHNCQUdDO0FBQ0QsOEJBQThCO0FBQzlCLFNBQWdCLE1BQU0sQ0FBQyxHQUFXO0lBQzlCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2pDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQjtBQUNMLENBQUM7QUFMRCx3QkFLQztBQUNELFNBQWdCLE9BQU8sQ0FBQyxHQUFhO0lBQ2pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN0QjtBQUNHLENBQUM7QUFMTCwwQkFLSztBQUNMLFNBQWdCLEtBQUssQ0FBQyxHQUFXO0lBQzdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQUhELHNCQUdDO0FBQ0QsU0FBZ0IsTUFBTSxDQUFDLEdBQWE7SUFDaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDckMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2pCO0FBQ0csQ0FBQztBQUxMLHdCQUtLO0FBQ0wsU0FBZ0IsTUFBTSxDQUFDLEdBQVU7SUFDN0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1osTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBSEQsd0JBR0M7QUFDRCxTQUFnQixPQUFPLENBQUMsR0FBWTtJQUNoQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNyQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7QUFDRyxDQUFDO0FBTEwsMEJBS0s7QUFDTCxTQUFnQixLQUFLLENBQUMsR0FBUztJQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25CLENBQUM7QUFIRCxzQkFHQztBQUNELFNBQWdCLE1BQU0sQ0FBQyxHQUFXO0lBQzlCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2pDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQjtBQUNMLENBQUM7QUFMRCx3QkFLQztBQUNELFNBQWdCLE9BQU8sQ0FBQyxHQUFhO0lBQ2pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsQjtBQUNMLENBQUM7QUFMRCwwQkFLQztBQUVELDJCQUEyQjtBQUMzQixTQUFnQixNQUFNLENBQUMsR0FBVSxFQUFFLEdBQVc7SUFDMUMsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtRQUNwQixNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7S0FDckI7QUFDTCxDQUFDO0FBSkQsd0JBSUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLHVCQUF1QixDQUFDLFFBQWE7SUFDMUMsUUFBUSxRQUFRLEVBQUU7UUFDZCxLQUFLLEtBQUs7WUFDTixPQUFPLFVBQVUsQ0FBQztRQUN0QixLQUFLLE1BQU07WUFDUCxPQUFPLGNBQWMsQ0FBQztRQUMxQixLQUFLLE9BQU87WUFDUixPQUFPLHVCQUF1QixDQUFDO1FBQ25DLEtBQUssTUFBTTtZQUNQLE9BQU8sa0JBQWtCLENBQUM7UUFDOUIsS0FBSyxPQUFPO1lBQ1IsT0FBTywyQkFBMkIsQ0FBQztRQUN2QyxLQUFLLE1BQU07WUFDUCxPQUFPLHdCQUF3QixDQUFDO1FBQ3BDLEtBQUssTUFBTTtZQUNQLE9BQU8saUJBQWlCLENBQUM7UUFDN0IsS0FBSyxPQUFPO1lBQ1IsT0FBTyxvQkFBb0IsQ0FBQztRQUNoQyxLQUFLLEtBQUs7WUFDTixPQUFPLFVBQVUsQ0FBQztRQUN0QixLQUFLLE1BQU07WUFDUCxPQUFPLG1CQUFtQixDQUFDO1FBQy9CLEtBQUssUUFBUTtZQUNULE9BQU8sK0JBQStCLENBQUM7UUFDM0MsS0FBSyxRQUFRO1lBQ1QsT0FBTywyQ0FBMkMsQ0FBQztRQUN2RCxLQUFLLEtBQUs7WUFDTixPQUFPLFVBQVUsQ0FBQztRQUN0QixLQUFLLE1BQU07WUFDUCxPQUFPLG1CQUFtQixDQUFDO1FBQy9CLEtBQUssS0FBSztZQUNOLE9BQU8sWUFBWSxDQUFDO1FBQ3hCLEtBQUssSUFBSTtZQUNMLE9BQU8sK0JBQStCLENBQUM7UUFDM0MsS0FBSyxPQUFPO1lBQ1IsT0FBTyxnQ0FBZ0MsQ0FBQztRQUM1QyxLQUFLLE9BQU87WUFDUixPQUFPLGlEQUFpRCxDQUFDO1FBQzdELEtBQUssS0FBSztZQUNOLE9BQU8saUNBQWlDLENBQUM7UUFDN0MsS0FBSyxNQUFNO1lBQ1AsT0FBTywwQ0FBMEMsQ0FBQztRQUN0RCxLQUFLLE9BQU87WUFDUixPQUFPLGlEQUFpRCxDQUFDO1FBQzdELEtBQUssS0FBSztZQUNOLE9BQU8sMEVBQTBFLENBQUM7UUFDdEYsS0FBSyxNQUFNO1lBQ1AsT0FBTyx3RkFBd0YsQ0FBQztRQUNwRyxLQUFLLE1BQU07WUFDUCxPQUFPLGdGQUFnRixDQUFDO1FBQzVGLEtBQUssT0FBTztZQUNSLE9BQU8sK0ZBQStGLENBQUM7UUFDM0csS0FBSyxLQUFLO1lBQ04sT0FBTyxzRUFBc0UsQ0FBQztRQUNsRixLQUFLLE1BQU07WUFDUCxPQUFPLG9GQUFvRixDQUFDO1FBQ2hHLEtBQUssT0FBTztZQUNSLE9BQU8sMkZBQTJGLENBQUM7UUFDdkc7WUFDSSxPQUFPLDZCQUE2QixDQUFDO0tBQzVDO0FBQ0wsQ0FBQztBQUVEOzs7R0FHRztBQUNILFNBQWdCLHVCQUF1QixDQUFDLEdBQVE7SUFDNUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3BCLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbEIsT0FBTyxZQUFZLENBQUM7U0FDdkI7UUFDRCxNQUFNLFNBQVMsR0FBZ0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUN6QyxLQUFLLE1BQU0sS0FBSyxJQUFJLEdBQUcsRUFBRTtZQUNyQixTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ2pDO1FBQ0QsTUFBTSxTQUFTLEdBQWEsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUMzRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLE9BQU8sWUFBWSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7U0FDL0Q7YUFBTTtZQUNILElBQUksR0FBRyxHQUFHLG1CQUFtQixHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsZUFBZSxDQUFDO1lBQzdELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN2QyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDMUIsR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7aUJBQy9CO3FCQUFNLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNqQyxHQUFHLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztpQkFDbEM7cUJBQU07b0JBQ0gsR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7aUJBQzdCO2FBQ0o7WUFDRCxPQUFPLEdBQUcsQ0FBQztTQUNkO0tBQ0o7SUFDRCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBM0JELDBEQTJCQztBQUNELFNBQVMsT0FBTyxDQUFDLEdBQVE7SUFDckIsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1FBQUUsT0FBTyxXQUFXLENBQUM7S0FBRTtJQUM5QyxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7UUFBRSxPQUFPLE1BQU0sQ0FBQztLQUFFO0lBQ3BDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUFFLE9BQU8sTUFBTSxDQUFDO0tBQUU7SUFDMUMsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7UUFBRSxPQUFPLE1BQU0sQ0FBQztLQUFFO0lBQy9DLE9BQU8sT0FBTyxHQUFHLENBQUM7QUFDdEIsQ0FBQyJ9