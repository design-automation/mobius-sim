/**
 * The `util` module has some utility functions used for debugging.
 * @module
 */
import { GIModel } from '../../../libs/geo-info/GIModel';
import { TId } from '../../../libs/geo-info/common';
/**
 * Select entities in the model.
 *
 * @param __model__
 * @param entities
 * @returns void
 */
export declare function Select(__model__: GIModel, entities: string | string[] | string[][]): void;
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
export declare function VrHotspot(__model__: GIModel, point: string, name: string, camera_rot: number): void;
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
export declare function VrPanorama(__model__: GIModel, point: string, back_url: number, back_rot: number, fore_url: number, fore_rot: number): void;
/**
 * Returns am html string representation of the parameters in this model.
 * The string can be printed to the console for viewing.
 *
 * @param __model__
 * @param __constList__
 * @returns Text that summarises what is in the model.
 */
export declare function ParamInfo(__model__: GIModel, __constList__: {}): string;
/**
 * Returns an html string representation of one or more entities in the model.
 * The string can be printed to the console for viewing.
 *
 * @param __model__
 * @param entities One or more objects ot collections.
 * @returns void
 */
export declare function EntityInfo(__model__: GIModel, entities: TId | TId[]): string;
/**
 * Returns an html string representation of the contents of this model.
 * The string can be printed to the console for viewing.
 *
 * @param __model__
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export declare function ModelInfo(__model__: GIModel): string;
/**
 * Checks the internal consistency of the model. Used for debugigng Mobius.
 *
 * @param __model__
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export declare function ModelCheck(__model__: GIModel): string;
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
export declare function ModelCompare(__model__: GIModel, input_data: string): Promise<string>;
export declare function _Async_Param_ModelCompare(__model__: GIModel, input_data: string): Promise<string>;
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
export declare function ModelMerge(__model__: GIModel, input_data: string): Promise<TId[]>;
export declare function _Async_Param_ModelMerge(__model__: GIModel, input_data: string): Promise<TId[]>;
/**
 * Post a message to the parent window.
 *
 * @param __model__
 * @param data The data to send, a list or a dictionary.
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export declare function SendData(__model__: GIModel, data: any): void;
