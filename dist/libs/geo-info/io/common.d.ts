import { IEntSets, TEntTypeIdx } from '../common';
import { GIModel } from '../GIModel';
/**
 * Given a list of entities, keep only the obects.
 * If the entities include collections, extract objects out of the collections.
 * Returns sets of objects.
 */
export declare function getObjSets(model: GIModel, entities: TEntTypeIdx[], ssid: number): IEntSets;
