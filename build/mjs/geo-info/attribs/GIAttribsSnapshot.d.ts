import { TEntTypeIdx } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for attribute snapshot.
 */
export declare class GIAttribsSnapshot {
    private modeldata;
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata: GIModelData);
    /**
     *
     * @param ssid
     * @param include
     */
    addSnapshot(ssid: number, include?: number[]): void;
    /**
     * Add attributes of ents from the specified snapshot to the current snapshot.
     * @param ssid ID of snapshot to copy attributes from.
     * @param ents ID of ents in both ssid and in the active snapshot
     */
    copyEntsToActiveSnapshot(from_ssid: number, ents: TEntTypeIdx[]): void;
    /**
     *
     * @param ssid
     */
    delSnapshot(ssid: number): void;
    toStr(ssid: number): string;
}
