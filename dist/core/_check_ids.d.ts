import { GIModel } from '../libs/geo-info/GIModel';
import { EEntType, TEntTypeIdx } from '../libs/geo-info/common';
export declare const ID: {
    isNull: number;
    isID: number;
    isIDL1: number;
    isIDL2: number;
    isIDL3: number;
    isIDL4: number;
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
export declare function checkIDs(__model__: GIModel, fn_name: string, arg_name: string, arg: any, id_types: number[], ent_types: EEntType[] | null, check_exists?: boolean): TEntTypeIdx | TEntTypeIdx[] | TEntTypeIdx[][];
