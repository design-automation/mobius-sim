import { GIModel } from '../GIModel';
import { TEntTypeIdx } from '../common';
/**
 * Import obj
 */
export declare function importObj(model: GIModel, obj_str: string): GIModel;
/**
 * Export to obj
 */
export declare function exportVertBasedObj(model: GIModel, entities: TEntTypeIdx[], ssid: number): string;
/**
 * Export to obj
 */
export declare function exportPosiBasedObj(model: GIModel, entities: TEntTypeIdx[], ssid: number): string;
