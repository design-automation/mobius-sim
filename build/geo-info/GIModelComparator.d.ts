import { GIModel } from './GIModel';
import { GIModelData } from './GIModelData';
/**
 * Geo-info model class.
 */
export declare class GIModelComparator {
    private modeldata;
    /**
      * Constructor
      */
    constructor(model: GIModelData);
    /**
     * Compares two models.
     * Checks that every entity in this model also exists in the other model.
     * \n
     * Additional entitis in the other model will not affect the score.
     * Attributes at the model level are ignored except for the `material` attributes.
     * \n
     * For grading, this model is assumed to be the answer model, and the other model is assumed to be
     * the model submitted by the student.
     * \n
     * Both models will be modified in the process of cpmparing.
     * \n
     * @param model The model to compare with.
     */
    compare(model: GIModel, normalize: boolean, check_geom_equality: boolean, check_attrib_equality: boolean): {
        percent: number;
        score: number;
        total: number;
        comment: string;
    };
    /**
     * Normalises the direction of open wires
     */
    private norm;
    /**
     * Get the min max posis
     */
    private getTransPadding;
    /**
     * Normalises the direction of open wires
     */
    private normOpenWires;
    /**
     * Normalises the edge order of closed wires
     */
    private normClosedWires;
    /**
     * Normalises the order of holes in faces
     */
    private normHoles;
    /**
     * Round the xyz values, rounded to the precision level
     * \n
     * @param posi_i
     */
    private normXyzFprint;
    /**
     * For any entity, greate a string that concatenates all the xyz values of its positions.
     * \n
     * These strings will be used for sorting entities into a predictable order,
     * independent of the order in which the geometry was actually created.
     * \n
     * If there are multiple entities in exactly the same position, then the ordering may be unpredictable.
     * \n
     * @param ent_type
     * @param ent_i
     */
    private xyzFprint;
    /**
     * Compare the objects.
     * Check that every object in this model also exists in the other model.
     * \n
     * This will also check the following attributes:
     * For posis, it will check the xyz attribute.
     * For vertices, it will check the rgb attribute, if such an attribute exists in the answer model.
     * For polygons, it will check the material attribute, if such an attribute exists in the answer model.
     */
    private compareObjs;
    /**
     * Compare the collections
     */
    private compareColls;
    /**
     * Compare the model attribs
     * At the moment, this seems to only compare the material attribute in the model
     */
    private compareModelAttribs;
    /**
     * Check to see if there are any common errors.
     */
    private checkForErrors;
    /**
     * Get a fprint of all geometric entities of a certain type in the model.
     * This returns a fprint array, and the entity indexes
     * The two arrays are in the same order
     */
    private getEntsFprint;
    /**
     * Get a fprint of one geometric entity: point, polyline, polygon
     * Returns a map of strings.
     * Keys are attribtes, like this 'ps:xyz'.
     * Values are fprints, as strings.
     */
    private getEntFprint;
    /**
     * Get one fprint for all collections
     */
    private getCollFprints;
    /**
     * Get a fprint of one collection
     * Returns a string, something like 'a@b@c#[1,2,3]#[3,5,7]#[2,5,8]'
     */
    private getCollFprint;
    /**
     * Get a fprint of an attribute value
     */
    private getAttribValFprint;
}
