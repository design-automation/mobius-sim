import { TEntTypeIdx, TPlane, Txyz } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for editing geometry.
 */
export declare class GIFuncsCommon {
    private modeldata;
    /**
     * Constructor
     */
    constructor(model: GIModelData);
    /**
     *
     * @param ents_arr
     */
    getCentroid(ents_arr: TEntTypeIdx | TEntTypeIdx[]): Txyz | Txyz[];
    private _centroidPosis;
    /**
     *
     * @param ents_arr
     */
    getCenterOfMass(ents_arr: TEntTypeIdx | TEntTypeIdx[]): Txyz | Txyz[];
    private _centerOfMass;
    private _centerOfMassOfPgon;
    /**
     * used by sweep
     * TODO update offset code to use this as well
     * private to get a set of planes along the length of a wire.
     * The planes are orientated perpendicular to the wire.
     * @param xyzs
     * @param normal
     * @param close
     */
    getPlanesSeq(xyzs: Txyz[], normal: Txyz, close: boolean): TPlane[];
    /**
     * Copy posis, points, plines, pgons
     * @param __model__
     * @param ents_arr
     * @param copy_attributes
     */
    copyGeom(ents_arr: TEntTypeIdx | TEntTypeIdx[] | TEntTypeIdx[][], copy_attributes: boolean): TEntTypeIdx | TEntTypeIdx[] | TEntTypeIdx[][];
    /**
     *
     * @param ents_arr
     * @param copy_attributes
     * @param vector
     */
    clonePosisInEntsAndMove(ents_arr: TEntTypeIdx | TEntTypeIdx[] | TEntTypeIdx[][], copy_attributes: boolean, vector: Txyz): void;
    /**
     * Clones position in entities. Lone positions are not cloned.
     * @param ents_arr
     * @param copy_attributes
     * @param vector
     */
    clonePosisInEnts(ents_arr: TEntTypeIdx | TEntTypeIdx[] | TEntTypeIdx[][], copy_attributes: boolean): void;
}
