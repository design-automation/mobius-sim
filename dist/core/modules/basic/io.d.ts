/**
 * The `io` module has functions for importing and exporting.
 * @module
 */
import { GIModel } from '../../../libs/geo-info/GIModel';
import { TId, Txyz, Txy } from '../../../libs/geo-info/common';
declare global {
    interface Navigator {
        webkitPersistentStorage: {
            requestQuota: (a: any, b: any, c: any) => {};
        };
    }
}
export declare enum _EIODataFormat {
    GI = "gi",
    OBJ = "obj",
    GEOJSON = "geojson"
}
export declare enum _EIODataSource {
    DEFAULT = "From URL",
    FILESYS = "From Local Storage"
}
export declare enum _EIODataTarget {
    DEFAULT = "Save to Hard Disk",
    FILESYS = "Save to Local Storage"
}
/**
 * Read data from a Url or from local storage.
 *
 * @param data The data to be read (from URL or from Local Storage).
 * @returns the data.
 */
export declare function Read(__model__: GIModel, data: string): Promise<string | {}>;
export declare function _Async_Param_Read(__model__: GIModel, data: string): Promise<string | {}>;
/**
 * Write data to the hard disk or to the local storage.
 *
 * @param data The data to be saved (can be the url to the file).
 * @param file_name The name to be saved in the file system (file extension should be included).
 * @param data_target Enum, where the data is to be exported to.
 * @returns whether the data is successfully saved.
 */
export declare function Write(__model__: GIModel, data: string, file_name: string, data_target: _EIODataTarget): Promise<Boolean>;
export declare function _Async_Param_Write(__model__: GIModel, data: string, file_name: string, data_target: _EIODataTarget): Promise<Boolean>;
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
export declare function Import(__model__: GIModel, input_data: string, data_format: _EIODataFormat): Promise<TId | TId[] | {}>;
export declare function _Async_Param_Import(__model__: GIModel, input_data: string, data_format: _EIODataFormat): Promise<TId | TId[] | {}>;
export declare function _import(__model__: GIModel, model_data: string, data_format: _EIODataFormat): TId;
export declare function _importGI(__model__: GIModel, json_str: string): number;
export declare enum _EIOExportDataFormat {
    GI = "gi",
    OBJ_VERT = "obj_v",
    OBJ_POSI = "obj_ps",
    GEOJSON = "geojson",
    GLTF = "gltf"
}
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
export declare function Export(__model__: GIModel, entities: TId | TId[] | TId[][], file_name: string, data_format: _EIOExportDataFormat, data_target: _EIODataTarget): Promise<void>;
export declare function _Async_Param_Export(__model__: GIModel, entities: TId | TId[] | TId[][], file_name: string, data_format: _EIOExportDataFormat, data_target: _EIODataTarget): void;
/**
 * Set the geolocation of the Cartesian coordinate system.
 *
 * @param __model__
 * @param lat_long Set the latitude and longitude of the origin of the Cartesian coordinate system.
 * @param rot Set the counter-clockwise rotation of the Cartesian coordinate system, in radians.
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns void
 */
export declare function Geolocate(__model__: GIModel, lat_long: Txy, rot: number, elev: number): void;
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
export declare function Geoalign(__model__: GIModel, lat_long_o: Txy, lat_long_x: Txy, elev: number): void;
/**
 * Transform a coordinate from latitude-longitude Geodesic coordinate to a Cartesian XYZ coordinate,
 * based on the geolocation of the model.
 *
 * @param __model__
 * @param lat_long Latitude and longitude coordinates.
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns XYZ coordinates
 */
export declare function LatLong2XYZ(__model__: GIModel, lat_long: Txy, elev: number): Txyz;
export declare function _getFile(source: string): Promise<any>;
export declare function _Async_Param__getFile(source: string): void;
