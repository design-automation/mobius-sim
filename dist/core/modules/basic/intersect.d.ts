/**
 * The `intersect` module has functions for calculating intersections between different types of entities.
 * @module
 */
import { TId, Txyz, TPlane, TRay } from '../../../libs/geo-info/common';
import { GIModel } from '../../../libs/geo-info/GIModel';
/**
 * Calculates the xyz intersection between a ray and one or more polygons.
 * \n
 * The intersection between each polygon face triangle and the ray is caclulated.
 * This ignores the intersections between rays and edges (including polyline edges).
 * \n
 * @param __model__
 * @param ray A ray.
 * @param entities A polygon or list of polygons.
 * @return A list of xyz intersection coordinates.
 * @example coords = intersect.RayFace(ray, polygon1)
 * @example_info Returns a list of coordinates where the ray  intersects with the polygon.
 */
export declare function RayFace(__model__: GIModel, ray: TRay, entities: TId | TId[]): Txyz[];
/**
 * Calculates the xyz intersection between a plane and a list of edges.
 * \n
 * This ignores the intersections between planes and polygon face triangles.
 * \n
 * @param __model__
 * @param plane A plane.
 * @param entities An edge or list of edges, or entities from which edges can be extracted.
 * @return A list of xyz intersection coordinates.
 * @example coords = intersect.PlaneEdge(plane, polyline1)
 * @example_info Returns a list of coordinates where the plane intersects with the edges of polyline1.
 */
export declare function PlaneEdge(__model__: GIModel, plane: TRay | TPlane, entities: TId | TId[]): Txyz[];
