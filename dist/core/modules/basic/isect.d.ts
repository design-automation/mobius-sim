/**
 * The `isect` module has functions for performing intersections between entities in the model.
 * These functions may make new entities, and may modify existing entities, depending on the function that is selected.
 * If new entities are created, then the function will return the IDs of those entities.
 * @module
 */
import { GIModel } from '../../../libs/geo-info/GIModel';
import { TId, TPlane } from '../../../libs/geo-info/common';
/**
 * Adds positions by intersecting polylines, planes, and polygons.
 * @param __model__
 * @param entities1 First polyline, plane, face, or polygon.
 * @param entities2 Second polyline, plane face, or polygon.
 * @returns List of positions.
 * @example intersect1 = isect.Intersect (object1, object2)
 * @example_info Returns a list of positions at the intersections between both objects.
 */
export declare function Intersect(__model__: GIModel, entities1: TId, entities2: TId): TId[];
export declare enum _EKnifeKeep {
    KEEP_ABOVE = "keep above the plane",
    KEEP_BELOW = "keep below the plane",
    KEEP_ALL = "keep all"
}
/**
 * Separates a list of points, polylines or polygons into two lists with a plane.
 * @param __model__
 * @param geometry List of points, polylines or polygons.
 * @param plane Knife.
 * @param keep Keep above, keep below, or keep both lists of separated points, polylines or polygons.
 * @returns List, or list of two lists, of points, polylines or polygons.
 * @example knife1 = isect.Knife ([p1,p2,p3,p4,p5], plane1, keepabove)
 * @example_info Returns [[p1,p2,p3],[p4,p5]] if p1, p2, p3 are points above the plane and p4, p5 are points below the plane.
 */
export declare function Knife(__model__: GIModel, geometry: TId[], plane: TPlane, keep: _EKnifeKeep): TId[];
/**
 * Splits a polyline or polygon with a polyline.
 * @param __model__
 * @param geometry A list of polylines or polygons to be split.
 * @param polyline Splitter.
 * @returns List of two lists containing polylines or polygons.
 * @example splitresult = isect.Split (pl1, pl2)
 * @example_info Returns [[pl1A],[pl1B]], where pl1A and pl1B are polylines resulting from the split occurring where pl1 and pl2 intersect.
 */
export declare function Split(__model__: GIModel, geometry: TId[], polyline: TId): TId[];
