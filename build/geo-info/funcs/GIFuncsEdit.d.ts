import { TEntTypeIdx } from '../common';
import { GIModelData } from '../GIModelData';
export declare enum _ERingMethod {
    OPEN = "open",
    CLOSE = "close"
}
export declare enum _EDivisorMethod {
    BY_NUMBER = "by_number",
    BY_LENGTH = "by_length",
    BY_MAX_LENGTH = "by_max_length",
    BY_MIN_LENGTH = "by_min_length"
}
export declare enum _EWeldMethod {
    MAKE_WELD = "make_weld",
    BREAK_WELD = "break_weld"
}
/**
 * Class for editing geometry.
 */
export declare class GIFuncsEdit {
    private modeldata;
    /**
     * Constructor
     */
    constructor(model: GIModelData);
    /**
     *
     * @param ents_arr
     * @param divisor
     * @param method
     */
    divide(ents_arr: TEntTypeIdx | TEntTypeIdx[], divisor: number, method: _EDivisorMethod): TEntTypeIdx[];
    private _divideEdge;
    /**
     *
     * @param pgon_i
     * @param holes_ents_arr
     */
    hole(pgon: TEntTypeIdx, holes_ents_arr: TEntTypeIdx[] | TEntTypeIdx[][]): TEntTypeIdx[];
    private _getHolePosisFromEnts;
    /**
     *
     * @param ents_arr
     * @param method
     */
    weld(ents_arr: TEntTypeIdx[], method: _EWeldMethod): TEntTypeIdx[];
    /**
     *
     * @param ents_arr
     * @param tolerance
     */
    fuse(ents_arr: TEntTypeIdx[], tolerance: number): TEntTypeIdx[];
    private _fuseDistSq;
    ring(ents_arr: TEntTypeIdx[], method: _ERingMethod): void;
    /**
     *
     * @param ents_arr
     * @param offset
     */
    shift(ents_arr: TEntTypeIdx[], offset: number): void;
    /**
     *
     * @param ents_arr
     */
    reverse(ents_arr: TEntTypeIdx[]): void;
    /**
     * Delete ents in the model.
     * The posis in ents will only be deleted if they are not used by other ents.
     * If collectons are deleted, the contents of the collection is not deleted.
     * If topological entities are deleted, then the object may need to be cloned.
     */
    delete(ents_arr: TEntTypeIdx | TEntTypeIdx[], invert: boolean): void;
    private _deleteNull;
}
