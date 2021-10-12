import { TBBox, TColor, TEntTypeIdx, TPlane, TRay, Txy, Txyz } from '../libs/geo-info/common';
/**
 *
 * @param fn_name
 * @param arg_name
 * @param arg
 * @param check_fns
 */
export declare function checkArgs(fn_name: string, arg_name: string, arg: any, check_fns: Function[]): void | TEntTypeIdx | TEntTypeIdx[] | TEntTypeIdx[][];
export declare function isDict(arg: any): void;
export declare function isList(arg: any): void;
export declare function isLList(arg: any): void;
export declare function isAny(arg: any): void;
export declare function isAnyL(arg: any): void;
export declare function isNull(arg: any): void;
export declare function isNullL(arg: any): void;
export declare function isBool(arg: boolean): void;
export declare function isBoolL(arg: boolean[]): void;
export declare function isStr(arg: string): void;
export declare function isStrL(arg: string[]): void;
export declare function isNum(arg: number): void;
export declare function isNumL(arg: number[]): void;
export declare function isNum01(arg: any): void;
export declare function isNum01L(arg: any): void;
export declare function isInt(arg: any): void;
export declare function isIntL(arg: any[]): void;
export declare function isStrStr(arg: [string, string]): void;
export declare function isStrNum(arg: [string, number]): void;
export declare function isXY(arg: Txy): void;
export declare function isXYInt(arg: Txy): void;
export declare function isColor(arg: TColor): void;
export declare function isXYZ(arg: Txyz): void;
export declare function isXYZL(arg: Txyz[]): void;
export declare function isXYZLL(arg: Txyz[][]): void;
export declare function isPln(arg: TPlane): void;
export declare function isPlnL(arg: TPlane[]): void;
export declare function isBBox(arg: TBBox): void;
export declare function isBBoxL(arg: TBBox[]): void;
export declare function isRay(arg: TRay): void;
export declare function isRayL(arg: TRay[]): void;
export declare function isRayLL(arg: TRay[][]): void;
export declare function isLLen(arg: any[], len: number): void;
/**
 *
 * @param arg
 */
export declare function getDataTypeStrFromValue(arg: any): string;
