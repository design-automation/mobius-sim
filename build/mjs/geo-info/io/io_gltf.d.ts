import { GIModel } from '../GIModel';
import { TEntTypeIdx } from '../common';
/**
 *  Export GLTF
 */
export declare function exportGltf(model: GIModel, entities: TEntTypeIdx[], ssid: number): Promise<string>;
