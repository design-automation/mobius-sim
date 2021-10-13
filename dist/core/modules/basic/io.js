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
        const fetchObj = fetch(url);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29yZS9tb2R1bGVzL2Jhc2ljL2lvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxpREFBZ0Q7QUFFaEQsd0RBQTBDO0FBRzFDLDREQUFvRztBQUNwRyxvRUFBbUY7QUFDbkYscURBQWtEO0FBQ2xELGtEQUEwRztBQUMxRyx5Q0FBeUM7QUFDekMsK0JBQStCO0FBQy9CLDJFQUFtRztBQUNuRyxpREFBa0U7QUFDbEUsa0RBQTBCO0FBQzFCLDhEQUE4RDtBQUU5RCx1REFBdUU7QUFDdkUscURBQW9FO0FBRXBFLGtEQUEwQjtBQUMxQiw0REFBMEY7QUFFMUYsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyw2QkFBNkI7QUFVdkUsbUdBQW1HO0FBQ25HLDZCQUE2QjtBQUM3QixJQUFZLGNBSVg7QUFKRCxXQUFZLGNBQWM7SUFDdEIsMkJBQVMsQ0FBQTtJQUNULDZCQUFXLENBQUE7SUFDWCxxQ0FBbUIsQ0FBQTtBQUN2QixDQUFDLEVBSlcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFJekI7QUFDRCxJQUFZLGNBR1g7QUFIRCxXQUFZLGNBQWM7SUFDdEIsc0NBQW9CLENBQUE7SUFDcEIsZ0RBQThCLENBQUE7QUFDbEMsQ0FBQyxFQUhXLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBR3pCO0FBQ0QsSUFBWSxjQUdYO0FBSEQsV0FBWSxjQUFjO0lBQ3RCLCtDQUE2QixDQUFBO0lBQzdCLG1EQUFpQyxDQUFBO0FBQ3JDLENBQUMsRUFIVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQUd6QjtBQUNELG1HQUFtRztBQUNuRzs7Ozs7R0FLRztBQUNLLEtBQUssVUFBVSxJQUFJLENBQUMsU0FBa0IsRUFBRSxJQUFZO0lBQ3hELE9BQU8sUUFBUSxD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