import { TAttribDataTypes, EEntType } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for attributes.
 */
export declare class GIAttribsThreejs {
    private modeldata;
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata: GIModelData);
    /**
     * Get a flat array of all the coordinates of all the vertices.
     * Verts that have been deleted will not be included
     * @param verts An array of vertex indices pointing to the position.
     */
    get3jsSeqPosisCoords(ssid: number): [number[], Map<number, number>];
    /**
     * Get a flat array of all the coordinates of all the vertices.
     * Verts that have been deleted will not be included
     * @param verts An array of vertex indices pointing to the positio.
     */
    get3jsSeqVertsCoords(ssid: number): [number[], Map<number, number>];
    /**
     * Get a flat array of normals values for all the vertices.
     * Verts that have been deleted will not be included
     */
    get3jsSeqVertsNormals(ssid: number): number[];
    /**
     * Get a flat array of colors values for all the vertices.
     */
    get3jsSeqVertsColors(ssid: number): number[];
    /**
     *
     */
    getModelAttribsForTable(ssid: number): any[];
    /**
     *
     * @param ent_type
     */
    getAttribsForTable(ssid: number, ent_type: EEntType): {
        data: any[];
        ents: number[];
    };
    /**
     * Gets the sub ents and attibs of an object or collection..
     * Returns an array of maps, each map is: attribname -> attrib_value
     * @param ent_type
     */
    getEntSubAttribsForTable(ssid: number, ent_type: EEntType, ent_i: number, level: EEntType): Array<Map<string, TAttribDataTypes>>;
    private _addEntSubWire;
    private _addEntSubAttribs;
    /**
     * @param ent_type
     * @param ents_i
     */
    getEntsVals(ssid: number, selected_ents: Map<string, number>, ent_type: EEntType): any[];
}
