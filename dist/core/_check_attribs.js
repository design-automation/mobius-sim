import * as chk from './_check_types';
// =========================================================================================================================================
// Attribute Checks
// =========================================================================================================================================
export function checkAttribName(fn_name, attrib_name) {
    chk.isStr(attrib_name); // check arg is string
    if (attrib_name === undefined) {
        throw new Error(fn_name + ': ' + 'attrib_name is undefined');
    }
    if (attrib_name.length === 0) {
        throw new Error(fn_name + ': ' + 'attrib_name not specified');
    }
    if (attrib_name.search(/\W/) !== -1) {
        throw new Error(fn_name + ': ' + 'attrib_name contains restricted characters');
    }
    if (attrib_name[0].search(/[0-9]/) !== -1) {
        throw new Error(fn_name + ': ' + 'attrib_name should not start with numbers');
    }
    // blocks writing to id
    if (attrib_name === 'id') {
        throw new Error(fn_name + ': id is not modifiable!');
    }
}
export function checkAttribIdxKey(fn_name, idx_or_key) {
    // -- check defined index
    if (typeof idx_or_key === 'number') {
        // check if index is number
        chk.isNum(idx_or_key);
        // this is an item in a list, the item value can be any
    }
    else if (typeof idx_or_key === 'string') {
        // check if index is number
        chk.isStr(idx_or_key);
        // this is an item in an object, the item value can be any
    }
    else {
        throw new Error(fn_name + ': index or key is not a valid type: ' + idx_or_key);
    }
}
export function checkAttribNameIdxKey(fn_name, attrib) {
    let attrib_name = null;
    let attrib_idx_key = null;
    // deconstruct the attrib arg
    if (Array.isArray(attrib)) {
        if (attrib.length !== 2) {
            throw new Error(fn_name + ': ' + 'attrib_name not specified');
        }
        attrib_name = attrib[0];
        attrib_idx_key = attrib[1];
    }
    else {
        attrib_name = attrib;
    }
    // check that the name is ok
    checkAttribName(fn_name, attrib_name);
    // check that the array index or object key is ok
    if (attrib_idx_key !== null) {
        checkAttribIdxKey(fn_name, attrib_idx_key);
    }
    // return the deconstructed attrib arg, attrib_idx_key may be null
    return [attrib_name, attrib_idx_key];
}
export function splitAttribNameIdxKey(fn_name, attrib) {
    let attrib_name = null;
    let attrib_idx_key = null;
    // deconstruct the attrib arg
    if (Array.isArray(attrib)) {
        attrib_name = attrib[0];
        attrib_idx_key = attrib[1];
    }
    else {
        attrib_name = attrib;
    }
    // return the deconstructed attrib arg, attrib_idx_key may be null
    return [attrib_name, attrib_idx_key];
}
export function checkAttribValue(fn_name, attrib_value) {
    // if it is undefined, then we are deleting the attribute value
    if (attrib_value === undefined) {
        return;
    }
    // check the actual value
    chk.checkArgs(fn_name, 'attrib_value', attrib_value, [chk.isNull, chk.isStr, chk.isNum, chk.isBool, chk.isList, chk.isDict]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NoZWNrX2F0dHJpYnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29yZS9fY2hlY2tfYXR0cmlicy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssR0FBRyxNQUFNLGdCQUFnQixDQUFDO0FBRXRDLDRJQUE0STtBQUM1SSxtQkFBbUI7QUFDbkIsNElBQTRJO0FBQzVJLE1BQU0sVUFBVSxlQUFlLENBQUMsT0FBZSxFQUFFLFdBQW1CO0lBQ2hFLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxzQkFBc0I7SUFDOUMsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO1FBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUUsT0FBTyxHQUFHLElBQUksR0FBRywwQkFBMEIsQ0FBQyxDQUFDO0tBQ2pFO0lBQ0QsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUMxQixNQUFNLElBQUksS0FBSyxDQUFFLE9BQU8sR0FBRyxJQUFJLEdBQUcsMkJBQTJCLENBQUMsQ0FBQztLQUNsRTtJQUNELElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUNqQyxNQUFNLElBQUksS0FBSyxDQUFFLE9BQU8sR0FBRyxJQUFJLEdBQUcsNENBQTRDLENBQUMsQ0FBQztLQUNuRjtJQUNELElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUN2QyxNQUFNLElBQUksS0FBSyxDQUFFLE9BQU8sR0FBRyxJQUFJLEdBQUcsMkNBQTJDLENBQUMsQ0FBQztLQUNsRjtJQUNELHVCQUF1QjtJQUN2QixJQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUU7UUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcseUJBQXlCLENBQUMsQ0FBQztLQUN4RDtBQUNMLENBQUM7QUFDRCxNQUFN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