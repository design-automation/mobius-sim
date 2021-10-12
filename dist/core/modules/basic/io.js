"use strict";
/**
 * The `io` module has functions for importing and exporting.
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
exports._Async_Param__getFile = exports._getFile = exports.LatLong2XYZ = exports.Geoalign = exports.Geolocate = exports._Async_Param_Export = exports.Export = exports._EIOExportDataFormat = exports._importGI = exports._import = exports._Async_Param_Import = exports.Import = exports._Async_Param_Write = exports.Write = exports._Async_Param_Read = exports.Read = exports._EIODataTarget = exports._EIODataSource = exports._EIODataFormat = void 0;
const _check_ids_1 = require("../../_check_ids");
const chk = __importStar(require("../../_check_types"));
const io_obj_1 = require("../../../libs/geo-info/io/io_obj");
const io_geojson_1 = require("../../../libs/geo-info/io/io_geojson");
const download_1 = require("../../../libs/filesys/download");
const common_1 = require("../../../libs/geo-info/common");
// import { __merge__ } from '../_model';
// import { _model } from '..';
const common_id_funcs_1 = require("../../../libs/geo-info/common_id_funcs");
const arrs_1 = require("../../../libs/util/arrs");
const jszip_1 = __importDefault(require("jszip"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const io_gltf_1 = require("../../../libs/geo-info/io/io_gltf");
const vectors_1 = require("../../../libs/geom/vectors");
const matrix_1 = require("../../../libs/geom/matrix");
const proj4_1 = __importDefault(require("proj4"));
const _check_types_1 = require("../../../core/_check_types");
const requestedBytes = 1024 * 1024 * 200; // 200 MB local storage quota
// ================================================================================================
// Import / Export data types
var _EIODataFormat;
(function (_EIODataFormat) {
    _EIODataFormat["GI"] = "gi";
    _EIODataFormat["OBJ"] = "obj";
    _EIODataFormat["GEOJSON"] = "geojson";
})(_EIODataFormat = exports._EIODataFormat || (exports._EIODataFormat = {}));
var _EIODataSource;
(function (_EIODataSource) {
    _EIODataSource["DEFAULT"] = "From URL";
    _EIODataSource["FILESYS"] = "From Local Storage";
})(_EIODataSource = exports._EIODataSource || (exports._EIODataSource = {}));
var _EIODataTarget;
(function (_EIODataTarget) {
    _EIODataTarget["DEFAULT"] = "Save to Hard Disk";
    _EIODataTarget["FILESYS"] = "Save to Local Storage";
})(_EIODataTarget = exports._EIODataTarget || (exports._EIODataTarget = {}));
// ================================================================================================
/**
 * Read data from a Url or from local storage.
 *
 * @param data The data to be read (from URL or from Local Storage).
 * @returns the data.
 */
async function Read(__model__, data) {
    return _getFile(data);
}
exports.Read = Read;
function _Async_Param_Read(__model__, data) {
    return null;
}
exports._Async_Param_Read = _Async_Param_Read;
// ================================================================================================
/**
 * Write data to the hard disk or to the local storage.
 *
 * @param data The data to be saved (can be the url to the file).
 * @param file_name The name to be saved in the file system (file extension should be included).
 * @param data_target Enum, where the data is to be exported to.
 * @returns whether the data is successfully saved.
 */
async function Write(__model__, data, file_name, data_target) {
    try {
        if (data_target === _EIODataTarget.DEFAULT) {
            return (0, download_1.download)(data, file_name);
        }
        return saveResource(data, file_name);
    }
    catch (ex) {
        return false;
    }
}
exports.Write = Write;
function _Async_Param_Write(__model__, data, file_name, data_target) {
    return null;
}
exports._Async_Param_Write = _Async_Param_Write;
// ================================================================================================
/**
 * Imports data into the model.
 * \n
 * There are two ways of specifying the file location to be imported:
 * - A url, e.g. "https://www.dropbox.com/xxxx/my_data.obj"
 * - A file name in the local storage, e.g. "my_data.obj".
 * \n
 * To place a file in local storage, go to the Mobius menu, and select 'Local Storage' from the dropdown.
 * Note that a script using a file in local storage may fail when others try to open the file.
 * \n
 * @param model_data The model data
 * @param data_format Enum, the file format.
 * @returns A list of the positions, points, polylines, polygons and collections added to the model.
 * @example io.Import ("my_data.obj", obj)
 * @example_info Imports the data from my_data.obj, from local storage.
 */
async function Import(__model__, input_data, data_format) {
    const model_data = await _getFile(input_data);
    if (!model_data) {
        throw new Error('Invalid imported model data');
    }
    // zip file
    if (model_data.constructor === {}.constructor) {
        const coll_results = {};
        for (const data_name in model_data) {
            if (model_data[data_name]) {
                coll_results[data_name] = _import(__model__, model_data[data_name], data_format);
            }
        }
        return coll_results;
    }
    // single file
    return _import(__model__, model_data, data_format);
}
exports.Import = Import;
function _Async_Param_Import(__model__, input_data, data_format) {
    return null;
}
exports._Async_Param_Import = _Async_Param_Import;
function _import(__model__, model_data, data_format) {
    switch (data_format) {
        case _EIODataFormat.GI:
            const gi_coll_i = _importGI(__model__, model_data);
            return (0, common_id_funcs_1.idMake)(common_1.EEntType.COLL, gi_coll_i);
        case _EIODataFormat.OBJ:
            const obj_coll_i = _importObj(__model__, model_data);
            return (0, common_id_funcs_1.idMake)(common_1.EEntType.COLL, obj_coll_i);
        case _EIODataFormat.GEOJSON:
            const gj_coll_i = _importGeojson(__model__, model_data);
            return (0, common_id_funcs_1.idMake)(common_1.EEntType.COLL, gj_coll_i);
        default:
            throw new Error('Import type not recognised');
    }
}
exports._import = _import;
function _importGI(__model__, json_str) {
    const ssid = __model__.modeldata.active_ssid;
    // import
    const ents = __model__.importGI(json_str);
    const container_coll_i = __model__.modeldata.geom.add.addColl();
    for (const [ent_type, ent_i] of ents) {
        switch (ent_type) {
            case common_1.EEntType.POINT:
                __model__.modeldata.geom.snapshot.addCollPoints(ssid, container_coll_i, ent_i);
                break;
            case common_1.EEntType.PLINE:
                __model__.modeldata.geom.snapshot.addCollPlines(ssid, container_coll_i, ent_i);
                break;
            case common_1.EEntType.PGON:
                __model__.modeldata.geom.snapshot.addCollPgons(ssid, container_coll_i, ent_i);
                break;
            case common_1.EEntType.COLL:
                __model__.modeldata.geom.snapshot.addCollChildren(ssid, container_coll_i, ent_i);
                break;
        }
    }
    __model__.modeldata.attribs.set.setEntAttribVal(common_1.EEntType.COLL, container_coll_i, 'name', 'import GI');
    // return the result
    return container_coll_i;
}
exports._importGI = _importGI;
function _importObj(__model__, model_data) {
    // get number of ents before merge
    const num_ents_before = __model__.metadata.getEntCounts();
    // import
    (0, io_obj_1.importObj)(__model__, model_data);
    // get number of ents after merge
    const num_ents_after = __model__.metadata.getEntCounts();
    // return the result
    const container_coll_i = _createColl(__model__, num_ents_before, num_ents_after);
    __model__.modeldata.attribs.set.setEntAttribVal(common_1.EEntType.COLL, container_coll_i, 'name', 'import OBJ');
    return container_coll_i;
}
function _importGeojson(__model__, model_data) {
    // get number of ents before merge
    const num_ents_before = __model__.metadata.getEntCounts();
    // import
    (0, io_geojson_1.importGeojson)(__model__, model_data, 0);
    // get number of ents after merge
    const num_ents_after = __model__.metadata.getEntCounts();
    // return the result
    const container_coll_i = _createColl(__model__, num_ents_before, num_ents_after);
    __model__.modeldata.attribs.set.setEntAttribVal(common_1.EEntType.COLL, container_coll_i, 'name', 'import GEOJSON');
    return container_coll_i;
}
// function _createGIColl(__model__: GIModel, before: number[], after: number[]): number {
//     throw new Error('Not implemented');
//     // const points_i: number[] = [];
//     // const plines_i: number[] = [];
//     // const pgons_i: number[] = [];
//     // for (let point_i = before[1]; point_i < after[1]; point_i++) {
//     //     if (__model__.modeldata.geom.query.entExists(EEntType.POINT, point_i)) {
//     //         points_i.push( point_i );
//     //     }
//     // }
//     // for (let pline_i = before[2]; pline_i < after[2]; pline_i++) {
//     //     if (__model__.modeldata.geom.query.entExists(EEntType.PLINE, pline_i)) {
//     //         plines_i.push( pline_i );
//     //     }
//     // }
//     // for (let pgon_i = before[3]; pgon_i < after[3]; pgon_i++) {
//     //     if (__model__.modeldata.geom.query.entExists(EEntType.PGON, pgon_i)) {
//     //         pgons_i.push( pgon_i );
//     //     }
//     // }
//     // if (points_i.length + plines_i.length + pgons_i.length === 0) { return null; }
//     // const container_coll_i: number = __model__.modeldata.geom.add.addColl(null, points_i, plines_i, pgons_i);
//     // for (let coll_i = before[4]; coll_i < after[4]; coll_i++) {
//     //     if (__model__.modeldata.geom.query.entExists(EEntType.COLL, coll_i)) {
//     //         __model__.modeldata.geom.modify_coll.setCollParent(coll_i, container_coll_i);
//     //     }
//     // }
//     // return container_coll_i;
// }
function _createColl(__model__, before, after) {
    const ssid = __model__.modeldata.active_ssid;
    const points_i = [];
    const plines_i = [];
    const pgons_i = [];
    const colls_i = [];
    for (let point_i = before[1]; point_i < after[1]; point_i++) {
        points_i.push(point_i);
    }
    for (let pline_i = before[2]; pline_i < after[2]; pline_i++) {
        plines_i.push(pline_i);
    }
    for (let pgon_i = before[3]; pgon_i < after[3]; pgon_i++) {
        pgons_i.push(pgon_i);
    }
    for (let coll_i = before[4]; coll_i < after[4]; coll_i++) {
        colls_i.push(coll_i);
    }
    if (points_i.length + plines_i.length + pgons_i.length === 0) {
        return null;
    }
    const container_coll_i = __model__.modeldata.geom.add.addColl();
    __model__.modeldata.geom.snapshot.addCollPoints(ssid, container_coll_i, points_i);
    __model__.modeldata.geom.snapshot.addCollPlines(ssid, container_coll_i, plines_i);
    __model__.modeldata.geom.snapshot.addCollPgons(ssid, container_coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.addCollChildren(ssid, container_coll_i, colls_i);
    return container_coll_i;
}
// ================================================================================================
var _EIOExportDataFormat;
(function (_EIOExportDataFormat) {
    _EIOExportDataFormat["GI"] = "gi";
    _EIOExportDataFormat["OBJ_VERT"] = "obj_v";
    _EIOExportDataFormat["OBJ_POSI"] = "obj_ps";
    // DAE = 'dae',
    _EIOExportDataFormat["GEOJSON"] = "geojson";
    _EIOExportDataFormat["GLTF"] = "gltf";
})(_EIOExportDataFormat = exports._EIOExportDataFormat || (exports._EIOExportDataFormat = {}));
/**
 * Export data from the model as a file.
 * \n
 * If you expore to your  hard disk,
 * it will result in a popup in your browser, asking you to save the file.
 * \n
 * If you export to Local Storage, there will be no popup.
 * \n
 * @param __model__
 * @param entities Optional. Entities to be exported. If null, the whole model will be exported.
 * @param file_name Name of the file as a string.
 * @param data_format Enum, the file format.
 * @param data_target Enum, where the data is to be exported to.
 * @returns void.
 * @example io.Export (#pg, 'my_model.obj', obj)
 * @example_info Exports all the polgons in the model as an OBJ.
 */
async function Export(__model__, entities, file_name, data_format, data_target) {
    if (typeof localStorage === 'undefined') {
        return;
    }
    // --- Error Check ---
    const fn_name = 'io.Export';
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null) {
            entities = (0, arrs_1.arrMakeFlat)(entities);
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isIDL1], [common_1.EEntType.PLINE, common_1.EEntType.PGON, common_1.EEntType.COLL]);
        }
        chk.checkArgs(fn_name, 'file_name', file_name, [chk.isStr, chk.isStrL]);
    }
    else {
        if (entities !== null) {
            entities = (0, arrs_1.arrMakeFlat)(entities);
            ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
        }
    }
    // --- Error Check ---
    await _export(__model__, ents_arr, file_name, data_format, data_target);
}
exports.Export = Export;
function _Async_Param_Export(__model__, entities, file_name, data_format, data_target) {
}
exports._Async_Param_Export = _Async_Param_Export;
async function _export(__model__, ents_arr, file_name, data_format, data_target) {
    const ssid = __model__.modeldata.active_ssid;
    switch (data_format) {
        case _EIOExportDataFormat.GI:
            {
                let model_data = '';
                model_data = __model__.exportGI(ents_arr);
                // gi_data = gi_data.replace(/\\\"/g, '\\\\\\"'); // TODO temporary fix
                model_data = model_data.replace(/\\/g, '\\\\\\'); // TODO temporary fix
                // === save the file ===
                if (data_target === _EIODataTarget.DEFAULT) {
                    return (0, download_1.download)(model_data, file_name);
                }
                return saveResource(model_data, file_name);
            }
        case _EIOExportDataFormat.OBJ_VERT:
            {
                const obj_verts_data = (0, io_obj_1.exportVertBasedObj)(__model__, ents_arr, ssid);
                // obj_data = obj_data.replace(/#/g, '%23'); // TODO temporary fix
                if (data_target === _EIODataTarget.DEFAULT) {
                    return (0, download_1.download)(obj_verts_data, file_name);
                }
                return saveResource(obj_verts_data, file_name);
            }
        case _EIOExportDataFormat.OBJ_POSI:
            {
                const obj_posis_data = (0, io_obj_1.exportPosiBasedObj)(__model__, ents_arr, ssid);
                // obj_data = obj_data.replace(/#/g, '%23'); // TODO temporary fix
                if (data_target === _EIODataTarget.DEFAULT) {
                    return (0, download_1.download)(obj_posis_data, file_name);
                }
                return saveResource(obj_posis_data, file_name);
            }
        // case _EIOExportDataFormat.DAE:
        //     const dae_data: string = exportDae(__model__);
        //     // dae_data = dae_data.replace(/#/g, '%23'); // TODO temporary fix
        //     if (data_target === _EIODataTarget.DEFAULT) {
        //         return download(dae_data, file_name);
        //     }
        //     return saveResource(dae_data, file_name);
        //     break;
        case _EIOExportDataFormat.GEOJSON:
            {
                const geojson_data = (0, io_geojson_1.exportGeojson)(__model__, ents_arr, true, ssid); // flatten
                if (data_target === _EIODataTarget.DEFAULT) {
                    return (0, download_1.download)(geojson_data, file_name);
                }
                return saveResource(geojson_data, file_name);
            }
        case _EIOExportDataFormat.GLTF:
            {
                const gltf_data = await (0, io_gltf_1.exportGltf)(__model__, ents_arr, ssid);
                if (data_target === _EIODataTarget.DEFAULT) {
                    return (0, download_1.download)(gltf_data, file_name);
                }
                return saveResource(gltf_data, file_name);
            }
        default:
            throw new Error('Data type not recognised');
    }
}
// ================================================================================================
/**
 * Set the geolocation of the Cartesian coordinate system.
 *
 * @param __model__
 * @param lat_long Set the latitude and longitude of the origin of the Cartesian coordinate system.
 * @param rot Set the counter-clockwise rotation of the Cartesian coordinate system, in radians.
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns void
 */
function Geolocate(__model__, lat_long, rot, elev) {
    // --- Error Check ---
    const fn_name = 'io.Geolocate';
    if (__model__.debug) {
        (0, _check_types_1.checkArgs)(fn_name, 'lat_long_o', lat_long, [_check_types_1.isXY, _check_types_1.isNull]);
        (0, _check_types_1.checkArgs)(fn_name, 'rot', elev, [_check_types_1.isNum, _check_types_1.isNull]);
        (0, _check_types_1.checkArgs)(fn_name, 'elev', elev, [_check_types_1.isNum, _check_types_1.isNull]);
    }
    // --- Error Check ---
    const gl_dict = { "latitude": lat_long[0], "longitude": lat_long[1] };
    if (elev !== null) {
        gl_dict["elevation"] = elev;
    }
    __model__.modeldata.attribs.set.setModelAttribVal("geolocation", gl_dict);
    let n_vec = [0, 1, 0];
    if (rot !== null) {
        n_vec = (0, vectors_1.vecRot)(n_vec, [0, 0, 1], -rot);
    }
    __model__.modeldata.attribs.set.setModelAttribVal("north", [n_vec[0], n_vec[1]]);
}
exports.Geolocate = Geolocate;
// ================================================================================================
/**
 * Set the geolocation of the Cartesian coordinate system.
 * \n
 * The Cartesian coordinate system is geolocated by defining two points:
 * - The latitude-longitude of the Cartesian origin.
 * - The latitude-longitude of a point on the positive Cartesian X-axis.
 * \n
 * @param __model__
 * @param lat_long_o Set the latitude and longitude of the origin of the Cartesian coordinate
 * system.
 * @param lat_long_x Set the latitude and longitude of a point on the x-axis of the Cartesian
 * coordinate system.
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns void
 */
function Geoalign(__model__, lat_long_o, lat_long_x, elev) {
    // --- Error Check ---
    const fn_name = 'io.Geoalign';
    if (__model__.debug) {
        (0, _check_types_1.checkArgs)(fn_name, 'lat_long_o', lat_long_o, [_check_types_1.isXY, _check_types_1.isNull]);
        (0, _check_types_1.checkArgs)(fn_name, 'lat_long_x', lat_long_x, [_check_types_1.isXY, _check_types_1.isNull]);
        (0, _check_types_1.checkArgs)(fn_name, 'elev', elev, [_check_types_1.isNum, _check_types_1.isNull]);
    }
    // --- Error Check ---
    const gl_dict = { "latitude": lat_long_o[0], "longitude": lat_long_o[1] };
    if (elev !== null) {
        gl_dict["elevation"] = elev;
    }
    __model__.modeldata.attribs.set.setModelAttribVal("geolocation", gl_dict);
    // calc
    const proj_obj = _createProjection(__model__);
    // origin
    let xyz_o = _xformFromLongLatToXYZ([lat_long_o[1], lat_long_o[0]], proj_obj, 0);
    // point on x axis
    let xyz_x = _xformFromLongLatToXYZ([lat_long_x[1], lat_long_x[0]], proj_obj, 0);
    // x axis vector
    const old_x_vec = [1, 0, 0];
    const new_x_vec = (0, vectors_1.vecFromTo)(xyz_o, xyz_x);
    const rot = (0, vectors_1.vecAng2)(old_x_vec, new_x_vec, [0, 0, 1]);
    // console.log("rot = ", rot, "x_vec = ", x_vec, xyz_o, xyz_x)
    // north vector
    const n_vec = (0, vectors_1.vecRot)([0, 1, 0], [0, 0, 1], -rot);
    __model__.modeldata.attribs.set.setModelAttribVal("north", [n_vec[0], n_vec[1]]);
}
exports.Geoalign = Geoalign;
// ================================================================================================
// ================================================================================================
// ================================================================================================
// ================================================================================================
/**
 * Functions for geospatial projection
 */
// longitude latitude in Singapore, NUS
const LONGLAT = [103.778329, 1.298759];
/**
 * TODO MEgre with io_geojson.ts
 * Get long lat, Detect CRS, create projection function
 * @param model The model.
 * @param point The features to add.
 */
function _createProjection(model) {
    // create the function for transformation
    const proj_str_a = '+proj=tmerc +lat_0=';
    const proj_str_b = ' +lon_0=';
    const proj_str_c = '+k=1 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs';
    let longitude = LONGLAT[0];
    let latitude = LONGLAT[1];
    if (model.modeldata.attribs.query.hasModelAttrib('geolocation')) {
        const geolocation = model.modeldata.attribs.get.getModelAttribVal('geolocation');
        const long_value = geolocation['longitude'];
        if (typeof long_value !== 'number') {
            throw new Error('Longitude attribute must be a number.');
        }
        longitude = long_value;
        if (longitude < -180 || longitude > 180) {
            throw new Error('Longitude attribute must be between -180 and 180.');
        }
        const lat_value = geolocation['latitude'];
        if (typeof lat_value !== 'number') {
            throw new Error('Latitude attribute must be a number');
        }
        latitude = lat_value;
        if (latitude < 0 || latitude > 90) {
            throw new Error('Latitude attribute must be between 0 and 90.');
        }
    }
    console.log("lat long", latitude, longitude);
    // try to figure out what the projection is of the source file
    // let proj_from_str = 'WGS84';
    // if (geojson_obj.hasOwnProperty('crs')) {
    //     if (geojson_obj.crs.hasOwnProperty('properties')) {
    //         if (geojson_obj.crs.properties.hasOwnProperty('name')) {
    //             const name: string = geojson_obj.crs.properties.name;
    //             const epsg_index = name.indexOf('EPSG');
    //             if (epsg_index !== -1) {
    //                 let epsg = name.slice(epsg_index);
    //                 epsg = epsg.replace(/\s/g, '+');
    //                 if (epsg === 'EPSG:4326') {
    //                     // do nothing, 'WGS84' is fine
    //                 } else if (['EPSG:4269', 'EPSG:3857', 'EPSG:3785', 'EPSG:900913', 'EPSG:102113'].indexOf(epsg) !== -1) {
    //                     // these are the epsg codes that proj4 knows
    //                     proj_from_str = epsg;
    //                 } else if (epsg === 'EPSG:3414') {
    //                     // singapore
    //                     proj_from_str =
    //                         '+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 ' +
    //                         '+ellps=WGS84 +units=m +no_defs';
    //                 }
    //             }
    //         }
    //     }
    // }
    // console.log('CRS of geojson data', proj_from_str);
    const proj_from_str = 'WGS84';
    const proj_to_str = proj_str_a + latitude + proj_str_b + longitude + proj_str_c;
    const proj_obj = (0, proj4_1.default)(proj_from_str, proj_to_str);
    return proj_obj;
}
/**
 * TODO MEgre with io_geojson.ts
 * Converts geojson long lat to cartesian coords
 * @param long_lat_arr
 * @param elevation
 */
function _xformFromLongLatToXYZ(long_lat_arr, proj_obj, elevation) {
    if ((0, arrs_1.getArrDepth)(long_lat_arr) === 1) {
        const long_lat = long_lat_arr;
        const xy = proj_obj.forward(long_lat);
        return [xy[0], xy[1], elevation];
    }
    else {
        long_lat_arr = long_lat_arr;
        const xyzs_xformed = [];
        for (const long_lat of long_lat_arr) {
            if (long_lat.length >= 2) {
                const xyz = _xformFromLongLatToXYZ(long_lat, proj_obj, elevation);
                xyzs_xformed.push(xyz);
            }
        }
        return xyzs_xformed;
    }
}
// ================================================================================================
/**
 * Transform a coordinate from latitude-longitude Geodesic coordinate to a Cartesian XYZ coordinate,
 * based on the geolocation of the model.
 *
 * @param __model__
 * @param lat_long Latitude and longitude coordinates.
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns XYZ coordinates
 */
function LatLong2XYZ(__model__, lat_long, elev) {
    // --- Error Check ---
    const fn_name = 'util.LatLong2XYZ';
    if (__model__.debug) {
        (0, _check_types_1.checkArgs)(fn_name, 'lat_long', lat_long, [_check_types_1.isXY, _check_types_1.isNull]);
        (0, _check_types_1.checkArgs)(fn_name, 'elev', elev, [_check_types_1.isNum, _check_types_1.isNull]);
    }
    // --- Error Check ---
    const proj_obj = _createProjection(__model__);
    // calculate angle of rotation
    let rot_matrix = null;
    if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
        const north = __model__.modeldata.attribs.get.getModelAttribVal('north');
        if (Array.isArray(north)) {
            const rot_ang = (0, vectors_1.vecAng2)([0, 1, 0], [north[0], north[1], 0], [0, 0, 1]);
            rot_matrix = (0, matrix_1.rotateMatrix)([[0, 0, 0], [0, 0, 1]], rot_ang);
        }
    }
    // add feature
    let xyz = _xformFromLongLatToXYZ([lat_long[1], lat_long[0]], proj_obj, elev);
    // rotate to north
    if (rot_matrix !== null) {
        xyz = (0, matrix_1.multMatrix)(xyz, rot_matrix);
    }
    return xyz;
}
exports.LatLong2XYZ = LatLong2XYZ;
// ================================================================================================
// ================================================================================================
// ================================================================================================
// ================================================================================================
/**
 * Functions for saving and loading resources to file system.
 */
async function saveResource(file, name) {
    const itemstring = localStorage.getItem('mobius_backup_list');
    if (!itemstring) {
        localStorage.setItem('mobius_backup_list', `["${name}"]`);
        localStorage.setItem('mobius_backup_date_dict', `{ "${name}": "${(new Date()).toLocaleString()}"}`);
    }
    else {
        const items = JSON.parse(itemstring);
        let check = false;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item === name) {
                items.splice(i, 1);
                items.unshift(item);
                check = true;
                break;
            }
        }
        if (!check) {
            items.unshift(name);
            // if (items.length > 10) {
            //     const item = items.pop();
            //     localStorage.removeItem(item);
            // }
        }
        localStorage.setItem('mobius_backup_list', JSON.stringify(items));
        const itemDates = JSON.parse(localStorage.getItem('mobius_backup_date_dict'));
        itemDates[itemstring] = (new Date()).toLocaleString();
        localStorage.setItem('mobius_backup_date_dict', JSON.stringify(itemDates));
    }
    // window['_code__'] = name;
    // window['_file__'] = file;
    function saveToFS(fs) {
        const code = name;
        // console.log(code)
        fs.root.getFile(code, { create: true }, function (fileEntry) {
            fileEntry.createWriter(async function (fileWriter) {
                const bb = new Blob([file + '_|_|_'], { type: 'text/plain;charset=utf-8' });
                await fileWriter.write(bb);
            }, (e) => { console.log(e); });
        }, (e) => { console.log(e.code); });
    }
    navigator.webkitPersistentStorage.requestQuota(requestedBytes, function (grantedBytes) {
        // @ts-ignore
        window.webkitRequestFileSystem(PERSISTENT, grantedBytes, saveToFS, function (e) { throw e; });
    }, function (e) { throw e; });
    return true;
    // localStorage.setItem(code, file);
}
async function getURLContent(url) {
    url = url.replace('http://', 'https://');
    if (url.indexOf('dropbox') !== -1) {
        url = url.replace('www', 'dl').replace('dl=0', 'dl=1');
    }
    if (url[0] === '"' || url[0] === '\'') {
        url = url.substring(1);
    }
    if (url[url.length - 1] === '"' || url[url.length - 1] === '\'') {
        url = url.substring(0, url.length - 1);
    }
    const p = new Promise((resolve) => {
        const fetchObj = (0, node_fetch_1.default)(url);
        fetchObj.catch(err => {
            resolve('HTTP Request Error: Unable to retrieve file from ' + url);
        });
        fetchObj.then(res => {
            if (!res.ok) {
                resolve('HTTP Request Error: Unable to retrieve file from ' + url);
                return '';
            }
            if (url.indexOf('.zip') !== -1) {
                res.blob().then(body => resolve(body));
            }
            else {
                res.text().then(body => resolve(body.replace(/(\\[bfnrtv\'\"\\])/g, '\\$1')));
            }
        });
    });
    return await p;
}
async function openZipFile(zipFile) {
    const result = {};
    await jszip_1.default.loadAsync(zipFile).then(async function (zip) {
        for (const filename of Object.keys(zip.files)) {
            // const splittedNames = filename.split('/').slice(1).join('/');
            await zip.files[filename].async('text').then(function (fileData) {
                result[filename] = fileData;
            });
        }
    });
    return result;
}
async function loadFromFileSystem(filecode) {
    const p = new Promise((resolve) => {
        navigator.webkitPersistentStorage.requestQuota(requestedBytes, function (grantedBytes) {
            // @ts-ignore
            window.webkitRequestFileSystem(PERSISTENT, grantedBytes, function (fs) {
                fs.root.getFile(filecode, {}, function (fileEntry) {
                    fileEntry.file((file) => {
                        const reader = new FileReader();
                        reader.onerror = () => {
                            resolve('error');
                        };
                        reader.onloadend = () => {
                            if ((typeof reader.result) === 'string') {
                                resolve(reader.result.split('_|_|_')[0]);
                                // const splitted = (<string>reader.result).split('_|_|_');
                                // let val = splitted[0];
                                // for (const i of splitted) {
                                //     if (val.length < i.length) {
                                //         val = i;
                                //     }
                                // }
                                // resolve(val);
                            }
                            else {
                                resolve(reader.result);
                            }
                        };
                        reader.readAsText(file, 'text/plain;charset=utf-8');
                    });
                });
            });
        }, function (e) { console.log('Error', e); });
    });
    return await p;
}
async function _getFile(source) {
    if (source.indexOf('__model_data__') !== -1) {
        return source.split('__model_data__').join('');
    }
    else if (source[0] === '{') {
        return source;
    }
    else if (source.indexOf('://') !== -1) {
        const val = source.replace(/ /g, '');
        const result = await getURLContent(val);
        if (result === undefined) {
            return source;
        }
        else if (result.indexOf && result.indexOf('HTTP Request Error') !== -1) {
            throw new Error(result);
        }
        else if (val.indexOf('.zip') !== -1) {
            return await openZipFile(result);
        }
        else {
            return result;
        }
    }
    else {
        if (source.length > 1 && source[0] === '{') {
            return null;
        }
        const val = source.replace(/\"|\'/g, '');
        const backup_list = JSON.parse(localStorage.getItem('mobius_backup_list'));
        if (val.endsWith('.zip')) {
            throw (new Error(`Importing zip files from local storage is not supported`));
        }
        if (val.indexOf('*') !== -1) {
            const splittedVal = val.split('*');
            const start = splittedVal[0] === '' ? null : splittedVal[0];
            const end = splittedVal[1] === '' ? null : splittedVal[1];
            let result = '{';
            for (const backup_name of backup_list) {
                let valid_check = true;
                if (start && !backup_name.startsWith(start)) {
                    valid_check = false;
                }
                if (end && !backup_name.endsWith(end)) {
                    valid_check = false;
                }
                if (valid_check) {
                    const backup_file = await loadFromFileSystem(backup_name);
                    result += `"${backup_name}": \`${backup_file.replace(/\\/g, '\\\\')}\`,`;
                }
            }
            result += '}';
            return result;
        }
        else {
            if (backup_list.indexOf(val) !== -1) {
                const result = await loadFromFileSystem(val);
                if (!result || result === 'error') {
                    throw (new Error(`File named ${val} does not exist in the local storage`));
                    // return source;
                }
                else {
                    return result;
                }
            }
            else {
                throw (new Error(`File named ${val} does not exist in the local storage`));
            }
        }
    }
}
exports._getFile = _getFile;
function _Async_Param__getFile(source) {
}
exports._Async_Param__getFile = _Async_Param__getFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29yZS9tb2R1bGVzL2Jhc2ljL2lvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxpREFBZ0Q7QUFFaEQsd0RBQTBDO0FBRzFDLDREQUFvRztBQUNwRyxvRUFBbUY7QUFDbkYscURBQWtEO0FBQ2xELGtEQUEwRztBQUMxRyx5Q0FBeUM7QUFDekMsK0JBQStCO0FBQy9CLDJFQUFtRztBQUNuRyxpREFBa0U7QUFDbEUsa0RBQTBCO0FBQzFCLDREQUErQjtBQUMvQiw4REFBOEQ7QUFFOUQsdURBQXVFO0FBQ3ZFLHFEQUFvRTtBQUVwRSxrREFBMEI7QUFDMUIsNERBQTBGO0FBRTFGLE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsNkJBQTZCO0FBVXZFLG1HQUFtRztBQUNuRyw2QkFBNkI7QUFDN0IsSUFBWSxjQUlYO0FBSkQsV0FBWSxjQUFjO0lBQ3RCLDJCQUFTLENBQUE7SUFDVCw2QkFBVyxDQUFBO0lBQ1gscUNBQW1CLENBQUE7QUFDdkIsQ0FBQyxFQUpXLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBSXpCO0FBQ0QsSUFBWSxjQUdYO0FBSEQsV0FBWSxjQUFjO0lBQ3RCLHNDQUFvQixDQUFBO0lBQ3BCLGdEQUE4QixDQUFBO0FBQ2xDLENBQUMsRUFIVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQUd6QjtBQUNELElBQVksY0FHWDtBQUhELFdBQVksY0FBYztJQUN0QiwrQ0FBNkIsQ0FBQTtJQUM3QixtREFBaUMsQ0FBQTtBQUNyQyxDQUFDLEVBSFcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFHekI7QUFDRCxtR0FBbUc7QUFDbkc7Ozs7O0dBS0c7QUFDSyxLQUFLLFVBQVUsSUFBSSxDQUFDLFNBQWtCLEVBQUUsSUFBWTtJQUN4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