// =====================================================================================================================
// util - check type
// =====================================================================================================================
/**
 *
 * @param fn_name
 * @param arg_name
 * @param arg
 * @param check_fns
 */
export function checkArgs(fn_name, arg_name, arg, check_fns) {
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
export function isDict(arg) {
    if (Array.isArray(arg) || typeof arg === 'string' || arg === null || typeof arg !== 'object') {
        throw new Error();
    }
}
// List
export function isList(arg) {
    if (!Array.isArray(arg)) {
        throw new Error();
    }
}
// List
export function isLList(arg) {
    if (!Array.isArray(arg) || !Array.isArray(arg[0])) {
        throw new Error();
    }
}
// Any
export function isAny(arg) {
    if (arg === undefined) {
        throw new Error();
    }
}
// Any list
export function isAnyL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isAny(arg[i]);
    }
}
// Null
export function isNull(arg) {
    if (arg !== null) {
        throw new Error();
    }
}
// Null list
export function isNullL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isNull(arg[i]);
    }
}
// Boolean
export function isBool(arg) {
    if (typeof arg !== 'boolean') {
        throw new Error();
    }
}
// Boolean list
export function isBoolL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isBool(arg[i]);
    }
}
// String
export function isStr(arg) {
    if (typeof arg !== 'string') {
        throw new Error();
    }
}
// String list
export function isStrL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isStr(arg[i]);
    }
}
// Numbers
export function isNum(arg) {
    if (isNaN(arg)) { // } || isNaN(parseInt(arg, 10))) {
        throw new Error();
    }
}
// Number list
export function isNumL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isNum(arg[i]);
    }
}
// Number between 0 and 1
export function isNum01(arg) {
    isNum(arg);
    if (arg < 0 || arg > 1) {
        throw new Error();
    }
}
// Number list between 0 and 1
export function isNum01L(arg) {
    isNumL(arg);
    for (let i = 0; i < arg.length; i++) {
        isNum01(arg[i]);
    }
}
// Integer
export function isInt(arg) {
    if (!Number.isInteger(arg)) {
        throw new Error();
    }
}
// List Integers
export function isIntL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isInt(arg[i]);
    }
}
// List Two strings
export function isStrStr(arg) {
    isStrL(arg);
    isLLen(arg, 2);
}
// List String and number
export function isStrNum(arg) {
    isLLen(arg, 2);
    isStr(arg[0]);
    isNum(arg[1]);
}
// List Two numbers
export function isXY(arg) {
    isNumL(arg);
    isLLen(arg, 2);
}
// List Number and Int
export function isXYInt(arg) {
    isIntL(arg);
    isLLen(arg, 2);
}
// List Colour - three numbers between 0 and 1
export function isColor(arg) {
    isNumL(arg);
    isLLen(arg, 3);
    isNum01L(arg);
    return;
}
// List Three Numbers
export function isXYZ(arg) {
    isNumL(arg);
    isLLen(arg, 3);
}
// List of Lists Three numbers
export function isXYZL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isXYZ(arg[i]);
    }
}
export function isXYZLL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isXYZL(arg[i]);
    }
}
export function isPln(arg) {
    isXYZL(arg);
    isLLen(arg, 3);
}
export function isPlnL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isPln(arg[i]);
    }
}
export function isBBox(arg) {
    isXYZL(arg);
    isLLen(arg, 4);
}
export function isBBoxL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isBBox(arg[i]);
    }
}
export function isRay(arg) {
    isXYZL(arg);
    isLLen(arg, 2);
}
export function isRayL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isRay(arg[i]);
    }
}
export function isRayLL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isRayL(arg[i]);
    }
}
// List of specified length
export function isLLen(arg, len) {
    if (arg.length !== len) {
        throw new Error();
    }
}
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
export function getDataTypeStrFromValue(arg) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NoZWNrX3R5cGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvcmUvX2NoZWNrX3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHdIQUF3SDtBQUN4SCxvQkFBb0I7QUFDcEIsd0hBQXdIO0FBSXhIOzs7Ozs7R0FNRztBQUNILE1BQU0sVUFBVSxTQUFTLENBQUMsT0FBZSxFQUFFLFFBQWdCLEVBQUUsR0FBUSxFQUFFLFNBQXFCO0lBRXhGLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztJQUNqQixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDbkIsSUFBSSxHQUFHLENBQUM7SUFDUixJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7UUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLFFBQVEsR0FBRyxlQUFlLEdBQUcsTUFBTSxDQUFDLENBQUM7S0FDekU7SUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN2QyxJQUFJO1lBQ0EsR0FBRyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMzQjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLFNBQVM7U0FDWjtRQUNELElBQUksR0FBRyxJQUFJLENBQUM7UUFDWixNQUFNLENBQUMsU0FBUztLQUNuQjtJQUNELElBQUksSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFLGdFQUFnRTtRQUNsRixrRkFBa0Y7UUFDbEYsK0NBQStDO1FBQy9DLElBQUksT0FBTyxHQUNQLHFDQUFxQyxHQUFHLE9BQU8sR0FBRyx3QkFBd0I7WUFDMUUsTUFBTTtZQUNOLHNCQUFzQixHQUFHLE9BQU8sR0FBRyxTQUFTO1lB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