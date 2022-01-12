import { GIModel } from '../GIModel';
import { IGeomMaps } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for comparing the geometry in two models.
 */
export declare class GIGeomCompare {
    private modeldata;
    private _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps);
    /**
     * Compares this model and another model.
     * \n
     * The max total score for this method is equal to 5.
     * It assigns 1 mark for for each entity type:
     * points, pline, pgons, and colelctions.
     * In each case, if the number of entities is equal, 1 mark is given.
     * \n
     * @param other_model The model to compare with.
     */
    compare(other_model: GIModel, result: {
        score: number;
        total: number;
        comment: any[];
    }): void;
    /**
     * Set the holes in a pgon by specifying a list of wires.
     * \n
     * This is a low level method used by the compare function to normalize hole order.
     * For making holes in faces, it is safer to use the cutFaceHoles method.
     */
    setPgonHoles(pgon_i: number, holes_i: number[]): void;
}
