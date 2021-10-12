"use strict";
/**
 * The `attrib` module has functions for working with attributes in teh model.
 * Note that attributes can also be set and retrieved using the "@" symbol.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._EPushMethodSel = exports.Push = exports.Rename = exports.Delete = exports.Add = exports.Get = exports._ESet = exports.Set = exports._EDataType = exports._EAttribPushTarget = exports._EEntTypeAndMod = exports._EEntType = void 0;
const _check_ids_1 = require("../../_check_ids");
const _check_attribs_1 = require("../../_check_attribs");
const underscore_1 = __importDefault(require("underscore"));
const common_1 = require("../../../libs/geo-info/common");
const common_id_funcs_1 = require("../../../libs/geo-info/common_id_funcs");
const arrs_1 = require("../../../libs/util/arrs");
const lodash = __importStar(require("lodash"));
// ================================================================================================
var _EEntType;
(function (_EEntType) {
    _EEntType["POSI"] = "ps";
    _EEntType["VERT"] = "_v";
    _EEntType["EDGE"] = "_e";
    _EEntType["WIRE"] = "_w";
    _EEntType["FACE"] = "_f";
    _EEntType["POINT"] = "pt";
    _EEntType["PLINE"] = "pl";
    _EEntType["PGON"] = "pg";
    _EEntType["COLL"] = "co";
})(_EEntType = exports._EEntType || (exports._EEntType = {}));
var _EEntTypeAndMod;
(function (_EEntTypeAndMod) {
    _EEntTypeAndMod["POSI"] = "ps";
    _EEntTypeAndMod["VERT"] = "_v";
    _EEntTypeAndMod["EDGE"] = "_e";
    _EEntTypeAndMod["WIRE"] = "_w";
    _EEntTypeAndMod["FACE"] = "_f";
    _EEntTypeAndMod["POINT"] = "pt";
    _EEntTypeAndMod["PLINE"] = "pl";
    _EEntTypeAndMod["PGON"] = "pg";
    _EEntTypeAndMod["COLL"] = "co";
    _EEntTypeAndMod["MOD"] = "mo";
})(_EEntTypeAndMod = exports._EEntTypeAndMod || (exports._EEntTypeAndMod = {}));
var _EAttribPushTarget;
(function (_EAttribPushTarget) {
    _EAttribPushTarget["POSI"] = "ps";
    _EAttribPushTarget["VERT"] = "_v";
    _EAttribPushTarget["EDGE"] = "_e";
    _EAttribPushTarget["WIRE"] = "_w";
    _EAttribPushTarget["FACE"] = "_f";
    _EAttribPushTarget["POINT"] = "pt";
    _EAttribPushTarget["PLINE"] = "pl";
    _EAttribPushTarget["PGON"] = "pg";
    _EAttribPushTarget["COLL"] = "co";
    _EAttribPushTarget["COLLP"] = "cop";
    _EAttribPushTarget["COLLC"] = "coc";
    _EAttribPushTarget["MOD"] = "mo";
})(_EAttribPushTarget = exports._EAttribPushTarget || (exports._EAttribPushTarget = {}));
var _EDataType;
(function (_EDataType) {
    _EDataType["NUMBER"] = "number";
    _EDataType["STRING"] = "string";
    _EDataType["BOOLEAN"] = "boolean";
    _EDataType["LIST"] = "list";
    _EDataType["DICT"] = "dict";
})(_EDataType = exports._EDataType || (exports._EDataType = {}));
function _getEntTypeFromStr(ent_type_str) {
    switch (ent_type_str) {
        case _EEntTypeAndMod.POSI:
            return common_1.EEntType.POSI;
        case _EEntTypeAndMod.VERT:
            return common_1.EEntType.VERT;
        case _EEntTypeAndMod.EDGE:
            return common_1.EEntType.EDGE;
        case _EEntTypeAndMod.WIRE:
            return common_1.EEntType.WIRE;
        case _EEntTypeAndMod.POINT:
            return common_1.EEntType.POINT;
        case _EEntTypeAndMod.PLINE:
            return common_1.EEntType.PLINE;
        case _EEntTypeAndMod.PGON:
            return common_1.EEntType.PGON;
        case _EEntTypeAndMod.COLL:
            return common_1.EEntType.COLL;
        case _EEntTypeAndMod.MOD:
            return common_1.EEntType.MOD;
        default:
            break;
    }
}
function _getAttribPushTarget(ent_type_str) {
    switch (ent_type_str) {
        case _EAttribPushTarget.POSI:
            return common_1.EEntType.POSI;
        case _EAttribPushTarget.VERT:
            return common_1.EEntType.VERT;
        case _EAttribPushTarget.EDGE:
            return common_1.EEntType.EDGE;
        case _EAttribPushTarget.WIRE:
            return common_1.EEntType.WIRE;
        case _EAttribPushTarget.POINT:
            return common_1.EEntType.POINT;
        case _EAttribPushTarget.PLINE:
            return common_1.EEntType.PLINE;
        case _EAttribPushTarget.PGON:
            return common_1.EEntType.PGON;
        case _EAttribPushTarget.COLL:
            return common_1.EEntType.COLL;
        case _EAttribPushTarget.COLLC:
            return 'coll_children';
        case _EAttribPushTarget.COLLP:
            return 'coll_parent';
        case _EAttribPushTarget.MOD:
            return common_1.EEntType.MOD;
        default:
            break;
    }
}
// ================================================================================================
/**
 * Set an attribute value for one or more entities.
 * \n
 * If entities is null, then model level attributes will be set.
 * \n
 * @param __model__
 * @param entities Entities, the entities to set the attribute value for.
 * @param attrib The attribute. Can be `name`, `[name, index]`, or `[name, key]`.
 * @param value The attribute value, or list of values.
 * @param method Enum
 */
function Set(__model__, entities, attrib, value, method) {
    // if entities is null, then we are setting model attributes
    // @ts-ignore
    if (entities !== null && (0, arrs_1.getArrDepth)(entities) === 2) {
        entities = underscore_1.default.flatten(entities);
    }
    // --- Error Check ---
    const fn_name = 'attrib.Set';
    let ents_arr = null;
    let attrib_name;
    let attrib_idx_key;
    if (__model__.debug) {
        // if (value === undefined) {
        //     throw new Error(fn_name + ': value is undefined');
        // }
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isNull, _check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
        [attrib_name, attrib_idx_key] = (0, _check_attribs_1.checkAttribNameIdxKey)(fn_name, attrib);
        (0, _check_attribs_1.checkAttribName)(fn_name, attrib_name);
    }
    else {
        if (entities !== null) {
            ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
        }
        [attrib_name, attrib_idx_key] = (0, _check_attribs_1.splitAttribNameIdxKey)(fn_name, attrib);
    }
    // --- Error Check ---
    _setAttrib(__model__, ents_arr, attrib_name, value, attrib_idx_key, method);
}
exports.Set = Set;
var _ESet;
(function (_ESet) {
    _ESet["ONE_VALUE"] = "one_value";
    _ESet["MANY_VALUES"] = "many_values";
})(_ESet = exports._ESet || (exports._ESet = {}));
function _setAttrib(__model__, ents_arr, attrib_name, attrib_values, idx_or_key, method) {
    // check the ents_arr
    if (ents_arr === null) {
        _setModelAttrib(__model__, attrib_name, attrib_values, idx_or_key);
        return;
    }
    else if (ents_arr.length === 0) {
        return;
    }
    else if ((0, arrs_1.getArrDepth)(ents_arr) === 1) {
        ents_arr = [ents_arr];
    }
    ents_arr = ents_arr;
    if (method === _ESet.MANY_VALUES) {
        // all ents get different attribute value
        _setEachEntDifferentAttribValue(__model__, ents_arr, attrib_name, attrib_values, idx_or_key);
    }
    else {
        // all ents get the same attribute value
        _setEachEntSameAttribValue(__model__, ents_arr, attrib_name, attrib_values, idx_or_key);
    }
    return;
}
function _setModelAttrib(__model__, attrib_name, attrib_value, idx_or_key) {
    if (typeof idx_or_key === 'number') {
        __model__.modeldata.attribs.set.setModelAttribListIdxVal(attrib_name, idx_or_key, attrib_value);
    }
    if (typeof idx_or_key === 'string') {
        __model__.modeldata.attribs.set.setModelAttribDictKeyVal(attrib_name, idx_or_key, attrib_value);
    }
    else {
        __model__.modeldata.attribs.set.setModelAttribVal(attrib_name, attrib_value);
    }
}
function _setEachEntDifferentAttribValue(__model__, ents_arr, attrib_name, attrib_values, idx_or_key) {
    if (ents_arr.length !== attrib_values.length) {
        throw new Error('If multiple entities are being set to multiple values, then the number of entities must match the number of values.');
    }
    const ent_type = ents_arr[0][0];
    const ents_i = _getEntsIndices(__model__, ents_arr);
    for (let i = 0; i < ents_arr.length; i++) {
        // --- Error Check ---
        if (__model__.debug) {
            const fn_name = 'entities@' + attrib_name;
            (0, _check_attribs_1.checkAttribValue)(fn_name, attrib_values[i]);
            if (idx_or_key !== null) {
                (0, _check_attribs_1.checkAttribIdxKey)(fn_name, idx_or_key);
            }
        }
        // --- Error Check ---
        // if this is a complex type, make a deep copy
        let val = attrib_values[i];
        if (val instanceof Object) {
            val = lodash.cloneDeep(val);
        }
        if (typeof idx_or_key === 'number') {
            __model__.modeldata.attribs.set.setEntsAttribListIdxVal(ent_type, ents_i[i], attrib_name, idx_or_key, val);
        }
        if (typeof idx_or_key === 'string') {
            __model__.modeldata.attribs.set.setEntsAttribDictKeyVal(ent_type, ents_i[i], attrib_name, idx_or_key, val);
        }
        else {
            __model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_type, ents_i[i], attrib_name, val);
        }
    }
}
function _setEachEntSameAttribValue(__model__, ents_arr, attrib_name, attrib_value, idx_or_key) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'entities@' + attrib_name;
        (0, _check_attribs_1.checkAttribValue)(fn_name, attrib_value);
    }
    // --- Error Check ---
    // if this is a complex type, make a deep copy
    if (attrib_value instanceof Object) {
        attrib_value = lodash.cloneDeep(attrib_value);
    }
    const ent_type = ents_arr[0][0];
    const ents_i = _getEntsIndices(__model__, ents_arr);
    if (typeof idx_or_key === 'number') {
        __model__.modeldata.attribs.set.setEntsAttribListIdxVal(ent_type, ents_i, attrib_name, idx_or_key, attrib_value);
    }
    else if (typeof idx_or_key === 'string') {
        __model__.modeldata.attribs.set.setEntsAttribDictKeyVal(ent_type, ents_i, attrib_name, idx_or_key, attrib_value);
    }
    else {
        __model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_type, ents_i, attrib_name, attrib_value);
    }
}
function _getEntsIndices(__model__, ents_arr) {
    const ent_type = ents_arr[0][0];
    const ents_i = [];
    for (let i = 0; i < ents_arr.length; i++) {
        if (ents_arr[i][0] !== ent_type) {
            throw new Error('If an attribute is being set for multiple entities, then they must all be of the same type.');
        }
        ents_i.push(ents_arr[i][1]);
    }
    return ents_i;
}
// ================================================================================================
/**
 * Get attribute values for one or more entities.
 * \n
 * If entities is null, then model level attributes will be returned.
 * \n
 * @param __model__
 * @param entities Entities, the entities to get the attribute values for.
 * @param attrib The attribute. Can be `name`, `[name, index]`, or `[name, key]`.
 * @returns One attribute value, or a list of attribute values.
 */
function Get(__model__, entities, attrib) {
    // @ts-ignore
    if (entities !== null && (0, arrs_1.getArrDepth)(entities) === 2) {
        entities = underscore_1.default.flatten(entities);
    }
    // --- Error Check ---
    let ents_arr = null;
    let attrib_name;
    let attrib_idx_key;
    const fn_name = 'attrib.Get';
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
        }
        [attrib_name, attrib_idx_key] = (0, _check_attribs_1.checkAttribNameIdxKey)(fn_name, attrib);
        (0, _check_attribs_1.checkAttribName)(fn_name, attrib_name);
    }
    else {
        if (entities !== null && entities !== undefined) {
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            // [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
            ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
        }
        [attrib_name, attrib_idx_key] = (0, _check_attribs_1.splitAttribNameIdxKey)(fn_name, attrib);
    }
    // --- Error Check ---
    return _get(__model__, ents_arr, attrib_name, attrib_idx_key);
}
exports.Get = Get;
function _get(__model__, ents_arr, attrib_name, attrib_idx_key) {
    const has_idx_key = attrib_idx_key !== null && attrib_idx_key !== undefined;
    if (ents_arr === null) {
        // get the attrib values from the model
        if (typeof attrib_idx_key === 'number') {
            return __model__.modeldata.attribs.get.getModelAttribListIdxVal(attrib_name, attrib_idx_key);
        }
        else if (typeof attrib_idx_key === 'string') {
            return __model__.modeldata.attribs.get.getModelAttribDictKeyVal(attrib_name, attrib_idx_key);
        }
        else {
            return __model__.modeldata.attribs.get.getModelAttribVal(attrib_name);
        }
    }
    else if (ents_arr.length === 0) {
        return [];
    }
    else if ((0, arrs_1.getArrDepth)(ents_arr) === 1) {
        const [ent_type, ent_i] = ents_arr;
        // check if this is ID
        if (attrib_name === '_id') {
            if (has_idx_key) {
                throw new Error('The "_id" attribute does have an index.');
            }
            return common_1.EEntTypeStr[ent_type] + ent_i;
        }
        // get the attrib values from the ents
        let val;
        if (typeof attrib_idx_key === 'number') {
            val = __model__.modeldata.attribs.get.getEntAttribListIdxVal(ent_type, ent_i, attrib_name, attrib_idx_key);
        }
        else if (typeof attrib_idx_key === 'string') {
            val = __model__.modeldata.attribs.get.getEntAttribDictKeyVal(ent_type, ent_i, attrib_name, attrib_idx_key);
        }
        else {
            val = __model__.modeldata.attribs.get.getEntAttribVal(ent_type, ent_i, attrib_name);
        }
        // if this is a complex type, make a deep copy
        if (val instanceof Object) {
            val = lodash.cloneDeep(val);
        }
        return val;
    }
    else {
        return ents_arr.map(ent_arr => _get(__model__, ent_arr, attrib_name, attrib_idx_key));
    }
}
// ================================================================================================
/**
 * Add one or more attributes to the model.
 * The attribute will appear as a new column in the attribute table.
 * (At least one entity must have a value for the column to be visible in the attribute table).
 * All attribute values will be set to null.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param data_type_sel Enum, the data type for this attribute
 * @param attribs A single attribute name, or a list of attribute names.
 */
function Add(__model__, ent_type_sel, data_type_sel, attribs) {
    // --- Error Check ---
    const fn_name = 'attrib.Add';
    const arg_name = 'ent_type_sel';
    let ent_type;
    if (__model__.debug) {
        if (ent_type_sel === 'ps' && attribs === 'xyz') {
            throw new Error(fn_name + ': ' + arg_name + ' The xyz attribute already exists.');
        }
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        if (ent_type === undefined) {
            throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' +
                'ps, _v, _e, _w, _f, pt, pl, pg, co, mo.');
        }
        // create an array of attrib names
        if (!Array.isArray(attribs)) {
            attribs = [attribs];
        }
        attribs = attribs;
        for (const attrib of attribs) {
            (0, _check_attribs_1.checkAttribName)(fn_name, attrib);
        }
    }
    else {
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        // create an array of attrib names
        if (!Array.isArray(attribs)) {
            attribs = [attribs];
        }
        attribs = attribs;
    }
    // --- Error Check ---
    // set the data type
    let data_type = null;
    switch (data_type_sel) {
        case _EDataType.NUMBER:
            data_type = common_1.EAttribDataTypeStrs.NUMBER;
            break;
        case _EDataType.STRING:
            data_type = common_1.EAttribDataTypeStrs.STRING;
            break;
        case _EDataType.BOOLEAN:
            data_type = common_1.EAttribDataTypeStrs.BOOLEAN;
            break;
        case _EDataType.LIST:
            data_type = common_1.EAttribDataTypeStrs.LIST;
            break;
        case _EDataType.DICT:
            data_type = common_1.EAttribDataTypeStrs.DICT;
            break;
        default:
            throw new Error('Data type not recognised.');
            break;
    }
    // create the attribute
    for (const attrib of attribs) {
        __model__.modeldata.attribs.add.addAttrib(ent_type, attrib, data_type);
    }
}
exports.Add = Add;
// ================================================================================================
/**
 * Delete one or more attributes from the model.
 * The column in the attribute table will be deleted.
 * All values will also be deleted.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param attribs A single attribute name, or a list of attribute names. In 'null' all attributes will be deleted.
 */
function Delete(__model__, ent_type_sel, attribs) {
    // --- Error Check ---
    const fn_name = 'attrib.Delete';
    const arg_name = 'ent_type_sel';
    let ent_type;
    if (__model__.debug) {
        if (ent_type_sel === 'ps' && attribs === 'xyz') {
            throw new Error(fn_name + ': ' + arg_name + ' Deleting xyz attribute is not allowed.');
        }
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        if (ent_type === undefined) {
            throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' +
                'ps, _v, _e, _w, _f, pt, pl, pg, co, mo.');
        }
        // create an array of attrib names
        if (attribs === null) {
            attribs = __model__.modeldata.attribs.getAttribNamesUser(ent_type);
        }
        if (!Array.isArray(attribs)) {
            attribs = [attribs];
        }
        attribs = attribs;
        for (const attrib of attribs) {
            (0, _check_attribs_1.checkAttribName)(fn_name, attrib);
        }
    }
    else {
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        // create an array of attrib names
        if (attribs === null) {
            attribs = __model__.modeldata.attribs.getAttribNamesUser(ent_type);
        }
        if (!Array.isArray(attribs)) {
            attribs = [attribs];
        }
        attribs = attribs;
    }
    // --- Error Check ---
    // delete the attributes
    for (const attrib of attribs) {
        __model__.modeldata.attribs.del.delEntAttrib(ent_type, attrib);
    }
}
exports.Delete = Delete;
// ================================================================================================
/**
 * Rename an attribute in the model.
 * The header for column in the attribute table will be renamed.
 * All values will remain the same.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param old_attrib The old attribute name.
 * @param new_attrib The old attribute name.
 */
function Rename(__model__, ent_type_sel, old_attrib, new_attrib) {
    if (ent_type_sel === 'ps' && old_attrib === 'xyz') {
        return;
    }
    // --- Error Check ---
    const fn_name = 'attrib.Rename';
    const arg_name = 'ent_type_sel';
    const ent_type = _getEntTypeFromStr(ent_type_sel);
    if (__model__.debug) {
        (0, _check_attribs_1.checkAttribName)(fn_name, old_attrib);
        (0, _check_attribs_1.checkAttribName)(fn_name, new_attrib);
        // --- Error Check ---
        // convert the ent_type_str to an ent_type
        if (ent_type === undefined) {
            throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' +
                'ps, _v, _e, _w, _f, pt, pl, pg, co, mo.');
        }
    }
    // create the attribute
    __model__.modeldata.attribs.renameAttrib(ent_type, old_attrib, new_attrib);
}
exports.Rename = Rename;
// ================================================================================================
/**
 * Push attributes up or down the hierarchy. The original attribute is not changed.
 * \n
 * @param __model__
 * @param entities Entities, the entities to push the attribute values for.
 * @param attrib The attribute. Can be `name`, `[name, index_or_key]`,
 * `[source_name, source_index_or_key, target_name]` or `[source_name, source_index_or_key, target_name, target_index_or_key]`.
 * @param ent_type_sel Enum, the target entity type where the attribute values should be pushed to.
 * @param method_sel Enum, the method for aggregating attribute values in cases where aggregation is necessary.
 */
function Push(__model__, entities, attrib, ent_type_sel, method_sel) {
    if (entities !== null) {
        const depth = (0, arrs_1.getArrDepth)(entities);
        if (depth === 0) {
            entities = [entities];
        }
        else if (depth === 2) {
            // @ts-ignore
            entities = underscore_1.default.flatten(entities);
        }
    }
    // --- Error Check ---
    const fn_name = 'attrib.Push';
    let ents_arr = null;
    let source_attrib_name;
    let source_attrib_idx_key;
    let target_attrib_name;
    let target_attrib_idx_key;
    let source_ent_type;
    const indices = [];
    let target;
    let source_attrib = null;
    let target_attrib = null;
    if (Array.isArray(attrib)) {
        // set source attrib
        source_attrib = [
            attrib[0],
            (attrib.length > 1 ? attrib[1] : null)
        ];
        // set target attrib
        target_attrib = [
            (attrib.length > 2 ? attrib[2] : attrib[0]),
            (attrib.length > 3 ? attrib[3] : null)
        ];
    }
    else {
        source_attrib = [attrib, null];
        target_attrib = [attrib, null];
    }
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
        }
        [source_attrib_name, source_attrib_idx_key] = (0, _check_attribs_1.checkAttribNameIdxKey)(fn_name, source_attrib);
        [target_attrib_name, target_attrib_idx_key] = (0, _check_attribs_1.checkAttribNameIdxKey)(fn_name, target_attrib);
        // --- Error Check ---
        // get the source ent_type and indices
        source_ent_type = ents_arr[0][0];
        for (const ent_arr of ents_arr) {
            if (ent_arr[0] !== source_ent_type) {
                throw new Error('The entities must all be of the same type.');
            }
            indices.push(ent_arr[1]);
        }
        // check the names
        (0, _check_attribs_1.checkAttribName)(fn_name, source_attrib_name);
        (0, _check_attribs_1.checkAttribName)(fn_name, target_attrib_name);
        // get the target ent_type
        target = _getAttribPushTarget(ent_type_sel);
        if (source_ent_type === target) {
            throw new Error('The new attribute is at the same level as the existing attribute.');
        }
    }
    else {
        if (entities !== null && entities !== undefined) {
            ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
        }
        [source_attrib_name, source_attrib_idx_key] = (0, _check_attribs_1.splitAttribNameIdxKey)(fn_name, source_attrib);
        [target_attrib_name, target_attrib_idx_key] = (0, _check_attribs_1.splitAttribNameIdxKey)(fn_name, target_attrib);
        // get the source ent_type and indices
        source_ent_type = ents_arr[0][0];
        for (const ent_arr of ents_arr) {
            indices.push(ent_arr[1]);
        }
        // get the target ent_type
        target = _getAttribPushTarget(ent_type_sel);
    }
    // get the method
    const method = _convertPushMethod(method_sel);
    // do the push
    __model__.modeldata.attribs.push.pushAttribVals(source_ent_type, source_attrib_name, source_attrib_idx_key, indices, target, target_attrib_name, target_attrib_idx_key, method);
}
exports.Push = Push;
var _EPushMethodSel;
(function (_EPushMethodSel) {
    _EPushMethodSel["FIRST"] = "first";
    _EPushMethodSel["LAST"] = "last";
    _EPushMethodSel["AVERAGE"] = "average";
    _EPushMethodSel["MEDIAN"] = "median";
    _EPushMethodSel["SUM"] = "sum";
    _EPushMethodSel["MIN"] = "min";
    _EPushMethodSel["MAX"] = "max";
})(_EPushMethodSel = exports._EPushMethodSel || (exports._EPushMethodSel = {}));
function _convertPushMethod(select) {
    switch (select) {
        case _EPushMethodSel.AVERAGE:
            return common_1.EAttribPush.AVERAGE;
        case _EPushMethodSel.MEDIAN:
            return common_1.EAttribPush.MEDIAN;
        case _EPushMethodSel.SUM:
            return common_1.EAttribPush.SUM;
        case _EPushMethodSel.MIN:
            return common_1.EAttribPush.MIN;
        case _EPushMethodSel.MAX:
            return common_1.EAttribPush.MAX;
        case _EPushMethodSel.FIRST:
            return common_1.EAttribPush.FIRST;
        case _EPushMethodSel.LAST:
            return common_1.EAttribPush.LAST;
        default:
            break;
    }
}
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0cmliLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvcmUvbW9kdWxlcy9iYXNpYy9hdHRyaWIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxpREFBZ0Q7QUFFaEQseURBQ2tHO0FBRWxHLDREQUFnQztBQUVoQyxrREFDbUc7QUFDbkcsMkVBQWlFO0FBQ2pFLGlEQUFxRDtBQUNyRCwrQ0FBaUM7QUFDakMsbUdBQW1HO0FBRW5HLElBQVksU0FVWDtBQVZELFdBQVksU0FBUztJQUNqQix3QkFBYSxDQUFBO0lBQ2Isd0JBQWEsQ0FBQTtJQUNiLHdCQUFhLENBQUE7SUFDYix3QkFBYSxDQUFBO0lBQ2Isd0JBQWEsQ0FBQTtJQUNiLHlCQUFhLENBQUE7SUFDYix5QkFBYSxDQUFBO0lBQ2Isd0JBQWEsQ0FBQTtJQUNiLHdCQUFhLENBQUE7QUFDakIsQ0FBQyxFQVZXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBVXBCO0FBQ0QsSUFBWSxlQVdYO0FBWEQsV0FBWSxlQUFlO0lBQ3ZCLDhCQUFhLENBQUE7SUFDYiw4QkFBYSxDQUFBO0lBQ2IsOEJBQWEsQ0FBQTtJQUNiLDhCQUFhLENBQUE7SUFDYiw4QkFBYSxDQUFBO0lBQ2IsK0JBQWEsQ0FBQTtJQUNiLCtCQUFhLENBQUE7SUFDYiw4QkFBYSxDQUFBO0lBQ2IsOEJBQWEsQ0FBQTtJQUNiLDZCQUFhLENBQUE7QUFDakIsQ0FBQyxFQVhXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBVzFCO0FBQ0QsSUFBWSxrQkFhWDtBQWJELFdBQVksa0JBQWtCO0lBQzFCLGlDQUFhLENBQUE7SUFDYixpQ0FBYSxDQUFBO0lBQ2IsaUNBQWEsQ0FBQTtJQUNiLGlDQUFhLENBQUE7SUFDYixpQ0FBYSxDQUFBO0lBQ2Isa0NBQWEsQ0FBQTtJQUNiLGtDQUFhLENBQUE7SUFDYixpQ0FBYSxDQUFBO0lB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