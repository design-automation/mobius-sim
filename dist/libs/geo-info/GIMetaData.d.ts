import { EAttribDataTypeStrs, TAttribDataTypes } from './common';
/**
 * Geo-info model metadata class.
 */
export declare class GIMetaData {
    private _data;
    /**
     * Constructor
     */
    constructor();
    getEntCounts(): number[];
    nextPosi(): number;
    nextVert(): number;
    nextTri(): number;
    nextEdge(): number;
    nextWire(): number;
    nextPoint(): number;
    nextPline(): number;
    nextPgon(): number;
    nextColl(): number;
    setNextPosi(index: number): void;
    setNextVert(index: number): void;
    setNextTri(index: number): void;
    setNextEdge(index: number): void;
    setNextWire(index: number): void;
    setNextPoint(index: number): void;
    setNextPline(index: number): void;
    setNextPgon(index: number): void;
    setNextColl(index: number): void;
    addByKeyVal(key: string | number, val: TAttribDataTypes, data_type: EAttribDataTypeStrs): number;
    getValFromIdx(index: number, data_type: EAttribDataTypeStrs): TAttribDataTypes;
    getIdxFromKey(key: string | number, data_type: EAttribDataTypeStrs): number;
    hasKey(key: string | number, data_type: EAttribDataTypeStrs): boolean;
    toDebugStr(): string;
}
