import { GIModel } from '../GIModel';
import { GIModelData } from '../GIModelData';
/**
 * Class for attributes.
 */
export declare class GIAttribsCompare {
    private modeldata;
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata: GIModelData);
    /**
     * Compares this model and another model.
     * \n
     * If check_equality=false, the max total score will be equal to the number of attributes in this model.
     * It checks that each attribute in this model exists in the other model. If it exists, 1 mark is assigned.
     * \n
     * If check_equality=true, the max score will be increased by 10, equal to the number of entity levels.
     * For each entity level, if the other model contains no additional attributes, then one mark is assigned.
     * \n
     * @param other_model The model to compare with.
     */
    compare(other_model: GIModel, result: {
        score: number;
        total: number;
        comment: any[];
    }): void;
}
