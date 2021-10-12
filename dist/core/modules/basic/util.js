"use strict";
/**
 * The `util` module has some utility functions used for debugging.
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendData = exports._Async_Param_ModelMerge = exports.ModelMerge = exports._Async_Param_ModelCompare = exports.ModelCompare = exports.ModelCheck = exports.ModelInfo = exports.EntityInfo = exports.ParamInfo = exports.VrPanorama = exports.VrHotspot = exports.Select = void 0;
const _check_ids_1 = require("../../_check_ids");
const GIModel_1 = require("../../../libs/geo-info/GIModel");
const common_1 = require("../../../libs/geo-info/common");
const arrs_1 = require("../../../libs/util/arrs");
const common_id_funcs_1 = require("../../../libs/geo-info/common_id_funcs");
const io_1 = require("./io");
const _check_types_1 = require("../../../core/_check_types");
// ================================================================================================
/**
 * Select entities in the model.
 *
 * @param __model__
 * @param entities
 * @returns void
 */
function Select(__model__, entities) {
    __model__.modeldata.geom.selected[__model__.getActiveSnapshot()] = [];
    const activeSelected = __model__.modeldata.geom.selected[__model__.getActiveSnapshot()];
    entities = ((Array.isArray(entities)) ? entities : [entities]);
    const [ents_id_flat, ents_indices] = _flatten(entities);
    const ents_arr = (0, common_id_funcs_1.idsBreak)(ents_id_flat);
    const attrib_name = '_selected';
    for (let i = 0; i < ents_arr.length; i++) {
        const ent_arr = ents_arr[i];
        const ent_indices = ents_indices[i];
        const attrib_value = 'selected[' + ent_indices.join('][') + ']';
        activeSelected.push(ent_arr);
        if (!__model__.modeldata.attribs.query.hasEntAttrib(ent_arr[0], attrib_name)) {
            __model__.modeldata.attribs.add.addAttrib(ent_arr[0], attrib_name, common_1.EAttribDataTypeStrs.STRING);
        }
        __model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_arr[0], ent_arr[1], attrib_name, attrib_value);
    }
}
exports.Select = Select;
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
// ================================================================================================
/**
 * Creta a VR hotspot. In the VR Viewer, you can teleport to such hotspots.
 * \n
 * @param __model__
 * @param point A point object to be used for creating hotspots.
 * @param name A name for the VR hotspots. If `null`, a default name will be created.
 * @param camera_rot The rotation of the camera direction when you teleport yo the hotspot. The
 * rotation is specified in degrees, in the counter-clockwise direction, starting from the Y axis.
 * If `null`, the camera rotation will default to 0.
 * @returns void
 */
function VrHotspot(__model__, point, name, camera_rot) {
    // --- Error Check ---
    const fn_name = 'util.vrHotspot';
    let ent_arr;
    if (__model__.debug) {
        ent_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'points', point, [_check_ids_1.ID.isID], [common_1.EEntType.POINT]);
        (0, _check_types_1.checkArgs)(fn_name, 'name', name, [_check_types_1.isStr, _check_types_1.isNull]);
        (0, _check_types_1.checkArgs)(fn_name, 'camera_rot', camera_rot, [_check_types_1.isNum, _check_types_1.isNull]);
    }
    else {
        ent_arr = (0, common_id_funcs_1.idsBreak)(point);
    }
    // --- Error Check ---
    const ent_i = ent_arr[1];
    if (!__model__.modeldata.attribs.query.hasEntAttrib(common_1.EEntType.POINT, "vr_hotspot")) {
        __model__.modeldata.attribs.add.addEntAttrib(common_1.EEntType.POINT, "vr_hotspot", common_1.EAttribDataTypeStrs.DICT);
    }
    let hs_dict = __model__.modeldata.attribs.get.getEntAttribVal(common_1.EEntType.POINT, ent_i, "vr_hotspot");
    if (hs_dict === undefined) {
        hs_dict = {};
    }
    if (name !== null) {
        hs_dict["name"] = name;
    }
    if (camera_rot !== null) {
        hs_dict["camera_rotation"] = camera_rot;
    }
    __model__.modeldata.attribs.set.setEntAttribVal(common_1.EEntType.POINT, ent_i, "vr_hotspot", hs_dict);
}
exports.VrHotspot = VrHotspot;
// ================================================================================================
/**
 * Create a VR panorama hotspot. In the VR Viewer, you can teleport to such hotspots.When you enter
 * the hotspot, the panorama images will be loaded into the view. \n
 * @param __model__
 * @param point The point object to be used for creating a panorama. If this point is already
 * defined as a VR hotspot, then the panorama hotspot will inherit the name and camera angle.
 * @param back_url The URL of the 360 degree panorama image to be used for the background.
 * @param Back_rot The rotation of the background panorama image, in degrees, in the
 * counter-clockwise direction. If `null`, then rotation will be 0.
 * @param fore_url The URL of the 360 degree panorama image to be used for the foreground. If `null`
 * then no foreground image will be used.
 * @param fore_rot The rotation of the forground panorama image, in degrees, in the
 * counter-clockwise direction. If `null`, then the foreground rotation will be equal to the background rotation.
 * @returns void
 */
function VrPanorama(__model__, point, back_url, back_rot, fore_url, fore_rot) {
    // --- Error Check ---
    const fn_name = 'util.vrPanorama';
    let ent_arr;
    if (__model__.debug) {
        ent_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'point', point, [_check_ids_1.ID.isID], [common_1.EEntType.POINT]);
        (0, _check_types_1.checkArgs)(fn_name, 'back_url', back_url, [_check_types_1.isStr]);
        (0, _check_types_1.checkArgs)(fn_name, 'back_rot', back_rot, [_check_types_1.isNum, _check_types_1.isNull]);
        (0, _check_types_1.checkArgs)(fn_name, 'fore_url', fore_url, [_check_types_1.isStr, _check_types_1.isNull]);
        (0, _check_types_1.checkArgs)(fn_name, 'fore_rot', fore_rot, [_check_types_1.isNum, _check_types_1.isNull]);
    }
    else {
        ent_arr = (0, common_id_funcs_1.idsBreak)(point);
    }
    // --- Error Check ---
    const ent_i = ent_arr[1];
    if (!__model__.modeldata.attribs.query.hasEntAttrib(common_1.EEntType.POINT, "vr_hotspot")) {
        __model__.modeldata.attribs.add.addEntAttrib(common_1.EEntType.POINT, "vr_hotspot", common_1.EAttribDataTypeStrs.DICT);
    }
    let phs_dict = __model__.modeldata.attribs.get.getEntAttribVal(common_1.EEntType.POINT, ent_i, "vr_hotspot");
    if (phs_dict === undefined) {
        phs_dict = {};
    }
    phs_dict["background_url"] = back_url;
    if (back_rot === null) {
        phs_dict["background_rotation"] = 0;
    }
    else {
        phs_dict["background_rotation"] = back_rot;
    }
    if (fore_url !== null) {
        phs_dict["foreground_url"] = fore_url;
        if (fore_rot === null) {
            phs_dict["foreground_rotation"] = phs_dict["background_rotation"];
        }
        else {
            phs_dict["foreground_rotation"] = fore_rot;
        }
    }
    __model__.modeldata.attribs.set.setEntAttribVal(common_1.EEntType.POINT, ent_i, "vr_hotspot", phs_dict);
}
exports.VrPanorama = VrPanorama;
// ================================================================================================
/**
 * Returns am html string representation of the parameters in this model.
 * The string can be printed to the console for viewing.
 *
 * @param __model__
 * @param __constList__
 * @returns Text that summarises what is in the model.
 */
function ParamInfo(__model__, __constList__) {
    return JSON.stringify(__constList__);
}
exports.ParamInfo = ParamInfo;
// ================================================================================================
/**
 * Returns an html string representation of one or more entities in the model.
 * The string can be printed to the console for viewing.
 *
 * @param __model__
 * @param entities One or more objects ot collections.
 * @returns void
 */
function EntityInfo(__model__, entities) {
    entities = (0, arrs_1.arrMakeFlat)(entities);
    // --- Error Check ---
    const fn_name = 'util.EntityInfo';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'coll', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [common_1.EEntType.COLL, common_1.EEntType.PGON, common_1.EEntType.PLINE, common_1.EEntType.POINT]);
    }
    else {
        ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
    }
    // --- Error Check ---
    let result = '<h4>Entity Information:</h4>';
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i] = ent_arr;
        switch (ent_type) {
            case common_1.EEntType.COLL:
                result += _collInfo(__model__, ent_i);
                break;
            case common_1.EEntType.PGON:
                result += _pgonInfo(__model__, ent_i);
                break;
            case common_1.EEntType.PLINE:
                result += _plineInfo(__model__, ent_i);
                break;
            case common_1.EEntType.POINT:
                result += _pointInfo(__model__, ent_i);
                break;
            default:
                break;
        }
    }
    return result;
}
exports.EntityInfo = EntityInfo;
function _getAttribs(__model__, ent_type, ent_i) {
    const names = __model__.modeldata.attribs.getAttribNames(ent_type);
    const attribs_with_vals = [];
    for (const name of names) {
        const val = __model__.modeldata.attribs.get.getEntAttribVal(ent_type, ent_i, name);
        if (val !== undefined) {
            attribs_with_vals.push(name);
        }
    }
    return attribs_with_vals;
}
function _getColls(__model__, ent_type, ent_i) {
    const ssid = __model__.modeldata.active_ssid;
    let colls_i = [];
    if (ent_type === common_1.EEntType.COLL) {
        const parent = __model__.modeldata.geom.snapshot.getCollParent(ssid, ent_i);
        if (parent !== -1) {
            colls_i = [parent];
        }
    }
    else {
        colls_i = __model__.modeldata.geom.nav.navAnyToColl(ent_type, ent_i);
    }
    const colls_names = [];
    for (const coll_i of colls_i) {
        let coll_name = 'No name';
        if (__model__.modeldata.attribs.query.hasEntAttrib(common_1.EEntType.COLL, common_1.EAttribNames.COLL_NAME)) {
            coll_name = __model__.modeldata.attribs.get.getEntAttribVal(common_1.EEntType.COLL, coll_i, common_1.EAttribNames.COLL_NAME);
        }
        colls_names.push(coll_name);
    }
    return colls_names;
}
function _pointInfo(__model__, point_i) {
    let info = '';
    // get the data
    const attribs = _getAttribs(__model__, common_1.EEntType.POINT, point_i);
    const colls_names = _getColls(__model__, common_1.EEntType.POINT, point_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Point</b></li>';
    info += '<ul>';
    if (attribs.length !== 0) {
        info += '<li>Attribs: ' + attribs.join(', ') + '</li>';
    }
    if (colls_names.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    }
    else if (colls_names.length > 1) {
        info += '<li>In ' + colls_names.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
function _plineInfo(__model__, pline_i) {
    let info = '';
    // get the data
    const attribs = _getAttribs(__model__, common_1.EEntType.PLINE, pline_i);
    const num_verts = __model__.modeldata.geom.nav.navAnyToVert(common_1.EEntType.PLINE, pline_i).length;
    const num_edges = __model__.modeldata.geom.nav.navAnyToEdge(common_1.EEntType.PLINE, pline_i).length;
    const colls_names = _getColls(__model__, common_1.EEntType.PLINE, pline_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Polyline</b></li>';
    info += '<ul>';
    if (attribs.length !== 0) {
        info += '<li>Attribs: ' + attribs.join(', ') + '</li>';
    }
    if (num_verts) {
        info += '<li>Num verts: ' + num_verts + '</li>';
    }
    if (num_edges) {
        info += '<li>Num edges: ' + num_edges + '</li>';
    }
    if (colls_names.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    }
    else if (colls_names.length > 1) {
        info += '<li>In ' + colls_names.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
function _pgonInfo(__model__, pgon_i) {
    let info = '';
    // get the data
    const attribs = _getAttribs(__model__, common_1.EEntType.PGON, pgon_i);
    const num_verts = __model__.modeldata.geom.nav.navAnyToVert(common_1.EEntType.PGON, pgon_i).length;
    const num_edges = __model__.modeldata.geom.nav.navAnyToEdge(common_1.EEntType.PGON, pgon_i).length;
    const num_wires = __model__.modeldata.geom.nav.navAnyToWire(common_1.EEntType.PGON, pgon_i).length;
    const colls_i = __model__.modeldata.geom.nav.navPgonToColl(pgon_i);
    const colls_names = _getColls(__model__, common_1.EEntType.PGON, pgon_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Polygon</b></li>';
    info += '<ul>';
    if (attribs.length !== 0) {
        info += '<li>Attribs: ' + attribs.join(', ') + '</li>';
    }
    if (num_verts) {
        info += '<li>Num verts: ' + num_verts + '</li>';
    }
    if (num_edges) {
        info += '<li>Num edges: ' + num_edges + '</li>';
    }
    if (num_wires) {
        info += '<li>Num wires: ' + num_wires + '</li>';
    }
    if (colls_i.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    }
    else if (colls_i.length > 1) {
        info += '<li>In ' + colls_i.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
function _collInfo(__model__, coll_i) {
    const ssid = __model__.modeldata.active_ssid;
    let info = '';
    // get the data
    let coll_name = 'None';
    if (__model__.modeldata.attribs.query.hasEntAttrib(common_1.EEntType.COLL, common_1.EAttribNames.COLL_NAME)) {
        coll_name = __model__.modeldata.attribs.get.getEntAttribVal(common_1.EEntType.COLL, coll_i, common_1.EAttribNames.COLL_NAME);
    }
    const attribs = _getAttribs(__model__, common_1.EEntType.COLL, coll_i);
    const num_pgons = __model__.modeldata.geom.nav.navCollToPgon(coll_i).length;
    const num_plines = __model__.modeldata.geom.nav.navCollToPline(coll_i).length;
    const num_points = __model__.modeldata.geom.nav.navCollToPoint(coll_i).length;
    const colls_names = _getColls(__model__, common_1.EEntType.COLL, coll_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Collection</b></li>';
    info += '<ul>';
    info += '<li>Name: <b>' + coll_name + '</b></li>';
    if (attribs.length !== 0) {
        info += '<li>Attribs: ' + attribs.join(', ') + '</li>';
    }
    if (num_pgons) {
        info += '<li>Num pgons: ' + num_pgons + '</li>';
    }
    if (num_plines) {
        info += '<li>Num plines: ' + num_plines + '</li>';
    }
    if (num_points) {
        info += '<li>Num points: ' + num_points + '</li>';
    }
    if (colls_names.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    }
    else if (colls_names.length > 1) {
        info += '<li>In ' + colls_names.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    const children = __model__.modeldata.geom.snapshot.getCollChildren(ssid, coll_i);
    if (children.length > 0) {
        info += '<li>Child collections: </li>';
        for (const child of children) {
            info += _collInfo(__model__, child);
        }
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
// ================================================================================================
/**
 * Returns an html string representation of the contents of this model.
 * The string can be printed to the console for viewing.
 *
 * @param __model__
 * @returns Text that summarises what is in the model, click print to see this text.
 */
function ModelInfo(__model__) {
    let info = '<h4>Model Information:</h4>';
    info += '<ul>';
    // model attribs
    const model_attribs = __model__.modeldata.attribs.getAttribNames(common_1.EEntType.MOD);
    if (model_attribs.length !== 0) {
        info += '<li>Model attribs: ' + model_attribs.join(', ') + '</li>';
    }
    // collections
    const num_colls = __model__.modeldata.geom.query.numEnts(common_1.EEntType.COLL);
    const coll_attribs = __model__.modeldata.attribs.getAttribNames(common_1.EEntType.COLL);
    info += '<li>';
    info += '<b>Collections</b>: ' + num_colls; // + ' (Deleted: ' + num_del_colls + ') ';
    if (coll_attribs.length !== 0) {
        info += 'Attribs: ' + coll_attribs.join(', ');
    }
    info += '</li>';
    // pgons
    const num_pgons = __model__.modeldata.geom.query.numEnts(common_1.EEntType.PGON);
    const pgon_attribs = __model__.modeldata.attribs.getAttribNames(common_1.EEntType.PGON);
    info += '<li>';
    info += '<b>Polygons</b>: ' + num_pgons; // + ' (Deleted: ' + num_del_pgons + ') ';
    if (pgon_attribs.length !== 0) {
        info += 'Attribs: ' + pgon_attribs.join(', ');
    }
    info += '</li>';
    // plines
    const num_plines = __model__.modeldata.geom.query.numEnts(common_1.EEntType.PLINE);
    const pline_attribs = __model__.modeldata.attribs.getAttribNames(common_1.EEntType.PLINE);
    info += '<li>';
    info += '<b>Polylines</b>: ' + num_plines; // + ' (Deleted: ' + num_del_plines + ') ';
    if (pline_attribs.length !== 0) {
        info += 'Attribs: ' + pline_attribs.join(', ');
    }
    info += '</li>';
    // points
    const num_points = __model__.modeldata.geom.query.numEnts(common_1.EEntType.POINT);
    const point_attribs = __model__.modeldata.attribs.getAttribNames(common_1.EEntType.POINT);
    info += '<li>';
    info += '<b>Points</b>: ' + num_points; // + ' (Deleted: ' + num_del_points + ') ';
    if (point_attribs.length !== 0) {
        info += 'Attribs: ' + point_attribs.join(', ');
    }
    info += '</li>';
    // wires
    const num_wires = __model__.modeldata.geom.query.numEnts(common_1.EEntType.WIRE);
    const wire_attribs = __model__.modeldata.attribs.getAttribNames(common_1.EEntType.WIRE);
    info += '<li>';
    info += '<b>Wires</b>: ' + num_wires; // + ' (Deleted: ' + num_del_wires + ') ';
    if (wire_attribs.length !== 0) {
        info += 'Attribs: ' + wire_attribs.join(', ');
    }
    info += '</li>';
    // edges
    const num_edges = __model__.modeldata.geom.query.numEnts(common_1.EEntType.EDGE);
    const edge_attribs = __model__.modeldata.attribs.getAttribNames(common_1.EEntType.EDGE);
    info += '<li>';
    info += '<b>Edges</b>: ' + num_edges; // + ' (Deleted: ' + num_del_edges + ') ';
    if (edge_attribs.length !== 0) {
        info += 'Attribs: ' + edge_attribs.join(', ');
    }
    info += '</li>';
    // verts
    const num_verts = __model__.modeldata.geom.query.numEnts(common_1.EEntType.VERT);
    const vert_attribs = __model__.modeldata.attribs.getAttribNames(common_1.EEntType.VERT);
    info += '<li>';
    info += '<b>Vertices</b>: ' + num_verts; // + ' (Deleted: ' + num_del_verts + ') ';
    if (vert_attribs.length !== 0) {
        info += 'Attribs: ' + vert_attribs.join(', ');
    }
    info += '</li>';
    // posis
    const num_posis = __model__.modeldata.geom.query.numEnts(common_1.EEntType.POSI);
    const posi_attribs = __model__.modeldata.attribs.getAttribNames(common_1.EEntType.POSI);
    info += '<li>';
    info += '<b>Positions</b>: ' + num_posis; // + ' (Deleted: ' + num_del_posis + ') ';
    if (posi_attribs.length !== 0) {
        info += 'Attribs: ' + posi_attribs.join(', ');
    }
    info += '</li>';
    // end
    info += '</ul>';
    // return the string
    return info;
}
exports.ModelInfo = ModelInfo;
// ================================================================================================
/**
 * Checks the internal consistency of the model. Used for debugigng Mobius.
 *
 * @param __model__
 * @returns Text that summarises what is in the model, click print to see this text.
 */
function ModelCheck(__model__) {
    console.log('==== ==== ==== ====');
    console.log('MODEL GEOM\n', __model__.modeldata.geom.toStr());
    // console.log('MODEL ATTRIBS\n', __model__.modeldata.attribs.toStr());
    console.log('META\n', __model__.metadata.toDebugStr());
    console.log('==== ==== ==== ====');
    console.log(__model__);
    const check = __model__.check();
    if (check.length > 0) {
        return String(check);
    }
    return 'No internal inconsistencies have been found.';
}
exports.ModelCheck = ModelCheck;
// ================================================================================================
/**
 * Compares two models. Used for grading models.
 *
 * Checks that every entity in this model also exists in the input_data.
 *
 * Additional entitis in the input data will not affect the score.
 *
 * Attributes at the model level are ignored except for the `material` attributes.
 *
 * For grading, this model is assumed to be the answer model, and the input model is assumed to be
 * the model submitted by the student.
 *
 * The order or entities in this model may be modified in the comparison process.
 *
 * For specifying the location of the GI Model, you can either specify a URL, or the name of a file in LocalStorage.
 * In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'
 *
 * @param __model__
 * @param input_data The location of the GI Model to compare this model to.
 * @returns Text that summarises the comparison between the two models.
 */
async function ModelCompare(__model__, input_data) {
    const input_data_str = await (0, io_1._getFile)(input_data);
    if (!input_data_str) {
        throw new Error('Invalid imported model data');
    }
    const input_model = new GIModel_1.GIModel();
    input_model.importGI(input_data_str);
    const result = __model__.compare(input_model, true, false, false);
    return result.comment;
}
exports.ModelCompare = ModelCompare;
function _Async_Param_ModelCompare(__model__, input_data) {
    return null;
}
exports._Async_Param_ModelCompare = _Async_Param_ModelCompare;
// ================================================================================================
/**
 * Merges data from another model into this model.
 * This is the same as importing the model, except that no collection is created.
 *
 * For specifying the location of the GI Model, you can either specify a URL, or the name of a file in LocalStorage.
 * In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'
 *
 * @param __model__
 * @param input_data The location of the GI Model to import into this model to.
 * @returns Text that summarises the comparison between the two models.
 */
async function ModelMerge(__model__, input_data) {
    const input_data_str = await (0, io_1._getFile)(input_data);
    if (!input_data_str) {
        throw new Error('Invalid imported model data');
    }
    const ents_arr = __model__.importGI(input_data_str);
    return (0, common_id_funcs_1.idsMake)(ents_arr);
}
exports.ModelMerge = ModelMerge;
function _Async_Param_ModelMerge(__model__, input_data) {
    return null;
}
exports._Async_Param_ModelMerge = _Async_Param_ModelMerge;
// ================================================================================================
/**
 * Post a message to the parent window.
 *
 * @param __model__
 * @param data The data to send, a list or a dictionary.
 * @returns Text that summarises what is in the model, click print to see this text.
 */
function SendData(__model__, data) {
    window.parent.postMessage(data, '*');
}
exports.SendData = SendData;
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL21vZHVsZXMvYmFzaWMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztHQUdHOzs7QUFFSCxpREFBZ0Q7QUFDaEQsb0RBQWlEO0FBQ2pELGtEQUFtSjtBQUNuSixpREFBcUQ7QUFDckQsMkVBQTBFO0FBQzFFLDZCQUFnQztBQUNoQyw0REFBMEY7QUFFMUYsbUdBQW1HO0FBQ25HOzs7Ozs7R0FNRztBQUNILFNBQWdCLE1BQU0sQ0FBQyxTQUFrQixFQUFFLFFBQW9DO0lBQzNFLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUN0RSxNQUFNLGNBQWMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztJQUN4RixRQUFRLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFhLENBQUM7SUFDM0UsTUFBTSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEQsTUFBTSxRQUFRLEdBQWtCLElBQUEsMEJBQVEsRUFBQyxZQUFZLENBQWtCLENBQUM7SUFDeEUsTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3RDLE1BQU0sT0FBTyxHQUFnQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsTUFBTSxXQUFXLEdBQWEs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