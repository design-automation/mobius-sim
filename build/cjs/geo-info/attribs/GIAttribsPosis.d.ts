import { Txyz, EEntType } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for attributes.
 */
export declare class GIAttribsPosis {
    private modeldata;
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata: GIModelData);
    /**
     * Shortcut for getting a coordinate from a posi_i
     * Shallow copy
     * @param posi_i
     */
    getPosiCoords(posi_i: number): Txyz;
    /**
     * Shortcut for getting a coordinate from a numeric vertex index (i.e. this is not an ID)
     * Shallow copy
     * @param vert_i
     */
    getVertCoords(vert_i: number): Txyz;
    /**
     * Shortcut for getting all the xyz coordinates from an ent_i
     * Shallow copy
     * @param posi_i
     */
    getEntCoords(ent_type: EEntType, ent_i: number): Txyz[];
    /**
     * Set the xyz position by index
     * @param index
     * @param value
     */
    setPosiCoords(index: number, xyz: Txyz): void;
    /**
     * Move the xyz position by index
     * @param index
     * @param value
     */
    movePosiCoords(index: number, xyz: Txyz): void;
}
