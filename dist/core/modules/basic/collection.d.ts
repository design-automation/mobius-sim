/**
 * The `collections` module has functions for creating and modifying collections.
 * @module
 */
import { GIModel } from '../../../libs/geo-info/GIModel';
import { TId } from '../../../libs/geo-info/common';
/**
 * Create a new collection.
 *
 * If the `entities` argument is null or an empty list, then an empty collection will be created.
 *
 * If the `name` argument is null, then no name attribute will be created for the collection.
 *
 * If the list of entities contains other collections, these other collections will then become
 * children of the new collection.
 *
 * @param __model__
 * @param entities List or nested lists of points, polylines, polygons, and other colletions, or null.
 * @param name The name to give to this collection, resulting in an attribute called `name`. If `null`, no attribute will be created.
 * @returns Entities, new collection, or a list of new collections.
 * @example collection1 = collection.Create([point1,polyine1,polygon1], 'my_coll')
 * @example_info Creates a collection containing point1, polyline1, polygon1, with an attribute `name = 'my_coll'`.
 */
export declare function Create(__model__: GIModel, entities: TId | TId[] | TId[][], name: string): TId | TId[];
/**
 * Get one or more collections from the model, given a name or list of names.
 * Collections with an attribute called 'name' and with a value that matches teh given vale will be returned.
 * \n
 * The value for name can include wildcards: '?' matches any single character and '*' matches any sequence of characters.
 * For example, 'coll?' will match 'coll1' and 'colla'. 'coll*' matches any name that starts with 'coll'.
 * \n
 * If a single collection is found, the collection will be returned as a single item (not a list).
 * This is a convenience so that there is no need to get the first item out of the returned list.
 * \n
 * If no collections are found, then an empty list is returned.
 * \n
 * @param __model__
 * @param names A name or list of names. May include wildcards, '?' and '*'.
 * @returns The collection, or a list of collections.
 */
export declare function Get(__model__: GIModel, names: string | string[]): TId | TId[];
/**
 * Addes entities to a collection.
 * \n
 * @param __model__
 * @param coll The collection to be updated.
 * @param entities Points, polylines, polygons, and collections to add.
 * @returns void
 */
export declare function Add(__model__: GIModel, coll: TId, entities: TId | TId[]): void;
/**
 * Removes entities from a collection.
 * \n
 * @param __model__
 * @param coll The collection to be updated.
 * @param entities Points, polylines, polygons, and collections to add. Or null to empty the collection.
 * @returns void
 */
export declare function Remove(__model__: GIModel, coll: TId, entities: TId | TId[]): void;
/**
 * Deletes a collection without deleting the entities in the collection.
 * \n
 * @param __model__
 * @param coll The collection or list of collections to be deleted.
 * @returns void
 */
export declare function Delete(__model__: GIModel, coll: TId | TId[]): void;
