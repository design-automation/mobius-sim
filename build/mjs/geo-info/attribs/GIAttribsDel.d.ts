import { EEntType } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for attributes.
 */
export declare class GIAttribsDel {
    private modeldata;
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata: GIModelData);
    /**
     * Deletes an existing attribute.
     * Time stamps are not updated.
     *
     * @param ent_type The level at which to create the attribute.
     * @param name The name of the attribute.
     * @return True if the attribute was created, false otherwise.
     */
    delEntAttrib(ent_type: EEntType, name: string): boolean;
    /**
     * Delete the entity from an attribute
     * If there is no value for the entity, then this does nothing
     * If there is a value, then both the entity index and the value are deleted
     * @param ent_type
     * @param name
     */
    delEnt(ent_type: EEntType, ents_i: number | number[]): void;
}
