import { GIModel } from '../GIModel';
/**
 * Import obj
 */
export declare function importDae(obj_str: string): GIModel;
/**
 * Export to dae collada file
 */
export declare function exportDae(model: GIModel, ssid: number): string;
