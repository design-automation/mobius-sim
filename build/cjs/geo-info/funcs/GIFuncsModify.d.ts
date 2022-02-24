import { TEntTypeIdx, TPlane, TRay, Txyz } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for transforming geometry: move, rotate, mirror, scale, xform.
 */
export declare class GIFuncsModify {
    private modeldata;
    /**
     * Constructor
     */
    constructor(model: GIModelData);
    /**
     *
     * @param ents_arr
     * @param vectors
     */
    move(ents_arr: TEntTypeIdx[], vectors: Txyz | Txyz[]): void;
    /**
     *
     * @param ents_arr
     * @param ray
     * @param angle
     */
    rotate(ents_arr: TEntTypeIdx[], ray: TRay, angle: number): void;
    /**
     *
     * @param ents_arr
     * @param plane
     * @param scale
     */
    scale(ents_arr: TEntTypeIdx[], plane: TPlane, scale: number | Txyz): void;
    /**
     *
     * @param ents_arr
     * @param plane
     */
    mirror(ents_arr: TEntTypeIdx[], plane: TPlane): void;
    /**
     *
     * @param ents_arr
     * @param from
     * @param to
     */
    xform(ents_arr: TEntTypeIdx[], from: TPlane, to: TPlane): void;
    /**
     *
     * @param ents_arr
     * @param dist
     */
    offset(ents_arr: TEntTypeIdx[], dist: number): void;
    private _offsetWire;
    /**
     *
     * @param ents_arr
     */
    remesh(ents_arr: TEntTypeIdx[]): void;
}
