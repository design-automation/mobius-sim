import { GIModel } from '../GIModel';
import { TEntTypeIdx, IEntSets } from '../common';
export declare function exportGeojson(model: GIModel, entities: TEntTypeIdx[], flatten: boolean, ssid: number): string;
/**
* Import geojson
*/
export declare function importGeojson(model: GIModel, geojson_str: string, elevation: number): IEntSets;