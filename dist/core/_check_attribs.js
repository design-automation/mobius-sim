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
exports.checkAttribValue = exports.splitAttribNameIdxKey = exports.checkAttribNameIdxKey = exports.checkAttribIdxKey = exports.checkAttribName = void 0;
const chk = __importStar(require("./_check_types"));
// =========================================================================================================================================
// Attribute Checks
// =========================================================================================================================================
function checkAttribName(fn_name, attrib_name) {
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
exports.checkAttribName = checkAttribName;
function checkAttribIdxKey(fn_name, idx_or_key) {
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
exports.checkAttribIdxKey = checkAttribIdxKey;
function checkAttribNameIdxKey(fn_name, attrib) {
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
exports.checkAttribNameIdxKey = checkAttribNameIdxKey;
function splitAttribNameIdxKey(fn_name, attrib) {
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
exports.splitAttribNameIdxKey = splitAttribNameIdxKey;
function checkAttribValue(fn_name, attrib_value) {
    // if it is undefined, then we are deleting the attribute value
    if (attrib_value === undefined) {
        return;
    }
    // check the actual value
    chk.checkArgs(fn_name, 'attrib_value', attrib_value, [chk.isNull, chk.isStr, chk.isNum, chk.isBool, chk.isList, chk.isDict]);
}
exports.checkAttribValue = checkAttribValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NoZWNrX2F0dHJpYnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29yZS9fY2hlY2tfYXR0cmlicy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQXNDO0FBRXRDLDRJQUE0STtBQUM1SSxtQkFBbUI7QUFDbkIsNElBQTRJO0FBQzVJLFNBQWdCLGVBQWUsQ0FBQyxPQUFlLEVBQUUsV0FBbUI7SUFDaEUsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLHNCQUFzQjtJQUM5QyxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7UUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBRSxPQUFPLEdBQUcsSUFBSSxHQUFHLDBCQUEwQixDQUFDLENBQUM7S0FDakU7SUFDRCxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUUsT0FBTyxHQUFHLElBQUksR0FBRywyQkFBMkIsQ0FBQyxDQUFDO0tBQ2xFO0lBQ0QsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUUsT0FBTyxHQUFHLElBQUksR0FBRyw0Q0FBNEMsQ0FBQyxDQUFDO0tBQ25GO0lBQ0QsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQ3ZDLE1BQU0sSUFBSSxLQUFLLENBQUUsT0FBTyxHQUFHLElBQUksR0FBRywyQ0FBMkMsQ0FBQyxDQUFDO0tBQ2xGO0lBQ0QsdUJBQXVCO0lBQ3ZCLElBQUksV0FBVyxLQUFLLElBQUksRUFBRTtRQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sR0FBRyx5QkFBeUIsQ0FBQyxDQUFDO0tBQ3hEO0FBQ0wsQ0FBQztBQWxCRCwwQ0FrQkM7QUFD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