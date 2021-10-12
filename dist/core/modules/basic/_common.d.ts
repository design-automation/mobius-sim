/**
 * Shared utility functions
 * @module
 */
import { GIModel } from '../../../libs/geo-info/GIModel';
import { TId, TPlane, Txyz, TRay, TEntTypeIdx } from '../../../libs/geo-info/common';
export declare function getOrigin(__model__: GIModel, data: Txyz | TRay | TPlane | TId | TId[], fn_name: string): Txyz;
export declare function getRay(__model__: GIModel, data: Txyz | TRay | TPlane | TId | TId[], fn_name: string): TRay;
export declare function getPlane(__model__: GIModel, data: Txyz | TRay | TPlane | TId | TId[], fn_name: string): TPlane;
export declare function getCentoridFromEnts(__model__: GIModel, ents: TId | TId[], fn_name: string): Txyz;
export declare function getCentroid(__model__: GIModel, ents_arr: TEntTypeIdx | TEntTypeIdx[]): Txyz | Txyz[];
export declare function getCenterOfMass(__model__: GIModel, ents_arr: TEntTypeIdx | TEntTypeIdx[]): Txyz | Txyz[];
export declare function getPlanesSeq(xyzs: Txyz[], normal: Txyz, close: boolean): TPlane[];
