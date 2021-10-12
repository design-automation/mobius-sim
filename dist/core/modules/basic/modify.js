"use strict";
/**
 * The `modify` module has functions for modifying existing entities in the model.
 * These functions do not make any new entities, and they do not change the topology of objects.
 * These functions only change attribute values.
 * All these functions have no return value.
 * @module
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Remesh = exports.Offset = exports.XForm = exports.Mirror = exports.Scale = exports.Rotate = exports.Move = void 0;
const _check_ids_1 = require("../../_check_ids");
const chk = __importStar(require("../../_check_types"));
const common_1 = require("../../../libs/geo-info/common");
const common_id_funcs_1 = require("../../../libs/geo-info/common_id_funcs");
const arrs_1 = require("../../../libs/util/arrs");
const _common_1 = require("./_common");
// ================================================================================================
/**
 * Moves entities. The directio and distance if movement is specified as a vector.
 * \n
 * If only one vector is given, then all entities are moved by the same vector.
 * If a list of vectors is given, the each entity will be moved by a different vector.
 * In this case, the number of vectors should be equal to the number of entities.
 * \n
 * If a position is shared between entites that are being moved by different vectors,
 * then the position will be moved by the average of the vectors.
 * \n
 * @param __model__
 * @param entities An entity or list of entities to move.
 * @param vector A vector or a list of vectors.
 * @returns void
 * @example modify.Move(pline1, [1,2,3])
 * @example_info Moves pline1 by [1,2,3].
 * @example modify.Move([pos1, pos2, pos3], [[0,0,1], [0,0,1], [0,1,0]] )
 * @example_info Moves pos1 by [0,0,1], pos2 by [0,0,1], and pos3 by [0,1,0].
 * @example modify.Move([pgon1, pgon2], [1,2,3] )
 * @example_info Moves both pgon1 and pgon2 by [1,2,3].
 */
function Move(__model__, entities, vectors) {
    entities = (0, arrs_1.arrMakeFlat)(entities);
    if (!(0, arrs_1.isEmptyArr)(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Move';
        let ents_arr;
        if (__model__.debug) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
            chk.checkArgs(fn_name, 'vectors', vectors, [chk.isXYZ, chk.isXYZL]);
        }
        else {
            ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
        }
        // --- Error Check ---
        __model__.modeldata.funcs_modify.move(ents_arr, vectors);
    }
}
exports.Move = Move;
// ================================================================================================
/**
 * Rotates entities on plane by angle.
 * \n
 * @param __model__
 * @param entities  An entity or list of entities to rotate.
 * @param ray A ray to rotate around. \n
 * Given a plane, a ray will be created from the plane z axis. \n
 * Given an `xyz` location, a ray will be generated with an origin at this location, and a direction `[0, 0, 1]`. \n
 * Given any entities, the centroid will be extracted, \n
 * and a ray will be generated with an origin at this centroid, and a direction `[0, 0, 1]`.
 * @param angle Angle (in radians).
 * @returns void
 * @example modify.Rotate(polyline1, plane1, PI)
 * @example_info Rotates polyline1 around the z-axis of plane1 by PI (i.e. 180 degrees).
 */
function Rotate(__model__, entities, ray, angle) {
    entities = (0, arrs_1.arrMakeFlat)(entities);
    if (!(0, arrs_1.isEmptyArr)(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Rotate';
        let ents_arr;
        if (__model__.debug) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [common_1.EEntType.POSI, common_1.EEntType.VERT, common_1.EEntType.EDGE, common_1.EEntType.WIRE,
                common_1.EEntType.POINT, common_1.EEntType.PLINE, common_1.EEntType.PGON, common_1.EEntType.COLL]);
            chk.checkArgs(fn_name, 'angle', angle, [chk.isNum]);
        }
        else {
            ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
        }
        ray = (0, _common_1.getRay)(__model__, ray, fn_name);
        // --- Error Check ---
        __model__.modeldata.funcs_modify.rotate(ents_arr, ray, angle);
    }
}
exports.Rotate = Rotate;
// ================================================================================================
/**
 * Scales entities relative to a plane.
 * \n
 * @param __model__
 * @param entities  An entity or list of entities to scale.
 * @param plane A plane to scale around. \n
 * Given a ray, a plane will be generated that is perpendicular to the ray. \n
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \n
 * Given any entities, the centroid will be extracted, \n
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @param scale Scale factor, a single number to scale equally, or [scale_x, scale_y, scale_z] relative to the plane.
 * @returns void
 * @example modify.Scale(entities, plane1, 0.5)
 * @example_info Scales entities by 0.5 on plane1.
 * @example modify.Scale(entities, plane1, [0.5, 1, 1])
 * @example_info Scales entities by 0.5 along the x axis of plane1, with no scaling along the y and z axes.
 */
function Scale(__model__, entities, plane, scale) {
    entities = (0, arrs_1.arrMakeFlat)(entities);
    if (!(0, arrs_1.isEmptyArr)(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Scale';
        let ents_arr;
        if (__model__.debug) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [common_1.EEntType.POSI, common_1.EEntType.VERT, common_1.EEntType.EDGE, common_1.EEntType.WIRE,
                common_1.EEntType.POINT, common_1.EEntType.PLINE, common_1.EEntType.PGON, common_1.EEntType.COLL]);
            chk.checkArgs(fn_name, 'scale', scale, [chk.isNum, chk.isXYZ]);
        }
        else {
            ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
        }
        plane = (0, _common_1.getPlane)(__model__, plane, fn_name);
        // --- Error Check ---
        __model__.modeldata.funcs_modify.scale(ents_arr, plane, scale);
    }
}
exports.Scale = Scale;
// ================================================================================================
/**
 * Mirrors entities across a plane.
 * \n
 * @param __model__
 * @param entities An entity or list of entities to mirros.
 * @param plane A plane to scale around. \n
 * Given a ray, a plane will be generated that is perpendicular to the ray. \n
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \n
 * Given any entities, the centroid will be extracted, \n
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @returns void
 * @example modify.Mirror(polygon1, plane1)
 * @example_info Mirrors polygon1 across plane1.
 */
function Mirror(__model__, entities, plane) {
    entities = (0, arrs_1.arrMakeFlat)(entities);
    if (!(0, arrs_1.isEmptyArr)(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Mirror';
        let ents_arr;
        if (__model__.debug) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [common_1.EEntType.POSI, common_1.EEntType.VERT, common_1.EEntType.EDGE, common_1.EEntType.WIRE,
                common_1.EEntType.POINT, common_1.EEntType.PLINE, common_1.EEntType.PGON, common_1.EEntType.COLL]);
        }
        else {
            ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
        }
        plane = (0, _common_1.getPlane)(__model__, plane, fn_name);
        // --- Error Check ---
        __model__.modeldata.funcs_modify.mirror(ents_arr, plane);
    }
}
exports.Mirror = Mirror;
// ================================================================================================
/**
 * Transforms entities from a source plane to a target plane.
 * \n
 * @param __model__
 * @param entities Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @param from_plane Plane defining source plane for the transformation. \n
 * Given a ray, a plane will be generated that is perpendicular to the ray. \n
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \n
 * Given any entities, the centroid will be extracted, \n
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @param to_plane Plane defining target plane for the transformation. \n
 * Given a ray, a plane will be generated that is perpendicular to the ray. \n
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \n
 * Given any entities, the centroid will be extracted, \n
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @returns void
 * @example modify.XForm(polygon1, plane1, plane2)
 * @example_info Transforms polygon1 from plane1 to plane2.
 */
function XForm(__model__, entities, from_plane, to_plane) {
    entities = (0, arrs_1.arrMakeFlat)(entities);
    if (!(0, arrs_1.isEmptyArr)(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.XForm';
        let ents_arr;
        if (__model__.debug) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [common_1.EEntType.POSI, common_1.EEntType.VERT, common_1.EEntType.EDGE, common_1.EEntType.WIRE,
                common_1.EEntType.POINT, common_1.EEntType.PLINE, common_1.EEntType.PGON, common_1.EEntType.COLL]);
        }
        else {
            ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
        }
        from_plane = (0, _common_1.getPlane)(__model__, from_plane, fn_name);
        to_plane = (0, _common_1.getPlane)(__model__, to_plane, fn_name);
        // --- Error Check ---
        __model__.modeldata.funcs_modify.xform(ents_arr, from_plane, to_plane);
    }
}
exports.XForm = XForm;
// ================================================================================================
/**
 * Offsets wires.
 * \n
 * @param __model__
 * @param entities Edges, wires, faces, polylines, polygons, collections.
 * @param dist The distance to offset by, can be either positive or negative
 * @returns void
 * @example modify.Offset(polygon1, 10)
 * @example_info Offsets the wires inside polygon1 by 10 units. Holes will also be offset.
 */
function Offset(__model__, entities, dist) {
    entities = (0, arrs_1.arrMakeFlat)(entities);
    if (!(0, arrs_1.isEmptyArr)(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Offset';
        let ents_arr;
        if (__model__.debug) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [common_1.EEntType.WIRE, common_1.EEntType.PLINE, common_1.EEntType.PGON, common_1.EEntType.COLL]);
            chk.checkArgs(fn_name, 'dist', dist, [chk.isNum]);
        }
        else {
            ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
        }
        // --- Error Check ---
        __model__.modeldata.funcs_modify.offset(ents_arr, dist);
    }
}
exports.Offset = Offset;
// ================================================================================================
/**
 * Remesh a face or polygon.
 * \n
 * When a face or polygon is deformed, the triangles that make up that face will sometimes become incorrect.
 * \n
 * Remeshing will regenerate the triangulated mesh for the face.
 * \n
 * Remeshing is not performed automatically as it would degrade performance.
 * Instead, it is left up to the user to remesh only when it is actually required.
 * \n
 * @param __model__
 * @param entities Single or list of faces, polygons, collections.
 * @returns void
 * @example modify.Remesh(polygon1)
 * @example_info Remeshs the face of the polygon.
 */
function Remesh(__model__, entities) {
    entities = (0, arrs_1.arrMakeFlat)(entities);
    if (!(0, arrs_1.isEmptyArr)(entities)) {
        // --- Error Check ---
        let ents_arr;
        if (__model__.debug) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, 'modify.Remesh', 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [common_1.EEntType.PGON, common_1.EEntType.COLL]);
        }
        else {
            ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
        }
        // --- Error Check ---
        __model__.modeldata.funcs_modify.remesh(ents_arr);
    }
}
exports.Remesh = Remesh;
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kaWZ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvcmUvbW9kdWxlcy9iYXNpYy9tb2RpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILGlEQUFnRDtBQUVoRCx3REFBMEM7QUFHMUMsa0RBQWdHO0FBQ2hHLDJFQUFpRTtBQUNqRSxpREFBaUU7QUFDakUsdUNBQTZDO0FBRzdDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFDSCxTQUFnQixJQUFJLENBQUMsU0FBa0IsRUFBRSxRQUFtQixFQUFFLE9BQW9CO0lBQzlFLFFBQVEsR0FBRyxJQUFBLGtCQUFXLEVBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsSUFBSSxDQUFDLElBQUEsaUJBQVUsRUFBQyxRQUFRLENBQUMsRUFBRTtRQUN2QixzQkFBc0I7UUFDdEIsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDO1FBQzlCLElBQUksUUFBdUIsQ0FBQztRQUM1QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7WUFDakIsUUFBUSxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxlQUFFLENBQUMsSUFBSSxFQUFFLGVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQWtCLENBQUM7WUFDM0csR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDdkU7YUFBTTtZQUNILFFBQVEsR0FBRyxJQUFBLDBCQUFRLEVBQUMsUUFBUSxDQUFrQixDQUFDO1NBQ2xEO1FBQ0Qsc0JBQXNCO1FBQ3RCLFNBQVMsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxR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