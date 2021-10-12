"use strict";
/**
 * The `collections` module has functions for creating and modifying collections.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delete = exports.Remove = exports.Add = exports.Get = exports.Create = void 0;
const _check_ids_1 = require("../../_check_ids");
const chk = __importStar(require("../../_check_types"));
const common_1 = require("../../../libs/geo-info/common");
const common_id_funcs_1 = require("../../../libs/geo-info/common_id_funcs");
const arrs_1 = require("../../../libs/util/arrs");
// import { __merge__} from '../_model';
// import { _model } from '..';
const arrs_2 = require("../../../libs/util/arrs");
// ================================================================================================
/**
 * Create a new collection.
 *
 * If the `entities` argument is null or an empty list, then an empty collection will be created.
 *
 * If the `name` argument is null, then no name attribute will be created for the collection.
 *
 * If the list of entities contains other collections, these other collections will then become
 * children of the new collection.
 *
 * @param __model__
 * @param entities List or nested lists of points, polylines, polygons, and other colletions, or null.
 * @param name The name to give to this collection, resulting in an attribute called `name`. If `null`, no attribute will be created.
 * @returns Entities, new collection, or a list of new collections.
 * @example collection1 = collection.Create([point1,polyine1,polygon1], 'my_coll')
 * @example_info Creates a collection containing point1, polyline1, polygon1, with an attribute `name = 'my_coll'`.
 */
function Create(__model__, entities, name) {
    entities = (entities === null) ? [] : (0, arrs_2.arrMakeFlat)(entities);
    // --- Error Check ---
    const fn_name = 'collection.Create';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1, _check_ids_1.ID.isIDL2], [common_1.EEntType.POINT, common_1.EEntType.PLINE, common_1.EEntType.PGON, common_1.EEntType.COLL]);
        chk.checkArgs(fn_name, 'name', name, [chk.isStr, chk.isNull]);
    }
    else {
        ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
    }
    // --- Error Check ---
    const coll_i = _create(__model__, ents_arr);
    // set the name
    if (name !== null) {
        __model__.modeldata.attribs.set.setEntsAttribVal(common_1.EEntType.COLL, coll_i, common_1.EAttribNames.COLL_NAME, name);
    }
    // return the collection id
    return (0, common_id_funcs_1.idMake)(common_1.EEntType.COLL, coll_i);
}
exports.Create = Create;
function _create(__model__, ents_arr) {
    const ssid = __model__.modeldata.active_ssid;
    const points_i = [];
    const plines_i = [];
    const pgons_i = [];
    const child_colls_i = [];
    for (const ent_arr of ents_arr) {
        if (ent_arr[0] === common_1.EEntType.POSI) {
            points_i.push(ent_arr[1]);
        }
        if (ent_arr[0] === common_1.EEntType.PLINE) {
            plines_i.push(ent_arr[1]);
        }
        if (ent_arr[0] === common_1.EEntType.PGON) {
            pgons_i.push(ent_arr[1]);
        }
        if (ent_arr[0] === common_1.EEntType.COLL) {
            child_colls_i.push(ent_arr[1]);
        }
    }
    // create the collection, setting tha parent to -1
    const coll_i = __model__.modeldata.geom.add.addColl();
    __model__.modeldata.geom.snapshot.addCollPoints(ssid, coll_i, points_i);
    __model__.modeldata.geom.snapshot.addCollPlines(ssid, coll_i, plines_i);
    __model__.modeldata.geom.snapshot.addCollPgons(ssid, coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.addCollChildren(ssid, coll_i, child_colls_i);
    // return the new collection
    return coll_i;
}
// ================================================================================================
/**
 * Get one or more collections from the model, given a name or list of names.
 * Collections with an attribute called 'name' and with a value that matches teh given vale will be returned.
 * \n
 * The value for name can include wildcards: '?' matches any single character and '*' matches any sequence of characters.
 * For example, 'coll?' will match 'coll1' and 'colla'. 'coll*' matches any name that starts with 'coll'.
 * \n
 * If a single collection is found, the collection will be returned as a single item (not a list).
 * This is a convenience so that there is no need to get the first item out of the returned list.
 * \n
 * If no collections are found, then an empty list is returned.
 * \n
 * @param __model__
 * @param names A name or list of names. May include wildcards, '?' and '*'.
 * @returns The collection, or a list of collections.
 */
function Get(__model__, names) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'collection.Get';
        chk.checkArgs(fn_name, 'names', names, [chk.isStr, chk.isStrL]);
    }
    // --- Error Check ---
    const colls_i = _get(__model__, names);
    if (colls_i.length === 0) {
        return []; // return an empty list
    }
    else if (colls_i.length === 1) {
        return (0, common_id_funcs_1.idMake)(common_1.EEntType.COLL, colls_i[0]);
    }
    return (0, common_id_funcs_1.idsMakeFromIdxs)(common_1.EEntType.COLL, colls_i);
    // return idsMake(colls_i.map(coll_i => [EEntType.COLL, coll_i]) as TEntTypeIdx[]) as TId[];
}
exports.Get = Get;
function _get(__model__, names) {
    if (!Array.isArray(names)) {
        // wildcards
        if (names.indexOf('*') !== -1 || names.indexOf('?') !== -1) {
            const reg_exp = new RegExp(names.replace('?', '\\w').replace('*', '\\w*'));
            const all_colls_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, common_1.EEntType.COLL);
            const all_names = all_colls_i.map(coll_i => __model__.modeldata.attribs.get.getEntAttribVal(common_1.EEntType.COLL, coll_i, common_1.EAttribNames.COLL_NAME));
            const unique_names = Array.from(new Set(all_names));
            const match_names = [];
            for (const name1 of unique_names) {
                if (reg_exp.test(name1)) {
                    match_names.push(name1);
                }
            }
            return _get(__model__, match_names);
        }
        const colls_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, common_1.EEntType.COLL);
        const query_result = __model__.modeldata.attribs.query.filterByAttribs(common_1.EEntType.COLL, colls_i, common_1.EAttribNames.COLL_NAME, null, common_1.EFilterOperatorTypes.IS_EQUAL, names);
        return query_result;
    }
    else {
        const all_colls_i = [];
        for (const name1 of names) {
            for (const coll_i of _get(__model__, name1)) {
                all_colls_i.push(coll_i);
            }
        }
        return all_colls_i;
    }
}
// ================================================================================================
/**
 * Addes entities to a collection.
 * \n
 * @param __model__
 * @param coll The collection to be updated.
 * @param entities Points, polylines, polygons, and collections to add.
 * @returns void
 */
function Add(__model__, coll, entities) {
    entities = (0, arrs_2.arrMakeFlat)(entities);
    if (!(0, arrs_1.isEmptyArr)(entities)) {
        // --- Error Check ---
        const fn_name = 'collection.Add';
        let coll_arr;
        let ents_arr;
        if (__model__.debug) {
            coll_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'coll', coll, [_check_ids_1.ID.isID], [common_1.EEntType.COLL]);
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [common_1.EEntType.POINT, common_1.EEntType.PLINE, common_1.EEntType.PGON, common_1.EEntType.COLL]);
        }
        else {
            // coll_arr = splitIDs(fn_name, 'coll', coll, [IDcheckObj.isID], [EEntType.COLL]) as TEntTypeIdx;
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            //     [IDcheckObj.isID, IDcheckObj.isIDList],
            //     [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
            coll_arr = (0, common_id_funcs_1.idsBreak)(coll);
            ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
        }
        // --- Error Check ---
        _collectionAdd(__model__, coll_arr[1], ents_arr);
    }
}
exports.Add = Add;
function _collectionAdd(__model__, coll_i, ents_arr) {
    const ssid = __model__.modeldata.active_ssid;
    const points_i = [];
    const plines_i = [];
    const pgons_i = [];
    const colls_i = [];
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case common_1.EEntType.POINT:
                points_i.push(ent_i);
                break;
            case common_1.EEntType.PLINE:
                plines_i.push(ent_i);
                break;
            case common_1.EEntType.PGON:
                pgons_i.push(ent_i);
                break;
            case common_1.EEntType.COLL:
                colls_i.push(ent_i);
                break;
            default:
                throw new Error('Error adding entities to a collection. \
                A collection can only contain points, polylines, polygons, and other collections.');
        }
    }
    __model__.modeldata.geom.snapshot.addCollPoints(ssid, coll_i, points_i);
    __model__.modeldata.geom.snapshot.addCollPlines(ssid, coll_i, plines_i);
    __model__.modeldata.geom.snapshot.addCollPgons(ssid, coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.addCollChildren(ssid, coll_i, colls_i);
}
// ================================================================================================
/**
 * Removes entities from a collection.
 * \n
 * @param __model__
 * @param coll The collection to be updated.
 * @param entities Points, polylines, polygons, and collections to add. Or null to empty the collection.
 * @returns void
 */
function Remove(__model__, coll, entities) {
    // --- Error Check ---
    const fn_name = 'collection.Remove';
    let ents_arr = null;
    let coll_arr;
    if (__model__.debug) {
        if (entities !== null) {
            entities = (0, arrs_2.arrMakeFlat)(entities);
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [common_1.EEntType.POINT, common_1.EEntType.PLINE, common_1.EEntType.PGON, common_1.EEntType.COLL]);
        }
        coll_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'coll', coll, [_check_ids_1.ID.isID], [common_1.EEntType.COLL]);
    }
    else {
        if (entities !== null) {
            entities = (0, arrs_2.arrMakeFlat)(entities);
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            //     [IDcheckObj.isID, IDcheckObj.isIDList],
            //     [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
            ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
        }
        // coll_arr = splitIDs(fn_name, 'coll', coll, [IDcheckObj.isID], [EEntType.COLL]) as TEntTypeIdx;
        coll_arr = (0, common_id_funcs_1.idsBreak)(coll);
    }
    // --- Error Check ---
    if (ents_arr === null) {
        _collectionEmpty(__model__, coll_arr[1]);
    }
    else {
        _collectionRemove(__model__, coll_arr[1], ents_arr);
    }
}
exports.Remove = Remove;
function _collectionRemove(__model__, coll_i, ents_arr) {
    const ssid = __model__.modeldata.active_ssid;
    const points_i = [];
    const plines_i = [];
    const pgons_i = [];
    const colls_i = [];
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case common_1.EEntType.POINT:
                points_i.push(ent_i);
                break;
            case common_1.EEntType.PLINE:
                plines_i.push(ent_i);
                break;
            case common_1.EEntType.PGON:
                pgons_i.push(ent_i);
                break;
            case common_1.EEntType.COLL:
                colls_i.push(ent_i);
                break;
            default:
                throw new Error('Error removing entities from a collection. \
                A collection can only contain points, polylines, polygons, and other collections.');
        }
    }
    __model__.modeldata.geom.snapshot.remCollPoints(ssid, coll_i, points_i);
    __model__.modeldata.geom.snapshot.remCollPlines(ssid, coll_i, plines_i);
    __model__.modeldata.geom.snapshot.remCollPgons(ssid, coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.remCollChildren(ssid, coll_i, colls_i);
}
function _collectionEmpty(__model__, coll_i) {
    const ssid = this.modeldata.active_ssid;
    const points_i = __model__.modeldata.geom.nav.navCollToPoint(coll_i);
    const plines_i = __model__.modeldata.geom.nav.navCollToPline(coll_i);
    const pgons_i = __model__.modeldata.geom.nav.navCollToPgon(coll_i);
    const colls_i = __model__.modeldata.geom.nav.navCollToCollChildren(coll_i);
    __model__.modeldata.geom.snapshot.remCollPoints(ssid, coll_i, points_i);
    __model__.modeldata.geom.snapshot.remCollPlines(ssid, coll_i, plines_i);
    __model__.modeldata.geom.snapshot.remCollPgons(ssid, coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.remCollChildren(ssid, coll_i, colls_i);
}
// ================================================================================================
/**
 * Deletes a collection without deleting the entities in the collection.
 * \n
 * @param __model__
 * @param coll The collection or list of collections to be deleted.
 * @returns void
 */
function Delete(__model__, coll) {
    coll = (0, arrs_2.arrMakeFlat)(coll);
    // --- Error Check ---
    const fn_name = 'collection.Delete';
    let colls_arrs;
    if (__model__.debug) {
        colls_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'coll', coll, [_check_ids_1.ID.isIDL1], [common_1.EEntType.COLL]);
    }
    else {
        // colls_arrs = splitIDs(fn_name, 'coll', coll, [IDcheckObj.isIDList], [EEntType.COLL]) as TEntTypeIdx[];
        colls_arrs = (0, common_id_funcs_1.idsBreak)(coll);
    }
    // --- Error Check ---
    const colls_i = [];
    for (const [ent_type, ent_i] of colls_arrs) {
        colls_i.push(ent_i);
    }
    __model__.modeldata.geom.snapshot.delColls(__model__.modeldata.active_ssid, colls_i);
}
exports.Delete = Delete;
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL21vZHVsZXMvYmFzaWMvY29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztHQUdHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsaURBQWdEO0FBRWhELHdEQUEwQztBQUcxQyxrREFBdUc7QUFDdkcsMkVBQTBGO0FBQzFGLGlEQUFvRDtBQUNwRCx3Q0FBd0M7QUFDeEMsK0JBQStCO0FBQy9CLDBDQUE4QztBQUU5QyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxTQUFnQixNQUFNLENBQUMsU0FBa0IsRUFBRSxRQUEyQixFQUFFLElBQVk7SUFDaEYsUUFBUSxHQUFHLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUEsa0JBQVcsRUFBQyxRQUFRLENBQUMsQ0FBQztJQUM1RCxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsbUJBQW1CLENBQUM7SUFDcEMsSUFBSSxRQUF1QixDQUFDO0lBQzVCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixRQUFRLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDeEQsQ0FBQyxlQUFFLENBQUMsSUFBSSxFQUFFLGVBQUUsQ0FBQyxNQUFNLEVBQUUsZUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUMvQixDQUFDLGlCQUFRLENBQUMsS0FBSyxFQUFFLGlCQUFRLENBQUMsS0FBSyxFQUFFLGlCQUFRLENBQUMsSUFBSSxFQUFFLGlCQUFRLENBQUMsSUFBSSxDQUFDLENBQWtCLENBQUM7UUFDckYsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxD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