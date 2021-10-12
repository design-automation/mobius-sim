"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__checkModel__ = exports.__select__ = exports.__stringify__ = exports.__clone__ = exports.__merge__ = exports.__postprocess__ = exports.__preprocess__ = exports.__new__ = void 0;
const GIModel_1 = require("../../libs/geo-info/GIModel");
const common_1 = require("../../libs/geo-info/common");
const common_id_funcs_1 = require("../../libs/geo-info/common_id_funcs");
//  ===============================================================================================
//  Functions used by Mobius
//  ===============================================================================================
/**
 * Creates a new empty model.
 *
 * @returns New model empty.
 */
function __new__() {
    const model = new GIModel_1.GIModel();
    // model.modeldata.attribs.add.addAttrib(EEntType.POSI, EAttribNames.COORDS, EAttribDataTypeStrs.LIST);
    return model;
}
exports.__new__ = __new__;
//  ===============================================================================================
/**
 * A function to preprocess the model, before it enters the node.
 * In cases where there is more than one model connected to a node,
 * the preprocess function will be called before the merge function.
 *
 * @param model The model to preprocess.
 */
function __preprocess__(__model__) {
}
exports.__preprocess__ = __preprocess__;
//  ===============================================================================================
/**
 * A function to postprocess the model, after it enters the node.
 *
 * @param model The model to postprocess.
 */
function __postprocess__(__model__) {
    // TODO
    // Remove all undefined values for the arrays
}
exports.__postprocess__ = __postprocess__;
//  ===============================================================================================
/**
 * Merges the second model into the first model. The geometry, attribues, and groups are all merged.
 * If the models contain contain groups with the same names, then the groups will be merged.
 *
 * @param model1 The model to merge into.
 * @param model2 The model to merge from    .
 */
function __merge__(model1, model2) {
    // model1.merge(model2);
    throw new Error('Deprecated');
}
exports.__merge__ = __merge__;
//  ===============================================================================================
/**
 * Clone a model.
 *
 * @param model The model to clone.
 */
function __clone__(model) {
    // return model.clone();
    throw new Error('Deprecated');
}
exports.__clone__ = __clone__;
//  ===============================================================================================
/**
 * Returns a string representation of this model.
 * @param __model__
 */
function __stringify__(__model__) {
    // return JSON.stringify(__model__.getModelData());
    throw new Error('Not implemented');
}
exports.__stringify__ = __stringify__;
//  ===============================================================================================
/**
 * Select entities in the model.
 * @param __model__
 */
function __select__(__model__, ents_id, var_name) {
    const start = performance.now();
    __model__.modeldata.geom.selected[__model__.getActiveSnapshot()] = [];
    const activeSelected = __model__.modeldata.geom.selected[__model__.getActiveSnapshot()];
    ents_id = ((Array.isArray(ents_id)) ? ents_id : [ents_id]);
    const [ents_id_flat, ents_indices] = _flatten(ents_id);
    const ents_arr = (0, common_id_funcs_1.idsBreak)(ents_id_flat);
    const attrib_name = '_' + var_name;
    for (let i = 0; i < ents_arr.length; i++) {
        const ent_arr = ents_arr[i];
        const ent_indices = ents_indices[i];
        const attrib_value = var_name + '[' + ent_indices.join('][') + ']';
        activeSelected.push(ent_arr);
        if (!__model__.modeldata.attribs.query.hasEntAttrib(ent_arr[0], attrib_name)) {
            __model__.modeldata.attribs.add.addAttrib(ent_arr[0], attrib_name, common_1.EAttribDataTypeStrs.STRING);
        }
        __model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_arr[0], ent_arr[1], attrib_name, attrib_value);
    }
}
exports.__select__ = __select__;
function _flatten(arrs) {
    const arr_flat = [];
    const arr_indices = [];
    let count = 0;
    for (const item of arrs) {
        if (Array.isArray(item)) {
            const [arr_flat2, arr_indices2] = _flatten(item);
            for (let i = 0; i < arr_flat2.length; i++) {
                if (arr_flat.indexOf(arr_flat2[i]) !== -1) {
                    continue;
                }
                arr_flat.push(arr_flat2[i]);
                arr_indices2[i].unshift(count);
                arr_indices.push(arr_indices2[i]);
            }
        }
        else {
            arr_flat.push(item);
            arr_indices.push([count]);
        }
        count += 1;
    }
    return [arr_flat, arr_indices];
}
//  ===============================================================================================
/**
 * Checks the model for internal consistency.
 * @param __model__
 */
function __checkModel__(__model__) {
    return __model__.check();
}
exports.__checkModel__ = __checkModel__;
// Moved to attrib.ts
//  ===============================================================================================
/**
//  * Sets an attribute value in the model.
//  * @param __model__
//  */
// export function __setAttrib__(__model__: GIModel, entities: TId|TId[]|TId[][],
//                               attrib_name: string, attrib_values: TAttribDataTypes|TAttribDataTypes[], attrib_index?: number): void {
//     // @ts-ignore
//     if (entities !== null && getArrDepth(entities) === 2) { entities = __.flatten(entities); }
//     // --- Error Check ---
//     const fn_name = 'entities@' + attrib_name;
//     let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
//     if (entities !== null && entities !== undefined) {
//         ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
//     }
//     checkAttribName(fn_name , attrib_name);
//     // --- Error Check ---
//     _setAttrib(__model__, ents_arr, attrib_name, attrib_values, attrib_index);
// }
// function _setAttrib(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[],
//         attrib_name: string, attrib_values: TAttribDataTypes|TAttribDataTypes[], attrib_index?: number): void {
//     // check the ents_arr
//     if (ents_arr === null) {
//         _setModelAttrib(__model__, attrib_name, attrib_values as TAttribDataTypes, attrib_index);
//         return;
//     } else if (ents_arr.length === 0) {
//         return;
//     } else if (getArrDepth(ents_arr) === 1) {
//         ents_arr = [ents_arr] as TEntTypeIdx[];
//     }
//     ents_arr = ents_arr as TEntTypeIdx[];
//     // check attrib_values
//     // are we setting a list of ents to a list of values?
//     const attrib_values_depth: number = getArrDepth(attrib_values);
//     if (attrib_values_depth === 2) {
//         // attrib values is a list of lists
//         // we assume that we are trying to set a different value for each ent
//         // so we expect the list lengths to be equal
//         _setEachEntDifferentAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes[], attrib_index);
//         return;
//     } else if (attrib_values_depth === 1) {
//         // check if ents_arr.length equals attrib_values.length
//         // then check if the first ent already has an attrib with the specified name
//         // if both are true, then we assume we are trying to set each ent to each value
//         const attrib_values_arr: number[]|string[] = attrib_values as number[]|string[];
//         if (ents_arr.length === attrib_values_arr.length) {
//             const first_ent_type: number = ents_arr[0][0];
//             if (__model__.modeldata.attribs.query.hasAttrib(first_ent_type, attrib_name)) {
//                 _setEachEntDifferentAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes[], attrib_index);
//                 return;
//             }
//         }
//     }
//     // all ents get the same attribute value
//     _setEachEntSameAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes, attrib_index);
//     return;
// }
// function _setModelAttrib(__model__: GIModel, attrib_name: string, attrib_value: TAttribDataTypes, idx_or_key?: number): void {
//     if (typeof idx_or_key === 'number') {
//         __model__.modeldata.attribs.set.setModelAttribListIdxVal(attrib_name, idx_or_key, attrib_value);
//     } if (typeof idx_or_key === 'string') {
//         __model__.modeldata.attribs.set.setModelAttribDictKeyVal(attrib_name, idx_or_key, attrib_value);
//     } else {
//         __model__.modeldata.attribs.set.setModelAttribVal(attrib_name, attrib_value);
//     }
// }
// function _setEachEntDifferentAttribValue(__model__: GIModel, ents_arr: TEntTypeIdx[],
//         attrib_name: string, attrib_values: TAttribDataTypes[], attrib_index?: number): void {
//     if (ents_arr.length !== attrib_values.length) {
//         throw new Error(
//             'If multiple attributes are being set to multiple values, then the number of entities must match the number of values.');
//     }
//     const ent_type: number = ents_arr[0][0];
//     const ents_i: number[] = _getEntsIndices(__model__, ents_arr);
//     for (let i = 0; i < ents_arr.length; i++) {
//         // --- Error Check ---
//         const fn_name = 'entities@' + attrib_name;
//         checkAttribValue(fn_name , attrib_values[i], attrib_index);
//         // --- Error Check ---
//         if (attrib_index !== null && attrib_index !== undefined) {
//             __model__.modeldata.attribs.set.setAttribListIdxVal(ent_type, ents_i[i], attrib_name, attrib_index, attrib_values[i] as number|string);
//         } else {
//             __model__.modeldata.attribs.set.setAttribVal(ent_type, ents_i[i], attrib_name, attrib_values[i]);
//         }
//     }
// }
// function _setEachEntSameAttribValue(__model__: GIModel, ents_arr: TEntTypeIdx[],
//         attrib_name: string, attrib_value: TAttribDataTypes, attrib_index?: number): void {
//     // --- Error Check ---
//     const fn_name = 'entities@' + attrib_name;
//     checkAttribValue(fn_name , attrib_value, attrib_index);
//     // --- Error Check ---
//     const ent_type: number = ents_arr[0][0];
//     const ents_i: number[] = _getEntsIndices(__model__, ents_arr);
//     if (attrib_index !== null && attrib_index !== undefined) {
//         __model__.modeldata.attribs.set.setAttribListIdxVal(ent_type, ents_i, attrib_name, attrib_index, attrib_value as number|string);
//     } else {
//         __model__.modeldata.attribs.set.setAttribVal(ent_type, ents_i, attrib_name, attrib_value);
//     }
// }
// function _getEntsIndices(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[] {
//     const ent_type: number = ents_arr[0][0];
//     const ents_i: number[] = [];
//     for (let i = 0; i < ents_arr.length; i++) {
//         if (ents_arr[i][0] !== ent_type) {
//             throw new Error('If an attribute is being set for multiple entities, then they must all be of the same type.');
//         }
//         ents_i.push(ents_arr[i][1]);
//     }
//     return ents_i;
// }
// //  ===============================================================================================
// /**
//  * Gets an attribute value from the model.
//  * @param __model__
//  */
// export function __getAttrib__(__model__: GIModel, entities: TId|TId[]|TId[][],
//         attrib_name: string, idx_or_key?: number|string): TAttribDataTypes|TAttribDataTypes[] {
//     // @ts-ignore
//     if (entities !== null && getArrDepth(entities) === 2) { entities = __.flatten(entities); }
//     // --- Error Check ---
//     const fn_name = 'Inline.__getAttrib__';
//     let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
//     if (entities !== null && entities !== undefined) {
//         ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
//     }
//     checkCommTypes(fn_name, 'attrib_name', attrib_name, [TypeCheckObj.isString]);
//     if (idx_or_key !== null && idx_or_key !== undefined) {
//         checkCommTypes(fn_name, 'attrib_index', idx_or_key, [TypeCheckObj.isNumber, TypeCheckObj.isString]);
//     }
//     // --- Error Check ---
//     return _getAttrib(__model__, ents_arr, attrib_name, idx_or_key);
// }
// function _getAttrib(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[],
//         attrib_name: string, idx_or_key?: number|string): TAttribDataTypes|TAttribDataTypes[] {
//     const has_idx_or_key: boolean = idx_or_key !== null && idx_or_key !== undefined;
//     if (ents_arr === null) {
//         if (has_idx_or_key && typeof idx_or_key === 'number') {
//             return __model__.modeldata.attribs.get.getModelAttribListIdxVal(attrib_name, idx_or_key);
//         } else if (has_idx_or_key && typeof idx_or_key === 'string') {
//             return __model__.modeldata.attribs.get.getModelAttribDictKeyVal(attrib_name, idx_or_key);
//         } else {
//             return __model__.modeldata.attribs.get.getModelAttribVal(attrib_name);
//         }
//     } else if (ents_arr.length === 0) {
//         return;
//     } else if (getArrDepth(ents_arr) === 1) {
//         const [ent_type, ent_i]: TEntTypeIdx = ents_arr as TEntTypeIdx;
//         if (attrib_name === 'id') {
//             if (has_idx_or_key) { throw new Error('The "id" attribute does have an index or key.'); }
//             return EEntTypeStr[ent_type] + ent_i as TAttribDataTypes;
//         } else if (has_idx_or_key && typeof idx_or_key === 'number') {
//             return __model__.modeldata.attribs.get.getAttribListIdxVal(ent_type, attrib_name, ent_i, idx_or_key);
//         } else if (has_idx_or_key && typeof idx_or_key === 'string') {
//             return __model__.modeldata.attribs.get.getAttribDictKeyVal(ent_type, attrib_name, ent_i, idx_or_key);
//         } else {
//             return __model__.modeldata.attribs.get.getAttribVal(ent_type, attrib_name, ent_i);
//         }
//     } else {
//         return (ents_arr as TEntTypeIdx[]).map( ent_arr =>
//             _getAttrib(__model__, ent_arr, attrib_name, idx_or_key) ) as TAttribDataTypes[];
//     }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX21vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvcmUvbW9kdWxlcy9fbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsb0RBQWlEO0FBQ2pELGtEQUF5RTtBQUN6RSwyRUFBaUU7QUFFakUsbUdBQW1HO0FBQ25HLDRCQUE0QjtBQUM1QixtR0FBbUc7QUFDbkc7Ozs7R0FJRztBQUNILFNBQWdCLE9BQU87SUFDbkIsTUFBTSxLQUFLLEdBQVksSUFBSSxpQkFBTyxFQUFFLENBQUM7SUFDckMsdUdBQXVHO0lBQ3ZHLE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFKRCwwQkFJQztBQUNELG1HQUFtRztBQUNuRzs7Ozs7O0dBTUc7QUFDSCxTQUFnQixjQUFjLENBQUMsU0FBa0I7QUFFakQsQ0FBQztBQUZELHdDQUVDO0FBQ0QsbUdBQW1HO0FBQ25HOzs7O0dBSUc7QUFDSCxTQUFnQixlQUFlLENBQUMsU0FBa0I7SUFDOUMsT0FBTztJQUNQLDZDQUE2QztBQUNqRCxDQUFDO0FBSEQsMENBR0M7QUFDRCxtR0FBbUc7QUFDbkc7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsU0FBUyxDQUFDLE1BQWUsRUFBRSxNQUFlO0lBQ3RELHdCQUF3QjtJQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFIRCw4QkFHQztBQUNELG1HQUFtRztBQUNuRzs7OztHQUlHO0FBQ0gsU0FBZ0IsU0FBUyxDQUFDLEtBQWM7SUFDcEMsd0JBQXdCO0lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUhELDhCQUdDO0FBQ0QsbUdBQW1HO0FBQ25HOzs7R0FHRztBQUNILFNBQWdCLGFBQWEsQ0FBQyxTQUFrQjtJQUM1QyxtREFBbUQ7SUFDbkQsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFIRCxzQ0FH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