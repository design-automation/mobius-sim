import { IThreeJS } from './ThreejsJSON';
import { GIModelData } from './GIModelData';
/**
 * Geo-info model class.
 */
export declare class GIModelThreejs {
    private modeldata;
    /**
      * Constructor
      */
    constructor(modeldata: GIModelData);
    /**
     * Generate a default color if none exists.
     */
    private _generateColors;
    /**
     * Returns arrays for visualization in Threejs.
     */
    get3jsData(ssid: number): IThreeJS;
}
