import { EEntType } from '../libs/geo-info/common';
import { idsBreak } from '../libs/geo-info/common_id_funcs';
import { getArrDepth } from '../libs/util/arrs';
import { getDataTypeStrFromValue } from './_check_types';
export const ID = {
    isNull: -1,
    isID: 0,
    isIDL1: 1,
    isIDL2: 2,
    isIDL3: 3,
    isIDL4: 4,
};
/**
 *
 * @param __model__
 * @param fn_name
 * @param arg_name
 * @param arg
 * @param id_types
 * @param ent_types
 * @param check_exists
 */
export function checkIDs(__model__, fn_name, arg_name, arg, id_types, ent_types, check_exists = true) {
    if (arg === undefined) {
        const err_msg = _errorMsg(fn_name, arg_name, arg, id_types, ent_types);
        throw new Error(err_msg + 'The argument "' + arg_name + '" is undefined.' + '<br>');
    }
    // check for null case
    if (arg === null) {
        if (id_types.indexOf(ID.isNull) === -1) {
            const err_msg = _errorMsg(fn_name, arg_name, arg, id_types, ent_types);
            throw new Error(err_msg + 'The argument "' + arg_name + '" cannot be null.<br>');
        }
        else {
            return null;
        }
    }
    // check list depths
    const arg_depth = getArrDepth(arg);
    if (id_types.indexOf(arg_depth) === -1) {
        const max_depth = Math.max(...id_types);
        const err_msg = _errorMsg(fn_name, arg_name, arg, id_types, ent_types);
        if (max_depth === 0 && arg_depth > 0) {
            throw new Error(err_msg +
                'The argument "' + arg_name + '" has the wrong structure. ' +
                'A single entity ID is expected. ' +
                'However, the argument is a list of depth ' + arg_depth + '. ');
        }
        throw new Error(err_msg +
            'The argument "' + arg_name + '" has the wrong structure. ' +
            'The maximum depth of the list structure is ' + max_depth + '. ' +
            'However, the argument is a list of depth ' + arg_depth + '. ');
    }
    // create a set of allowable entity types
    let ent_types_set;
    if (ent_types === null) {
        ent_types_set = new Set([
            EEntType.POSI,
            EEntType.VERT,
            EEntType.TRI,
            EEntType.EDGE,
            EEntType.WIRE,
            EEntType.POINT,
            EEntType.PLINE,
            EEntType.PGON,
            EEntType.COLL
        ]);
    }
    else {
        ent_types_set = new Set(ent_types);
    }
    // check the IDs
    let ents;
    try {
        ents = _checkIdsAreValid(__model__, arg, ent_types_set, check_exists, 0, arg_depth);
    }
    catch (err) {
        const err_msg = _errorMsg(fn_name, arg_name, arg, id_types, ent_types);
        throw new Error(err_msg + 'The argument "' + arg_name + '" contains bad IDs:' + err.message + '<br>');
    }
    // return the ents
    return ents; // returns TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]; depends on which passes
}
/**
 *
 * @param __model__
 * @param arg
 * @param ent_types_set
 * @param check_exists
 */
function _checkIdsAreValid(__model__, arg, ent_types_set, check_exists, curr_depth, req_depth) {
    if (!Array.isArray(arg)) {
        // check array is homogeneous
        if (curr_depth !== req_depth) {
            throw new Error('<ul><li>The entity with the ID "' + arg + '" is in a list that has an inconsistent depth. ' +
                'For this entity, the depth of the list is ' + curr_depth + ', while previous entities were in lists with a depth of ' + req_depth + '.' +
                '</li></ul>');
        }
        let ent_arr;
        try {
            ent_arr = idsBreak(arg); // split
        }
        catch (err) {
            throw new Error('<ul><li>The entity ID "' + arg + '" is not a valid Entity ID.</li></ul>'); // check valid id
        }
        // check entity exists
        if (check_exists && !__model__.modeldata.geom.snapshot.hasEnt(__model__.modeldata.active_ssid, ent_arr[0], ent_arr[1])) {
            throw new Error('<ul><li>The entity with the ID "' + arg + '" has been deleted.</li></ul>'); // check id exists
        }
        // check entity type
        if (!ent_types_set.has(ent_arr[0])) {
            throw new Error('<ul><li>The entity with the ID "' + arg + '" is not one of the perimtted types.</li></ul>');
        }
        // return the ent array
        return ent_arr;
    }
    else {
        return arg.map(a_arg => _checkIdsAreValid(__model__, a_arg, ent_types_set, check_exists, curr_depth + 1, req_depth));
    }
}
/**
 *
 * @param fn_name
 * @param arg_name
 * @param arg
 * @param id_types
 * @param ent_types
 */
function _errorMsg(fn_name, arg_name, arg, id_types, ent_types) {
    let err_msg = 'One of the arguments passed to the ' + fn_name + ' function is invalid. ' +
        '<ul>' +
        '<li>Function name: "' + fn_name + '" </li>' +
        '<li>Parameter name: "' + arg_name + '" </li>' +
        '<li>Argument value: ' + JSON.stringify(arg) + ' </li>' +
        '<li>Argument value data type: ' + getDataTypeStrFromValue(arg) + ' </li>' +
        '</ul>' +
        'The "' + arg_name + '" parameter accepts geometric entity IDs in the following structures:' +
        '<ul>';
    for (const id_type of id_types) {
        err_msg += '<li>' + _getDataTypeStrFromIDType(id_type) + ' </li>';
    }
    err_msg +=
        '</ul>' +
            'The entity IDs can be of the following types:' +
            '<ul>';
    for (const ent_type of ent_types) {
        err_msg +=
            '<li>' +
                _getIDTypeStr(ent_type) +
                '</li>';
    }
    err_msg += '</ul>';
    return err_msg;
}
/**
 *
 * @param check_fn
 */
function _getDataTypeStrFromIDType(id_type) {
    switch (id_type) {
        case ID.isID:
            return 'an entity ID';
        case ID.isIDL1:
            return 'a list of entity IDs (with a depth of 1)';
        case ID.isIDL2:
            return 'a nested list of entity IDs (with a depth of 2)';
        case ID.isIDL3:
            return 'a nested list of entity IDs (with a depth of 3)';
        case ID.isNull:
            return 'a null value';
        default:
            return 'sorry... arg type not found';
    }
}
/**
 *
 * @param ent_type
 */
function _getIDTypeStr(ent_type) {
    switch (ent_type) {
        case EEntType.POSI:
            return 'positions (ps)';
        case EEntType.VERT:
            return 'vertices (_v)';
        case EEntType.EDGE:
            return 'edges (_e)';
        case EEntType.WIRE:
            return 'wires (_w)';
        case EEntType.POINT:
            return 'points (pt)';
        case EEntType.PLINE:
            return 'polylines (pl)';
        case EEntType.PGON:
            return 'polgons (pg)';
        case EEntType.COLL:
            return 'collections (co)';
        case null:
            return 'a null value';
        default:
            return 'Internal error... entitiy type not found';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NoZWNrX2lkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL19jaGVja19pZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFFBQVEsRUFBZSxNQUFNLHVCQUF1QixDQUFDO0FBQzlELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNqRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFekQsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHO0lBQ2QsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNWLElBQUksRUFBRSxDQUFDO0lBQ1AsTUFBTSxFQUFFLENBQUM7SUFDVCxNQUFNLEVBQUUsQ0FBQztJQUNULE1BQU0sRUFBRSxDQUFDO0lBQ1QsTUFBTSxFQUFFLENBQUM7Q0FDWixDQUFDO0FBQ0Y7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxVQUFVLFFBQVEsQ0FBQyxTQUFrQixFQUFFLE9BQWUsRUFBRSxRQUFnQixFQUFFLEdBQVEsRUFBRSxRQUFrQixFQUNuRixTQUEwQixFQUFFLFlBQVksR0FBRyxJQUFJO0lBQ3BFLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtRQUNuQixNQUFNLE9BQU8sR0FBVyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQy9FLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxHQUFHLGdCQUFnQixHQUFHLFFBQVEsR0FBRyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsQ0FBQztLQUN2RjtJQUNELHNCQUFzQjtJQUN0QixJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7UUFDZCxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFF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