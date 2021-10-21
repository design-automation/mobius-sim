/**
 * The `isect` module has functions for performing intersections between entities in the model.
 * These functions may make new entities, and may modify existing entities, depending on the function that is selected.
 * If new entities are created, then the function will return the IDs of those entities.
 * @module
 */
// import { __merge__ } from '../_model';
/**
 * Adds positions by intersecting polylines, planes, and polygons.
 * @param __model__
 * @param entities1 First polyline, plane, face, or polygon.
 * @param entities2 Second polyline, plane face, or polygon.
 * @returns List of positions.
 * @example intersect1 = isect.Intersect (object1, object2)
 * @example_info Returns a list of positions at the intersections between both objects.
 */
export function Intersect(__model__, entities1, entities2) {
    // --- Error Check ---
    // const fn_name = 'isect.Intersect';
    // const ents_arr_1 = checkIDnTypes(fn_name, 'object1', entities1,
    //                                  [IDcheckObj.isID, TypeCheckObj.isPlane],
    //                                  [EEntType.PLINE, EEntType.PGON, EEntType.FACE]);
    // const ents_arr_2 = checkIDnTypes(fn_name, 'object2', entities2,
    //                                  [IDcheckObj.isID, TypeCheckObj.isPlane],
    //                                  [EEntType.PLINE, EEntType.PGON, EEntType.FACE]);
    // --- Error Check ---
    throw new Error('Not impemented.');
    return null;
}
// Knife modelling operation keep
export var _EKnifeKeep;
(function (_EKnifeKeep) {
    _EKnifeKeep["KEEP_ABOVE"] = "keep above the plane";
    _EKnifeKeep["KEEP_BELOW"] = "keep below the plane";
    _EKnifeKeep["KEEP_ALL"] = "keep all";
})(_EKnifeKeep || (_EKnifeKeep = {}));
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
export function Knife(__model__, geometry, plane, keep) {
    // --- Error Check ---
    // const fn_name = 'isect.Knife';
    // const ents_arr = checkIDs(__model__, fn_name, 'geometry', geometry, ['isIDList'], [EEntType.POINT, EEntType.PLINE, EEntType.PGON]);
    // checkCommTypes(fn_name, 'plane', plane, [TypeCheckObj.isPlane]);
    // --- Error Check ---
    throw new Error('Not implemented.');
    return null;
}
/**
 * Splits a polyline or polygon with a polyline.
 * @param __model__
 * @param geometry A list of polylines or polygons to be split.
 * @param polyline Splitter.
 * @returns List of two lists containing polylines or polygons.
 * @example splitresult = isect.Split (pl1, pl2)
 * @example_info Returns [[pl1A],[pl1B]], where pl1A and pl1B are polylines resulting from the split occurring where pl1 and pl2 intersect.
 */
export function Split(__model__, geometry, polyline) {
    // --- Error Check ---
    // const fn_name = 'isect.Split';
    // const ents_arr = checkIDs(__model__, fn_name, 'objects', geometry, ['isIDList'], [EEntType.PLINE, EEntType.PGON]);
    // checkIDs(__model__, fn_name, 'polyline', polyline, [IDcheckObj.isID], [EEntType.PLINE]);
    // --- Error Check ---
    throw new Error('Not implemented.');
    return null;
}
// Ray and plane
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29yZS9tb2R1bGVzL2Jhc2ljL2lzZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBUUgseUNBQXlDO0FBRXpDOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxVQUFVLFNBQVMsQ0FBQyxTQUFrQixFQUFFLFNBQWMsRUFBRSxTQUFjO0lBQ3hFLHNCQUFzQjtJQUN0QixxQ0FBcUM7SUFDckMsa0VBQWtFO0lBQ2xFLDRFQUE0RTtJQUM1RSxvRkFBb0Y7SUFDcEYsa0VBQWtFO0lBQ2xFLDRFQUE0RTtJQUM1RSxvRkFBb0Y7SUFDcEYsc0JBQXNCO0lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUFDLE9BQU8sSUFBSSxDQUFDO0FBQ3BELENBQUM7QUFDRCxpQ0FBaUM7QUFDakMsTUFBTSxDQUFOLElBQVksV0FJWDtBQUpELFdBQVksV0FBVztJQUNuQixrREFBb0MsQ0FBQTtJQUNwQyxrREFBcUMsQ0FBQTtJQUNyQyxvQ0FBc0IsQ0FBQTtBQUMxQixDQUFDLEVBSlcsV0FBVyxLQUFYLFdBQVcsUUFJdEI7QUFDRDs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUFDLFNBQWtCLEVBQUUsUUFBZSxFQUFFLEtBQWEsRUFBRSxJQUFpQjtJQUN2RixzQkFBc0I7SUFDdEIsaUNBQWlDO0lBQ2pDLHNJQUFzSTtJQUN0SSxtRUFBbUU7SUFDbkUsc0JBQXNCO0lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUFDLE9BQU8sSUFBSSxDQUFDO0FBQ3JELENBQUM7QUFDRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sVUFBVSxLQUFLLENBQUMsU0FBa0IsRUFBRSxRQUFlLEVBQUUsUUFBYTtJQUNwRSxzQkFBc0I7SUFDdEIsaUNBQWlDO0lBQ2pDLHFIQUFxSDtJQUNySCwyRkFBMkY7SUFDM0Ysc0JBQXNCO0lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUFDLE9BQU8sSUFBSSxDQUFDO0FBQ3JELENBQUM7QUFFRCxnQkFBZ0IifQ==