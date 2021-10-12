import { GIModel } from '../../libs/geo-info/GIModel';
/**
 * Creates a new empty model.
 *
 * @returns New model empty.
 */
export declare function __new__(): GIModel;
/**
 * A function to preprocess the model, before it enters the node.
 * In cases where there is more than one model connected to a node,
 * the preprocess function will be called before the merge function.
 *
 * @param model The model to preprocess.
 */
export declare function __preprocess__(__model__: GIModel): void;
/**
 * A function to postprocess the model, after it enters the node.
 *
 * @param model The model to postprocess.
 */
export declare function __postprocess__(__model__: GIModel): void;
/**
 * Merges the second model into the first model. The geometry, attribues, and groups are all merged.
 * If the models contain contain groups with the same names, then the groups will be merged.
 *
 * @param model1 The model to merge into.
 * @param model2 The model to merge from    .
 */
export declare function __merge__(model1: GIModel, model2: GIModel): void;
/**
 * Clone a model.
 *
 * @param model The model to clone.
 */
export declare function __clone__(model: GIModel): GIModel;
/**
 * Returns a string representation of this model.
 * @param __model__
 */
export declare function __stringify__(__model__: GIModel): string;
/**
 * Select entities in the model.
 * @param __model__
 */
export declare function __select__(__model__: GIModel, ents_id: string | string[] | string[][], var_name: string): void;
/**
 * Checks the model for internal consistency.
 * @param __model__
 */
export declare function __checkModel__(__model__: GIModel): string[];
/**
//  * Sets an attribute value in the model.
//  * @param __model__
//  */
